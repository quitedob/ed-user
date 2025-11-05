/**
 * 获取播放器实例 - 增强版，支持字幕、时间点标签等高级功能
 */
export function getClient(playRes, speedDouble, speedDrag, options = {}) {
  const params = JSON.parse(playRes.vodPlayConfig)

  // 当speed参数值为boolean类型时，代表是否显示倍速切换的按钮。当参数值为数组时，则代表倍速切换的可选速率。最多可设置6个速率，取值范围：(0,3]。PC端默认值为：[2, 1.5, 1.2, 0.5]，移动端默认值为：[1, 1.5, 2]。
  const speed = speedDouble === 0 ? false : true
  // 是否禁止拖拽进度条，取值：{on,off}。
  const banSeek = speedDrag === 0 ? 'on' : 'off'

  // 合并高级功能配置
  const advancedOptions = {
    // 字幕配置
    subtitle: {
      enabled: options.subtitles?.enabled || false,
      defaultLanguage: options.subtitles?.defaultLanguage || 'zh',
      languages: options.subtitles?.languages || ['zh', 'en'],
      style: {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'bottom',
        align: 'center'
      }
    },
    // 时间点标签配置
    timeTags: {
      enabled: options.timeTags?.enabled || false,
      tags: options.timeTags?.tags || [],
      style: {
        position: 'top',
        backgroundColor: 'rgba(64, 158, 255, 0.8)',
        textColor: '#FFFFFF',
        borderRadius: '12px',
        fontSize: '12px'
      }
    },
    // 课件同步配置
    coursewareSync: {
      enabled: options.coursewareSync?.enabled || false,
      pages: options.coursewareSync?.pages || [],
      autoSwitch: options.coursewareSync?.autoSwitch !== false
    },
    // 学习进度增强
    learningProgress: {
      enabled: options.learningProgress?.enabled !== false,
      recordInterval: options.learningProgress?.recordInterval || 10, // 秒
      progressThreshold: options.learningProgress?.progressThreshold || 0.8
    },
    // 交互事件
    events: {
      onSubtitleChange: options.events?.onSubtitleChange,
      onTimeTagClick: options.events?.onTimeTagClick,
      onCoursewarePageChange: options.events?.onCoursewarePageChange,
      onProgressUpdate: options.events?.onProgressUpdate,
      onLearningComplete: options.events?.onLearningComplete
    }
  }

  return window.polyvPlayer({
    wrap: '#player',
    height: '100%',
    width: '100%',
    autoplay: true,
    hideSwitchPlayer: true,
    showLine: 'off',
    history_video_duration: 1,
    speed: speed,
    ban_seek: banSeek,
    watchStartTime: playRes.currentDuration,
    playsafe: params.token,
    // 添加字幕配置
    subtitle: advancedOptions.subtitle.enabled ? {
      defaultLanguage: advancedOptions.subtitle.defaultLanguage,
      languages: advancedOptions.subtitle.languages,
      style: advancedOptions.subtitle.style
    } : false,
    // 添加时间点标签配置
    timeTags: advancedOptions.timeTags.enabled ? {
      tags: advancedOptions.timeTags.tags,
      style: advancedOptions.timeTags.style
    } : false,
    // 添加课件同步配置
    coursewareSync: advancedOptions.coursewareSync.enabled ? {
      pages: advancedOptions.coursewareSync.pages,
      autoSwitch: advancedOptions.coursewareSync.autoSwitch
    } : false,
    // 事件监听器
    listeners: {
      onTimeUpdate: (data) => {
        handleTimeUpdate(data, advancedOptions)
      },
      onSubtitleChange: (subtitleData) => {
        if (advancedOptions.events.onSubtitleChange) {
          advancedOptions.events.onSubtitleChange(subtitleData)
        }
      },
      onTimeTagClick: (tagData) => {
        if (advancedOptions.events.onTimeTagClick) {
          advancedOptions.events.onTimeTagClick(tagData)
        }
      },
      onCoursewarePageChange: (pageData) => {
        if (advancedOptions.events.onCoursewarePageChange) {
          advancedOptions.events.onCoursewarePageChange(pageData)
        }
      },
      onEnded: () => {
        if (advancedOptions.events.onLearningComplete) {
          advancedOptions.events.onLearningComplete()
        }
      }
    },
    ...params
  })
}

/**
 * 事件处理函数 - 处理播放器时间更新事件
 */
function handleTimeUpdate(data, options) {
  const currentTime = data.currentTime

  // 处理字幕更新
  if (options.subtitle.enabled) {
    updateSubtitle(currentTime, options)
  }

  // 处理时间点标签激活
  if (options.timeTags.enabled) {
    updateTimeTagActivation(currentTime, options)
  }

  // 处理课件同步
  if (options.coursewareSync.enabled) {
    updateCoursewareSync(currentTime, options)
  }

  // 处理学习进度记录
  if (options.learningProgress.enabled) {
    recordLearningProgress(currentTime, data.duration, options)
  }

  // 触发进度更新事件
  if (options.events.onProgressUpdate) {
    options.events.onProgressUpdate({
      currentTime,
      duration: data.duration,
      progress: (currentTime / data.duration) * 100
    })
  }
}

/**
 * 更新字幕显示
 */
function updateSubtitle(currentTime, options) {
  const subtitleData = findCurrentSubtitle(currentTime, options.subtitle.data)
  if (subtitleData) {
    // 更新字幕显示逻辑
    if (options.events.onSubtitleChange) {
      options.events.onSubtitleChange(subtitleData)
    }
  }
}

/**
 * 更新时间点标签激活状态
 */
function updateTimeTagActivation(currentTime, options) {
  const activeTags = options.timeTags.tags.filter(tag =>
    Math.abs(currentTime - tag.time) < 2 // 2秒容差
  )

  activeTags.forEach(tag => {
    if (options.events.onTimeTagClick) {
      options.events.onTimeTagClick({ type: 'activate', tag })
    }
  })
}

/**
 * 更新课件同步
 */
function updateCoursewareSync(currentTime, options) {
  const currentPage = options.coursewareSync.pages.find(page =>
    currentTime >= page.startTime && currentTime <= page.endTime
  )

  if (currentPage) {
    if (options.events.onCoursewarePageChange) {
      options.events.onCoursewarePageChange({
        type: 'pageChange',
        pageNumber: currentPage.pageNumber,
        pageData: currentPage
      })
    }
  }
}

/**
 * 记录学习进度
 */
function recordLearningProgress(currentTime, duration, options) {
  if (Math.floor(currentTime) % options.learningProgress.recordInterval === 0) {
    const progress = currentTime / duration

    if (progress >= options.learningProgress.progressThreshold) {
      // 学习完成条件满足
      if (options.events.onLearningComplete) {
        options.events.onLearningComplete({
          currentTime,
          duration,
          progress
        })
      }
    }
  }
}

/**
 * 查找当前应显示的字幕
 */
function findCurrentSubtitle(currentTime, subtitleData) {
  if (!subtitleData) return null

  return subtitleData.find(item =>
    currentTime >= item.start && currentTime <= item.end
  )
}

/**
 * 获取播放器实例 - 专业版增强（支持字幕、时间点标签等高级功能）
 * @param playRes
 * @param speedDouble
 * @param speedDrag
 * @param options 高级功能配置选项
 * @returns {*}
 */
export function getClientForPri(playRes, speedDouble, speedDrag, options = {}) {
  const params = JSON.parse(playRes.vodPlayConfig)

  // 当speed参数值为boolean类型时，代表是否显示倍速切换的按钮。当参数值为数组时，则代表倍速切换的可选速率。最多可设置6个速率，取值范围：(0,3]。PC端默认值为：[2, 1.5, 1.2, 0.5]，移动端默认值为：[1, 1.5, 2]。
  const speed = speedDouble === 0 ? false : true
  // 是否禁止拖拽进度条，取值：{on,off}。
  const banSeek = speedDrag === 0 ? 'on' : 'off'

  // 复用高级功能配置
  const advancedOptions = {
    // 字幕配置
    subtitle: {
      enabled: options.subtitles?.enabled || false,
      defaultLanguage: options.subtitles?.defaultLanguage || 'zh',
      languages: options.subtitles?.languages || ['zh', 'en'],
      data: options.subtitles?.data || []
    },
    // 时间点标签配置
    timeTags: {
      enabled: options.timeTags?.enabled || false,
      tags: options.timeTags?.tags || []
    },
    // 课件同步配置
    coursewareSync: {
      enabled: options.coursewareSync?.enabled || false,
      pages: options.coursewareSync?.pages || [],
      autoSwitch: options.coursewareSync?.autoSwitch !== false
    },
    // 交互事件
    events: {
      onSubtitleChange: options.events?.onSubtitleChange,
      onTimeTagClick: options.events?.onTimeTagClick,
      onCoursewarePageChange: options.events?.onCoursewarePageChange,
      onProgressUpdate: options.events?.onProgressUpdate,
      onLearningComplete: options.events?.onLearningComplete
    }
  }

  return window.polyvPlayer({
    wrap: '#player',
    height: '100%',
    width: '100%',
    hideSwitchPlayer: true,
    autoplay: false,
    showLine: 'off',
    url: params.hdUrl,
    speed: speed,
    ban_seek: banSeek,
    watchStartTime: playRes.currentDuration,
    // 添加高级功能支持
    subtitle: advancedOptions.subtitle.enabled ? {
      defaultLanguage: advancedOptions.subtitle.defaultLanguage,
      languages: advancedOptions.subtitle.languages,
      data: advancedOptions.subtitle.data
    } : false,
    timeTags: advancedOptions.timeTags.enabled ? {
      tags: advancedOptions.timeTags.tags
    } : false,
    coursewareSync: advancedOptions.coursewareSync.enabled ? {
      pages: advancedOptions.coursewareSync.pages,
      autoSwitch: advancedOptions.coursewareSync.autoSwitch
    } : false,
    listeners: {
      onTimeUpdate: (data) => {
        handleTimeUpdate(data, advancedOptions)
      }
    }
  })
}

/**
 * 工具函数 - 创建字幕数据
 */
export function createSubtitleData(data) {
  return data.map(item => ({
    start: item.start,
    end: item.end,
    text: item.text,
    language: item.language || 'zh'
  }))
}

/**
 * 工具函数 - 创建时间点标签数据
 */
export function createTimeTagData(data) {
  return data.map(item => ({
    id: item.id,
    title: item.title,
    shortTitle: item.shortTitle || item.title.slice(0, 4),
    time: item.time,
    description: item.description || '',
    type: item.type || 'default'
  }))
}

/**
 * 工具函数 - 创建课件同步数据
 */
export function createCoursewareSyncData(data) {
  return data.map(item => ({
    pageNumber: item.pageNumber,
    startTime: item.startTime,
    endTime: item.endTime,
    title: item.title,
    content: item.content,
    preview: item.preview || null
  }))
}
