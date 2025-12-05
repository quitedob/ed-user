<template>
  <div class="default-layout">
    <header class="layout-header">
      <div class="header-left">
        <el-button @click="goBack" :icon="ArrowLeft" text>返回</el-button>
        <h1 class="page-title">{{ pageTitle }}</h1>
      </div>
      <div class="header-right">
        <el-button @click="goHome" :icon="HomeFilled" text>首页</el-button>
      </div>
    </header>
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ArrowLeft, HomeFilled } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 页面标题
const pageTitle = computed(() => {
  // 根据路由路径生成页面标题
  const path = route.path
  if (path.includes('/student/course/')) {
    return '课程学习'
  }
  return '学习平台'
})

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/student')
}
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: linear-gradient(135deg, #3A4D8F 0%, #2C3E7A 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .page-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: white;
    }
  }
}

.layout-main {
  flex: 1;
  padding: 24px;
  background: #f5f7fa;
  overflow-y: auto;
}
</style>
