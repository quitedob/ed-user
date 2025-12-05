<template>
  <div class="class-dashboard">
    <!-- 学习统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon progress">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ classStats.learningProgress }}%</div>
            <div class="stat-label">学习进度</div>
          </div>
        </div>
        <div class="stat-progress">
          <el-progress
            :percentage="classStats.learningProgress"
            :stroke-width="6"
            :show-text="false"
          />
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon courses">
            <el-icon><Reading /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ classStats.completedCourses }}</div>
            <div class="stat-label">已完成课程</div>
          </div>
        </div>
        <div class="stat-meta">
          <span class="meta-text">共{{ classStats.totalCourses }}门课程</span>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon homeworks">
            <el-icon><EditPen /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ classStats.pendingHomeworks }}</div>
            <div class="stat-label">待完成作业</div>
          </div>
        </div>
        <div class="stat-meta">
          <span class="meta-text">{{ classStats.completedHomeworks }}份已提交</span>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon exams">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ classStats.upcomingExams }}</div>
            <div class="stat-label">即将考试</div>
          </div>
        </div>
        <div class="stat-meta">
          <span class="meta-text">{{ classStats.completedExams }}场已完成</span>
        </div>
      </el-card>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 左侧内容 -->
      <div class="content-left">
        <!-- 最近课程 -->
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <h3>最近课程</h3>
              <el-button text type="primary" @click="goToCourses">查看全部</el-button>
            </div>
          </template>
          <div class="course-list">
            <div
              v-for="course in recentCourses"
              :key="course.id"
              class="course-item"
              @click="openCourse(course)"
            >
              <div class="course-cover" :style="{ background: course.coverColor }">
                <div class="course-icon">
                  <el-icon><component :is="course.icon" /></el-icon>
                </div>
              </div>
              <div class="course-info">
                <h4 class="course-title">{{ course.title }}</h4>
                <div class="course-instructor">{{ course.instructor }}</div>
                <div class="course-progress">
                  <el-progress
                    :percentage="course.progress"
                    :stroke-width="6"
                    :show-text="false"
                  />
                  <span class="progress-text">{{ course.progress }}%</span>
                </div>
              </div>
              <div class="course-status">
                <el-tag
                  :type="getCourseStatusType(course.status)"
                  size="small"
                >
                  {{ getCourseStatusLabel(course.status) }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 待办作业 -->
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <h3>待办作业</h3>
              <el-button text type="primary" @click="goToHomeworks">查看全部</el-button>
            </div>
          </template>
          <div class="homework-list">
            <div
              v-for="homework in pendingHomeworks"
              :key="homework.id"
              class="homework-item"
              @click="openHomework(homework)"
            >
              <div class="homework-icon">
                <el-icon><EditPen /></el-icon>
              </div>
              <div class="homework-info">
                <h4 class="homework-title">{{ homework.title }}</h4>
                <div class="homework-course">{{ homework.courseTitle }}</div>
                <div class="homework-deadline">
                  <el-icon><Clock /></el-icon>
                  <span>截止：{{ formatDeadline(homework.deadline) }}</span>
                </div>
              </div>
              <div class="homework-urgency" :class="homework.urgency">
                {{ getUrgencyLabel(homework.urgency) }}
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧内容 -->
      <div class="content-right">
        <!-- 班级动态 -->
        <el-card class="side-card">
          <template #header>
            <h3>班级动态</h3>
          </template>
          <div class="activity-list">
            <div
              v-for="activity in classActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.type">
                <el-icon>
                  <component :is="getActivityIcon(activity.type)" />
                </el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ formatTime(activity.time) }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  TrendCharts, Reading, EditPen, Document, Clock,
  Monitor, ChatDotRound
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: false // 不使用布局
})

const route = useRoute()
const router = useRouter()

// 响应式数据
const classStats = ref({
  learningProgress: 68,
  completedCourses: 4,
  totalCourses: 6,
  pendingHomeworks: 3,
  completedHomeworks: 8,
  upcomingExams: 2,
  completedExams: 1
})

const recentCourses = ref([
  {
    id: 'course_001',
    title: 'Python程序设计基础',
    instructor: '李教授',
    progress: 85,
    status: 'in_progress',
    coverColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: Monitor
  },
  {
    id: 'course_002',
    title: '数据结构与算法',
    instructor: '王老师',
    progress: 60,
    status: 'in_progress',
    coverColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: TrendCharts
  },
  {
    id: 'course_003',
    title: 'Web前端开发',
    instructor: '张讲师',
    progress: 45,
    status: 'in_progress',
    coverColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: Document
  }
])

const pendingHomeworks = ref([
  {
    id: 'hw_001',
    title: 'Python函数练习题',
    courseTitle: 'Python程序设计基础',
    deadline: '2024-01-25T23:59:59Z',
    urgency: 'high'
  },
  {
    id: 'hw_002',
    title: '链表操作实现',
    courseTitle: '数据结构与算法',
    deadline: '2024-01-28T23:59:59Z',
    urgency: 'medium'
  },
  {
    id: 'hw_003',
    title: 'HTML/CSS页面设计',
    courseTitle: 'Web前端开发',
    deadline: '2024-01-30T23:59:59Z',
    urgency: 'low'
  }
])

const classActivities = ref([
  {
    id: 'act_001',
    type: 'homework',
    title: '发布了新作业：Python函数练习题',
    time: '2024-01-20T10:30:00Z'
  },
  {
    id: 'act_002',
    type: 'exam',
    title: '期中考试安排已公布',
    time: '2024-01-20T08:15:00Z'
  },
  {
    id: 'act_003',
    type: 'discussion',
    title: '课程讨论区有新回复',
    time: '2024-01-19T16:45:00Z'
  },
  {
    id: 'act_004',
    type: 'resource',
    title: '上传了新的学习资料',
    time: '2024-01-19T09:20:00Z'
  }
])

// 计算属性
const classId = computed(() => route.params.id)

// 方法
const getCourseStatusType = (status) => {
  const types = {
    not_started: 'info',
    in_progress: 'primary',
    completed: 'success',
    locked: 'warning'
  }
  return types[status] || 'info'
}

const getCourseStatusLabel = (status) => {
  const labels = {
    not_started: '未开始',
    in_progress: '学习中',
    completed: '已完成',
    locked: '未解锁'
  }
  return labels[status] || '未知'
}

const getUrgencyLabel = (urgency) => {
  const labels = {
    high: '紧急',
    medium: '一般',
    low: '宽松'
  }
  return labels[urgency] || '未知'
}

const getActivityIcon = (type) => {
  const icons = {
    homework: EditPen,
    exam: Document,
    discussion: ChatDotRound,
    resource: Reading
  }
  return icons[type] || Document
}

const formatDeadline = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `已逾期 ${Math.abs(diffDays)} 天`
  } else if (diffDays === 0) {
    return '今天截止'
  } else if (diffDays === 1) {
    return '明天截止'
  } else if (diffDays <= 7) {
    return `${diffDays} 天后截止`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const formatTime = (timeString) => {
  const date = new Date(timeString)
  const now = new Date()
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60))

  if (diffHours < 1) {
    return '刚刚'
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else {
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}天前`
  }
}

const openCourse = (course) => {
  router.push(`/student/course/${course.id}/chapters`)
}

const openHomework = (homework) => {
  router.push(`/student/class-homework/${homework.id}`)
}

const goToCourses = () => {
  router.push(`/student/class/${classId.value}/courses`)
}

const goToHomeworks = () => {
  router.push(`/student/class/${classId.value}/homeworks`)
}

// 生命周期
onMounted(() => {
  // 可以在这里加载班级统计数据
})
</script>

<style lang="scss" scoped>
.class-dashboard {
  // 统计卡片网格
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          &.progress {
            background: linear-gradient(135deg, #4CAF50, #388E3C);
          }

          &.courses {
            background: linear-gradient(135deg, #2196F3, #1976D2);
          }

          &.homeworks {
            background: linear-gradient(135deg, #FF9800, #F57C00);
          }

          &.exams {
            background: linear-gradient(135deg, #9C27B0, #7B1FA2);
          }

          .el-icon {
            font-size: 24px;
          }
        }

        .stat-info {
          .stat-number {
            font-size: 28px;
            font-weight: 700;
            color: #303133;
            line-height: 1;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }

      .stat-progress {
        margin-bottom: 8px;
      }

      .stat-meta {
        .meta-text {
          font-size: 12px;
          color: #606266;
        }
      }
    }
  }

  // 内容网格
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  // 内容卡片
  .content-card {
    margin-bottom: 24px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }

    // 课程列表
    .course-list {
      .course-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #409eff;
          background: #f5f7fa;
        }

        &:last-child {
          margin-bottom: 0;
        }

        .course-cover {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;

          .course-icon {
            font-size: 24px;
          }
        }

        .course-info {
          flex: 1;

          .course-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 4px 0;
          }

          .course-instructor {
            font-size: 14px;
            color: #606266;
            margin-bottom: 8px;
          }

          .course-progress {
            display: flex;
            align-items: center;
            gap: 8px;

            .progress-text {
              font-size: 12px;
              color: #409eff;
              font-weight: 500;
            }
          }
        }

        .course-status {
          flex-shrink: 0;
        }
      }
    }

    // 作业列表
    .homework-list {
      .homework-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #409eff;
          background: #f5f7fa;
        }

        &:last-child {
          margin-bottom: 0;
        }

        .homework-icon {
          width: 40px;
          height: 40px;
          background: #fff3e0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff9800;
          flex-shrink: 0;

          .el-icon {
            font-size: 18px;
          }
        }

        .homework-info {
          flex: 1;

          .homework-title {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 2px 0;
          }

          .homework-course {
            font-size: 12px;
            color: #606266;
            margin-bottom: 4px;
          }

          .homework-deadline {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #909399;

            .el-icon {
              font-size: 12px;
            }
          }
        }

        .homework-urgency {
          flex-shrink: 0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;

          &.high {
            background: #fef2f2;
            color: #dc2626;
          }

          &.medium {
            background: #fff7ed;
            color: #ea580c;
          }

          &.low {
            background: #f0f9ff;
            color: #0284c7;
          }
        }
      }
    }
  }

  // 右侧卡片
  .content-right {
    .side-card {
      margin-bottom: 20px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

  
      // 动态列表
      .activity-list {
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .activity-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            &.homework {
              background: #fff3e0;
              color: #ff9800;
            }

            &.exam {
              background: #f3e5f5;
              color: #9c27b0;
            }

            &.discussion {
              background: #e3f2fd;
              color: #2196f3;
            }

            &.resource {
              background: #e8f5e8;
              color: #4caf50;
            }

            .el-icon {
              font-size: 14px;
            }
          }

          .activity-content {
            flex: 1;

            .activity-title {
              font-size: 13px;
              color: #303133;
              margin-bottom: 2px;
              line-height: 1.4;
            }

            .activity-time {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .class-dashboard {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .content-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid .stat-card .stat-content {
      gap: 12px;

      .stat-icon {
        width: 48px;
        height: 48px;

        .el-icon {
          font-size: 20px;
        }
      }

      .stat-info .stat-number {
        font-size: 24px;
      }
    }
  }
}
</style>