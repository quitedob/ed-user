<template>
  <div class="class-courses">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">班级课程</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索课程..."
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="状态" style="width: 120px" clearable>
          <el-option label="全部" value="" />
          <el-option label="未开始" value="not_started" />
          <el-option label="学习中" value="in_progress" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </div>
    </div>

    <!-- 课程统计 -->
    <div class="course-stats">
      <div class="stat-item">
        <span class="stat-number">{{ courseStats.total }}</span>
        <span class="stat-label">总课程数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ courseStats.inProgress }}</span>
        <span class="stat-label">学习中</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ courseStats.completed }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ courseStats.avgProgress }}%</span>
        <span class="stat-label">平均进度</span>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="courses-grid">
      <el-card
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-card"
        shadow="hover"
        @click="openCourse(course)"
      >
        <div class="course-cover" :style="{ background: course.coverColor }">
          <div class="course-icon">
            <el-icon><component :is="course.icon" /></el-icon>
          </div>
          <div class="course-progress-circle">
            <el-progress
              type="circle"
              :percentage="course.progress"
              :width="50"
              :stroke-width="4"
              :show-text="false"
            />
            <span class="progress-text">{{ course.progress }}%</span>
          </div>
        </div>

        <div class="course-content">
          <div class="course-header">
            <h3 class="course-title">{{ course.title }}</h3>
            <el-tag
              :type="getCourseStatusType(course.status)"
              size="small"
            >
              {{ getCourseStatusLabel(course.status) }}
            </el-tag>
          </div>

          <div class="course-instructor">
            <el-icon><User /></el-icon>
            <span>{{ course.instructor }}</span>
          </div>

          <div class="course-meta">
            <div class="meta-item">
              <el-icon><Reading /></el-icon>
              <span>{{ course.lessonCount }}课时</span>
            </div>
            <div class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>{{ course.duration }}</span>
            </div>
          </div>

          <div class="course-description">{{ course.description }}</div>

          <div class="course-progress-bar">
            <div class="progress-info">
              <span>学习进度</span>
              <span>{{ course.completedLessons }}/{{ course.lessonCount }}</span>
            </div>
            <el-progress
              :percentage="course.progress"
              :stroke-width="6"
              :show-text="false"
            />
          </div>

          <div class="course-footer">
            <div class="last-studied">
              <span class="label">最近学习：</span>
              <span class="time">{{ formatLastStudied(course.lastStudied) }}</span>
            </div>
            <el-button
              type="primary"
              size="small"
              @click.stop="continueLearning(course)"
            >
              {{ course.status === 'completed' ? '复习' : '继续学习' }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredCourses.length === 0" class="empty-state">
      <el-empty description="暂无课程" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search, User, Reading, Clock, Monitor, TrendCharts,
  Document, Trophy
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: false // 不使用布局
})

const route = useRoute()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const statusFilter = ref('')
const courses = ref([])

const courseStats = ref({
  total: 0,
  inProgress: 0,
  completed: 0,
  avgProgress: 0
})

// 计算属性
const filteredCourses = computed(() => {
  let filtered = courses.value

  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter(course => course.status === statusFilter.value)
  }

  return filtered
})

// 方法
const loadCourses = async () => {
  // 模拟课程数据
  const mockCourses = [
    {
      id: 'course_001',
      title: 'Python程序设计基础',
      instructor: '李教授',
      description: '从零开始学习Python编程语言，掌握基本语法和编程思想，为后续高级课程打下坚实基础。',
      coverColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: Monitor,
      status: 'in_progress',
      progress: 85,
      completedLessons: 17,
      lessonCount: 20,
      duration: '8周',
      lastStudied: '2024-01-20T14:30:00Z'
    },
    {
      id: 'course_002',
      title: '数据结构与算法',
      instructor: '王老师',
      description: '学习常用数据结构和算法设计方法，提升程序设计能力和问题解决技巧。',
      coverColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: TrendCharts,
      status: 'in_progress',
      progress: 60,
      completedLessons: 12,
      lessonCount: 20,
      duration: '10周',
      lastStudied: '2024-01-19T10:15:00Z'
    },
    {
      id: 'course_003',
      title: 'Web前端开发',
      instructor: '张讲师',
      description: '系统学习HTML、CSS、JavaScript等前端技术，掌握现代Web开发技能。',
      coverColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: Document,
      status: 'in_progress',
      progress: 45,
      completedLessons: 9,
      lessonCount: 20,
      duration: '8周',
      lastStudied: '2024-01-18T16:45:00Z'
    },
    {
      id: 'course_004',
      title: '数据库系统原理',
      instructor: '陈教授',
      description: '学习关系数据库理论、SQL语言和数据库设计方法，掌握数据管理核心技术。',
      coverColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: Trophy,
      status: 'completed',
      progress: 100,
      completedLessons: 15,
      lessonCount: 15,
      duration: '6周',
      lastStudied: '2024-01-10T09:20:00Z'
    },
    {
      id: 'course_005',
      title: '操作系统',
      instructor: '刘教授',
      description: '深入理解操作系统原理，学习进程管理、内存管理、文件系统等核心概念。',
      coverColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: Monitor,
      status: 'not_started',
      progress: 0,
      completedLessons: 0,
      lessonCount: 18,
      duration: '8周',
      lastStudied: null
    },
    {
      id: 'course_006',
      title: '软件工程',
      instructor: '赵老师',
      description: '学习软件开发方法论、项目管理、质量保证等软件工程核心知识。',
      coverColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      icon: TrendCharts,
      status: 'not_started',
      progress: 0,
      completedLessons: 0,
      lessonCount: 16,
      duration: '7周',
      lastStudied: null
    }
  ]

  courses.value = mockCourses
  updateCourseStats()
}

const updateCourseStats = () => {
  const stats = courses.value.reduce((acc, course) => {
    acc.total++
    if (course.status === 'in_progress') acc.inProgress++
    if (course.status === 'completed') acc.completed++
    acc.totalProgress += course.progress
    return acc
  }, { total: 0, inProgress: 0, completed: 0, totalProgress: 0 })

  courseStats.value = {
    total: stats.total,
    inProgress: stats.inProgress,
    completed: stats.completed,
    avgProgress: stats.total > 0 ? Math.round(stats.totalProgress / stats.total) : 0
  }
}

const getCourseStatusType = (status) => {
  const types = {
    not_started: 'info',
    in_progress: 'primary',
    completed: 'success'
  }
  return types[status] || 'info'
}

const getCourseStatusLabel = (status) => {
  const labels = {
    not_started: '未开始',
    in_progress: '学习中',
    completed: '已完成'
  }
  return labels[status] || '未知'
}

const formatLastStudied = (timeString) => {
  if (!timeString) return '尚未开始'

  const date = new Date(timeString)
  const now = new Date()
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60))

  if (diffHours < 1) {
    return '刚刚学习'
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else {
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}天前`
  }
}

const openCourse = (course) => {
  // 跳转到课程章节页面
  router.push(`/student/course/${course.id}/chapters`)
}

const continueLearning = (course) => {
  // 跳转到课程章节页面
  router.push(`/student/course/${course.id}/chapters`)
}

// 生命周期
onMounted(() => {
  loadCourses()
})
</script>

<style lang="scss" scoped>
.class-courses {
  // 页面头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  // 课程统计
  .course-stats {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .stat-item {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 28px;
        font-weight: 700;
        color: #409eff;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  // 课程网格
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;

    .course-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .course-cover {
        height: 140px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        overflow: hidden;
        border-radius: 8px 8px 0 0;

        .course-icon {
          font-size: 40px;
          opacity: 0.9;
        }

        .course-progress-circle {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;

          .progress-text {
            position: absolute;
            font-size: 10px;
            font-weight: 600;
            color: #409eff;
          }
        }
      }

      .course-content {
        padding: 20px;

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;

          .course-title {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
            margin: 0;
            line-height: 1.3;
            flex: 1;
            margin-right: 8px;
          }
        }

        .course-instructor {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #606266;
          margin-bottom: 12px;

          .el-icon {
            font-size: 14px;
          }
        }

        .course-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: #909399;

            .el-icon {
              font-size: 14px;
            }
          }
        }

        .course-description {
          font-size: 14px;
          color: #606266;
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-progress-bar {
          margin-bottom: 16px;

          .progress-info {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #909399;
            margin-bottom: 6px;
          }
        }

        .course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .last-studied {
            flex: 1;
            font-size: 12px;
            color: #909399;

            .label {
              color: #606266;
            }

            .time {
              color: #409eff;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  // 空状态
  .empty-state {
    margin-top: 60px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .class-courses {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .header-actions {
        flex-direction: column;
        gap: 12px;

        .el-input,
        .el-select {
          width: 100% !important;
        }
      }
    }

    .course-stats {
      flex-direction: column;
      gap: 16px;

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;

        .stat-number {
          margin-bottom: 0;
        }
      }
    }

    .courses-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>