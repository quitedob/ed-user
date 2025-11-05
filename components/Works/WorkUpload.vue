<template>
  <div class="work-upload">
    <div class="upload-header">
      <h3>上传AIGC作品</h3>
      <p>分享你用AI创作的精彩作品</p>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      @submit.prevent="handleSubmit"
    >
      <!-- 作品类型选择 -->
      <el-form-item label="作品类型" prop="type">
        <el-radio-group v-model="formData.type" @change="handleTypeChange">
          <el-radio-button label="article">📝 文章</el-radio-button>
          <el-radio-button label="image">🖼️ 图片</el-radio-button>
          <el-radio-button label="video">🎬 视频</el-radio-button>
          <el-radio-button label="music">🎵 音乐</el-radio-button>
          <el-radio-button label="webpage">🌐 网页</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 作品标题 -->
      <el-form-item label="作品标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入作品标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <!-- 作品说明 -->
      <el-form-item label="作品说明" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请描述你的作品创作过程、使用工具、创作理念等"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 文件上传区域 -->
      <el-form-item :label="uploadLabel" prop="file">
        <!-- 文章上传 -->
        <div v-if="formData.type === 'article'" class="upload-area">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            accept=".pdf,.doc,.docx,.txt,.md"
            :on-change="handleFileChange"
            drag
          >
            <div class="upload-content">
              <el-icon class="upload-icon"><Document /></el-icon>
              <div class="upload-text">
                <p>点击或拖拽文件到此区域上传</p>
                <p class="upload-hint">支持 PDF、Word、TXT、Markdown 格式</p>
              </div>
            </div>
          </el-upload>

          <div v-if="formData.file" class="file-preview">
            <div class="file-info">
              <el-icon><Document /></el-icon>
              <span>{{ formData.file.name }}</span>
              <el-button type="danger" size="small" @click="removeFile">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 图片上传 -->
        <div v-else-if="formData.type === 'image'" class="upload-area">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="handleImageChange"
            drag
          >
            <div class="upload-content">
              <el-icon class="upload-icon"><Picture /></el-icon>
              <div class="upload-text">
                <p>点击或拖拽图片到此区域上传</p>
                <p class="upload-hint">支持 JPG、PNG、GIF 等常见图片格式</p>
              </div>
            </div>
          </el-upload>

          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="预览图" />
            <div class="preview-actions">
              <el-button type="danger" @click="removeFile">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 视频上传 -->
        <div v-else-if="formData.type === 'video'" class="upload-area">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            accept="video/*"
            :on-change="handleVideoChange"
            drag
          >
            <div class="upload-content">
              <el-icon class="upload-icon"><VideoPlay /></el-icon>
              <div class="upload-text">
                <p>点击或拖拽视频到此区域上传</p>
                <p class="upload-hint">支持 MP4、AVI、MOV 等常见视频格式</p>
              </div>
            </div>
          </el-upload>

          <div v-if="videoPreview" class="video-preview">
            <video :src="videoPreview" controls></video>
            <div class="preview-info">
              <p><strong>文件名:</strong> {{ formData.file?.name }}</p>
              <p><strong>文件大小:</strong> {{ formatFileSize(formData.file?.size) }}</p>
              <el-button type="danger" @click="removeFile">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 音乐上传 -->
        <div v-else-if="formData.type === 'music'" class="upload-area">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            accept="audio/*"
            :on-change="handleMusicChange"
            drag
          >
            <div class="upload-content">
              <el-icon class="upload-icon"><Headphones /></el-icon>
              <div class="upload-text">
                <p>点击或拖拽音频文件到此区域上传</p>
                <p class="upload-hint">支持 MP3、WAV、FLAC 等常见音频格式</p>
              </div>
            </div>
          </el-upload>

          <div v-if="musicPreview" class="music-preview">
            <div class="music-player">
              <div class="music-cover">
                <img src="/images/default-music-cover.jpg" alt="音乐封面" />
              </div>
              <div class="music-info">
                <h4>{{ formData.file?.name }}</h4>
                <audio :src="musicPreview" controls></audio>
              </div>
            </div>
            <el-button type="danger" @click="removeFile">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>

        <!-- 网页链接 -->
        <div v-else-if="formData.type === 'webpage'" class="upload-area">
          <el-form-item label="网页链接" prop="webUrl">
            <el-input
              v-model="formData.webUrl"
              placeholder="请输入网页链接"
              type="url"
            >
              <template #prepend>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div v-if="formData.webUrl" class="webpage-preview">
            <div class="webpage-info">
              <el-icon><Link /></el-icon>
              <span>{{ formData.webUrl }}</span>
              <el-button size="small" @click="previewWebpage">
                预览
              </el-button>
            </div>
          </div>
        </div>
      </el-form-item>

      <!-- AI工具信息 -->
      <el-form-item label="使用的AI工具">
        <el-select
          v-model="formData.aiTools"
          multiple
          placeholder="选择使用的AI工具"
          style="width: 100%"
        >
          <el-option
            v-for="tool in aiTools"
            :key="tool.value"
            :label="tool.label"
            :value="tool.value"
          />
        </el-select>
      </el-form-item>

      <!-- 标签 -->
      <el-form-item label="标签">
        <el-tag
          v-for="tag in formData.tags"
          :key="tag"
          closable
          @close="removeTag(tag)"
          style="margin-right: 8px; margin-bottom: 8px;"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="inputRef"
          v-model="inputValue"
          size="small"
          style="width: 100px;"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else size="small" @click="showInput">
          + 添加标签
        </el-button>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="uploading"
          size="large"
        >
          {{ uploading ? '上传中...' : '提交作品' }}
        </el-button>
        <el-button @click="resetForm" size="large">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useWorkApi } from '~/composables/useMockApi'

const props = defineProps({
  lessonId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['success', 'error'])

const workApi = useWorkApi()

// 响应式数据
const formRef = ref(null)
const uploadRef = ref(null)
const inputRef = ref(null)
const uploading = ref(false)

const formData = ref({
  type: 'article',
  title: '',
  description: '',
  file: null,
  webUrl: '',
  aiTools: [],
  tags: []
})

const imagePreview = ref('')
const videoPreview = ref('')
const musicPreview = ref('')
const inputVisible = ref(false)
const inputValue = ref('')

// 表单验证规则
const rules = {
  type: [
    { required: true, message: '请选择作品类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入作品标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入作品说明', trigger: 'blur' },
    { min: 10, max: 500, message: '说明长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  webUrl: [
    { required: true, message: '请输入网页链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的网页链接', trigger: 'blur' }
  ]
}

// AI工具选项
const aiTools = [
  { label: 'ChatGPT', value: 'chatgpt' },
  { label: 'Midjourney', value: 'midjourney' },
  { label: 'DALL-E', value: 'dalle' },
  { label: 'Stable Diffusion', value: 'stable-diffusion' },
  { label: 'GitHub Copilot', value: 'github-copilot' },
  { label: 'Claude', value: 'claude' },
  { label: 'Gemini', value: 'gemini' },
  { label: '文心一言', value: 'wenxin' },
  { label: '通义千问', value: 'tongyi' },
  { label: '其他', value: 'other' }
]

// 计算属性
const uploadLabel = computed(() => {
  const labels = {
    article: '文章文件',
    image: '图片文件',
    video: '视频文件',
    music: '音频文件',
    webpage: '网页信息'
  }
  return labels[formData.value.type] || '文件'
})

// 方法
const handleTypeChange = (type) => {
  // 重置文件和预览
  formData.value.file = null
  formData.value.webUrl = ''
  imagePreview.value = ''
  videoPreview.value = ''
  musicPreview.value = ''
}

const handleFileChange = (file) => {
  formData.value.file = file.raw
}

const handleImageChange = (file) => {
  formData.value.file = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleVideoChange = (file) => {
  formData.value.file = file.raw
  videoPreview.value = URL.createObjectURL(file.raw)
}

const handleMusicChange = (file) => {
  formData.value.file = file.raw
  musicPreview.value = URL.createObjectURL(file.raw)
}

const removeFile = () => {
  formData.value.file = null
  imagePreview.value = ''
  videoPreview.value = ''
  musicPreview.value = ''

  if (videoPreview.value) {
    URL.revokeObjectURL(videoPreview.value)
  }
  if (musicPreview.value) {
    URL.revokeObjectURL(musicPreview.value)
  }
}

const removeTag = (tag) => {
  const index = formData.value.tags.indexOf(tag)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !formData.value.tags.includes(inputValue.value)) {
    formData.value.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const previewWebpage = () => {
  window.open(formData.value.webUrl, '_blank')
}

const resetForm = () => {
  formRef.value?.resetFields()
  removeFile()
  formData.value.tags = []
  formData.value.aiTools = []
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    uploading.value = true

    // 准备提交数据
    const submitData = {
      lessonId: props.lessonId,
      type: formData.value.type,
      title: formData.value.title,
      description: formData.value.description,
      aiTools: formData.value.aiTools,
      tags: formData.value.tags
    }

    // 根据类型添加特定数据
    if (formData.value.type === 'webpage') {
      submitData.webUrl = formData.value.webUrl
    } else if (formData.value.file) {
      submitData.fileName = formData.value.file.name
      submitData.fileSize = formData.value.file.size
      // 在实际应用中，这里会上传文件并获取文件URL
      submitData.fileUrl = `/files/${Date.now()}_${formData.value.file.name}`
    }

    // 调用API上传作品
    const result = await workApi.uploadWork(submitData)

    ElMessage.success('作品上传成功！')
    emit('success', result)
    resetForm()

  } catch (error) {
    console.error('上传作品失败:', error)
    ElMessage.error('上传作品失败，请重试')
    emit('error', error)
  } finally {
    uploading.value = false
  }
}
</script>

<style lang="scss" scoped>
.work-upload {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.upload-header {
  text-align: center;
  margin-bottom: 32px;

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px 0;
  }

  p {
    color: #606266;
    margin: 0;
  }
}

.upload-area {
  .upload-content {
    text-align: center;
    padding: 40px 20px;

    .upload-icon {
      font-size: 48px;
      color: #409eff;
      margin-bottom: 16px;
    }

    .upload-text {
      p {
        margin: 8px 0;
        color: #606266;

        &.upload-hint {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  :deep(.el-upload-dragger) {
    border: 2px dashed #dcdfe6;
    border-radius: 8px;
    width: 100%;
    height: auto;

    &:hover {
      border-color: #409eff;
    }
  }
}

.file-preview {
  margin-top: 16px;
  padding: 16px;
  background: #f6f8fb;
  border-radius: 8px;

  .file-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-icon {
      font-size: 20px;
      color: #409eff;
    }

    span {
      flex: 1;
      color: #303133;
    }
  }
}

.image-preview {
  margin-top: 16px;
  position: relative;

  img {
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
  }

  .preview-actions {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.video-preview {
  margin-top: 16px;

  video {
    width: 100%;
    max-height: 300px;
    border-radius: 8px;
  }

  .preview-info {
    margin-top: 12px;
    padding: 12px;
    background: #f6f8fb;
    border-radius: 8px;

    p {
      margin: 4px 0;
      font-size: 14px;
      color: #606266;
    }
  }
}

.music-preview {
  margin-top: 16px;

  .music-player {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f6f8fb;
    border-radius: 8px;
    margin-bottom: 12px;

    .music-cover {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .music-info {
      flex: 1;

      h4 {
        margin: 0 0 12px 0;
        color: #303133;
      }

      audio {
        width: 100%;
      }
    }
  }
}

.webpage-preview {
  margin-top: 16px;

  .webpage-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f6f8fb;
    border-radius: 8px;

    .el-icon {
      color: #409eff;
    }

    span {
      flex: 1;
      color: #303133;
      word-break: break-all;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .work-upload {
    padding: 20px;
  }

  .upload-header {
    margin-bottom: 24px;

    h3 {
      font-size: 20px;
    }
  }

  .music-player {
    flex-direction: column;
    text-align: center;

    .music-cover {
      align-self: center;
    }
  }
}
</style>