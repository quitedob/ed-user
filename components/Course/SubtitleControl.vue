<template>
  <div class="subtitle-control-component">
    <!-- 字幕控制头部 -->
    <div class="subtitle-header" v-if="title || showHeader">
      <h3 class="header-title">{{ title || '字幕控制' }}</h3>
      <div class="header-actions">
        <el-switch
          v-model="subtitlesEnabled"
          :disabled="!hasSubtitles"
          @change="handleSubtitleToggle"
          size="small"
          inline-prompt
          :active-text="subtitlesEnabled ? '开启' : ''"
          :inactive-text="!subtitlesEnabled ? '关闭' : ''"
        />
      </div>
    </div>

    <!-- 字幕选择器 -->
    <div class="subtitle-selector" v-if="hasSubtitles && subtitlesEnabled">
      <div class="selector-label">选择字幕：</div>
      <el-select
        v-model="selectedSubtitleId"
        placeholder="请选择字幕语言"
        size="small"
        @change="handleSubtitleChange"
        style="width: 100%"
      >
        <el-option
          v-for="subtitle in subtitles"
          :key="subtitle.id"
          :label="subtitle.label"
          :value="subtitle.id"
        >
          <div class="subtitle-option">
            <span class="language-flag">{{ getLanguageFlag(subtitle.language) }}</span>
            <span class="language-label">{{ subtitle.label }}</span>
            <span class="language-code">{{ subtitle.language.toUpperCase() }}</span>
          </div>
        </el-option>
      </el-select>
    </div>

    <!-- 字幕样式控制 -->
    <div class="subtitle-style-controls" v-if="subtitlesEnabled && showStyleControls">
      <el-collapse v-model="activeCollapse">
        <!-- 字体设置 -->
        <el-collapse-item title="字体设置" name="font">
          <div class="style-group">
            <div class="style-item">
              <label>字体大小：</label>
              <el-slider
                v-model="subtitleStyle.fontSize"
                :min="12"
                :max="24"
                :step="1"
                show-input
                @change="updateSubtitleStyle"
              />
            </div>
            <div class="style-item">
              <label>字体颜色：</label>
              <el-color-picker
                v-model="subtitleStyle.color"
                @change="updateSubtitleStyle"
                show-alpha
              />
            </div>
            <div class="style-item">
              <label>背景颜色：</label>
              <el-color-picker
                v-model="subtitleStyle.backgroundColor"
                @change="updateSubtitleStyle"
                show-alpha
              />
            </div>
          </div>
        </el-collapse-item>

        <!-- 位置设置 -->
        <el-collapse-item title="位置设置" name="position">
          <div class="style-group">
            <div class="style-item">
              <label>垂直位置：</label>
              <el-select v-model="subtitleStyle.position" @change="updateSubtitleStyle" style="width: 100%">
                <el-option label="顶部" value="top" />
                <el-option label="中部" value="center" />
                <el-option label="底部" value="bottom" />
              </el-select>
            </div>
            <div class="style-item">
              <label>水平对齐：</label>
              <el-select v-model="subtitleStyle.align" @change="updateSubtitleStyle" style="width: 100%">
                <el-option label="左对齐" value="left" />
                <el-option label="居中对齐" value="center" />
                <el-option label="右对齐" value="right" />
              </el-select>
            </div>
          </div>
        </el-collapse-item>

        <!-- 效果设置 -->
        <el-collapse-item title="效果设置" name="effects">
          <div class="style-group">
            <div class="style-item">
              <label>背景透明度：</label>
              <el-slider
                v-model="subtitleStyle.backgroundOpacity"
                :min="0"
                :max="1"
                :step="0.1"
                @change="updateSubtitleStyle"
              />
            </div>
            <div class="style-item">
              <el-switch
                v-model="subtitleStyle.showBorder"
                active-text="显示边框"
                @change="updateSubtitleStyle"
              />
            </div>
            <div class="style-item">
              <el-switch
                v-model="subtitleStyle.enableShadow"
                active-text="启用阴影"
                @change="updateSubtitleStyle"
              />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 重置按钮 -->
      <div class="style-actions">
        <el-button size="small" @click="resetSubtitleStyle">
          重置为默认
        </el-button>
        <el-button size="small" type="primary" @click="saveSubtitleStyle">
          保存样式
        </el-button>
      </div>
    </div>

    <!-- 当前字幕显示 -->
    <div class="current-subtitle" v-if="subtitlesEnabled && currentSubtitle">
      <div class="subtitle-preview">
        <div class="preview-label">当前字幕：</div>
        <div class="preview-content" :style="getPreviewStyle()">
          {{ currentSubtitle.text }}
        </div>
        <div class="preview-time">
          {{ formatTime(currentSubtitle.start) }} - {{ formatTime(currentSubtitle.end) }}
        </div>
      </div>
    </div>

    <!-- 字幕列表 -->
    <div class="subtitle-list" v-if="subtitlesEnabled && currentSubtitleData && showSubtitleList">
      <div class="list-header">
        <span>字幕列表</span>
        <el-button size="small" :icon="Download" @click="downloadSubtitle">
          下载字幕
        </el-button>
      </div>
      <div class="subtitle-items">
        <div
          v-for="(item, index) in currentSubtitleData"
          :key="index"
          class="subtitle-item"
          :class="{ active: isCurrentSubtitle(item) }"
          @click="seekToTime(item.start)"
        >
          <div class="item-index">{{ index + 1 }}</div>
          <div class="item-content">
            <div class="item-time">{{ formatTime(item.start) }} - {{ formatTime(item.end) }}</div>
            <div class="item-text">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!hasSubtitles" class="empty-state">
      <el-empty description="暂无可用字幕" :image-size="80">
        <el-button v-if="allowUpload" type="primary" :icon="Upload" @click="handleUpload">
          上传字幕文件
        </el-button>
      </el-empty>
    </div>

    <!-- 上传字幕对话框 -->
    <el-dialog v-model="showUploadDialog" title="上传字幕文件" width="500px">
      <el-upload
        class="subtitle-upload"
        drag
        :before-upload="beforeUpload"
        :http-request="handleFileUpload"
        accept=".srt,.vtt,.ass"
        :limit="1"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将字幕文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 SRT、VTT、ASS 格式的字幕文件
          </div>
        </template>
      </el-upload>

      <div class="upload-form" v-if="uploadForm.file">
        <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="80px">
          <el-form-item label="语言" prop="language">
            <el-select v-model="uploadForm.language" placeholder="请选择语言" style="width: 100%">
              <el-option label="中文" value="zh" />
              <el-option label="英文" value="en" />
              <el-option label="日文" value="ja" />
              <el-option label="韩文" value="ko" />
              <el-option label="法文" value="fr" />
              <el-option label="德文" value="de" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="label">
            <el-input v-model="uploadForm.label" placeholder="请输入字幕标签" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="showUploadDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload" :loading="uploading">
          上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  Download,
  Upload,
  UploadFilled
} from '@element-plus/icons-vue'

const props = defineProps({
  // 可用字幕列表
  subtitles: {
    type: Array,
    default: () => []
  },
  // 当前选中的字幕ID
  modelValue: {
    type: String,
    default: ''
  },
  // 是否启用字幕
  enabled: {
    type: Boolean,
    default: false
  },
  // 当前播放的字幕
  currentSubtitle: {
    type: Object,
    default: null
  },
  // 当前字幕数据
  currentSubtitleData: {
    type: Array,
    default: () => []
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
  // 是否显示样式控制
  showStyleControls: {
    type: Boolean,
    default: true
  },
  // 是否显示字幕列表
  showSubtitleList: {
    type: Boolean,
    default: false
  },
  // 是否允许上传
  allowUpload: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:enabled',
  'subtitleChange',
  'styleChange',
  'seekToTime',
  'subtitleUpload'
])

// 响应式数据
const subtitlesEnabled = ref(props.enabled)
const selectedSubtitleId = ref(props.modelValue)
const activeCollapse = ref(['font'])
const showUploadDialog = ref(false)
const uploading = ref(false)
const uploadFormRef = ref(null)

// 字幕样式
const subtitleStyle = ref({
  fontSize: 16,
  color: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  position: 'bottom',
  align: 'center',
  backgroundOpacity: 0.8,
  showBorder: false,
  enableShadow: true
})

// 上传表单
const uploadForm = ref({
  file: null,
  language: '',
  label: ''
})

// 上传验证规则
const uploadRules = {
  language: [
    { required: true, message: '请选择语言', trigger: 'change' }
  ],
  label: [
    { required: true, message: '请输入字幕标签', trigger: 'blur' }
  ]
}

// 计算属性
const hasSubtitles = computed(() => {
  return props.subtitles && props.subtitles.length > 0
})

// 方法
const getLanguageFlag = (language) => {
  const flags = {
    zh: '🇨🇳',
    en: '🇺🇸',
    ja: '🇯🇵',
    ko: '🇰🇷',
    fr: '🇫🇷',
    de: '🇩🇪'
  }
  return flags[language] || '🌐'
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

const handleSubtitleToggle = (enabled) => {
  emit('update:enabled', enabled)
}

const handleSubtitleChange = (subtitleId) => {
  selectedSubtitleId.value = subtitleId
  emit('update:modelValue', subtitleId)
  emit('subtitleChange', subtitleId)
}

const updateSubtitleStyle = () => {
  emit('styleChange', subtitleStyle.value)
}

const resetSubtitleStyle = () => {
  subtitleStyle.value = {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'bottom',
    align: 'center',
    backgroundOpacity: 0.8,
    showBorder: false,
    enableShadow: true
  }
  updateSubtitleStyle()
}

const saveSubtitleStyle = () => {
  localStorage.setItem('subtitleStyle', JSON.stringify(subtitleStyle.value))
  ElMessage.success('字幕样式已保存')
}

const getPreviewStyle = () => {
  return {
    fontSize: `${subtitleStyle.value.fontSize}px`,
    color: subtitleStyle.value.color,
    backgroundColor: subtitleStyle.value.backgroundColor,
    textAlign: subtitleStyle.value.align,
    border: subtitleStyle.value.showBorder ? '1px solid #ccc' : 'none',
    textShadow: subtitleStyle.value.enableShadow ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none',
    padding: '4px 8px',
    borderRadius: '4px'
  }
}

const isCurrentSubtitle = (subtitle) => {
  if (!props.currentSubtitle) return false
  return props.currentSubtitle.start === subtitle.start && props.currentSubtitle.end === subtitle.end
}

const seekToTime = (time) => {
  emit('seekToTime', time)
}

const downloadSubtitle = () => {
  if (!props.currentSubtitleData) return

  const srtContent = props.currentSubtitleData.map((item, index) => {
    return `${index + 1}\n${formatSrtTime(item.start)} --> ${formatSrtTime(item.end)}\n${item.text}\n`
  }).join('\n')

  const blob = new Blob([srtContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `subtitle_${selectedSubtitleId.value}.srt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const formatSrtTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
}

const handleUpload = () => {
  showUploadDialog.value = true
}

const beforeUpload = (file) => {
  const allowedTypes = ['srt', 'vtt', 'ass']
  const extension = file.name.split('.').pop().toLowerCase()

  if (!allowedTypes.includes(extension)) {
    ElMessage.error('只支持 SRT、VTT、ASS 格式的字幕文件')
    return false
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    ElMessage.error('字幕文件大小不能超过 5MB')
    return false
  }

  uploadForm.value.file = file
  return false // 阻止自动上传
}

const handleFileUpload = () => {
  // 手动处理上传逻辑
}

const confirmUpload = async () => {
  try {
    await uploadFormRef.value.validate()
    uploading.value = true

    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    formData.append('language', uploadForm.value.language)
    formData.append('label', uploadForm.value.label)

    emit('subtitleUpload', formData)

    showUploadDialog.value = false
    resetUploadForm()
  } catch (error) {
    console.error('上传字幕失败:', error)
  } finally {
    uploading.value = false
  }
}

const resetUploadForm = () => {
  uploadForm.value = {
    file: null,
    language: '',
    label: ''
  }
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields()
  }
}

// 初始化加载保存的样式
onMounted(() => {
  const savedStyle = localStorage.getItem('subtitleStyle')
  if (savedStyle) {
    try {
      subtitleStyle.value = JSON.parse(savedStyle)
    } catch (error) {
      console.error('加载字幕样式失败:', error)
    }
  }
})

// 监听props变化
watch(() => props.enabled, (newVal) => {
  subtitlesEnabled.value = newVal
})

watch(() => props.modelValue, (newVal) => {
  selectedSubtitleId.value = newVal
})
</script>

<style lang="scss" scoped>
.subtitle-control-component {
  .subtitle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .subtitle-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .selector-label {
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
    }
  }

  .subtitle-option {
    display: flex;
    align-items: center;
    gap: 8px;

    .language-flag {
      font-size: 16px;
    }

    .language-label {
      flex: 1;
    }

    .language-code {
      font-size: 12px;
      color: #909399;
    }
  }

  .subtitle-style-controls {
    margin-bottom: 16px;

    .style-group {
      .style-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        label {
          min-width: 100px;
          font-size: 14px;
          color: #606266;
        }
      }
    }

    .style-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e4e7ed;
    }
  }

  .current-subtitle {
    margin-bottom: 16px;

    .subtitle-preview {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 16px;

      .preview-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
      }

      .preview-content {
        background: #000;
        border-radius: 4px;
        padding: 8px 12px;
        margin-bottom: 8px;
        text-align: center;
        line-height: 1.6;
      }

      .preview-time {
        font-size: 12px;
        color: #909399;
        text-align: center;
      }
    }
  }

  .subtitle-list {
    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      span {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .subtitle-items {
      max-height: 300px;
      overflow-y: auto;

      .subtitle-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: #f5f7fa;
        }

        &.active {
          background: #ecf5ff;
          border-color: #409eff;
        }

        .item-index {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          background: #e4e7ed;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #606266;
        }

        .item-content {
          flex: 1;

          .item-time {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
          }

          .item-text {
            font-size: 14px;
            color: #303133;
            line-height: 1.4;
          }
        }
      }
    }
  }

  .subtitle-upload {
    margin-bottom: 16px;
  }

  .upload-form {
    border-top: 1px solid #e4e7ed;
    padding-top: 16px;
    margin-top: 16px;
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .subtitle-control-component {
    .subtitle-selector {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .subtitle-style-controls {
      .style-group {
        .style-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          label {
            min-width: auto;
          }
        }
      }
    }

    .subtitle-list {
      .list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  }
}
</style>