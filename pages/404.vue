<template>
  <div class="error-page">
    <el-result icon="info" status="404" title="对不起，您访问的内容不存在！">
      <template #sub-title>
        <div class="error-info">
          <p>请求的页面：<code>{{ currentPath }}</code></p>
          <p v-if="errorMessage" class="error-message">错误信息：{{ errorMessage }}</p>
        </div>
      </template>
      <template #extra>
        <div class="action-buttons">
          <el-button type="primary" @click="goHome">前往首页</el-button>
          <el-button type="success" @click="goBack">返回上一页</el-button>
          <el-button type="warning" @click="showErrorLog" v-if="hasConsoleErrors">
            查看错误日志
          </el-button>
        </div>
      </template>
    </el-result>

    <!-- 错误日志弹窗 -->
    <el-dialog
      v-model="errorLogVisible"
      title="错误日志"
      width="700px"
      :close-on-click-modal="false"
    >
      <div class="error-log-content">
        <div class="log-header">
          <span class="log-title">控制台错误信息</span>
          <el-button 
            type="primary" 
            size="small" 
            @click="copyErrorLog"
            :icon="CopyDocument"
          >
            一键复制
          </el-button>
        </div>
        
        <div class="log-body">
          <pre>{{ errorLogText }}</pre>
        </div>

        <div class="log-footer">
          <el-alert
            v-if="copySuccess"
            title="复制成功！错误日志已复制到剪贴板"
            type="success"
            :closable="false"
            show-icon
          />
          <p class="tip">提示：您可以将此错误日志发送给技术支持团队</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { CopyDocument } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const errorLogVisible = ref(false)
const copySuccess = ref(false)
const consoleErrors = ref([])
const currentPath = ref('')
const errorMessage = ref('')

// 计算属性
const hasConsoleErrors = computed(() => consoleErrors.value.length > 0)

const errorLogText = computed(() => {
  const logs = []
  logs.push('='.repeat(60))
  logs.push('错误报告')
  logs.push('='.repeat(60))
  logs.push(`时间: ${new Date().toLocaleString()}`)
  logs.push(`页面路径: ${currentPath.value}`)
  logs.push(`用户代理: ${navigator.userAgent}`)
  logs.push('')
  logs.push('控制台错误:')
  logs.push('-'.repeat(60))
  
  if (consoleErrors.value.length > 0) {
    consoleErrors.value.forEach((error, index) => {
      logs.push(`\n[错误 ${index + 1}]`)
      logs.push(`类型: ${error.type}`)
      logs.push(`消息: ${error.message}`)
      logs.push(`文件: ${error.filename || 'N/A'}`)
      logs.push(`行号: ${error.lineno || 'N/A'}`)
      logs.push(`列号: ${error.colno || 'N/A'}`)
      if (error.stack) {
        logs.push(`堆栈: ${error.stack}`)
      }
    })
  } else {
    logs.push('无控制台错误记录')
  }
  
  logs.push('')
  logs.push('='.repeat(60))
  
  return logs.join('\n')
})

// 方法
function goBack() {
  router.go(-1)
}

function goHome() {
  router.push({ path: '/' })
}

function showErrorLog() {
  errorLogVisible.value = true
  copySuccess.value = false
}

async function copyErrorLog() {
  try {
    await navigator.clipboard.writeText(errorLogText.value)
    copySuccess.value = true
    ElMessage.success('错误日志已复制到剪贴板')
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

// 捕获控制台错误
function captureConsoleErrors() {
  // 保存原始的 console.error
  const originalError = console.error
  
  // 重写 console.error
  console.error = function(...args) {
    // 调用原始方法
    originalError.apply(console, args)
    
    // 记录错误
    consoleErrors.value.push({
      type: 'error',
      message: args.map(arg => String(arg)).join(' '),
      timestamp: new Date().toISOString()
    })
  }
  
  // 捕获全局错误
  window.addEventListener('error', (event) => {
    consoleErrors.value.push({
      type: 'error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString()
    })
  })
  
  // 捕获未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    consoleErrors.value.push({
      type: 'unhandledrejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString()
    })
  })
}

// 生命周期
onMounted(() => {
  currentPath.value = route.fullPath
  errorMessage.value = route.query.error || ''
  
  // 开始捕获错误
  captureConsoleErrors()
  
  // 从 sessionStorage 读取之前的错误（如果有）
  try {
    const savedErrors = sessionStorage.getItem('consoleErrors')
    if (savedErrors) {
      consoleErrors.value = JSON.parse(savedErrors)
    }
  } catch (e) {
    console.error('读取错误日志失败:', e)
  }
})

// 在组件卸载前保存错误日志
onBeforeUnmount(() => {
  try {
    sessionStorage.setItem('consoleErrors', JSON.stringify(consoleErrors.value))
  } catch (e) {
    console.error('保存错误日志失败:', e)
  }
})
</script>

<style lang="scss" scoped>
.error-page {
  min-height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.el-result {
  width: 100%;
  max-width: 800px;
}

.error-info {
  margin-top: 16px;
  text-align: left;
  
  p {
    margin: 8px 0;
    font-size: 14px;
    color: #606266;
    
    code {
      background: #f5f7fa;
      padding: 2px 8px;
      border-radius: 4px;
      color: #e6a23c;
      font-family: 'Monaco', 'Consolas', monospace;
    }
  }
  
  .error-message {
    color: #f56c6c;
    font-weight: 500;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

// 错误日志弹窗样式
.error-log-content {
  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;
    
    .log-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .log-body {
    background: #2d2d2d;
    border-radius: 8px;
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 16px;
    
    pre {
      margin: 0;
      color: #f8f8f2;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    // 自定义滚动条
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #1e1e1e;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 4px;
      
      &:hover {
        background: #777;
      }
    }
  }
  
  .log-footer {
    .tip {
      margin-top: 12px;
      font-size: 13px;
      color: #909399;
      text-align: center;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .error-page {
    padding: 20px 10px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
    
    .el-button {
      width: 100%;
    }
  }
  
  :deep(.el-dialog) {
    width: 90% !important;
  }
}
</style>
