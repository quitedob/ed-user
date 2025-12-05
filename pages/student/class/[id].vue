<template>
  <!-- 如果是作业详情页或考试详情页，直接显示内容 -->
  <div v-if="isDetailPage" class="detail-page">
    <NuxtPage />
  </div>

  <!-- 否则显示完整的班级页面布局 -->
  <div v-else class="class-workspace">
    <!-- 班级信息头部 -->
    <div class="class-header">
      <div class="class-cover" :style="{ background: currentClass?.color }">
        <div class="class-info">
          <h1 class="class-name">{{ currentClass?.name }}</h1>
          <div class="class-meta">
            <span class="class-grade">{{ currentClass?.grade }}</span>
            <span class="divider">|</span>
            <span class="teacher-name">{{ currentClass?.teacherName }}</span>
          </div>
        </div>
        <div class="class-actions">
          <el-button type="primary" @click="goToResources">
            <el-icon><Reading /></el-icon>
            班级资源
          </el-button>
        </div>
      </div>
    </div>

    <!-- 班级内导航 -->
    <div class="class-nav">
      <div class="nav-container">
        <NuxtLink
          v-for="navItem in navItems"
          :key="navItem.key"
          :to="`/student/class/${route.params.id}/${navItem.key}`"
          class="nav-item"
          :class="{ active: $route.path.endsWith(`/${navItem.key}`) }"
        >
          <el-icon>
            <component :is="navItem.icon" />
          </el-icon>
          <span>{{ navItem.label }}</span>
          <el-badge
            v-if="navItem.count > 0"
            :value="navItem.count"
            class="nav-badge"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- 页面内容区域 -->
    <div class="class-content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Reading, EditPen, Document
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: false
})

const router = useRouter()
const route = useRoute()

// 响应式数据
const currentClass = ref(null)
const loading = ref(false)

// 导航配置
const navItems = ref([
  {
    key: 'courses',
    label: '课程',
    icon: Reading,
    count: 0
  },
  {
    key: 'homeworks',
    label: '作业',
    icon: EditPen,
    count: 0
  },
  {
    key: 'exams',
    label: '考试',
    icon: Document,
    count: 0
  }
])

// 计算属性
const classId = computed(() => route.params.id)

// 判断是否是详情页面（现在详情页使用独立路由，这里始终返回false）
const isDetailPage = computed(() => false)

// 方法
const loadClassData = async () => {
  // 如果已经在加载中，避免重复加载
  if (loading.value) {
    return
  }
  
  loading.value = true
  try {
    // 从模拟数据中查找班级信息
    const mockClasses = [
      {
        id: 'class_001',
        name: '计算机科学与技术2101班',
        grade: '大三',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        teacherName: '李教授',
        studentCount: 45,
        courseCount: 6,
        pendingHomeworks: 3,
        upcomingExams: 1,
        unreadNotices: 2
      },
      {
        id: 'class_002',
        name: '软件工程2202班',
        grade: '大二',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        teacherName: '王老师',
        studentCount: 38,
        courseCount: 5,
        pendingHomeworks: 2,
        upcomingExams: 0,
        unreadNotices: 1
      },
      {
        id: 'class_003',
        name: '数据结构2023级',
        grade: '大一',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        teacherName: '张讲师',
        studentCount: 52,
        courseCount: 4,
        pendingHomeworks: 5,
        upcomingExams: 2,
        unreadNotices: 0
      },
      {
        id: 'class_004',
        name: '人工智能基础班',
        grade: '研究生',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        teacherName: '陈教授',
        studentCount: 28,
        courseCount: 3,
        pendingHomeworks: 1,
        upcomingExams: 0,
        unreadNotices: 3
      }
    ]

    const foundClass = mockClasses.find(cls => cls.id === classId.value)

    if (!foundClass) {
      // 只在确实找不到班级时才显示错误
      ElMessage.error('班级不存在')
      await nextTick() // 等待DOM更新
      router.push('/student')
      return
    }

    currentClass.value = foundClass

    // 更新导航徽章数字
    navItems.value = navItems.value.map(item => {
      switch (item.key) {
        case 'courses':
          return { ...item, count: currentClass.value.courseCount }
        case 'homeworks':
          return { ...item, count: currentClass.value.pendingHomeworks }
        case 'exams':
          return { ...item, count: currentClass.value.upcomingExams }
        default:
          return item
      }
    })

  } catch (error) {
    console.error('加载班级数据失败:', error)
    ElMessage.error('加载班级数据失败')
  } finally {
    loading.value = false
  }
}

const goToResources = () => {
  // 跳转到班级资源页面
  ElMessage.info('班级资源功能开发中...')
}

// 监听路由参数变化（immediate: true 会在组件挂载时立即执行一次）
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadClassData()
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.detail-page {
  width: 100%;
  height: 100vh;
}

.class-workspace {
  min-height: calc(100vh - 64px);
  background: #f5f7fa;
}

// 班级信息头部
.class-header {
  .class-cover {
    padding: 32px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(2px);
    }

    .class-info {
      position: relative;
      z-index: 1;

      .class-name {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 12px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .class-meta {
        font-size: 16px;
        opacity: 0.9;
        display: flex;
        align-items: center;
        gap: 8px;

        .divider {
          opacity: 0.6;
        }
      }
    }

    .class-actions {
      position: relative;
      z-index: 1;

      .el-button {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        color: white;
        backdrop-filter: blur(10px);

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}

// 班级内导航
.class-nav {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-container {
    display: flex;
    align-items: center;
    padding: 0 32px;
    max-width: 1200px;
    margin: 0 auto;

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 20px 24px;
      color: #606266;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
      position: relative;

      &:hover {
        color: #409eff;
        background: #f8f9fa;
      }

      &.active {
        color: #409eff;
        border-bottom-color: #409eff;
        background: #ecf5ff;
      }

      .el-icon {
        font-size: 18px;
      }

      .nav-badge {
        margin-left: 4px;
      }
    }
  }
}

// 页面内容区域
.class-content {
  padding: 24px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

// 响应式设计
@media (max-width: 768px) {
  .class-header .class-cover {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 24px 16px;

    .class-info .class-name {
      font-size: 24px;
    }

    .class-info .class-meta {
      justify-content: center;
      font-size: 14px;
    }
  }

  .class-nav .nav-container {
    padding: 0 16px;
    overflow-x: auto;

    .nav-item {
      padding: 16px 12px;
      font-size: 14px;
      white-space: nowrap;
    }
  }

  .class-content {
    padding: 16px;
  }
}
</style>