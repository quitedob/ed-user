<template>
  <div class="course-page">
    <div class="content-header">
      <h2>我的课程</h2>
    </div>

    <div class="action-bar">
      <div class="action-right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索课程..."
          :prefix-icon="Search"
          class="search-input"
        />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading" :size="40">
        <Loading />
      </el-icon>
      <p>正在加载课程数据...</p>
    </div>

    <!-- 课程卡片网格 -->
    <div v-else class="course-grid">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-card"
        @click="goToCourse(course.id)"
      >
        <div class="card-cover">
          <img :src="course.cover" :alt="course.title" />
          <div v-if="course.progress !== undefined" class="progress-overlay">
            <div class="progress-info">
              {{ course.completedChapters }}/{{ course.totalChapters }} 章节 {{ course.progress }}% 完
            </div>
          </div>
        </div>
        <div class="card-body">
          <h3 class="course-title">{{ course.title }}</h3>
          <div class="course-meta">
            <div class="course-school">{{ course.school }}</div>
            <div class="course-teacher">{{ course.teacher }}</div>
          </div>
          <div class="course-date">
            开课时间: {{ course.startDate }} ~ {{ course.endDate }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Folder, Search, Loading } from '@element-plus/icons-vue'
import { useCourseApi } from '~/composables/useMockApi'

const router = useRouter()
const { getAuthCourses } = useCourseApi()

// 搜索
const searchQuery = ref('')

// 课程数据
const courses = ref([])
const loading = ref(true)

// 获取课程数据
onMounted(async () => {
  try {
    const data = await getAuthCourses()
    courses.value = data || []
  } catch (error) {
    console.warn('API不可用，使用本地模拟数据')
    // 如果API失败，使用默认数据
    courses.value = [

  {
    id: 1,
    title: '软件工程导论',
    school: '芝麻编程',
    teacher: '李教授',
    startDate: '2024-08-31',
    endDate: '2025-06-31',
    cover: '/images/common_head.jpg',
    completedChapters: 46,
    totalChapters: 50,
    progress: 92
  },
  {
    id: 2,
    title: '编译原理',
    school: '芝麻编程',
    teacher: '王教授',
    startDate: '2024-09-01',
    endDate: '2025-01-15',
    cover: '/images/logo.png',
    completedChapters: 12,
    totalChapters: 40,
    progress: 30
  },
  {
    id: 3,
    title: 'JAVA基础技术',
    school: '芝麻编程',
    teacher: '刘老师',
    startDate: '2024-08-31',
    endDate: '2025-06-31',
    cover: '/images/common_login.png',
    completedChapters: 25,
    totalChapters: 35,
    progress: 71
  },
  {
    id: 4,
    title: '数据结构与算法',
    school: '芝麻编程',
    teacher: '张教授',
    startDate: '2024-09-01',
    endDate: '2025-01-20',
    cover: '/images/phone.png',
    completedChapters: 8,
    totalChapters: 30,
    progress: 27
  },
  {
    id: 5,
    title: '计算机网络',
    school: '芝麻编程',
    teacher: '赵老师',
    startDate: '2024-08-31',
    endDate: '2025-06-31',
    cover: '/images/common_head.jpg',
    completedChapters: 18,
    totalChapters: 28,
    progress: 64
  },
  {
    id: 6,
    title: '操作系统原理',
    school: '芝麻编程',
    teacher: '陈教授',
    startDate: '2024-09-01',
    endDate: '2025-01-25',
    cover: '/images/logo.png',
    completedChapters: 5,
    totalChapters: 32,
    progress: 16
  },
  {
    id: 7,
    title: '数据库系统',
    school: '芝麻编程',
    teacher: '周老师',
    startDate: '2024-08-31',
    endDate: '2025-06-31',
    cover: '/images/common_login.png',
    completedChapters: 22,
    totalChapters: 26,
    progress: 85
  },
  {
    id: 8,
    title: 'Web前端开发',
    school: '芝麻编程',
    teacher: '吴老师',
    startDate: '2024-09-01',
    endDate: '2025-01-30',
    cover: '/images/phone.png',
    completedChapters: 15,
    totalChapters: 24,
    progress: 63
  }
    ]
  } finally {
    loading.value = false
  }
})

// 计算属性：过滤课程
const filteredCourses = computed(() => {
  if (!searchQuery.value) return courses.value
  return courses.value.filter(course => 
    course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const goToCourse = (courseId) => {
  console.log('跳转到课程详情:', courseId)
  router.push(`/student/course/${courseId}`)
}
</script>

<style lang="scss" scoped>
.course-page {
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

.content-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .action-left {
    display: flex;
    gap: 12px;
  }

  .search-input {
    width: 300px;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 16px;

  p {
    font-size: 16px;
    color: #909399;
  }
}

// 课程卡片网格
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .card-cover {
    position: relative;
    height: 160px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .progress-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      padding: 8px 12px;
    }

    .progress-info {
      color: white;
      font-size: 12px;
      font-weight: 500;
    }
  }

  .card-body {
    padding: 16px;
  }

  .course-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 12px 0;
    line-height: 1.4;
  }

  .course-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
    color: #606266;
  }

  .course-date {
    font-size: 12px;
    color: #909399;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .course-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .course-grid {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-direction: column;
    gap: 12px;

    .action-left,
    .action-right {
      width: 100%;
    }

    .search-input {
      width: 100%;
    }
  }
}
</style>