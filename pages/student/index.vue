<script setup>
// 学生中心首页 - 重定向到课程页面
definePageMeta({
  layout: 'student',
  // middleware: ['auth'], // 暂时注释，开发时使用
  title: '学生中心'
})

// 在客户端重定向
if (process.client) {
  navigateTo('/student/course', { replace: true })
}
</script>

<template>
  <div class="redirecting">
    <p>正在跳转到课程页面...</p>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
  
  p {
    font-size: 16px;
    color: #909399;
  }
}
</style>