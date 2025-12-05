<template>
  <div class="teacher-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">教学概览</h1>
      <p class="page-subtitle">{{ greeting }}，{{ userName }}！欢迎回到教师中心</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card" @click="goToClasses">
        <div class="stat-content">
          <div class="stat-icon classes">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statsData.totalClasses }}</div>
            <div class="stat-label">我的班级</div>
          </div>
        </div>
        <div class="stat-action">
          <span class="view-link">查看全部 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </el-card>

      <el-card class="stat-card" @click="goToCourses">
        <div class="stat-content">
          <div class="stat-icon courses">
            <el-icon :size="32"><Reading /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statsData.totalCourses }}</div>
            <div class="stat-label">我的课程</div>
          </div>
        </div>
        <div class="stat-action">
          <span class="view-link">查看全部 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon students">
            <el-icon :size="32"><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statsData.totalStudents }}</div>
            <div class="stat-label">我的学员</div>
          </div>
        </div>
        <div class="stat-action">
          <span class="view-link">查看全部 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </el-card>

      <el-card class="stat-card" @click="goToHomeworks">
        <div class="stat-content">
          <div class="stat-icon homework">
            <el-icon :size="32"><EditPen /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statsData.totalHomeworks }}</div>
            <div class="stat-label">我的作业</div>
          </div>
        </div>
        <div class="stat-action">
          <span class="view-link">查看全部 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </el-card>

      <el-card class="stat-card" @click="goToExams">
        <div class="stat-content">
          <div class="stat-icon exams">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statsData.totalExams }}</div>
            <div class="stat-label">我的考试</div>
          </div>
        </div>
        <div class="stat-action">
          <span class="view-link">查看全部 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </el-card>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-sections">
      <!-- 我的班级 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <h3>我的班级</h3>
            <el-button link type="primary" @click="goToClasses">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
        </template>
        <div class="classes-grid">
          <div
            v-for="classInfo in recentClasses"
            :key="classInfo.id"
            class="class-card"
            @click="goToClassDetail(classInfo.id)"
          >
            <div class="class-cover" :style="{ background: classInfo.color }">
              <el-icon size="32"><School /></el-icon>
            </div>
            <div class="class-info">
              <h4 class="class-name">{{ classInfo.name }}</h4>
              <div class="class-course">{{ classInfo.courseName }}</div>
              <div class="class-meta">
                <span><el-icon><User /></el-icon> {{ classInfo.studentCount }}人</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 我的作业 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <h3>我的作业</h3>
            <el-button link type="primary" @click="goToHomeworks">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
        </template>
        <div class="homework-list">
          <div v-for="hw in recentHomeworks" :key="hw.id" class="homework-item">
            <div class="homework-info">
              <h4>{{ hw.title }}</h4>
              <div class="homework-meta">
                <span class="class-name">{{ hw.className }}</span>
                <span class="deadline">截止：{{ hw.deadline }}</span>
              </div>
            </div>
            <div class="homework-stats">
              <span class="submitted">{{ hw.submittedCount }}/{{ hw.totalCount }}</span>
              <span class="label">已提交</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 我的考试 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <h3>我的考试</h3>
            <el-button link type="primary" @click="goToExams">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
        </template>
        <div class="exam-list">
          <div v-for="exam in recentExams" :key="exam.id" class="exam-item">
            <div class="exam-info">
              <h4>{{ exam.title }}</h4>
              <div class="exam-meta">
                <span class="class-name">{{ exam.className }}</span>
                <span class="time">{{ exam.examTime }}</span>
              </div>
            </div>
            <el-tag :type="exam.status === 'upcoming' ? 'warning' : 'success'" size="small">
              {{ exam.status === 'upcoming' ? '即将开始' : '已结束' }}
            </el-tag>
          </div>
        </div>
      </el-card>

      <!-- 我的课程 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <h3>我的课程</h3>
            <el-button link type="primary" @click="goToCourses">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
        </template>
        <div class="courses-list">
          <div
            v-for="course in recentCourses"
            :key="course.id"
            class="course-item"
            @click="goToCourseDetail(course.id)"
          >
            <div class="course-cover">
              <img :src="course.cover" :alt="course.title" />
            </div>
            <div class="course-info">
              <h4 class="course-title">{{ course.title }}</h4>
              <div class="course-stats">
                <span>{{ course.totalStudents }}名学员</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 我的学员 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <h3>我的学员</h3>
            <el-button link type="primary">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
        </template>
        <div class="students-list">
          <div v-for="student in recentStudents" :key="student.id" class="student-item">
            <el-avatar :size="40" :src="student.avatar" />
            <div class="student-info">
              <div class="student-name">{{ student.name }}</div>
              <div class="student-class">{{ student.className }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import {
  Reading, User, UserFilled, EditPen, Document, ArrowRight
} from '@element-plus/icons-vue'

const School = User

definePageMeta({
  layout: 'default',
  title: '教学概览'
})

const userName = ref('张老师')
const greeting = ref('上午好')

const statsData = ref({
  totalCourses: 3,
  totalClasses: 4,
  totalStudents: 156,
  totalHomeworks: 12,
  totalExams: 5
})

const recentClasses = ref([
  { id: 'class_t001', name: '计算机2101班', courseName: 'Python编程基础', studentCount: 28, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'class_t002', name: '软件工程2201班', courseName: 'JavaScript进阶', studentCount: 35, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'class_t003', name: '数据科学2201班', courseName: '数据结构', studentCount: 42, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
])

const recentHomeworks = ref([
  { id: 'hw1', title: 'Python函数练习', className: '计算机2101班', deadline: '2024-12-25', submittedCount: 20, totalCount: 28 },
  { id: 'hw2', title: 'JavaScript异步编程', className: '软件工程2201班', deadline: '2024-12-28', submittedCount: 15, totalCount: 35 }
])

const recentExams = ref([
  { id: 'exam1', title: '期中考试', className: '计算机2101班', examTime: '2024-12-30 14:00', status: 'upcoming' },
  { id: 'exam2', title: '单元测试', className: '软件工程2201班', examTime: '2024-12-20 10:00', status: 'finished' }
])

const recentCourses = ref([
  { id: 'course_t001', title: 'Python编程基础', cover: '/images/python-course.jpg', totalStudents: 45 },
  { id: 'course_t002', title: 'JavaScript进阶开发', cover: '/images/js-course.jpg', totalStudents: 38 }
])

const recentStudents = ref([
  { id: 's1', name: '张三', className: '计算机2101班', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 's2', name: '李四', className: '软件工程2201班', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 's3', name: '王五', className: '数据科学2201班', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }
])

const goToCourses = () => navigateTo('/teacher/course')
const goToClasses = () => navigateTo('/teacher/class')
const goToHomeworks = () => navigateTo('/teacher/homework')
const goToExams = () => navigateTo('/teacher/exam')
const goToCourseDetail = (id) => navigateTo(`/teacher/course/${id}`)
const goToClassDetail = (id) => navigateTo(`/teacher/class/${id}`)

const updateGreeting = () => {
  const hour = new Date().getHours()
  greeting.value = hour < 12 ? '上午好' : hour < 18 ? '下午好' : '晚上好'
}

onMounted(() => updateGreeting())
</script>

<style lang="scss" scoped>
.teacher-dashboard {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);

  .page-header {
    margin-bottom: 32px;
    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #303133;
      margin: 0 0 8px 0;
    }
    .page-subtitle {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin-bottom: 32px;

    @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }

    .stat-card {
      cursor: pointer;
      transition: all 0.3s;
      &:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }

      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          &.classes { background: linear-gradient(135deg, #667eea, #764ba2); }
          &.courses { background: linear-gradient(135deg, #4CAF50, #2E7D32); }
          &.students { background: linear-gradient(135deg, #FF9800, #F57C00); }
          &.homework { background: linear-gradient(135deg, #2196F3, #1565C0); }
          &.exams { background: linear-gradient(135deg, #f44336, #c62828); }
        }

        .stat-info {
          .stat-number { font-size: 32px; font-weight: 700; color: #303133; }
          .stat-label { font-size: 14px; color: #909399; }
        }
      }

      .stat-action {
        margin-top: 12px;
        text-align: right;
        .view-link {
          font-size: 13px;
          color: #409eff;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }

  .content-sections {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    @media (max-width: 1024px) { grid-template-columns: 1fr; }

    .content-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h3 { margin: 0; font-size: 18px; font-weight: 600; color: #303133; }
      }
    }

    .classes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;

      .class-card {
        background: #f8f9fa;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
        &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        .class-cover {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .class-info {
          padding: 12px;
          .class-name { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 4px 0; }
          .class-course { font-size: 13px; color: #909399; margin-bottom: 8px; }
          .class-meta { font-size: 12px; color: #606266; display: flex; align-items: center; gap: 4px; }
        }
      }
    }

    .homework-list, .exam-list {
      .homework-item, .exam-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        &:last-child { border-bottom: none; }

        h4 { font-size: 15px; font-weight: 500; color: #303133; margin: 0 0 4px 0; }
        .homework-meta, .exam-meta {
          font-size: 13px; color: #909399;
          .class-name { margin-right: 12px; }
        }
        .homework-stats {
          text-align: center;
          .submitted { font-size: 18px; font-weight: 600; color: #409eff; }
          .label { display: block; font-size: 12px; color: #909399; }
        }
      }
    }

    .courses-list {
      .course-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        &:last-child { border-bottom: none; }
        &:hover { background: #f8f9fa; margin: 0 -12px; padding: 12px; border-radius: 8px; }

        .course-cover {
          width: 80px; height: 60px; border-radius: 8px; overflow: hidden;
          img { width: 100%; height: 100%; object-fit: cover; }
        }
        .course-info {
          .course-title { font-size: 15px; font-weight: 500; color: #303133; margin: 0 0 4px 0; }
          .course-stats { font-size: 13px; color: #909399; }
        }
      }
    }

    .students-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;

      .student-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        background: #f8f9fa;
        border-radius: 8px;

        .student-info {
          .student-name { font-size: 14px; font-weight: 500; color: #303133; }
          .student-class { font-size: 12px; color: #909399; }
        }
      }
    }
  }
}
</style>
