<template>
  <div class="course-detail-page">
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

    <!-- 左侧导航 + 右侧内容区 -->
    <div class="course-content">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="sidebar-item"
          :class="{ active: activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          <span>{{ tab.label }}</span>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="main-content">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Reading,
  ChatDotRound,
  Edit,
  Document
} from '@element-plus/icons-vue'

definePageMeta({
  title: '课程详情'
})

const route = useRoute()
const router = useRouter()

// 课程信息
const courseInfo = ref({
  id: parseInt(route.params.id),
  title: '软件工程导论',
  school: '芝麻编程',
  teacher: '李教授',
  cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
  progress: 78
})

// 标签页配置
const tabs = [
  { key: 'chapters', label: '章节', icon: Reading },
  { key: 'homework', label: '作业', icon: Edit },
  { key: 'exam', label: '考试', icon: Document },
  { key: 'ai', label: 'AI助教', icon: ChatDotRound }
]

// 当前激活的标签
const activeTab = ref('chapters')

// 切换标签
const switchTab = (tabKey) => {
  activeTab.value = tabKey
  const routeMap = {
    chapters: `/student/course/${route.params.id}/chapters`,
    homework: `/student/course/${route.params.id}/homework`,
    exam: `/student/course/${route.params.id}/exam`,
    ai: `/student/course/${route.params.id}/ai`
  }
  router.push(routeMap[tabKey])
}

// 监听路由变化，更新激活标签
watch(() => route.path, (newPath) => {
  if (newPath.includes('/chapters')) activeTab.value = 'chapters'
  else if (newPath.includes('/homework')) activeTab.value = 'homework'
  else if (newPath.includes('/exam')) activeTab.value = 'exam'
  else if (newPath.includes('/ai')) activeTab.value = 'ai'
}, { immediate: true })

// 生命周期
onMounted(() => {
  // 如果没有子路由，默认跳转到章节页
  if (route.path === `/student/course/${route.params.id}`) {
    router.push(`/student/course/${route.params.id}/chapters`)
  }
})
</script>

<style lang="scss" scoped>
.course-detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

.course-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e4e7ed;

  .course-cover {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .course-info {
    flex: 1;

    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .course-meta {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }

    .course-progress {
      display: flex;
      align-items: center;
      gap: 12px;

      .el-progress {
        flex: 1;
        max-width: 300px;
      }

      span {
        font-size: 13px;
        color: #909399;
      }
    }
  }
}

.course-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  padding: 20px 0;

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.3s;
    color: #606266;
    font-size: 14px;

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
      border-right: 3px solid #409eff;
      font-weight: 600;
    }
  }
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
}
</style>
