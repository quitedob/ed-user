<template>
  <div class="exam-detail">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ exam.title }}</h1>
        <p>{{ getClassName(exam.classId) }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="editExam">编辑考试</el-button>
        <el-button type="primary" @click="startGrading" :disabled="exam.participantCount === exam.gradedCount">批改试卷</el-button>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 考试信息 -->
        <el-card shadow="never" class="info-card">
          <template #header><span class="card-title">考试信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="考试标题">{{ exam.title }}</el-descriptions-item>
            <el-descriptions-item label="关联班级">{{ getClassName(exam.classId) }}</el-descriptions-item>
            <el-descriptions-item label="考试时间">{{ exam.startTime }} - {{ exam.endTime }}</el-descriptions-item>
            <el-descriptions-item label="考试时长">{{ exam.duration }} 分钟</el-descriptions-item>
            <el-descriptions-item label="总分">{{ exam.totalScore }} 分</el-descriptions-item>
            <el-descriptions-item label="及格分">{{ exam.passScore }} 分</el-descriptions-item>
            <el-descriptions-item label="题目数量">{{ exam.questionCount }} 道</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(exam.status)">{{ getStatusText(exam.status) }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 题目列表 -->
        <el-card shadow="never" class="questions-card">
          <template #header><span class="card-title">题目列表</span></template>
          <div class="questions-list">
            <div v-for="(q, index) in exam.questions" :key="q.id" class="question-item">
              <div class="question-header">
                <span class="question-index">{{ index + 1 }}</span>
                <el-tag :type="getTypeTagType(q.type)" size="small">{{ getTypeLabel(q.type) }}</el-tag>
                <el-tag :type="getDifficultyTagType(q.difficulty)" size="small">{{ getDifficultyLabel(q.difficulty) }}</el-tag>
                <span class="question-score">{{ q.score }}分</span>
              </div>
              <div class="question-content">{{ q.questionText }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 考试统计 -->
        <el-card shadow="never" class="stats-card">
          <template #header><span class="card-title">考试统计</span></template>
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-number">{{ exam.totalCount }}</div><div class="stat-label">应考人数</div></div>
            <div class="stat-item"><div class="stat-number text-primary">{{ exam.participantCount }}</div><div class="stat-label">已参考</div></div>
            <div class="stat-item"><div class="stat-number text-success">{{ exam.gradedCount }}</div><div class="stat-label">已批改</div></div>
            <div class="stat-item"><div class="stat-number text-warning">{{ exam.participantCount - exam.gradedCount }}</div><div class="stat-label">待批改</div></div>
          </div>
        </el-card>

        <!-- 成绩统计 -->
        <el-card shadow="never" class="score-card" v-if="exam.avgScore">
          <template #header><span class="card-title">成绩统计</span></template>
          <div class="score-stats">
            <div class="score-item"><span class="label">平均分</span><span class="value">{{ exam.avgScore }}分</span></div>
            <div class="score-item"><span class="label">最高分</span><span class="value text-success">{{ exam.maxScore }}分</span></div>
            <div class="score-item"><span class="label">最低分</span><span class="value text-danger">{{ exam.minScore }}分</span></div>
            <div class="score-item"><span class="label">及格率</span><span class="value">{{ exam.passRate }}%</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '考试详情' })

const router = useRouter()
const route = useRoute()
const examId = computed(() => route.params.id)

// JSON格式的班级数据
const classes = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

// JSON格式的考试详情数据
const examsData = {
  exam001: {
    id: 'exam001',
    title: '期中考试',
    classId: 'class_t001',
    startTime: '2024-12-20 09:00',
    endTime: '2024-12-20 11:00',
    duration: 120,
    totalScore: 100,
    passScore: 60,
    questionCount: 30,
    totalCount: 28,
    participantCount: 26,
    gradedCount: 20,
    avgScore: 78,
    maxScore: 95,
    minScore: 45,
    passRate: 85,
    status: 'grading',
    questions: [
      { id: 'q1', type: 'single', questionText: 'Python中用于定义函数的关键字是？', difficulty: 'easy', score: 3 },
      { id: 'q2', type: 'single', questionText: '以下哪个不是Python的内置数据类型？', difficulty: 'easy', score: 3 },
      { id: 'q3', type: 'multiple', questionText: '以下哪些是Python的循环语句？', difficulty: 'medium', score: 5 },
      { id: 'q4', type: 'fill', questionText: 'Python中使用____关键字导入模块', difficulty: 'easy', score: 4 },
      { id: 'q5', type: 'essay', questionText: '简述Python中列表和元组的区别', difficulty: 'medium', score: 10 },
      { id: 'q6', type: 'programming', questionText: '编写一个函数，计算斐波那契数列的第n项', difficulty: 'hard', score: 20 }
    ]
  }
}

const exam = ref({
  id: '', title: '', classId: '', startTime: '', endTime: '', duration: 0, totalScore: 0, passScore: 0,
  questionCount: 0, totalCount: 0, participantCount: 0, gradedCount: 0, avgScore: null, maxScore: null, minScore: null, passRate: null, status: '', questions: []
})

const getClassName = (classId) => classes.find(c => c.id === classId)?.name || '未知班级'
const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger' }[type] || '')
const getDifficultyLabel = (d) => ({ easy: '简单', medium: '中等', hard: '困难' }[d] || d)
const getDifficultyTagType = (d) => ({ easy: 'success', medium: 'warning', hard: 'danger' }[d] || '')
const getStatusType = (s) => ({ pending: 'info', ongoing: 'warning', grading: 'primary', completed: 'success' }[s] || 'info')
const getStatusText = (s) => ({ pending: '未开始', ongoing: '进行中', grading: '批改中', completed: '已完成' }[s] || '未知')

const goBack = () => router.back()
const editExam = () => router.push(`/teacher/exam/create?id=${examId.value}`)
const startGrading = () => router.push(`/teacher/exam/grading/${examId.value}`)

const loadExam = () => {
  exam.value = examsData[examId.value] || examsData.exam001
}

onMounted(() => loadExam())
</script>

<style lang="scss" scoped>
.exam-detail {
  padding: 24px;
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
    .header-actions { display: flex; gap: 12px; }
  }

  .card-title { font-size: 16px; font-weight: 600; }
  .info-card, .questions-card { margin-bottom: 24px; }

  .questions-card {
    .questions-list {
      .question-item {
        padding: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 12px;
        &:last-child { margin-bottom: 0; }
        .question-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .question-index { width: 24px; height: 24px; background: #409eff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .question-score { margin-left: auto; color: #f56c6c; font-weight: 600; }
        .question-content { font-size: 14px; color: #606266; }
      }
    }
  }

  .stats-card {
    margin-bottom: 24px;
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      .stat-item {
        text-align: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        .stat-number { font-size: 28px; font-weight: 700; color: #303133; }
        .stat-number.text-primary { color: #409eff; }
        .stat-number.text-success { color: #67c23a; }
        .stat-number.text-warning { color: #e6a23c; }
        .stat-label { font-size: 13px; color: #909399; }
      }
    }
  }

  .score-card {
    .score-stats {
      .score-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        &:last-child { border-bottom: none; }
        .label { color: #909399; }
        .value { font-weight: 600; color: #303133; }
        .value.text-success { color: #67c23a; }
        .value.text-danger { color: #f56c6c; }
      }
    }
  }
}
</style>
