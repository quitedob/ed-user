<template>
  <div class="teacher-exam">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>考试管理</h1>
        <p>管理所有班级的考试</p>
      </div>
      <el-button type="primary" @click="createExam">
        <el-icon><Plus /></el-icon> 发布考试
      </el-button>
    </div>

    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ allExams.length }}</div>
        <div class="stat-label">总考试数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ pendingGradingCount }}</div>
        <div class="stat-label">待批改</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ avgScoreDisplay }}</div>
        <div class="stat-label">平均分</div>
      </el-card>
    </div>

    <div class="filter-section">
      <el-select v-model="selectedClass" placeholder="选择班级" style="width: 200px" clearable>
        <el-option label="全部班级" value="" />
        <el-option v-for="cls in classes" :key="cls.id" :label="cls.name" :value="cls.id" />
      </el-select>
      <el-select v-model="selectedStatus" placeholder="选择状态" style="width: 150px" clearable>
        <el-option label="全部状态" value="" />
        <el-option label="未开始" value="pending" />
        <el-option label="进行中" value="ongoing" />
        <el-option label="批改中" value="grading" />
        <el-option label="已完成" value="completed" />
      </el-select>
    </div>

    <div class="exam-list">
      <el-card v-for="exam in filteredExams" :key="exam.id" class="exam-card" shadow="hover">
        <div class="exam-header">
          <div class="exam-info">
            <h3>{{ exam.title }}</h3>
            <div class="exam-meta">
              <span class="class-name">{{ getClassName(exam.classId) }}</span>
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
          <div class="stat-item">
            <span class="label">及格率</span>
            <span class="value">{{ exam.passRate ? exam.passRate + '%' : '-' }}</span>
          </div>
        </div>

        <div class="exam-actions">
          <el-button v-if="exam.status === 'grading'" type="primary" size="small" @click="startGrading(exam)">
            批改试卷
          </el-button>
          <el-button size="small" @click="viewDetail(exam)">查看详情</el-button>
          <el-button size="small" @click="viewAnalysis(exam)" :disabled="exam.status !== 'completed'">成绩分析</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Clock, Document } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '考试管理' })

const router = useRouter()
const selectedClass = ref('')
const selectedStatus = ref('')

// JSON格式的班级数据
const classes = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

// JSON格式的考试数据
const allExams = ref([
  { id: 'exam001', title: '期中考试', classId: 'class_t001', duration: 120, questionCount: 30, totalScore: 100, startTime: '2024-12-20 09:00', endTime: '2024-12-20 11:00', totalCount: 28, participantCount: 26, gradedCount: 20, avgScore: 78, passRate: 85, status: 'grading' },
  { id: 'exam002', title: '单元测试一', classId: 'class_t001', duration: 60, questionCount: 20, totalScore: 100, startTime: '2024-12-25 14:00', endTime: '2024-12-25 15:00', totalCount: 28, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' },
  { id: 'exam003', title: 'JavaScript期中考试', classId: 'class_t002', duration: 120, questionCount: 35, totalScore: 100, startTime: '2024-12-22 09:00', endTime: '2024-12-22 11:00', totalCount: 35, participantCount: 33, gradedCount: 30, avgScore: 75, passRate: 82, status: 'grading' },
  { id: 'exam004', title: '单元测试', classId: 'class_t002', duration: 45, questionCount: 15, totalScore: 100, startTime: '2024-12-18 14:00', endTime: '2024-12-18 14:45', totalCount: 35, participantCount: 35, gradedCount: 35, avgScore: 80, passRate: 88, status: 'completed' },
  { id: 'exam005', title: '数据结构期中考试', classId: 'class_t003', duration: 150, questionCount: 40, totalScore: 100, startTime: '2024-12-21 09:00', endTime: '2024-12-21 11:30', totalCount: 65, participantCount: 62, gradedCount: 55, avgScore: 72, passRate: 78, status: 'grading' },
  { id: 'exam006', title: '算法测试', classId: 'class_t003', duration: 90, questionCount: 25, totalScore: 100, startTime: '2024-12-28 14:00', endTime: '2024-12-28 15:30', totalCount: 65, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' }
])

const filteredExams = computed(() => {
  let result = allExams.value
  if (selectedClass.value) {
    result = result.filter(exam => exam.classId === selectedClass.value)
  }
  if (selectedStatus.value) {
    result = result.filter(exam => exam.status === selectedStatus.value)
  }
  return result
})

const pendingGradingCount = computed(() => allExams.value.reduce((sum, e) => sum + (e.participantCount - e.gradedCount), 0))

const avgScoreDisplay = computed(() => {
  const completed = allExams.value.filter(e => e.avgScore)
  if (completed.length === 0) return '-'
  return Math.round(completed.reduce((sum, e) => sum + e.avgScore, 0) / completed.length)
})

const getClassName = (classId) => classes.find(c => c.id === classId)?.name || '未知班级'
const getStatusType = (s) => ({ pending: 'info', ongoing: 'warning', grading: 'primary', completed: 'success' }[s] || 'info')
const getStatusText = (s) => ({ pending: '未开始', ongoing: '进行中', grading: '批改中', completed: '已完成' }[s] || '未知')

const goBack = () => router.push('/teacher')
const createExam = () => router.push('/teacher/exam/create')
const viewDetail = (exam) => router.push(`/teacher/exam/${exam.id}`)
const viewAnalysis = (exam) => ElMessage.info(`查看成绩分析：${exam.title}`)
const startGrading = (exam) => router.push(`/teacher/exam/grading/${exam.id}`)
</script>

<style lang="scss" scoped>
.teacher-exam {
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

  .filter-section {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
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
          .class-name { color: #409eff; font-weight: 500; }
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
