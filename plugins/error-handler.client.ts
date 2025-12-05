export default defineNuxtPlugin((nuxtApp) => {
  // 捕获 Vue 错误
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue Error:', error)
    console.error('Error Info:', info)
    
    // 保存错误到 sessionStorage
    try {
      const errors = JSON.parse(sessionStorage.getItem('consoleErrors') || '[]')
      errors.push({
        type: 'vue-error',
        message: error.message || String(error),
        stack: error.stack,
        info,
        timestamp: new Date().toISOString()
      })
      sessionStorage.setItem('consoleErrors', JSON.stringify(errors))
    } catch (e) {
      console.error('保存错误失败:', e)
    }
  }

  // 捕获全局错误
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error('Nuxt Error Hook:', error)
    
    // 如果是模块导入错误，跳转到 404
    if (error.message && error.message.includes('does not provide an export')) {
      const router = useRouter()
      router.push({
        path: '/404',
        query: {
          error: error.message,
          from: router.currentRoute.value.fullPath
        }
      })
    }
  })

  // 捕获路由错误
  nuxtApp.hook('app:error', (error) => {
    console.error('App Error:', error)
    
    // 保存错误
    try {
      const errors = JSON.parse(sessionStorage.getItem('consoleErrors') || '[]')
      errors.push({
        type: 'app-error',
        message: error.message || String(error),
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
      sessionStorage.setItem('consoleErrors', JSON.stringify(errors))
    } catch (e) {
      console.error('保存错误失败:', e)
    }
  })

  // 捕获未处理的 Promise 拒绝
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason)
      
      // 保存错误
      try {
        const errors = JSON.parse(sessionStorage.getItem('consoleErrors') || '[]')
        errors.push({
          type: 'unhandledrejection',
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
          timestamp: new Date().toISOString()
        })
        sessionStorage.setItem('consoleErrors', JSON.stringify(errors))
      } catch (e) {
        console.error('保存错误失败:', e)
      }

      // 如果是模块导入错误，跳转到 404
      if (event.reason?.message && event.reason.message.includes('does not provide an export')) {
        const router = useRouter()
        router.push({
          path: '/404',
          query: {
            error: event.reason.message
          }
        })
      }
    })
  }
})
