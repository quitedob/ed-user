<template>
  <div class="exam-grading">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>批改试卷：{{ exam.title }}</h1>
        <p>{{ getClassName(exam.classId) }} · 已批改 {{ gradedCount }}/{{ submissions.length }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="prevSubmission" :disabled="currentIndex === 0">
          <el-icon><ArrowLeft /></el-icon> 上一份
        </el-button>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ submissions.length }}</span>
        <el-button @click="nextSubmission" :disabled="currentIndex >= submissions.length - 1">
          下一份 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <el-row :gutter="24" v-if="currentSubmission">
      <!-- 左侧：学生答案 -->
      <el-col :span="16">
        <el-card shadow="never" class="answers-card">
          <template #header>
            <div class="student-header">
              <el-avatar :size="40" :src="currentSubmission.avatar" />
              <div class="student-info">
                <div class="name">{{ currentSubmission.studentName }}</div>
                <div class="meta">学号：{{ currentSubmission.studentId }} · 交卷时间：{{ currentSubmission.submitTime }}</div>
              </div>
              <el-tag v-if="currentSubmission.isGraded" type="success">已批改 · {{ currentSubmission.totalScore }}分</el-tag>
              <el-tag v-else type="warning">待批改</el-tag>
            </div>
          </template>

          <div class="answers-list">
            <div v-for="(answer, index) in currentSubmission.answers" :key="index" class="answer-item">
              <div class="question-header">
                <span class="question-num">第{{ index + 1 }}题</span>
                <el-tag :type="getTypeTagType(answer.type)" size="small">{{ getTypeLabel(answer.type) }}</el-tag>
                <span class="question-max-score">满分：{{ answer.maxScore }}分</span>
              </div>
              <div class="question-text">{{ answer.questionText }}</div>
              
              <!-- 学生答案 -->
              <div class="student-answer">
                <div class="answer-label">学生答案：</div>
                <div class="answer-content" :class="getAnswerClass(answer)">
                  {{ answer.userAnswer || '未作答' }}
                </div>
              </div>

              <!-- 参考答案 -->
              <div class="correct-answer" v-if="answer.correctAnswer">
                <div class="answer-label">参考答案：</div>
                <div class="answer-content correct">{{ answer.correctAnswer }}</div>
              </div>

              <!-- 评分输入 -->
              <div class="score-section">
                <div class="score-input">
                  <span class="label">评分：</span>
                  <el-input-number v-model="answer.score" :min="0" :max="answer.maxScore" size="small" />
                  <span class="max-score">/ {{ answer.maxScore }}分</span>
                </div>
                <el-input v-model="answer.comment" placeholder="评语（可选）" size="small" style="margin-top: 8px" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：批改操作 -->
      <el-col :span="8">
        <el-card shadow="never" class="grading-panel">
          <template #header><span class="card-title">考试评价</span></template>
          
          <div class="score-summary">
            <div class="total-score">
              <span class="label">当前得分</span>
              <span class="score">{{ calculatedScore }}</span>
              <span class="max">/ {{ exam.totalScore }}分</span>
            </div>
            <el-progress :percentage="Math.round(calculatedScore / exam.totalScore * 100)" :stroke-width="12" />
            <div class="pass-status">
              <el-tag :type="calculatedScore >= exam.passScore ? 'success' : 'danger'" size="large">
                {{ calculatedScore >= exam.passScore ? '及格' : '不及格' }}
              </el-tag>
            </div>
          </div>

          <div class="grading-actions">
            <el-button type="primary" size="large" @click="submitGrading" style="width: 100%">
              <el-icon><Check /></el-icon> 提交批改
            </el-button>
          </div>
        </el-card>

        <!-- 提交列表 -->
        <el-card shadow="never" class="submissions-list-card">
          <template #header><span class="card-title">试卷列表</span></template>
          <div class="submissions-list">
            <div 
              v-for="(sub, idx) in submissions" 
              :key="sub.id" 
              class="submission-item"
              :class="{ active: idx === currentIndex, graded: sub.isGraded }"
              @click="switchSubmission(idx)"
            >
              <el-avatar :size="32" :src="sub.avatar" />
              <div class="sub-info">
                <div class="sub-name">{{ sub.studentName }}</div>
                <div class="sub-status">
                  <el-tag v-if="sub.isGraded" type="success" size="small">{{ sub.totalScore }}分</el-tag>
                  <el-tag v-else type="info" size="small">待批改</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '批改试卷' })

const router = useRouter()
const route = useRoute()
const examId = computed(() => route.params.id)

// JSON格式的班级数据
const classes = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

// JSON格式的考试数据
const examsData = {
  exam001: { id: 'exam001', title: '期中考试', classId: 'class_t001', totalScore: 100, passScore: 60 },
  exam005: { id: 'exam005', title: '数据结构期中考试', classId: 'class_t003', totalScore: 100, passScore: 60 }
}

// JSON格式的提交数据
const submissionsData = [
  {
    id: 'sub001', studentId: '2021001', studentName: '张三', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    submitTime: '2024-12-21 10:45', isGraded: false, totalScore: 0,
    answers: [
      { type: 'single', questionText: '数组和链表的主要区别是？', userAnswer: 'A', correctAnswer: 'A', maxScore: 5, score: 5, comment: '' },
      { type: 'single', questionText: '栈的特点是？', userAnswer: 'B', correctAnswer: 'A', maxScore: 5, score: 0, comment: '' },
      { type: 'multiple', questionText: '以下哪些是线性结构？', userAnswer: 'A,B,C', correctAnswer: 'A,B', maxScore: 10, score: 5, comment: '' },
      { type: 'fill', questionText: '二叉树的前序遍历顺序是____', userAnswer: '根左右', correctAnswer: '根左右', maxScore: 10, score: 10, comment: '' },
      { type: 'essay', questionText: '简述快速排序的基本思想', userAnswer: '选择一个基准元素，将数组分为两部分...', correctAnswer: null, maxScore: 20, score: 0, comment: '' },
      { type: 'programming', questionText: '实现二叉树的层序遍历', userAnswer: 'def levelOrder(root):\n  if not root: return []\n  queue = [root]\n  result = []\n  while queue:\n    node = queue.pop(0)\n    result.append(node.val)\n    if node.left: queue.append(node.left)\n    if node.right: queue.append(node.right)\n  return result', correctAnswer: null, maxScore: 30, score: 0, comment: '' }
    ]
  },
  {
    id: 'sub002', studentId: '2021002', studentName: '李四', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    submitTime: '2024-12-21 11:00', isGraded: true, totalScore: 85,
    answers: [
      { type: 'single', questionText: '数组和链表的主要区别是？', userAnswer: 'A', correctAnswer: 'A', maxScore: 5, score: 5, comment: '' },
      { type: 'single', questionText: '栈的特点是？', userAnswer: 'A', correctAnswer: 'A', maxScore: 5, score: 5, comment: '' },
      { type: 'multiple', questionText: '以下哪些是线性结构？', userAnswer: 'A,B', correctAnswer: 'A,B', maxScore: 10, score: 10, comment: '' },
      { type: 'fill', questionText: '二叉树的前序遍历顺序是____', userAnswer: '根左右', correctAnswer: '根左右', maxScore: 10, score: 10, comment: '' },
      { type: 'essay', questionText: '简述快速排序的基本思想', userAnswer: '分治思想，选择基准，分区，递归...', correctAnswer: null, maxScore: 20, score: 18, comment: '回答完整' },
      { type: 'programming', questionText: '实现二叉树的层序遍历', userAnswer: '使用队列实现...', correctAnswer: null, maxScore: 30, score: 27, comment: '代码正确' }
    ]
  },
  {
    id: 'sub003', studentId: '2021003', studentName: '王五', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    submitTime: '2024-12-21 11:20', isGraded: false, totalScore: 0,
    answers: [
      { type: 'single', questionText: '数组和链表的主要区别是？', userAnswer: 'A', correctAnswer: 'A', maxScore: 5, score: 5, comment: '' },
      { type: 'single', questionText: '栈的特点是？', userAnswer: 'A', correctAnswer: 'A', maxScore: 5, score: 5, comment: '' },
      { type: 'multiple', questionText: '以下哪些是线性结构？', userAnswer: 'A,B,C,D', correctAnswer: 'A,B', maxScore: 10, score: 0, comment: '' },
      { type: 'fill', questionText: '二叉树的前序遍历顺序是____', userAnswer: '左根右', correctAnswer: '根左右', maxScore: 10, score: 0, comment: '' },
      { type: 'essay', questionText: '简述快速排序的基本思想', userAnswer: '快速排序是一种排序算法...', correctAnswer: null, maxScore: 20, score: 0, comment: '' },
      { type: 'programming', questionText: '实现二叉树的层序遍历', userAnswer: '未作答', correctAnswer: null, maxScore: 30, score: 0, comment: '' }
    ]
  }
]

const exam = ref({ id: '', title: '', classId: '', totalScore: 100, passScore: 60 })
const submissions = ref([])
const currentIndex = ref(0)

const currentSubmission = computed(() => submissions.value[currentIndex.value] || null)
const gradedCount = computed(() => submissions.value.filter(s => s.isGraded).length)
const calculatedScore = computed(() => {
  if (!currentSubmission.value) return 0
  return currentSubmission.value.answers.reduce((sum, a) => sum + (a.score || 0), 0)
})

const getClassName = (classId) => classes.find(c => c.id === classId)?.name || '未知班级'
const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger' }[type] || '')
const getAnswerClass = (answer) => {
  if (answer.score === answer.maxScore) return 'correct'
  if (answer.score === 0) return 'wrong'
  return 'partial'
}

const goBack = () => router.back()
const prevSubmission = () => { if (currentIndex.value > 0) currentIndex.value-- }
const nextSubmission = () => { if (currentIndex.value < submissions.value.length - 1) currentIndex.value++ }

const submitGrading = () => {
  if (currentSubmission.value) {
    currentSubmission.value.isGraded = true
    currentSubmission.value.totalScore = calculatedScore.value
    ElMessage.success(`已完成 ${currentSubmission.value.studentName} 的试卷批改，得分：${calculatedScore.value}分`)
    if (currentIndex.value < submissions.value.length - 1) {
      currentIndex.value++
    }
  }
}

const loadData = () => {
  exam.value = examsData[examId.value] || examsData.exam005
  submissions.value = JSON.parse(JSON.stringify(submissionsData))

  // 自动批改有预设答案的题目
  autoGradeSubmission(currentSubmission.value)
}

// 自动批改功能
const autoGradeSubmission = (submission) => {
  if (!submission) return

  submission.answers.forEach(answer => {
    if (answer.correctAnswer) {
      // 单选题
      if (answer.type === 'single') {
        answer.score = answer.userAnswer === answer.correctAnswer ? answer.maxScore : 0
        if (!answer.comment) {
          answer.comment = answer.userAnswer === answer.correctAnswer ? '答案正确' : '答案错误'
        }
      }
      // 多选题
      else if (answer.type === 'multiple') {
        const userAnswers = answer.userAnswer.split(',').map(a => a.trim()).sort()
        const correctAnswers = answer.correctAnswer.split(',').map(a => a.trim()).sort()
        const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers)
        answer.score = isCorrect ? answer.maxScore : 0
        if (!answer.comment) {
          answer.comment = isCorrect ? '答案正确' : '答案错误'
        }
      }
      // 填空题
      else if (answer.type === 'fill') {
        const isCorrect = answer.userAnswer.trim().toLowerCase() === answer.correctAnswer.trim().toLowerCase()
        answer.score = isCorrect ? answer.maxScore : 0
        if (!answer.comment) {
          answer.comment = isCorrect ? '答案正确' : '答案错误'
        }
      }
    }
    // 主观题（问答、编程）不自动批改，保留人工批改
    else {
      if (!answer.score) answer.score = 0
    }
  })
}

// 切换到新的提交记录时也进行自动批改
const switchSubmission = (idx) => {
  currentIndex.value = idx
  autoGradeSubmission(currentSubmission.value)
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.exam-grading {
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    .header-info { flex: 1; }
    h1 { font-size: 20px; font-weight: 600; color: #303133; margin: 0 0 4px 0; }
    p { font-size: 14px; color: #909399; margin: 0; }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .progress-text { font-size: 14px; color: #606266; font-weight: 500; }
  }

  .answers-card {
    .student-header {
      display: flex;
      align-items: center;
      gap: 12px;
      .student-info {
        flex: 1;
        .name { font-size: 16px; font-weight: 600; color: #303133; }
        .meta { font-size: 13px; color: #909399; }
      }
    }

    .answers-list {
      .answer-item {
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 16px;
        &:last-child { margin-bottom: 0; }

        .question-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          .question-max-score { margin-left: auto; color: #f56c6c; font-weight: 500; }
        }
        .question-num { font-weight: 600; color: #409eff; }
        .question-text { font-size: 14px; color: #303133; margin-bottom: 12px; line-height: 1.6; }

        .student-answer, .correct-answer {
          margin-bottom: 12px;
          .answer-label { font-size: 13px; color: #909399; margin-bottom: 4px; }
          .answer-content {
            padding: 12px;
            background: #f5f7fa;
            border-radius: 6px;
            font-size: 14px;
            white-space: pre-wrap;
            &.correct { background: #f0f9eb; color: #67c23a; }
            &.wrong { background: #fef0f0; color: #f56c6c; }
            &.partial { background: #fdf6ec; color: #e6a23c; }
          }
        }

        .score-section {
          .score-input {
            display: flex;
            align-items: center;
            gap: 8px;
            .label { font-size: 14px; color: #606266; }
            .max-score { color: #909399; }
          }
        }
      }
    }
  }

  .grading-panel {
    margin-bottom: 24px;
    .card-title { font-size: 16px; font-weight: 600; }
    .score-summary {
      text-align: center;
      margin-bottom: 20px;
      .total-score {
        margin-bottom: 16px;
        .label { font-size: 14px; color: #909399; display: block; margin-bottom: 8px; }
        .score { font-size: 48px; font-weight: 700; color: #409eff; }
        .max { font-size: 18px; color: #909399; }
      }
      .pass-status { margin-top: 16px; }
    }
  }

  .submissions-list-card {
    .card-title { font-size: 16px; font-weight: 600; }
    .submissions-list {
      max-height: 400px;
      overflow-y: auto;
      .submission-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover { background: #f5f7fa; }
        &.active { background: #ecf5ff; border: 1px solid #409eff; }
        &.graded { opacity: 0.7; }
        .sub-info {
          flex: 1;
          .sub-name { font-size: 14px; font-weight: 500; color: #303133; }
        }
      }
    }
  }
}
</style>
