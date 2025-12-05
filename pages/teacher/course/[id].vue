<template>
  <div class="teacher-course-detail">
    <!-- 页面顶部操作栏 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-spacer"></div>
    </div>

    <!-- 顶部课程信息 -->
    <div class="course-header">
      <div class="course-cover">
        <img :src="courseInfo.cover || '/images/default-course.jpg'" :alt="courseInfo.title || '课程封面'" />
      </div>
      <div class="course-info">
        <h1 class="course-title">{{ courseInfo.title || '课程标题' }}</h1>
        <p class="course-description">{{ courseInfo.description || '课程描述' }}</p>
        <div class="course-stats">
          <div class="stat-item">
            <el-icon><User /></el-icon>
            <span>{{ courseInfo.totalStudents || 0 }}名学员</span>
          </div>
          <div class="stat-item">
            <el-icon><Reading /></el-icon>
            <span>{{ courseInfo.totalLessons || 0 }}课时</span>
          </div>
          <div class="stat-item">
            <el-icon><DataLine /></el-icon>
            <span>{{ courseInfo.avgProgress || 0 }}%平均进度</span>
          </div>
        </div>
        <div class="course-actions">
          <el-button type="primary" @click="editCourse">
            <el-icon><Edit /></el-icon>
            编辑课程
          </el-button>
        </div>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="course-tabs">
      <div class="tab-container">
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
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeft, User, Reading, DataLine, Edit, UserFilled,
  DataBoard, Monitor, Document, EditPen, Trophy
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: 'teacher'
})

// 响应式数据
const route = useRoute()
const router = useRouter()
const courseInfo = ref({
  cover: '',
  title: '',
  description: '',
  totalStudents: 0,
  totalLessons: 0,
  avgProgress: 0
})
const loading = ref(false)
const activeTab = ref('overview')

// 标签页配置
const tabs = [
  { key: 'overview', label: '课程概览', icon: DataBoard },
  { key: 'homework', label: '作业管理', icon: EditPen },
  { key: 'exam', label: '考试管理', icon: Trophy },
  { key: 'students', label: '学员管理', icon: UserFilled }
]

// 方法
const loadCourseDetail = async () => {
  loading.value = true
  try {
    const { teacherApi } = await import('~/api/mock')
    const response = await teacherApi.getTeacherCourseDetail(route.params.id)

    if (response.success && response.data) {
      courseInfo.value = response.data
    } else {
      console.warn('课程数据不存在:', response.message)
      // 保持默认值，不显示错误消息给用户
    }
  } catch (error) {
    console.error('加载课程详情失败:', error)
    ElMessage.error('加载课程详情失败')
  } finally {
    loading.value = false
  }
}

const switchTab = (tabKey) => {
  activeTab.value = tabKey
  const courseId = route.params.id
  const targetPath = tabKey === 'overview'
    ? `/teacher/course/${courseId}`
    : `/teacher/course/${courseId}/${tabKey}`
  router.push(targetPath)
}

const goBack = () => {
  // 返回到教师首页或课程列表页面
  router.push('/teacher')
}

const editCourse = () => {
  router.push(`/teacher/course/create?id=${route.params.id}`)
}

// 监听路由变化更新标签页状态
watch(() => route.path, (newPath) => {
  const pathSegments = newPath.split('/')
  const lastSegment = pathSegments[pathSegments.length - 1]

  if (lastSegment && !lastSegment.match(/^\d+$/)) {
    activeTab.value = lastSegment
  } else {
    activeTab.value = 'overview'
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  loadCourseDetail()
})
</script>

<style lang="scss" scoped>
.teacher-course-detail {
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .header-spacer {
      flex: 1;
    }
  }

  .course-header {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .course-cover {
      width: 200px;
      height: 150px;
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

      .course-title {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
      }

      .course-description {
        font-size: 16px;
        color: #606266;
        margin: 0 0 16px 0;
        line-height: 1.5;
      }

      .course-stats {
        display: flex;
        gap: 24px;
        margin-bottom: 20px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #606266;

          .el-icon {
            font-size: 16px;
          }
        }
      }

      .course-actions {
        display: flex;
        gap: 12px;
      }
    }
  }

  .course-tabs {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;

    .tab-container {
      display: flex;
      padding: 0 24px;

      .tab-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 20px;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.2s;
        color: #606266;
        font-weight: 500;

        &:hover {
          color: #4CAF50;
          background: #f8f9fa;
        }

        &.active {
          color: #4CAF50;
          border-bottom-color: #4CAF50;
          font-weight: 600;
        }

        .el-icon {
          font-size: 18px;
        }

        span {
          font-size: 15px;
        }
      }
    }
  }

  .tab-content {
    min-height: 400px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .teacher-course-detail {
    .course-header {
      flex-direction: column;
      align-items: stretch;

      .course-cover {
        width: 100%;
        height: 200px;
      }
    }

    .course-tabs {
      .tab-container {
        padding: 0 16px;
        overflow-x: auto;

        .tab-item {
          flex-shrink: 0;
          padding: 12px 16px;
        }
      }
    }
  }
}
</style>