<template>
  <div class="redirect-page">
    <div class="redirect-content">
      <div class="redirect-icon">
        <el-icon :size="48"><Loading /></el-icon>
      </div>
      <h2>页面迁移中...</h2>
      <p>正在为您跳转到新的学习页面，请稍候</p>
      <div class="redirect-info">
        <p>旧的课程学习页面已升级为更完善的学生门户学习体验</p>
        <p>如果页面没有自动跳转，请点击下方按钮</p>
      </div>
      <el-button type="primary" @click="manualRedirect" :loading="redirecting">
        立即跳转到新页面
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

definePageMeta({
  title: '页面迁移中'
})

const route = useRoute()
const router = useRouter()
const redirecting = ref(false)

// 自动重定向逻辑
const performRedirect = () => {
  const courseId = route.query.id
  if (courseId) {
    // 检查用户是否已登录
    const token = getToken()
    if (token) {
      // 已登录，重定向到学生门户
      router.replace(`/student/course/${courseId}`)
    } else {
      // 未登录，重定向到课程详情页
      router.replace(`/course/detail?id=${courseId}`)
    }
  } else {
    // 没有课程ID，重定向到课程列表
    router.replace('/course/list')
  }
}

// 手动重定向
const manualRedirect = () => {
  redirecting.value = true
  performRedirect()
}

// 组件挂载时自动重定向
onMounted(() => {
  // 延迟1秒后自动重定向，给用户足够时间看到提示信息
  setTimeout(() => {
    if (!redirecting.value) {
      performRedirect()
    }
  }, 1000)
})
</script>

<style lang="scss" scoped>
.redirect-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.redirect-content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .redirect-icon {
    margin-bottom: 24px;
    color: white;
    animation: pulse 2s infinite;
  }

  h2 {
    font-size: 28px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: white;
  }

  p {
    font-size: 16px;
    margin: 0 0 32px 0;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
  }

  .redirect-info {
    margin-bottom: 32px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border-left: 4px solid rgba(255, 255, 255, 0.3);

    p {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .el-button {
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .redirect-content {
    margin: 20px;
    padding: 30px 20px;

    h2 {
      font-size: 24px;
    }

    p {
      font-size: 14px;
    }

    .redirect-info {
      padding: 16px;

      p {
        font-size: 13px;
      }
    }

    .el-button {
      width: 100%;
      font-size: 14px;
    }
  }
}
</style>