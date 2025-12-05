<template>
  <div class="course-exam">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>考试管理</h1>
        <p>{{ courseInfo.title }}</p>
      </div>
      <el-button type="primary" @click="createExam">
        <el-icon><Plus /></el-icon> 发布考试
      </el-button>
    </div>

    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ examList.length }}</div>
        <div class="stat-label">总考试数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ pendingCount }}</div>
        <div class="stat-label">待批改</div>
      </el-card>
    </div>

    <div class="exam-list">
      <el-card v-for="exam in examList" :key="exam.id" class="exam-card" shadow="hover">
        <div class="exam-header">
          <div class="exam-info">
            <h3>{{ exam.title }}</h3>
            <div class="exam-meta">
              <span><el-icon><Clock /></el-icon> {{ exam.duration }}分钟</span>
              <span><el-icon><Document /></el-icon> {{ exam.questionCount }}题</span>
              <span>满分：{{ exam.totalScore }}分</span>
            </div>
          </div>
          <el-tag :type="getStatusType(exam.status)">{{ getStatusText(exam.status) }}</el-tag>
        </div>

        <div class="exam-time">
          <span class="label">考试时间：</span>
          <span class="value">{{ exam.startTime }} - {{ exam.endTime }}</span>
        </div>

        <div class="exam-stats">
          <div class="stat-item">
            <span class="label">参考人数</span>
            <span class="value">{{ exam.participantCount }}/{{ exam.totalCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">已批改</span>
            <span class="value">{{ exam.gradedCount }}/{{ exam.participantCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">平均分</span>
            <span class="value">{{ exam.avgScore || '-' }}</span>
          </div>
        </div>

        <div class="exam-actions">
          <el-button v-if="exam.status === 'grading'" type="primary" size="small" @click="startGrading(exam)">批改</el-button>
          <el-button size="small" @click="viewDetail(exam)">详情</el-button>
          <el-button size="small" @click="viewAnalysis(exam)" :disabled="exam.status !== 'completed'">分析</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Clock, Document } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '课程考试管理' })

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.id)

// JSON格式的课程数据
const coursesData = {
  course_t001: { id: 'course_t001', title: 'Python编程基础' },
  course_t002: { id: 'course_t002', title: 'JavaScript进阶开发' },
  course_t003: { id: 'course_t003', title: '数据结构与算法' },
  course_t004: { id: 'course_t004', title: 'React框架开发' },
  course_t005: { id: 'course_t005', title: 'Java Web开发' },
  course_t006: { id: 'course_t006', title: '机器学习基础' },
  course_t007: { id: 'course_t007', title: '数据库设计与优化' },
  course_t008: { id: 'course_t008', title: '移动应用开发' },
  course_t009: { id: 'course_t009', title: '软件工程实践' }
}

// JSON格式的考试数据
const examsData = {
  course_t001: [
    { id: 'exam001', title: 'Python期中考试', duration: 120, questionCount: 30, totalScore: 100, startTime: '2024-12-20 09:00', endTime: '2024-12-20 11:00', totalCount: 45, participantCount: 43, gradedCount: 40, avgScore: 78, passRate: 85, status: 'grading' },
    { id: 'exam002', title: 'Python期末考试', duration: 150, questionCount: 40, totalScore: 100, startTime: '2025-01-15 09:00', endTime: '2025-01-15 11:30', totalCount: 45, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
  ],
  course_t002: [
    { id: 'exam003', title: 'JS单元测试', duration: 60, questionCount: 20, totalScore: 100, startTime: '2024-12-18 14:00', endTime: '2024-12-18 15:00', totalCount: 38, participantCount: 38, gradedCount: 38, avgScore: 82, passRate: 92, status: 'completed' }
  ],
  course_t003: [
    { id: 'exam004', title: '数据结构期中考试', duration: 120, questionCount: 25, totalScore: 100, startTime: '2024-12-22 09:00', endTime: '2024-12-22 11:00', totalCount: 42, participantCount: 40, gradedCount: 35, avgScore: 75, passRate: 80, status: 'grading' }
  ],
  course_t004: [
    { id: 'exam005', title: 'React框架期中考试', duration: 150, questionCount: 10, totalScore: 100, startTime: '2024-02-10 14:00', endTime: '2024-02-10 16:30', totalCount: 41, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
  ],
  course_t005: [
    { id: 'exam006', title: 'Java Web开发期末考试', duration: 150, questionCount: 12, totalScore: 100, startTime: '2024-02-12 09:00', endTime: '2024-02-12 11:30', totalCount: 36, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
  ],
  course_t006: [
    { id: 'exam007', title: '机器学习期末考试', duration: 180, questionCount: 10, totalScore: 100, startTime: '2024-02-13 14:00', endTime: '2024-02-13 17:00', totalCount: 29, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
  ],
  course_t007: [
    { id: 'exam008', title: '数据库设计与优化期末考试', duration: 150, questionCount: 11, totalScore: 100, startTime: '2024-02-14 09:00', endTime: '2024-02-14 11:30', totalCount: 44, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
  ],
  course_t008: [
    { id: 'exam009', title: 'Flutter移动开发期中考试', duration: 120, questionCount: 9, totalScore: 100, startTime: '2024-02-15 14:00', endTime: '2024-02-15 16:00', totalCount: 33, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
  ],
  course_t009: [
    { id: 'exam010', title: '软件工程实践期末考试', duration: 150, questionCount: 10, totalScore: 100, startTime: '2024-02-16 09:00', endTime: '2024-02-16 11:30', totalCount: 48, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
  ]
}

const courseInfo = ref({ id: '', title: '' })
const examList = ref([])

const pendingCount = computed(() => examList.value.reduce((sum, e) => sum + (e.participantCount - e.gradedCount), 0))

const getStatusType = (s) => ({ pending: 'info', ongoing: 'warning', grading: 'primary', completed: 'success' }[s] || 'info')
const getStatusText = (s) => ({ pending: '未开始', ongoing: '进行中', grading: '批改中', completed: '已完成' }[s] || '未知')

const goBack = () => {
  // 使用 router.back() 返回上一页，如果上一页不是课程详情页，则跳转到课程详情页
  if (document.referrer && document.referrer.includes('/teacher/course/')) {
    router.back()
  } else {
    router.push(`/teacher/course/${courseId.value}`)
  }
}
const createExam = () => router.push(`/teacher/exam/create?courseId=${courseId.value}`)
const viewDetail = (exam) => router.push(`/teacher/exam/${exam.id}`)
const viewAnalysis = (exam) => ElMessage.info(`查看成绩分析：${exam.title}`)
const startGrading = (exam) => router.push(`/teacher/exam/grading/${exam.id}`)

const loadData = () => {
  courseInfo.value = coursesData[courseId.value] || coursesData.course_t001
  examList.value = examsData[courseId.value] || []
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.course-exam {
  padding: 32px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    .header-info { flex: 1; }
    h1 { font-size: 24px; font-weight: 600; color: #303133; margin: 0 0 4px 0; }
    p { font-size: 14px; color: #909399; margin: 0; }
  }

  .stats-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
    .stat-card {
      text-align: center;
      padding: 16px 32px;
      .stat-number { font-size: 32px; font-weight: 700; color: #303133; }
      .stat-label { font-size: 14px; color: #909399; }
    }
  }

  .exam-list {
    display: grid;
    gap: 20px;

    .exam-card {
      .exam-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        h3 { font-size: 18px; font-weight: 600; color: #303133; margin: 0 0 8px 0; }
        .exam-meta {
          font-size: 13px;
          color: #909399;
          display: flex;
          gap: 16px;
          span { display: flex; align-items: center; gap: 4px; }
        }
      }
      .exam-time {
        margin-bottom: 16px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
        .label { color: #909399; }
        .value { color: #303133; font-weight: 500; }
      }
      .exam-stats {
        display: flex;
        gap: 32px;
        margin-bottom: 16px;
        .stat-item {
          .label { font-size: 13px; color: #909399; display: block; margin-bottom: 4px; }
          .value { font-size: 16px; font-weight: 600; color: #303133; }
        }
      }
      .exam-actions { display: flex; gap: 8px; }
    }
  }
}
</style>
