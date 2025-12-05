<template>
  <div class="courseware-sync-component">
    <!-- 课件同步头部 -->
    <div class="courseware-header" v-if="title || showHeader">
      <h3 class="header-title">{{ title || '课件同步' }}</h3>
      <div class="header-actions">
        <el-switch
          v-model="autoSync"
          @change="handleAutoSyncToggle"
          size="small"
          inline-prompt
          active-text="自动"
          inactive-text="手动"
        />
        <el-button size="small" :icon="FullScreen" @click="toggleFullscreen">
          全屏查看
        </el-button>
      </div>
    </div>

    <!-- 课件导航 -->
    <div class="courseware-navigation" v-if="coursewareData && coursewareData.length > 0">
      <div class="nav-info">
        <span>当前页面：</span>
        <el-select
          v-model="currentPageNumber"
          @change="handlePageChange"
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="page in coursewareData"
            :key="page.pageNumber"
            :label="`第${page.pageNumber}页`"
            :value="page.pageNumber"
          />
        </el-select>
        <span class="total-pages">/ 共{{ coursewareData.length }}页</span>
      </div>

      <div class="nav-controls">
        <el-button
          size="small"
          :icon="ArrowLeft"
          @click="previousPage"
          :disabled="currentPageNumber <= 1"
        >
          上一页
        </el-button>
        <el-button
          size="small"
          @click="nextPage"
          :disabled="currentPageNumber >= coursewareData.length"
        >
          下一页
          <el-icon class="ml-1"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 课件内容显示区域 -->
    <div class="courseware-display" ref="coursewareDisplay" v-if="currentPage">
      <div class="display-toolbar">
        <div class="page-info">
          <span class="page-title">{{ currentPage.title }}</span>
          <span class="page-number">第{{ currentPage.pageNumber }}页</span>
        </div>
        <div class="display-tools">
          <el-button-group size="small">
            <el-button :icon="ZoomOut" @click="zoomOut" :disabled="currentZoom <= 0.5" />
            <el-button>{{ Math.round(currentZoom * 100) }}%</el-button>
            <el-button :icon="ZoomIn" @click="zoomIn" :disabled="currentZoom >= 2" />
          </el-button-group>
          <el-button size="small" :icon="Refresh" @click="resetZoom">
            重置
          </el-button>
        </div>
      </div>

      <!-- 课件内容渲染区域 -->
      <div class="courseware-content" :style="contentStyle">
        <!-- 图片类型课件 -->
        <div v-if="currentPage.type === 'image'" class="image-content">
          <img
            :src="currentPage.content"
            :alt="currentPage.title"
            :style="{ transform: `scale(${currentZoom})` }"
          />
        </div>

        <!-- PDF类型课件 -->
        <div v-else-if="currentPage.type === 'pdf'" class="pdf-content">
          <iframe
            :src="currentPage.content"
            :style="{ transform: `scale(${currentZoom})` }"
          ></iframe>
        </div>

        <!-- HTML类型课件 -->
        <div v-else-if="currentPage.type === 'html'" class="html-content" v-html="currentPage.content">
        </div>

        <!-- 文本类型课件 -->
        <div v-else-if="currentPage.type === 'text'" class="text-content">
          <div :style="{ transform: `scale(${currentZoom})` }">
            {{ currentPage.content }}
          </div>
        </div>

        <!-- 时间同步信息 -->
        <div class="sync-info" v-if="showSyncInfo && currentTime !== null">
          <div class="time-indicator">
            <el-icon><Timer /></el-icon>
            <span>当前时间：{{ formatTime(currentTime) }}</span>
          </div>
          <div class="page-time">
            <span>课件页面时间：{{ formatTime(currentPage.startTime) }} - {{ formatTime(currentPage.endTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar" v-if="showProgress">
        <el-progress
          :percentage="pageProgress"
          :show-text="false"
          :stroke-width="4"
        />
        <div class="progress-text">
          <span>{{ currentPageNumber }}/{{ coursewareData.length }}</span>
          <span v-if="currentTime !== null">{{ formatTime(currentTime) }}/{{ formatTime(totalDuration) }}</span>
        </div>
      </div>
    </div>

    <!-- 课件缩略图列表 -->
    <div class="courseware-thumbnails" v-if="showThumbnails && coursewareData && coursewareData.length > 0">
      <div class="thumbnails-header">
        <span>课件预览</span>
        <el-button size="small" text @click="toggleThumbnails">
          {{ showThumbnails ? '隐藏' : '显示' }}
        </el-button>
      </div>
      <div class="thumbnails-list" ref="thumbnailsList">
        <div
          v-for="page in coursewareData"
          :key="page.pageNumber"
          class="thumbnail-item"
          :class="{ active: page.pageNumber === currentPageNumber }"
          @click="jumpToPage(page.pageNumber)"
        >
          <div class="thumbnail-image" v-if="page.preview">
            <img :src="page.preview" :alt="page.title" />
          </div>
          <div class="thumbnail-placeholder" v-else>
            <el-icon><Document /></el-icon>
          </div>
          <div class="thumbnail-info">
            <span class="page-num">P{{ page.pageNumber }}</span>
            <span class="page-name">{{ page.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间轴同步视图 -->
    <div class="timeline-view" v-if="showTimeline">
      <div class="timeline-header">
        <span>时间轴同步</span>
        <el-button size="small" :icon="Setting" @click="showTimelineSettings = true">
          设置
        </el-button>
      </div>
      <div class="timeline-content">
        <div class="timeline-bar" ref="timelineBar">
          <!-- 时间刻度 -->
          <div class="timeline-scale">
            <div
              v-for="mark in timelineMarks"
              :key="mark.time"
              class="scale-mark"
              :style="{ left: `${mark.position}%` }"
            >
              <span class="mark-time">{{ formatTime(mark.time) }}</span>
            </div>
          </div>

          <!-- 页面时间块 -->
          <div
            v-for="page in coursewareData"
            :key="page.pageNumber"
            class="timeline-page"
            :class="{ active: page.pageNumber === currentPageNumber }"
            :style="{
              left: `${(page.startTime / totalDuration) * 100}%`,
              width: `${((page.endTime - page.startTime) / totalDuration) * 100}%`
            }"
            @click="seekToTime(page.startTime)"
          >
            <div class="page-block">
              <span class="block-label">{{ page.pageNumber }}</span>
            </div>
          </div>

          <!-- 当前时间指示器 -->
          <div
            class="current-time-indicator"
            :style="{ left: `${(currentTime / totalDuration) * 100}%` }"
          >
            <div class="indicator-line"></div>
            <div class="indicator-handle"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!coursewareData || coursewareData.length === 0" class="empty-state">
      <el-empty description="暂无课件内容" :image-size="80">
        <el-button v-if="allowUpload" type="primary" :icon="Upload" @click="handleUpload">
          上传课件
        </el-button>
      </el-empty>
    </div>

    <!-- 时间轴设置对话框 -->
    <el-dialog v-model="showTimelineSettings" title="时间轴设置" width="400px">
      <el-form :model="timelineSettings" label-width="100px">
        <el-form-item label="显示刻度">
          <el-slider
            v-model="timelineSettings.scaleInterval"
            :min="10"
            :max="300"
            :step="10"
            show-input
            input-size="small"
          >
            <template #default>秒</template>
          </el-slider>
        </el-form-item>
        <el-form-item label="颜色主题">
          <el-select v-model="timelineSettings.colorTheme" style="width: 100%">
            <el-option label="默认蓝色" value="blue" />
            <el-option label="活力橙色" value="orange" />
            <el-option label="清新绿色" value="green" />
            <el-option label="优雅紫色" value="purple" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showTimelineSettings = false">取消</el-button>
        <el-button type="primary" @click="saveTimelineSettings">保存设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  Document,
  FullScreen,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Refresh,
  Timer,
  Setting,
  Upload
} from '@element-plus/icons-vue'

const props = defineProps({
  // 课件数据
  coursewareData: {
    type: Array,
    default: () => []
  },
  // 当前播放时间
  currentTime: {
    type: Number,
    default: 0
  },
  // 视频总时长
  totalDuration: {
    type: Number,
    default: 0
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 是否显示头部
  showHeader: {
    type: Boolean,
    default: true
  },
  // 是否显示同步信息
  showSyncInfo: {
    type: Boolean,
    default: true
  },
  // 是否显示进度条
  showProgress: {
    type: Boolean,
    default: true
  },
  // 是否显示缩略图
  showThumbnails: {
    type: Boolean,
    default: true
  },
  // 是否显示时间轴
  showTimeline: {
    type: Boolean,
    default: true
  },
  // 是否允许上传
  allowUpload: {
    type: Boolean,
    default: false
  },
  // 自动同步
  modelValue: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'pageChange',
  'seekToTime',
  'coursewareUpload',
  'fullscreen'
])

// 响应式数据
const autoSync = ref(props.modelValue)
const currentPageNumber = ref(1)
const currentZoom = ref(1)
const showTimelineSettings = ref(false)
const coursewareDisplay = ref(null)
const thumbnailsList = ref(null)
const timelineBar = ref(null)

// 时间轴设置
const timelineSettings = ref({
  scaleInterval: 60,
  colorTheme: 'blue'
})

// 计算属性
const currentPage = computed(() => {
  if (!props.coursewareData) return null
  return props.coursewareData.find(page => page.pageNumber === currentPageNumber.value)
})

const pageProgress = computed(() => {
  if (!props.coursewareData || props.coursewareData.length === 0) return 0
  return (currentPageNumber.value / props.coursewareData.length) * 100
})

const timelineMarks = computed(() => {
  if (!props.totalDuration) return []

  const marks = []
  const interval = timelineSettings.value.scaleInterval

  for (let time = 0; time <= props.totalDuration; time += interval) {
    marks.push({
      time,
      position: (time / props.totalDuration) * 100
    })
  }

  return marks
})

const contentStyle = computed(() => ({
  height: showThumbnails.value ? 'calc(100% - 80px)' : '100%'
}))

// 方法
const handleAutoSyncToggle = (enabled) => {
  emit('update:modelValue', enabled)
}

const handlePageChange = (pageNumber) => {
  currentPageNumber.value = pageNumber
  emit('pageChange', pageNumber)
}

const previousPage = () => {
  if (currentPageNumber.value > 1) {
    handlePageChange(currentPageNumber.value - 1)
  }
}

const nextPage = () => {
  if (props.coursewareData && currentPageNumber.value < props.coursewareData.length) {
    handlePageChange(currentPageNumber.value + 1)
  }
}

const jumpToPage = (pageNumber) => {
  handlePageChange(pageNumber)
  // 滚动到对应的缩略图
  if (thumbnailsList.value) {
    const thumbnailElements = thumbnailsList.value.querySelectorAll('.thumbnail-item')
    const targetElement = thumbnailElements[pageNumber - 1]
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
}

const zoomIn = () => {
  if (currentZoom.value < 2) {
    currentZoom.value += 0.1
  }
}

const zoomOut = () => {
  if (currentZoom.value > 0.5) {
    currentZoom.value -= 0.1
  }
}

const resetZoom = () => {
  currentZoom.value = 1
}

const toggleFullscreen = () => {
  if (coursewareDisplay.value) {
    if (!document.fullscreenElement) {
      coursewareDisplay.value.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  emit('fullscreen')
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const toggleThumbnails = () => {
  showThumbnails.value = !showThumbnails.value
}

const seekToTime = (time) => {
  emit('seekToTime', time)
}

const handleUpload = () => {
  emit('coursewareUpload')
}

const saveTimelineSettings = () => {
  localStorage.setItem('timelineSettings', JSON.stringify(timelineSettings.value))
  showTimelineSettings.value = false
  ElMessage.success('时间轴设置已保存')
}

// 自动同步逻辑
const syncWithVideoTime = () => {
  if (!autoSync.value || !props.coursewareData || props.currentTime === null) return

  const currentPage = props.coursewareData.find(page =>
    props.currentTime >= page.startTime && props.currentTime <= page.endTime
  )

  if (currentPage && currentPage.pageNumber !== currentPageNumber.value) {
    handlePageChange(currentPage.pageNumber)
  }
}

// 初始化设置
onMounted(() => {
  const savedSettings = localStorage.getItem('timelineSettings')
  if (savedSettings) {
    try {
      timelineSettings.value = JSON.parse(savedSettings)
    } catch (error) {
      console.error('加载时间轴设置失败:', error)
    }
  }
})

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  autoSync.value = newVal
})

watch(() => props.currentTime, () => {
  syncWithVideoTime()
})

watch(() => props.coursewareData, (newData) => {
  if (newData && newData.length > 0 && currentPageNumber.value === 1) {
    // 初始化时找到当前时间对应的页面
    syncWithVideoTime()
  }
})
</script>

<style lang="scss" scoped>
.courseware-sync-component {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;

  .courseware-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e4e7ed;
    background: #fafafa;

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .courseware-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e4e7ed;

    .nav-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .total-pages {
        font-size: 14px;
        color: #909399;
      }
    }

    .nav-controls {
      display: flex;
      gap: 8px;
    }
  }

  .courseware-display {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .display-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid #e4e7ed;

      .page-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .page-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }

        .page-number {
          font-size: 14px;
          color: #909399;
        }
      }

      .display-tools {
        display: flex;
        gap: 8px;
      }
    }

    .courseware-content {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: #f5f7fa;

      .image-content,
      .pdf-content,
      .html-content,
      .text-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;

        img,
        iframe,
        > div {
          max-width: 100%;
          max-height: 100%;
          transition: transform 0.3s ease;
        }
      }

      .sync-info {
        position: absolute;
        bottom: 12px;
        left: 12px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        backdrop-filter: blur(4px);

        .time-indicator,
        .page-time {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 4px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .progress-bar {
      padding: 12px 20px;
      background: white;
      border-top: 1px solid #e4e7ed;

      .progress-text {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .courseware-thumbnails {
    border-top: 1px solid #e4e7ed;
    background: #fafafa;

    .thumbnails-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid #e4e7ed;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    .thumbnails-list {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      overflow-x: auto;

      .thumbnail-item {
        flex-shrink: 0;
        width: 80px;
        cursor: pointer;
        border-radius: 4px;
        overflow: hidden;
        border: 2px solid transparent;
        transition: all 0.3s;

        &:hover {
          border-color: #e4e7ed;
        }

        &.active {
          border-color: #409eff;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
        }

        .thumbnail-image {
          width: 80px;
          height: 60px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .thumbnail-placeholder {
          width: 80px;
          height: 60px;
          background: #e4e7ed;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #909399;
        }

        .thumbnail-info {
          padding: 8px 4px;
          background: white;
          text-align: center;

          .page-num {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #409eff;
          }

          .page-name {
            display: block;
            font-size: 10px;
            color: #606266;
            margin-top: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .timeline-view {
    border-top: 1px solid #e4e7ed;
    background: #fafafa;

    .timeline-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid #e4e7ed;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    .timeline-content {
      padding: 20px;

      .timeline-bar {
        position: relative;
        height: 60px;
        background: white;
        border-radius: 4px;
        overflow: hidden;

        .timeline-scale {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;

          .scale-mark {
            position: absolute;
            top: 0;
            height: 100%;
            border-left: 1px solid #e4e7ed;

            .mark-time {
              position: absolute;
              top: 22px;
              transform: translateX(-50%);
              font-size: 10px;
              color: #909399;
              white-space: nowrap;
            }
          }
        }

        .timeline-page {
          position: absolute;
          top: 35px;
          height: 20px;
          background: #409eff;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            opacity: 0.8;
          }

          &.active {
            background: #67c23a;
          }

          .page-block {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .block-label {
              font-size: 10px;
              color: white;
              font-weight: 600;
            }
          }
        }

        .current-time-indicator {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #f56c6c;
          z-index: 10;
          pointer-events: none;

          .indicator-line {
            width: 100%;
            height: 100%;
            background: #f56c6c;
          }

          .indicator-handle {
            position: absolute;
            top: -4px;
            left: -4px;
            width: 10px;
            height: 10px;
            background: #f56c6c;
            border-radius: 50%;
            border: 2px solid white;
          }
        }
      }
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
}

// 全屏样式
:deep(.courseware-display:fullscreen) {
  background: #000;

  .display-toolbar {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    backdrop-filter: blur(10px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .courseware-sync-component {
    .courseware-navigation {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .courseware-display {
      .display-toolbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }

    .courseware-thumbnails {
      .thumbnails-list {
        .thumbnail-item {
          width: 60px;

          .thumbnail-image,
          .thumbnail-placeholder {
            width: 60px;
            height: 45px;
          }

          .thumbnail-info {
            padding: 6px 2px;

            .page-name {
              font-size: 9px;
            }
          }
        }
      }
    }

    .timeline-view {
      .timeline-content {
        padding: 12px;

        .timeline-bar {
          height: 40px;

          .scale-mark .mark-time {
            font-size: 9px;
            top: 18px;
          }

          .timeline-page {
            top: 22px;
            height: 15px;

            .block-label {
              font-size: 9px;
            }
          }
        }
      }
    }
  }
}
</style>