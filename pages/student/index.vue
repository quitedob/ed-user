<template>
  <div class="student-home">
    <!-- 统计卡片（移到顶部） -->
    <div class="quick-stats">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon classes">
            <el-icon><School /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalClasses }}</div>
            <div class="stat-label">我的班级</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon courses">
            <el-icon><Reading /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalCourses }}</div>
            <div class="stat-label">总课程数</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon tasks">
            <el-icon><EditPen /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalPendingTasks }}</div>
            <div class="stat-label">待办任务</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon exams">
            <el-icon><Trophy /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ upcomingExams }}</div>
            <div class="stat-label">近期考试</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="greeting">{{ greeting }}，{{ userName }}</h1>
        <p class="welcome-text">请选择要进入的班级开始学习</p>
      </div>
      <div class="user-avatar">
        <el-avatar :size="80" :src="userAvatar" />
      </div>
    </div>

    <!-- 班级选择网格（放大卡片） -->
    <div class="class-selection-grid">
      <div
        v-for="cls in myClasses"
        :key="cls.id"
        class="class-card"
        @click="enterClass(cls.id)"
      >
        <div class="class-cover" :style="{ background: cls.color }">
          <span class="class-grade">{{ cls.grade }}</span>
          <div class="class-icon">
            <el-icon size="48"><School /></el-icon>
          </div>
        </div>
        <div class="class-info">
          <h3 class="class-name">{{ cls.name }}</h3>
          <div class="class-teacher">
            <el-icon><User /></el-icon>
            <span>{{ cls.teacherName }}</span>
          </div>
          <div class="class-stats">
            <div class="stat-item">
              <el-icon><UserFilled /></el-icon>
              <span>{{ cls.studentCount }}人</span>
            </div>
            <div class="stat-item">
              <el-icon><Reading /></el-icon>
              <span>{{ cls.courseCount }}门课</span>
            </div>
          </div>
          <div class="class-tasks">
            <el-tag v-if="cls.pendingHomeworks > 0" size="default" type="warning" class="task-tag">
              <el-icon><EditPen /></el-icon>
              待办作业 {{ cls.pendingHomeworks }}
            </el-tag>
            <el-tag v-if="cls.upcomingExams > 0" size="default" type="danger" class="task-tag">
              <el-icon><Document /></el-icon>
              近期考试 {{ cls.upcomingExams }}
            </el-tag>
            <el-tag v-if="cls.unreadNotices > 0" size="default" type="info" class="task-tag">
              <el-icon><Bell /></el-icon>
              新通知 {{ cls.unreadNotices }}
            </el-tag>
          </div>
        </div>
        <div class="enter-btn">
          进入班级
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  User, UserFilled, Reading, EditPen, ArrowRight, Bell, Document, Trophy
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const School = User

definePageMeta({
  layout: false,
  title: '学生中心'
})

const router = useRouter()

const userName = ref('张三')
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
const myClasses = ref([])

const totalClasses = computed(() => myClasses.value.length)
const totalCourses = computed(() => myClasses.value.reduce((sum, cls) => sum + cls.courseCount, 0))
const totalPendingTasks = computed(() => myClasses.value.reduce((sum, cls) => sum + cls.pendingHomeworks, 0))
const upcomingExams = computed(() => myClasses.value.reduce((sum, cls) => sum + cls.upcomingExams, 0))

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
})

const loadMyClasses = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  myClasses.value = [
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
    }
  ]
}

const enterClass = (classId) => router.push(`/student/class/${classId}`)

onMounted(() => loadMyClasses())
</script>

<style lang="scss" scoped>
.student-home {
  min-height: 100vh;
  padding: 32px 48px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

// 统计卡片（顶部）
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }

  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 8px;

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        .el-icon { font-size: 32px; }

        &.classes { background: linear-gradient(135deg, #667eea, #764ba2); }
        &.courses { background: linear-gradient(135deg, #4CAF50, #2E7D32); }
        &.tasks { background: linear-gradient(135deg, #FF9800, #F57C00); }
        &.exams { background: linear-gradient(135deg, #f44336, #c62828); }
      }

      .stat-info {
        .stat-number {
          font-size: 36px;
          font-weight: 700;
          color: #303133;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 16px;
          color: #606266;
        }
      }
    }
  }
}

// 欢迎横幅
.welcome-banner {
  background: white;
  border-radius: 20px;
  padding: 40px 48px;
  margin-bottom: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .banner-content {
    .greeting {
      font-size: 40px;
      font-weight: 700;
      color: #303133;
      margin: 0 0 12px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .welcome-text {
      font-size: 20px;
      color: #606266;
      margin: 0;
    }
  }
}

// 班级选择网格（放大）
.class-selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 32px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }

  .class-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .class-cover {
      height: 140px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      .class-grade {
        position: absolute;
        top: 16px;
        left: 16px;
        background: rgba(0, 0, 0, 0.3);
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 600;
        backdrop-filter: blur(10px);
      }
    }

    .class-info {
      padding: 28px;
      padding-bottom: 80px;

      .class-name {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 16px 0;
        line-height: 1.3;
      }

      .class-teacher {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        color: #606266;
        margin-bottom: 16px;
        .el-icon { font-size: 18px; }
      }

      .class-stats {
        display: flex;
        gap: 24px;
        margin-bottom: 20px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #909399;
          .el-icon { font-size: 16px; }
        }
      }

      .class-tasks {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .task-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          padding: 8px 14px;
          .el-icon { font-size: 14px; }
        }
      }
    }

    .enter-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 18px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: opacity 0.3s;

      &:hover { opacity: 0.9; }
    }
  }
}
</style>
