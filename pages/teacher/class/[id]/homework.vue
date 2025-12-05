<template>
  <div class="class-homework">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>作业管理</h1>
        <p>{{ classInfo.name }}</p>
      </div>
      <el-button type="primary" @click="createHomework">
        <el-icon><Plus /></el-icon> 发布作业
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ homeworks.length }}</div>
        <div class="stat-label">总作业数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ pendingGradingCount }}</div>
        <div class="stat-label">待批改</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ avgSubmitRate }}%</div>
        <div class="stat-label">平均提交率</div>
      </el-card>
    </div>

    <!-- 作业列表 -->
    <div class="homework-list">
      <el-card v-for="hw in homeworks" :key="hw.id" class="homework-card" shadow="hover">
        <div class="homework-header">
          <div class="homework-info">
            <h3>{{ hw.title }}</h3>
            <div class="homework-meta">
              <span>截止：{{ hw.deadline }}</span>
              <span>题目数：{{ hw.questionCount }}</span>
            </div>
          </div>
          <el-tag :type="getStatusType(hw.status)">{{ getStatusText(hw.status) }}</el-tag>
        </div>

        <div class="homework-stats">
          <div class="stat-item">
            <span class="label">提交情况</span>
            <span class="value">{{ hw.submittedCount }}/{{ hw.totalCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">已批改</span>
            <span class="value">{{ hw.gradedCount }}/{{ hw.submittedCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">平均分</span>
            <span class="value">{{ hw.avgScore || '-' }}</span>
          </div>
        </div>

        <el-progress :percentage="getGradingProgress(hw)" :stroke-width="8" />

        <div class="homework-actions">
          <el-button type="primary" size="small" @click="startGrading(hw)" :disabled="hw.submittedCount === hw.gradedCount">
            批改作业
          </el-button>
          <el-button size="small" @click="viewDetail(hw)">查看详情</el-button>
          <el-button size="small" @click="viewSubmissions(hw)">提交列表</el-button>
        </div>
      </el-card>
    </div>

    <!-- 批改对话框 -->
    <el-dialog v-model="gradingDialogVisible" title="作业批改" width="900px" destroy-on-close>
      <template v-if="currentHomework && currentSubmission">
        <div class="grading-dialog">
          <div class="grading-header">
            <h3>{{ currentHomework.title }}</h3>
            <div class="grading-progress">
              已批改：{{ currentGradingIndex + 1 }}/{{ pendingSubmissions.length }}
            </div>
          </div>

          <div class="submission-content">
            <div class="student-info">
              <el-avatar :size="48" :src="currentSubmission.avatar" />
              <div class="info-text">
                <div class="name">{{ currentSubmission.studentName }}</div>
                <div class="submit-time">提交时间：{{ currentSubmission.submitTime }}</div>
              </div>
            </div>

            <!-- 答案展示区 -->
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

            <!-- 总评 -->
            <div class="total-section">
              <div class="total-score">
                <span>总分：</span>
                <span class="score-value">{{ totalScore }}</span>
                <span>/ {{ currentHomework.totalScore }}分</span>
              </div>
              <div class="comment-input">
                <span>评语：</span>
                <el-input v-model="currentSubmission.comment" type="textarea" :rows="3" placeholder="请输入评语（可选）" />
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
import { ArrowLeft, Plus } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '作业管理' })

const route = useRoute()
const router = useRouter()
const classId = computed(() => route.params.id)

// JSON格式的班级数据
const classData = {
  class_t001: { name: '计算机2101班', studentCount: 28 },
  class_t002: { name: '软件工程2201班', studentCount: 35 },
  class_t003: { name: '数据科学2201班', studentCount: 65 }
}

// JSON格式的作业数据
const homeworksData = {
  class_t001: [
    { id: 'hw001', title: '第一章作业：软件工程概述', deadline: '2024-12-25', questionCount: 5, totalCount: 28, submittedCount: 25, gradedCount: 20, avgScore: 85, totalScore: 100, status: 'grading' },
    { id: 'hw002', title: '第二章作业：需求分析', deadline: '2024-12-30', questionCount: 8, totalCount: 28, submittedCount: 18, gradedCount: 0, avgScore: null, totalScore: 100, status: 'collecting' },
    { id: 'hw003', title: '第三章作业：系统设计', deadline: '2025-01-05', questionCount: 6, totalCount: 28, submittedCount: 0, gradedCount: 0, avgScore: null, totalScore: 100, status: 'pending' }
  ],
  class_t002: [
    { id: 'hw004', title: 'ES6新特性练习', deadline: '2024-12-28', questionCount: 10, totalCount: 35, submittedCount: 30, gradedCount: 25, avgScore: 78, totalScore: 100, status: 'grading' },
    { id: 'hw005', title: '异步编程作业', deadline: '2025-01-02', questionCount: 8, totalCount: 35, submittedCount: 20, gradedCount: 0, avgScore: null, totalScore: 100, status: 'collecting' }
  ],
  class_t003: [
    { id: 'hw006', title: '链表操作练习', deadline: '2024-12-26', questionCount: 6, totalCount: 65, submittedCount: 58, gradedCount: 50, avgScore: 82, totalScore: 100, status: 'grading' },
    { id: 'hw007', title: '树结构作业', deadline: '2024-12-30', questionCount: 8, totalCount: 65, submittedCount: 45, gradedCount: 0, avgScore: null, totalScore: 100, status: 'collecting' },
    { id: 'hw008', title: '图算法练习', deadline: '2025-01-08', questionCount: 10, totalCount: 65, submittedCount: 0, gradedCount: 0, avgScore: null, totalScore: 100, status: 'pending' }
  ]
}

const classInfo = ref({ name: '计算机2101班' })
const gradingDialogVisible = ref(false)
const currentHomework = ref(null)
const currentGradingIndex = ref(0)
const homeworks = ref([])

const loadData = () => {
  const data = classData[classId.value] || classData.class_t001
  classInfo.value = data
  homeworks.value = homeworksData[classId.value] || homeworksData.class_t001
}

onMounted(() => loadData())

const pendingSubmissions = ref([])
const currentSubmission = computed(() => pendingSubmissions.value[currentGradingIndex.value] || null)

const totalScore = computed(() => {
  if (!currentSubmission.value) return 0
  return currentSubmission.value.answers.reduce((sum, a) => sum + (a.score || 0), 0)
})

const pendingGradingCount = computed(() => homeworks.value.reduce((sum, hw) => sum + (hw.submittedCount - hw.gradedCount), 0))
const avgSubmitRate = computed(() => {
  const total = homeworks.value.reduce((sum, hw) => sum + hw.totalCount, 0)
  const submitted = homeworks.value.reduce((sum, hw) => sum + hw.submittedCount, 0)
  return total ? Math.round(submitted / total * 100) : 0
})

const getGradingProgress = (hw) => {
  if (!hw.submittedCount) return 0
  return Math.round(hw.gradedCount / hw.submittedCount * 100)
}

const getStatusType = (status) => {
  const map = { pending: 'info', collecting: 'warning', grading: 'primary', completed: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { pending: '未开始', collecting: '收集中', grading: '批改中', completed: '已完成' }
  return map[status] || '未知'
}

const getQuestionTypeText = (type) => {
  const map = { single: '单选题', multiple: '多选题', fill: '填空题', essay: '简答题', oj: '编程题' }
  return map[type] || '未知'
}

const goBack = () => router.push(`/teacher/class/${classId.value}`)
const createHomework = () => router.push(`/teacher/homework/create?classId=${classId.value}`)
const viewDetail = (hw) => router.push(`/teacher/homework/${hw.id}`)
const viewSubmissions = (hw) => ElMessage.info(`查看提交列表：${hw.title}`)

const startGrading = (hw) => {
  router.push(`/teacher/homework/grading/${hw.id}`)
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
  ElMessage.success(`已批改 ${currentSubmission.value.studentName} 的作业，得分：${totalScore.value}分`)
  if (currentGradingIndex.value < pendingSubmissions.value.length - 1) {
    currentGradingIndex.value++
  } else {
    gradingDialogVisible.value = false
    ElMessage.success('所有作业批改完成！')
  }
}
</script>

<style lang="scss" scoped>
.class-homework {
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

  .homework-list {
    display: grid;
    gap: 20px;

    .homework-card {
      .homework-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;

        h3 {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 8px 0;
        }

        .homework-meta {
          font-size: 13px;
          color: #909399;
          display: flex;
          gap: 16px;
        }
      }

      .homework-stats {
        display: flex;
        gap: 32px;
        margin-bottom: 16px;

        .stat-item {
          .label {
            font-size: 13px;
            color: #909399;
            margin-right: 8px;
          }

          .value {
            font-size: 15px;
            font-weight: 600;
            color: #303133;
          }
        }
      }

      .homework-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
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

    .grading-progress {
      color: #909399;
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
        margin-bottom: 16px;
        font-size: 16px;

        .score-value {
          font-size: 24px;
          font-weight: 700;
          color: #409eff;
          margin: 0 4px;
        }
      }

      .comment-input span {
        display: block;
        margin-bottom: 8px;
        color: #606266;
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
