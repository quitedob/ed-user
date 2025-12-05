<!-- PDF预览器组件 -->
<template>
  <div class="pdf-viewer-container">
    <div class="pdf-toolbar">
      <el-button-group size="small">
        <el-button @click="prevPage" :disabled="currentPage <= 1">
          <el-icon><ArrowLeft /></el-icon>
          上一页
        </el-button>
        <el-button @click="nextPage" :disabled="currentPage >= totalPages">
          下一页
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </el-button-group>

      <div class="page-info">
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
      </div>

      <el-button-group size="small">
        <el-button @click="zoomOut" :disabled="scale <= 0.5">
          <el-icon><Minus /></el-icon>
          缩小
        </el-button>
        <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
        <el-button @click="zoomIn" :disabled="scale >= 3">
          <el-icon><Plus /></el-icon>
          放大
        </el-button>
        <el-button @click="resetZoom">
          适应页面
        </el-button>
      </el-button-group>

      <el-button-group size="small">
        <el-button @click="toggleFullscreen">
          <el-icon><FullScreen /></el-icon>
          全屏
        </el-button>
        <el-button @click="downloadPdf">
          <el-icon><Download /></el-icon>
          下载
        </el-button>
      </el-button-group>

      <!-- 搜索功能 -->
      <div class="search-box">
        <el-input
          v-model="searchText"
          placeholder="搜索文本..."
          size="small"
          style="width: 150px;"
          @keyup.enter="searchTextInPdf"
        >
          <template #suffix>
            <el-icon @click="searchTextInPdf" style="cursor: pointer;">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button size="small" @click="clearSearch">
          清除
        </el-button>
      </div>
    </div>

    <div class="pdf-content" ref="pdfContainer">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        <p>正在加载PDF...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <el-icon><Warning /></el-icon>
        <p>{{ error }}</p>
        <el-button @click="loadPdf">重试</el-button>
      </div>

      <div v-else class="pdf-canvas-container" ref="canvasContainer">
        <canvas ref="pdfCanvas"></canvas>
      </div>
    </div>

    <!-- 缩略图面板 -->
    <div v-if="showThumbnails" class="thumbnail-panel">
      <div class="thumbnail-header">
        <span>页面缩略图</span>
        <el-button size="small" @click="showThumbnails = false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="thumbnail-list">
        <div
          v-for="pageNum in totalPages"
          :key="pageNum"
          :class="['thumbnail-item', { active: pageNum === currentPage }]"
          @click="goToPage(pageNum)"
        >
          <canvas :ref="(el) => setThumbnailRef(el, pageNum)" class="thumbnail-canvas"></canvas>
          <span class="page-number">{{ pageNum }}</span>
        </div>
      </div>
    </div>

    <!-- 全屏模式 -->
    <div v-if="isFullscreen" class="fullscreen-overlay" @click="exitFullscreen">
      <div class="fullscreen-content" @click.stop>
        <div class="fullscreen-toolbar">
          <el-button @click="exitFullscreen">
            <el-icon><Close /></el-icon>
            退出全屏
          </el-button>
        </div>
        <div class="fullscreen-pdf" ref="fullscreenContainer">
          <canvas ref="fullscreenCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  FullScreen,
  Download,
  Search,
  Close,
  Warning,
  Loading
} from '@element-plus/icons-vue'
import * as pdfjsLib from 'pdfjs-dist'

// 配置PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
}

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  initialPage: {
    type: Number,
    default: 1
  },
  initialScale: {
    type: Number,
    default: 1.0
  }
})

const emit = defineEmits(['page-change', 'scale-change', 'load-complete', 'error'])

const pdfContainer = ref(null)
const canvasContainer = ref(null)
const pdfCanvas = ref(null)
const fullscreenContainer = ref(null)
const fullscreenCanvas = ref(null)

// 响应式数据
const loading = ref(false)
const error = ref('')
const pdfDoc = ref(null)
const currentPage = ref(props.initialPage)
const totalPages = ref(0)
const scale = ref(props.initialScale)
const searchText = ref('')
const showThumbnails = ref(false)
const isFullscreen = ref(false)
const thumbnailRefs = ref([])

// 搜索相关
const searchResults = ref([])
const currentSearchIndex = ref(-1)

// 设置缩略图引用
const setThumbnailRef = (el, pageNum) => {
  if (el) {
    thumbnailRefs.value[pageNum] = el
  }
}

// 加载PDF
const loadPdf = async () => {
  if (!props.src) return

  loading.value = true
  error.value = ''

  try {
    const loadingTask = pdfjsLib.getDocument(props.src)
    pdfDoc.value = await loadingTask.promise

    totalPages.value = pdfDoc.value.numPages
    currentPage.value = Math.min(props.initialPage, totalPages.value)

    await renderPage(currentPage.value)
    await generateThumbnails()

    emit('load-complete', { totalPages: totalPages.value })
  } catch (err) {
    console.error('PDF加载失败:', err)
    error.value = 'PDF加载失败，请检查文件路径是否正确'
    emit('error', err)
  } finally {
    loading.value = false
  }
}

// 渲染页面
const renderPage = async (pageNum, canvas = pdfCanvas.value, container = canvasContainer.value) => {
  if (!pdfDoc.value || !canvas) return

  const page = await pdfDoc.value.getPage(pageNum)
  const viewport = page.getViewport({ scale: scale.value })

  canvas.height = viewport.height
  canvas.width = viewport.width

  const renderContext = {
    canvasContext: canvas.getContext('2d'),
    viewport: viewport
  }

  await page.render(renderContext).promise

  // 调整容器大小
  if (container) {
    container.style.width = viewport.width + 'px'
    container.style.height = viewport.height + 'px'
  }
}

// 生成缩略图
const generateThumbnails = async () => {
  for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
    const canvas = thumbnailRefs.value[pageNum]
    if (canvas) {
      const page = await pdfDoc.value.getPage(pageNum)
      const viewport = page.getViewport({ scale: 0.2 })

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport
      }

      await page.render(renderContext).promise
    }
  }
}

// 页面导航
const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const goToPage = async (pageNum) => {
  if (pageNum < 1 || pageNum > totalPages.value) return

  currentPage.value = pageNum
  await renderPage(pageNum)

  if (isFullscreen.value) {
    await renderFullscreenPage(pageNum)
  }

  emit('page-change', pageNum)
}

// 缩放控制
const zoomIn = async () => {
  if (scale.value >= 3) return
  scale.value += 0.25
  await reRender()
}

const zoomOut = async () => {
  if (scale.value <= 0.5) return
  scale.value -= 0.25
  await reRender()
}

const resetZoom = async () => {
  scale.value = 1.0
  await reRender()
}

const reRender = async () => {
  await renderPage(currentPage.value)
  if (isFullscreen.value) {
    await renderFullscreenPage(currentPage.value)
  }
  emit('scale-change', scale.value)
}

// 全屏模式
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

const enterFullscreen = async () => {
  isFullscreen.value = true
  await nextTick()
  await renderFullscreenPage(currentPage.value)
}

const exitFullscreen = () => {
  isFullscreen.value = false
}

const renderFullscreenPage = async (pageNum) => {
  if (!fullscreenCanvas.value) return

  const container = fullscreenContainer.value
  if (container) {
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    const page = await pdfDoc.value.getPage(pageNum)
    const viewport = page.getViewport({ scale: 1 })

    // 计算适合容器的缩放比例
    const scaleX = containerWidth / viewport.width
    const scaleY = containerHeight / viewport.height
    const optimalScale = Math.min(scaleX, scaleY, 2) // 最大放大2倍

    const scaledViewport = page.getViewport({ scale: optimalScale })

    fullscreenCanvas.value.height = scaledViewport.height
    fullscreenCanvas.value.width = scaledViewport.width

    const renderContext = {
      canvasContext: fullscreenCanvas.value.getContext('2d'),
      viewport: scaledViewport
    }

    await page.render(renderContext).promise
  }
}

// 搜索功能
const searchTextInPdf = async () => {
  if (!searchText.value || !pdfDoc.value) return

  searchResults.value = []

  for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
    const page = await pdfDoc.value.getPage(pageNum)
    const textContent = await page.getTextContent()

    const text = textContent.items.map(item => item.str).join(' ')
    const regex = new RegExp(searchText.value, 'gi')
    let match

    while ((match = regex.exec(text)) !== null) {
      searchResults.value.push({
        pageNum,
        text: match[0],
        index: match.index
      })
    }
  }

  if (searchResults.value.length > 0) {
    currentSearchIndex.value = 0
    goToPage(searchResults.value[0].pageNum)
    ElMessage.success(`找到 ${searchResults.value.length} 个匹配结果`)
  } else {
    ElMessage.warning('未找到匹配内容')
  }
}

const clearSearch = () => {
  searchText.value = ''
  searchResults.value = []
  currentSearchIndex.value = -1
}

// 下载PDF
const downloadPdf = () => {
  const link = document.createElement('a')
  link.href = props.src
  link.download = 'document.pdf'
  link.click()
}

// 生命周期
onMounted(() => {
  loadPdf()
})

watch(() => props.src, () => {
  loadPdf()
})

watch(() => props.initialPage, (newPage) => {
  if (newPage && newPage !== currentPage.value) {
    goToPage(newPage)
  }
})
</script>

<style lang="scss" scoped>
.pdf-viewer-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.pdf-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
  flex-wrap: wrap;
  gap: 8px;

  .page-info {
    font-size: 14px;
    color: #606266;
  }

  .zoom-level {
    font-size: 14px;
    color: #606266;
    min-width: 50px;
    text-align: center;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.pdf-content {
  position: relative;
  min-height: 600px;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #909399;

    .el-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    p {
      margin: 0 0 16px 0;
      text-align: center;
    }
  }

  .error-container {
    .el-icon {
      color: #f56c6c;
    }
  }

  .pdf-canvas-container {
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: auto;
    max-width: 100%;
    max-height: 800px;
  }
}

.thumbnail-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background: white;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;

  .thumbnail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #ebeef5;
    font-weight: bold;
  }

  .thumbnail-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;

    .thumbnail-item {
      margin-bottom: 12px;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
      border: 2px solid transparent;

      &:hover,
      &.active {
        border-color: #409eff;
      }

      .thumbnail-canvas {
        width: 100%;
        height: auto;
        display: block;
      }

      .page-number {
        display: block;
        text-align: center;
        padding: 4px;
        background: #f5f7fa;
        font-size: 12px;
      }
    }
  }
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;

  .fullscreen-content {
    width: 90vw;
    height: 90vh;
    background: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .fullscreen-toolbar {
      padding: 12px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: flex-end;
    }

    .fullscreen-pdf {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f5f5;
      padding: 20px;

      canvas {
        max-width: 100%;
        max-height: 100%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .pdf-toolbar {
    flex-direction: column;
    align-items: stretch;

    .el-button-group {
      justify-content: center;
      margin-bottom: 8px;
    }

    .search-box {
      justify-content: center;
    }
  }

  .pdf-content {
    padding: 10px;
    min-height: 400px;
  }

  .thumbnail-panel {
    width: 150px;
  }

  .fullscreen-overlay .fullscreen-content {
    width: 95vw;
    height: 95vh;
  }
}
</style>
