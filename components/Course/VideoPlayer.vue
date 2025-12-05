<template>
  <div class="video-player-container">
    <div class="video-wrapper" ref="videoWrapper">
      <!-- 视频播放器 -->
      <div class="video-screen" @click="togglePlay">
        <img
          v-if="!isPlaying && thumbnail"
          :src="thumbnail"
          :alt="title"
          class="video-thumbnail"
        />

        <!-- 实际的视频元素 -->
        <video
          v-show="isPlaying || currentTime > 0"
          ref="videoElement"
          :src="videoSrc"
          class="video-element"
          @loadedmetadata="onLoadedMetadata"
          @timeupdate="onTimeUpdate"
          @ended="onEnded"
          @play="onPlay"
          @pause="onPause"
          crossOrigin="anonymous"
        ></video>

        <!-- 字幕显示 -->
        <div v-if="subtitlesEnabled && currentSubtitle" class="subtitle-overlay">
          <div class="subtitle-text">{{ currentSubtitle.text }}</div>
        </div>

        <div class="video-overlay" :class="{ playing: isPlaying }">
          <!-- 播放按钮 -->
          <div v-if="!isPlaying" class="play-button">
            <el-icon size="64px" color="white">
              <VideoPlay />
            </el-icon>
          </div>

          <!-- 视频信息 -->
          <div class="video-info">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
          </div>
        </div>
      </div>

      <!-- 控制栏 -->
      <div class="video-controls">
        <!-- 播放/暂停按钮 -->
        <div class="control-buttons">
          <el-button @click="togglePlay" :icon="isPlaying ? VideoPause : VideoPlay" circle />

          <!-- 音量控制 -->
          <div class="volume-control">
            <el-button @click="toggleMute" :icon="isMuted ? Mute : Microphone" circle />
            <el-slider
              v-model="volume"
              :min="0"
              :max="100"
              @input="setVolume"
              style="width: 80px; margin-left: 8px;"
            />
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-control">
          <span class="time-current">{{ formatTime(currentTime) }}</span>
          <el-slider
            v-model="progress"
            :min="0"
            :max="100"
            :step="0.1"
            @input="onProgressInput"
            @change="onProgressChange"
            class="progress-slider"
          />
          <span class="time-total">{{ formatTime(duration) }}</span>
        </div>

        <!-- 其他控制 -->
        <div class="extra-controls">
          <!-- 字幕控制 -->
          <el-dropdown v-if="subtitles && subtitles.length > 0" @command="changeSubtitle">
            <el-button circle>
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="off">
                  {{ subtitlesEnabled ? '关闭字幕' : '字幕已关闭' }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-for="subtitle in subtitles"
                  :key="subtitle.id"
                  :command="subtitle.id"
                  :class="{ active: currentSubtitleId === subtitle.id }"
                >
                  {{ subtitle.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button @click="toggleFullscreen" :icon="FullScreen" circle />
          <el-button @click="adjustSpeed" circle>
            {{ speed }}x
          </el-button>
        </div>
      </div>
    </div>

    <!-- 视频详情 -->
    <div class="video-details">
      <h3>{{ title }}</h3>
      <p class="video-description">{{ description }}</p>

      <div class="video-meta">
        <span class="duration">时长: {{ formatTime(duration) }}</span>
        <span class="created-at">发布时间: {{ formatDate(createdAt) }}</span>
      </div>

      <!-- 学习进度 -->
      <div class="learning-progress" v-if="duration > 0">
        <div class="progress-header">
          <span>学习进度</span>
          <span>{{ Math.round((watchTime / duration) * 100) }}%</span>
        </div>
        <el-progress
          :percentage="Math.round((watchTime / duration) * 100)"
          :show-text="false"
          :stroke-width="6"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useVideoApi } from '~/composables/useMockApi'
import { VideoPlay, VideoPause, Mute, Microphone, FullScreen, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  videoId: {
    type: [String, Number],
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: ''
  },
  videoSrc: {
    type: String,
    default: ''
  },
  createdAt: {
    type: String,
    default: ''
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  subtitles: {
    type: Array,
    default: () => []
  },
  coursewareSync: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['play', 'pause', 'ended', 'progress', 'coursewareSync'])

const videoApi = useVideoApi()

// 响应式数据
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(80)
const currentTime = ref(0)
const watchTime = ref(0)
const progress = ref(0)
const speed = ref(1)
const duration = ref(props.duration || 0)
const videoWrapper = ref(null)
const videoElement = ref(null)

// 进度条拖拽控制 - 关键修复
const isSeeking = ref(false)
const seekingProgress = ref(0)

// 字幕相关
const subtitlesEnabled = ref(false)
const currentSubtitleId = ref(null)
const currentSubtitle = ref(null)
const loadedSubtitles = ref(new Map())

// 课件同步相关
const activeCoursewarePage = ref(null)

// 进度记录定时器
let progressRecordTimer = null

// 方法
const togglePlay = async () => {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

const play = async () => {
  if (videoElement.value) {
    try {
      await videoElement.value.play()
      isPlaying.value = true
      emit('play')
    } catch (error) {
      console.error('播放失败:', error)
      ElMessage.error('视频播放失败')
    }
  }
}

const pause = () => {
  if (videoElement.value) {
    videoElement.value.pause()
    isPlaying.value = false
    emit('pause')
    recordProgress()
  }
}

const ended = () => {
  isPlaying.value = false
  emit('ended')
  recordProgress()
  ElMessage.success('视频播放完成')
}

const toggleMute = () => {
  if (videoElement.value) {
    isMuted.value = !isMuted.value
    videoElement.value.muted = isMuted.value
    if (isMuted.value) {
      volume.value = 0
    } else {
      volume.value = 80
      videoElement.value.volume = 0.8
    }
  }
}

const setVolume = (val) => {
  if (videoElement.value) {
    volume.value = val
    videoElement.value.volume = val / 100
    isMuted.value = val === 0
    videoElement.value.muted = isMuted.value
  }
}

// 进度条拖拽中 - 实时更新UI但不跳转视频
const onProgressInput = (val) => {
  isSeeking.value = true
  seekingProgress.value = val
  // 更新显示的时间但不改变视频位置
  if (videoElement.value && videoElement.value.duration > 0) {
    const seekTime = (val / 100) * videoElement.value.duration
    currentTime.value = seekTime
  }
}

// 进度条拖拽结束 - 真正跳转视频位置
const onProgressChange = (val) => {
  if (videoElement.value && videoElement.value.duration > 0) {
    const seekTime = (val / 100) * videoElement.value.duration
    videoElement.value.currentTime = seekTime
    currentTime.value = seekTime
    progress.value = val
    
    // 延迟重置拖拽状态，确保视频已经跳转
    setTimeout(() => {
      isSeeking.value = false
    }, 150)
  }
}

const toggleFullscreen = () => {
  if (videoWrapper.value) {
    if (!document.fullscreenElement) {
      videoWrapper.value.requestFullscreen().catch(err => {
        console.error('全屏失败:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }
}

const adjustSpeed = () => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const currentIndex = speeds.indexOf(speed.value)
  speed.value = speeds[(currentIndex + 1) % speeds.length]
  if (videoElement.value) {
    videoElement.value.playbackRate = speed.value
  }
}

const recordProgress = async () => {
  try {
    await videoApi.recordProgress(props.videoId, currentTime.value)
  } catch (error) {
    console.error('记录播放进度失败:', error)
  }
}

// 视频事件处理
const onLoadedMetadata = () => {
  if (videoElement.value) {
    duration.value = videoElement.value.duration
    console.log('Video loaded, duration:', duration.value)
    // 设置初始音量
    videoElement.value.volume = volume.value / 100
    videoElement.value.playbackRate = speed.value
  }
}

const onTimeUpdate = () => {
  // 拖拽时不更新进度条，避免冲突
  if (videoElement.value && !isSeeking.value) {
    currentTime.value = videoElement.value.currentTime
    watchTime.value = Math.max(watchTime.value, videoElement.value.currentTime)

    if (videoElement.value.duration > 0) {
      progress.value = (currentTime.value / videoElement.value.duration) * 100
      console.log('Progress updated:', progress.value, 'Current time:', currentTime.value, 'Duration:', videoElement.value.duration)
    }

    // 更新字幕
    updateCurrentSubtitle()

    // 更新课件同步
    updateCoursewareSync()
  }
}

const onEnded = () => {
  ended()
}

const onPlay = () => {
  isPlaying.value = true
  emit('play')
  
  // 启动进度记录定时器（每10秒记录一次）
  if (!progressRecordTimer) {
    progressRecordTimer = setInterval(() => {
      if (isPlaying.value) {
        recordProgress()
        emit('progress', {
          currentTime: currentTime.value,
          progress: progress.value,
          subtitle: currentSubtitle.value,
          coursewarePage: activeCoursewarePage.value
        })
      }
    }, 10000)
  }
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 字幕相关方法
const loadSubtitle = async (subtitleId) => {
  if (loadedSubtitles.value.has(subtitleId)) {
    return loadedSubtitles.value.get(subtitleId)
  }

  const subtitle = props.subtitles.find(s => s.id === subtitleId)
  if (!subtitle) return null

  // 模拟加载字幕文件
  let subtitleData = []
  if (subtitle.url) {
    try {
      subtitleData = await mockSubtitleData(subtitleId)
    } catch (error) {
      console.error('加载字幕失败:', error)
      return null
    }
  } else if (subtitle.data) {
    subtitleData = subtitle.data
  }

  loadedSubtitles.value.set(subtitleId, subtitleData)
  return subtitleData
}

const mockSubtitleData = async (subtitleId) => {
  // 模拟字幕数据
  return [
    { start: 5, end: 8, text: '欢迎使用在线学习平台' },
    { start: 10, end: 15, text: '今天我们将学习软件工程的基本概念' },
    { start: 16, end: 22, text: '软件工程是应用系统化、严格化、可量化的方法' },
    { start: 23, end: 28, text: '来开发和维护软件的工程学科' },
    { start: 30, end: 35, text: '接下来让我们了解软件生命周期' },
    { start: 36, end: 42, text: '软件生命周期包括需求分析、设计、实现、测试和维护' }
  ]
}

const changeSubtitle = async (command) => {
  if (command === 'off') {
    subtitlesEnabled.value = false
    currentSubtitleId.value = null
    currentSubtitle.value = null
    return
  }

  const subtitleData = await loadSubtitle(command)
  if (subtitleData) {
    currentSubtitleId.value = command
    subtitlesEnabled.value = true
    updateCurrentSubtitle()
  }
}

const updateCurrentSubtitle = () => {
  if (!subtitlesEnabled.value || !currentSubtitleId.value) {
    currentSubtitle.value = null
    return
  }

  const subtitleData = loadedSubtitles.value.get(currentSubtitleId.value)
  if (!subtitleData) return

  const current = subtitleData.find(item =>
    currentTime.value >= item.start && currentTime.value <= item.end
  )

  currentSubtitle.value = current || null
}

// 课件同步相关方法
const updateCoursewareSync = () => {
  if (!props.coursewareSync || !props.coursewareSync.pages) return

  const currentPage = props.coursewareSync.pages.find(page =>
    currentTime.value >= page.startTime && currentTime.value <= page.endTime
  )

  if (currentPage && currentPage.pageNumber !== activeCoursewarePage.value) {
    activeCoursewarePage.value = currentPage.pageNumber
    emit('coursewareSync', {
      type: 'pageChange',
      pageNumber: currentPage.pageNumber,
      pageData: currentPage
    })
  }
}

// 生命周期
onMounted(() => {
  if (props.autoplay) {
    nextTick(() => {
      play()
    })
  }
})

onUnmounted(() => {
  if (progressRecordTimer) {
    clearInterval(progressRecordTimer)
  }
  // 最后记录一次进度
  recordProgress()
})

// 监听属性变化
watch(() => props.videoId, (newId) => {
  // 重置播放器状态
  pause()
  currentTime.value = 0
  watchTime.value = 0
  progress.value = 0
  speed.value = 1
  isSeeking.value = false
  
  if (videoElement.value) {
    videoElement.value.currentTime = 0
  }
})

// 监听音量变化
watch(volume, (newVolume) => {
  if (videoElement.value && !isSeeking.value) {
    videoElement.value.volume = newVolume / 100
  }
})

// 监听播放速度变化
watch(speed, (newSpeed) => {
  if (videoElement.value) {
    videoElement.value.playbackRate = newSpeed
  }
})
</script>

<style lang="scss" scoped>
.video-player-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.video-wrapper {
  position: relative;
}

.video-screen {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  cursor: pointer;
  overflow: hidden;

  .video-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-element {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
  }

  // 字幕叠加层
  .subtitle-overlay {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    max-width: 80%;
    pointer-events: none;

    .subtitle-text {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 16px;
      text-align: center;
      line-height: 1.4;
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }

  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, opacity 0.3s;

    &.playing {
      background: rgba(0, 0, 0, 0);
      pointer-events: none;

      .play-button,
      .video-info {
        opacity: 0;
      }
    }

    &:hover {
      background: rgba(0, 0, 0, 0.4);

      .play-button,
      .video-info {
        opacity: 1;
      }
    }

    .play-button {
      transition: opacity 0.3s;
      margin-bottom: 24px;
      cursor: pointer;
      pointer-events: auto;
    }

    .video-info {
      text-align: center;
      color: white;
      transition: opacity 0.3s;
      max-width: 80%;
      pointer-events: none;

      h3 {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 8px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      p {
        font-size: 16px;
        margin: 0;
        opacity: 0.9;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}

.video-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;

  .control-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .volume-control {
      display: flex;
      align-items: center;
    }
  }

  .progress-control {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;

    .time-current,
    .time-total {
      font-size: 12px;
      color: #666;
      min-width: 45px;
      text-align: center;
      font-family: 'Courier New', monospace;
    }

    .progress-slider {
      flex: 1;

      :deep(.el-slider__runway) {
        cursor: pointer;
        height: 6px;
      }

      :deep(.el-slider__bar) {
        height: 6px;
      }

      :deep(.el-slider__button-wrapper) {
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      :deep(.el-slider__button) {
        width: 14px;
        height: 14px;
        border: 2px solid #409eff;
      }
    }
  }

  .extra-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.video-details {
  padding: 24px;
  border-top: 1px solid #f0f0f0;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 12px 0;
  }

  .video-description {
    color: #606266;
    line-height: 1.6;
    margin: 0 0 16px 0;
  }

  .video-meta {
    display: flex;
    gap: 24px;
    margin-bottom: 20px;

    span {
      font-size: 14px;
      color: #909399;
    }
  }

  .learning-progress {
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      span {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }
    }
  }
}

// 全屏样式
:deep(.video-wrapper:fullscreen) {
  background: #000;
  display: flex;
  flex-direction: column;

  .video-screen {
    flex: 1;
  }

  .video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: opacity 0.3s;

    .time-current,
    .time-total {
      color: white;
    }
  }

  &:hover .video-controls {
    opacity: 1;
  }
}

// 字幕控制相关样式
:deep(.el-dropdown-menu) {
  .el-dropdown-item {
    &.active {
      background-color: #ecf5ff;
      color: #409eff;
      font-weight: 600;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .video-controls {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;

    .control-buttons,
    .extra-controls {
      gap: 8px;
    }

    .progress-control {
      order: 3;
      flex-basis: 100%;
      gap: 8px;

      .time-current,
      .time-total {
        min-width: 40px;
        font-size: 11px;
      }
    }

    .volume-control .el-slider {
      display: none;
    }
  }

  .video-details {
    padding: 16px;

    .video-meta {
      flex-direction: column;
      gap: 8px;
    }
  }

  .video-screen .subtitle-overlay {
    bottom: 60px;
    max-width: 90%;

    .subtitle-text {
      font-size: 14px;
      padding: 6px 12px;
    }
  }
}
</style>
