<template>
  <!-- 如果是学习页面，直接显示内容 -->
  <div v-if="isLearningPage" class="learning-page">
    <NuxtPage />
  </div>

  <!-- 否则显示课程详情页布局（无侧边栏） -->
  <div v-else class="course-detail-page">
    <!-- 课程头部 -->
    <div class="course-header">
      <div class="course-cover">
        <img :src="courseInfo.cover" :alt="courseInfo.title" />
      </div>
      <div class="course-info">
        <h1>{{ courseInfo.title || '加载中...' }}</h1>
        <div class="course-meta">
          <span>{{ courseInfo.school }}</span>
          <span>{{ courseInfo.teacher }}</span>
        </div>
        <div class="course-progress">
          <el-progress :percentage="courseInfo.progress" />
          <span>已学习 {{ courseInfo.progress }}%</span>
        </div>
      </div>
    </div>

    <!-- 顶部标签导航（替代侧边栏） -->
    <div class="course-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.label }}</span>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="main-content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { Reading, Edit, Document } from '@element-plus/icons-vue'

definePageMeta({
  title: '课程详情'
})

const route = useRoute()
const router = useRouter()

const courseInfo = ref({
  id: parseInt(route.params.id),
  title: '软件工程导论',
  school: '芝麻编程',
  teacher: '李教授',
  cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
  progress: 78
})

// 标签页配置（移除AI助教）
const tabs = [
  { key: 'chapters', label: '章节', icon: Reading },
  { key: 'homework', label: '作业', icon: Edit },
  { key: 'exam', label: '考试', icon: Document }
]

const activeTab = ref('chapters')

// 判断是否是学习页面
const isLearningPage = computed(() => {
  return route.path.includes('/section/') || route.path.match(/\/exam\/\d+/) || route.path.match(/\/homework\/\d+/)
})

const switchTab = (tabKey) => {
  activeTab.value = tabKey
  const routeMap = {
    chapters: `/student/course/${route.params.id}/chapters`,
    homework: `/student/course/${route.params.id}/homework`,
    exam: `/student/course/${route.params.id}/exam`
  }
  router.push(routeMap[tabKey])
}

watch(() => route.path, (newPath) => {
  if (newPath.includes('/chapters')) activeTab.value = 'chapters'
  else if (newPath.includes('/homework')) activeTab.value = 'homework'
  else if (newPath.includes('/exam')) activeTab.value = 'exam'
}, { immediate: true })

onMounted(() => {
  if (route.path === `/student/course/${route.params.id}`) {
    router.push(`/student/course/${route.params.id}/chapters`)
  }
})
</script>

<style lang="scss" scoped>
.course-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7fa;
}

.course-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  background: white;
  border-bottom: 1px solid #e4e7ed;

  .course-cover {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .course-info {
    flex: 1;

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    .course-meta {
      display: flex;
      gap: 20px;
      font-size: 15px;
      color: #606266;
      margin-bottom: 12px;
    }

    .course-progress {
      display: flex;
      align-items: center;
      gap: 16px;

      .el-progress {
        flex: 1;
        max-width: 400px;
      }

      span {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}

.course-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 32px;
  background: white;
  border-bottom: 1px solid #e4e7ed;

  .tab-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    color: #606266;
    font-size: 15px;
    font-weight: 500;

    .el-icon {
      font-size: 18px;
    }

    &:hover {
      background: #f5f7fa;
      color: #409eff;
    }

    &.active {
      background: #ecf5ff;
      color: #409eff;
    }
  }
}

.main-content {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.learning-page {
  width: 100%;
  height: 100%;
}
</style>
