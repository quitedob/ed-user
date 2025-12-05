<template>
  <div class="class-exam">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>考试管理</h1>
        <p>{{ classInfo.name }}</p>
      </div>
      <el-button type="primary" @click="createExam">
        <el-icon><Plus /></el-icon> 发布考试
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ exams.length }}</div>
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

    <!-- 考试列表 -->
    <div class="exam-list">
      <el-card v-for="exam in exams" :key="exam.id" class="exam-card" shadow="hover">
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

    <!-- 批改对话框 -->
    <el-dialog v-model="gradingDialogVisible" title="试卷批改" width="900px" destroy-on-close>
      <template v-if="currentExam && currentSubmission">
        <div class="grading-dialog">
          <div class="grading-header">
            <h3>{{ currentExam.title }}</h3>
            <div class="grading-progress">已批改：{{ currentGradingIndex + 1 }}/{{ pendingSubmissions.length }}</div>
          </div>

          <div class="submission-content">
            <div class="student-info">
              <el-avatar :size="48" :src="currentSubmission.avatar" />
              <div class="info-text">
                <div class="name">{{ currentSubmission.studentName }}</div>
                <div class="submit-time">交卷时间：{{ currentSubmission.submitTime }}</div>
              </div>
            </div>

            <div class="answers-section">
              <div v-for="(answer, idx) in currentSubmission.answers" :key="idx" class="answer-item">
                <div class="question-header">
                  <span class="question-num">第{{ idx + 1 }}题</span>
                  <span class="question-type">{{ getQuestionTypeText(answer.type) }}</span>
                  <span class="question-score">{{ answer.maxScore }}分</span>
                </div>
                <div class="question-text">{{ answer.questionText }}</div>
                <div class="student-answer">
                  <div class="answer-label">学生答案：</div>
                  <div class="answer-content">{{ answer.userAnswer || '未作答' }}</div>
                </div>
                <div v-if="answer.correctAnswer" class="correct-answer">
                  <div class="answer-label">正确答案：</div>
                  <div class="answer-content">{{ answer.correctAnswer }}</div>
                </div>
                <div class="score-input">
                  <span>评分：</span>
                  <el-input-number v-model="answer.score" :min="0" :max="answer.maxScore" size="small" />
                  <span class="max-score">/ {{ answer.maxScore }}分</span>
                </div>
              </div>
            </div>

            <div class="total-section">
              <div class="total-score">
                <span>总分：</span>
                <span class="score-value">{{ totalScore }}</span>
                <span>/ {{ currentExam.totalScore }}分</span>
                <el-tag :type="isPass ? 'success' : 'danger'" style="margin-left: 12px">
                  {{ isPass ? '及格' : '不及格' }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="prevSubmission" :disabled="currentGradingIndex === 0">上一份</el-button>
          <el-button type="primary" @click="submitGrading">提交批改</el-button>
          <el-button @click="nextSubmission" :disabled="currentGradingIndex >= pendingSubmissions.length - 1">下一份</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Clock, Document } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '考试管理' })

const route = useRoute()
const router = useRouter()
const classId = computed(() => route.params.id)

// JSON格式的班级数据
const classData = {
  class_t001: { name: '计算机2101班', studentCount: 28 },
  class_t002: { name: '软件工程2201班', studentCount: 35 },
  class_t003: { name: '数据科学2201班', studentCount: 65 }
}

// JSON格式的考试数据
const examsData = {
  class_t001: [
    { id: 'exam001', title: '期中考试', duration: 120, questionCount: 30, totalScore: 100, startTime: '2024-12-20 09:00', endTime: '2024-12-20 11:00', totalCount: 28, participantCount: 26, gradedCount: 20, avgScore: 78, passRate: 85, status: 'grading' },
    { id: 'exam002', title: '单元测试一', duration: 60, questionCount: 20, totalScore: 100, startTime: '2024-12-25 14:00', endTime: '2024-12-25 15:00', totalCount: 28, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' },
    { id: 'exam003', title: '随堂测验', duration: 30, questionCount: 10, totalScore: 50, startTime: '2024-12-15 10:00', endTime: '2024-12-15 10:30', totalCount: 28, participantCount: 28, gradedCount: 28, avgScore: 42, passRate: 92, status: 'completed' }
  ],
  class_t002: [
    { id: 'exam004', title: 'JavaScript期中考试', duration: 120, questionCount: 35, totalScore: 100, startTime: '2024-12-22 09:00', endTime: '2024-12-22 11:00', totalCount: 35, participantCount: 33, gradedCount: 30, avgScore: 75, passRate: 82, status: 'grading' },
    { id: 'exam005', title: '单元测试', duration: 45, questionCount: 15, totalScore: 100, startTime: '2024-12-18 14:00', endTime: '2024-12-18 14:45', totalCount: 35, participantCount: 35, gradedCount: 35, avgScore: 80, passRate: 88, status: 'completed' }
  ],
  class_t003: [
    { id: 'exam006', title: '数据结构期中考试', duration: 150, questionCount: 40, totalScore: 100, startTime: '2024-12-21 09:00', endTime: '2024-12-21 11:30', totalCount: 65, participantCount: 62, gradedCount: 55, avgScore: 72, passRate: 78, status: 'grading' },
    { id: 'exam007', title: '算法测试', duration: 90, questionCount: 25, totalScore: 100, startTime: '2024-12-28 14:00', endTime: '2024-12-28 15:30', totalCount: 65, participantCount: 0, gradedCount: 0, avgScore: null, passRate: null, status: 'pending' },
    { id: 'exam008', title: '链表小测', duration: 30, questionCount: 10, totalScore: 50, startTime: '2024-12-10 10:00', endTime: '2024-12-10 10:30', totalCount: 65, participantCount: 65, gradedCount: 65, avgScore: 38, passRate: 85, status: 'completed' }
  ]
}

const classInfo = ref({ name: '计算机2101班' })
const gradingDialogVisible = ref(false)
const currentExam = ref(null)
const currentGradingIndex = ref(0)
const exams = ref([])

const loadData = () => {
  const data = classData[classId.value] || classData.class_t001
  classInfo.value = data
  exams.value = examsData[classId.value] || examsData.class_t001
}

onMounted(() => loadData())

const pendingSubmissions = ref([])
const currentSubmission = computed(() => pendingSubmissions.value[currentGradingIndex.value] || null)

const totalScore = computed(() => {
  if (!currentSubmission.value) return 0
  return currentSubmission.value.answers.reduce((sum, a) => sum + (a.score || 0), 0)
})

const isPass = computed(() => {
  if (!currentExam.value) return false
  return totalScore.value >= currentExam.value.totalScore * 0.6
})

const pendingGradingCount = computed(() => exams.value.reduce((sum, e) => sum + (e.participantCount - e.gradedCount), 0))

const avgScoreDisplay = computed(() => {
  const completed = exams.value.filter(e => e.avgScore)
  if (completed.length === 0) return '-'
  return Math.round(completed.reduce((sum, e) => sum + e.avgScore, 0) / completed.length)
})

const getStatusType = (status) => {
  const map = { pending: 'info', ongoing: 'warning', grading: 'primary', completed: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { pending: '未开始', ongoing: '进行中', grading: '批改中', completed: '已完成' }
  return map[status] || '未知'
}

const getQuestionTypeText = (type) => {
  const map = { single: '单选题', multiple: '多选题', fill: '填空题', essay: '简答题', oj: '编程题' }
  return map[type] || '未知'
}

const goBack = () => router.push(`/teacher/class/${classId.value}`)
const createExam = () => router.push(`/teacher/exam/create?classId=${classId.value}`)
const viewDetail = (exam) => router.push(`/teacher/exam/${exam.id}`)
const viewAnalysis = (exam) => ElMessage.info(`查看成绩分析：${exam.title}`)

const startGrading = (exam) => {
  router.push(`/teacher/exam/grading/${exam.id}`)
}

const prevSubmission = () => {
  if (currentGradingIndex.value > 0) {
    currentGradingIndex.value--
  }
}

const nextSubmission = () => {
  if (currentGradingIndex.value < pendingSubmissions.value.length - 1) {
    currentGradingIndex.value++
  }
}

const submitGrading = () => {
  if (!currentSubmission.value) return
  ElMessage.success(`已批改 ${currentSubmission.value.studentName} 的试卷，得分：${totalScore.value}分`)
  if (currentGradingIndex.value < pendingSubmissions.value.length - 1) {
    currentGradingIndex.value++
  } else {
    gradingDialogVisible.value = false
    ElMessage.success('所有试卷批改完成！')
  }
}
</script>

<style lang="scss" scoped>
.class-exam {
  padding: 32px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;

    .header-info {
      flex: 1;
    }

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 4px 0;
    }

    p {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .stats-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    .stat-card {
      text-align: center;
      padding: 16px 32px;

      .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #303133;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
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

        h3 {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 8px 0;
        }

        .exam-meta {
          font-size: 13px;
          color: #909399;
          display: flex;
          gap: 16px;

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }

      .exam-time {
        margin-bottom: 16px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;

        .label {
          color: #909399;
        }

        .value {
          color: #303133;
          font-weight: 500;
        }
      }

      .exam-stats {
        display: flex;
        gap: 32px;
        margin-bottom: 16px;

        .stat-item {
          .label {
            font-size: 13px;
            color: #909399;
            display: block;
            margin-bottom: 4px;
          }

          .value {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
        }
      }

      .exam-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

.grading-dialog {
  .grading-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e7ed;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .submission-content {
    .student-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      .name {
        font-weight: 600;
        color: #303133;
      }

      .submit-time {
        font-size: 13px;
        color: #909399;
      }
    }

    .answers-section {
      .answer-item {
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 16px;

        .question-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .question-num {
            font-weight: 600;
            color: #409eff;
          }

          .question-type {
            background: #ecf5ff;
            color: #409eff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
          }

          .question-score {
            color: #f56c6c;
            font-weight: 500;
          }
        }

        .question-text {
          margin-bottom: 12px;
          color: #303133;
          line-height: 1.6;
        }

        .student-answer,
        .correct-answer {
          margin-bottom: 12px;

          .answer-label {
            font-size: 13px;
            color: #909399;
            margin-bottom: 4px;
          }

          .answer-content {
            padding: 12px;
            background: #f5f7fa;
            border-radius: 6px;
          }
        }

        .correct-answer .answer-content {
          background: #f0f9eb;
          color: #67c23a;
        }

        .score-input {
          display: flex;
          align-items: center;
          gap: 8px;

          .max-score {
            color: #909399;
          }
        }
      }
    }

    .total-section {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      .total-score {
        font-size: 16px;

        .score-value {
          font-size: 28px;
          font-weight: 700;
          color: #409eff;
          margin: 0 4px;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
