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
          v-show="isPlaying"
          ref="videoElement"
          :src="videoSrc"
          class="video-element"
          @loadedmetadata="onLoadedMetadata"
          @timeupdate="onTimeUpdate"
          @ended="onEnded"
          @play="onPlay"
          @pause="onPause"
        ></video>

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
            <el-button @click="toggleMute" :icon="Mute" circle />
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
            @input="seekTo"
            class="progress-slider"
          />
          <span class="time-total">{{ formatTime(duration) }}</span>
        </div>

        <!-- 其他控制 -->
        <div class="extra-controls">
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
      <div class="learning-progress">
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
import { useVideoApi } from '~/composables/useMockApi'
import { VideoPlay, VideoPause, Mute, FullScreen } from '@element-plus/icons-vue'

const props = defineProps({
  videoId: {
    type: String,
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
  }
})

const emit = defineEmits(['play', 'pause', 'ended', 'progress'])

const videoApi = useVideoApi()

// 响应式数据
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(80)
const currentTime = ref(0)
const watchTime = ref(0)
const progress = ref(0)
const speed = ref(1)
const videoWrapper = ref(null)
const videoElement = ref(null)

// 模拟定时器
let playInterval = null

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
  pause()
  emit('ended')
  ElMessage.success('视频播放完成')
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  volume.value = isMuted.value ? 0 : 80
}

const setVolume = (val) => {
  volume.value = val
  isMuted.value = val === 0
}

const seekTo = (val) => {
  if (videoElement.value) {
    const seekTime = (val / 100) * videoElement.value.duration
    videoElement.value.currentTime = seekTime
    currentTime.value = seekTime
    progress.value = val
  }
}

const toggleFullscreen = () => {
  if (videoWrapper.value) {
    if (!document.fullscreenElement) {
      videoWrapper.value.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
}

const adjustSpeed = () => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const currentIndex = speeds.indexOf(speed.value)
  speed.value = speeds[(currentIndex + 1) % speeds.length]
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
    // 更新时长显示
    duration.value = videoElement.value.duration
  }
}

const onTimeUpdate = () => {
  if (videoElement.value) {
    currentTime.value = videoElement.value.currentTime
    watchTime.value = videoElement.value.currentTime
    progress.value = (currentTime.value / videoElement.value.duration) * 100

    // 每10秒记录一次进度
    if (Math.floor(currentTime.value) % 10 === 0) {
      recordProgress()
      emit('progress', {
        currentTime: currentTime.value,
        progress: progress.value
      })
    }
  }
}

const onEnded = () => {
  ended()
}

const onPlay = () => {
  isPlaying.value = true
  emit('play')
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
}

const formatTime = (seconds) => {
  if (!seconds) return '00:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 生命周期
onMounted(() => {
  if (props.autoplay) {
    play()
  }
})

onUnmounted(() => {
  if (playInterval) {
    clearInterval(playInterval)
  }
})

// 监听属性变化
watch(() => props.videoId, (newId) => {
  // 重置播放器状态
  pause()
  currentTime.value = 0
  watchTime.value = 0
  progress.value = 0
  speed.value = 1
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
    transition: background-color 0.3s;

    &.playing {
      background: rgba(0, 0, 0, 0.1);

      .play-button {
        opacity: 0;
      }

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
    }

    .video-info {
      text-align: center;
      color: white;
      transition: opacity 0.3s;
      max-width: 80%;

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
    }

    .progress-slider {
      flex: 1;
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
    background: rgba(0, 0, 0, 0.7);
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
}
</style>