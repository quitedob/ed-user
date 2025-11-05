<template>
  <div class="oj-page">
    <div class="page-title">
      <h2>在线判题系统 (OJ)</h2>
    </div>
    <el-empty description="OJ功能开发中..." />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'student',
  // middleware: ['auth'], // 暂时注释，开发时使用
  title: 'OJ系统'
})
</script>

<style lang="scss" scoped>
.oj-page {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}
</style>