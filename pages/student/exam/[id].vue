<template>
  <div class="exam-detail-page">
    <!-- 顶部导航栏 -->
    <div class="exam-header">
      <div class="header-left">
        <h1 class="exam-title">{{ examInfo.title }}</h1>
        <div class="exam-meta">
          <span>总分：{{ examInfo.totalScore }}分</span>
          <span>及格分：{{ examInfo.passScore }}分</span>
          <span>题目数：{{ examInfo.questionCount }}题</span>
        </div>
      </div>
      <div class="header-right">
        <div class="timer">
          <el-icon><Clock /></el-icon>
          <span>剩余时间：{{ formatTime(remainingTime) }}</span>
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="exam-body">
      <!-- 左侧答题区 -->
      <div class="answer-area">
        <!-- 遍历所有题目 -->
        <div
          v-for="(question, index) in examInfo.questions"
          :key="index"
          :id="`question-${index}`"
          class="question-block"
        >
          <div class="question-header">
            <span class="question-number">{{ index + 1 }}</span>
            <span class="question-type">{{ getQuestionTypeText(question.type) }}</span>
            <span class="question-score">{{ question.score }}分</span>
          </div>

          <div class="question-content">
            <div class="question-text" v-html="question.question"></div>

            <!-- 单选题 -->
            <div v-if="question.type === 'single'" class="options">
              <el-radio-group v-model="question.answer">
                <el-radio
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  :label="option.value"
                  class="option-item"
                >
                  <span class="option-label">{{ option.value }}.</span>
                  <span class="option-text">{{ option.text }}</span>
                </el-radio>
              </el-radio-group>
            </div>

            <!-- 多选题 -->
            <div v-else-if="question.type === 'multiple'" class="options">
              <el-checkbox-group v-model="question.answer">
                <el-checkbox
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  :label="option.value"
                  class="option-item"
                >
                  <span class="option-label">{{ option.value }}.</span>
                  <span class="option-text">{{ option.text }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>

            <!-- 填空题 -->
            <div v-else-if="question.type === 'fill'" class="fill-answer">
              <el-input
                v-model="question.answer"
                type="textarea"
                :rows="3"
                placeholder="请输入答案"
              />
            </div>

            <!-- 问答题 -->
            <div v-else-if="question.type === 'essay'" class="essay-answer">
              <el-input
                v-model="question.answer"
                type="textarea"
                :rows="6"
                placeholder="请输入答案"
              />
            </div>
          </div>
        </div>

        <!-- 底部提交按钮 -->
        <div class="submit-section">
          <el-button type="primary" size="large" @click="submitExam">
            提交考卷
          </el-button>
        </div>
      </div>

      <!-- 右侧题目导航 -->
      <div class="question-nav">
        <div class="nav-header">
          <h3>答题卡</h3>
          <div class="progress-info">
            <span>已答：{{ answeredCount }}/{{ examInfo.questionCount }}</span>
          </div>
        </div>

        <div class="nav-content">
          <div class="question-grid">
            <div
              v-for="(question, index) in examInfo.questions"
              :key="index"
              class="question-item"
              :class="{
                answered: isAnswered(question),
                active: activeQuestion === index
              }"
              @click="scrollToQuestion(index)"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <div class="nav-footer">
          <el-button type="primary" size="large" @click="submitExam" style="width: 100%">
            提交考卷
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Clock } from '@element-plus/icons-vue'

definePageMeta({
  title: '考试',
  layout: 'learning'
})

const route = useRoute()
const router = useRouter()

const examId = computed(() => parseInt(route.params.id) || 1)

// 考试信息
const examInfo = ref({
  id: examId.value,
  title: '软件工程期中考试',
  courseId: 1, // 从哪个课程来的
  totalScore: 100,
  passScore: 60,
  duration: 90,
  questionCount: 0,
  questions: []
})

const remainingTime = ref(5400)
const activeQuestion = ref(0)
let timer = null

const answeredCount = computed(() => {
  return examInfo.value.questions.filter(q => isAnswered(q)).length
})

const isAnswered = (question) => {
  if (question.type === 'single') {
    return question.answer !== null && question.answer !== ''
  } else if (question.type === 'multiple') {
    return question.answer && question.answer.length > 0
  } else {
    return question.answer && question.answer.trim() !== ''
  }
}

const getQuestionTypeText = (type) => {
  const typeMap = {
    single: '单选题',
    multiple: '多选题',
    fill: '填空题',
    essay: '问答题'
  }
  return typeMap[type] || '未知题型'
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

const scrollToQuestion = (index) => {
  activeQuestion.value = index
  const element = document.getElementById(`question-${index}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const submitExam = () => {
  const unansweredCount = examInfo.value.questionCount - answeredCount.value

  if (unansweredCount > 0) {
    ElMessageBox.confirm(
      `还有 ${unansweredCount} 道题未作答，确定要提交吗？`,
      '提示',
      {
        confirmButtonText: '确定提交',
        cancelButtonText: '继续答题',
        type: 'warning'
      }
    ).then(() => {
      doSubmit()
    })
  } else {
    ElMessageBox.confirm(
      '确定要提交考卷吗？提交后将无法修改。',
      '提示',
      {
        confirmButtonText: '确定提交',
        cancelButtonText: '再检查一下',
        type: 'warning'
      }
    ).then(() => {
      doSubmit()
    })
  }
}

const doSubmit = () => {
  if (timer) {
    clearInterval(timer)
  }

  const completed = localStorage.getItem('completedExams')
  let completedIds = completed ? JSON.parse(completed) : []
  if (!completedIds.includes(examId.value)) {
    completedIds.push(examId.value)
    localStorage.setItem('completedExams', JSON.stringify(completedIds))
  }

  ElMessage.success('考卷提交成功！')

  setTimeout(() => {
    router.push(`/student/course/${examInfo.value.courseId}/exam`)
  }, 1000)
}

const startTimer = () => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      ElMessage.warning('考试时间已到，系统将自动提交！')
      doSubmit()
    }
  }, 1000)
}

const loadExamData = () => {
  const questions = [
    {
      type: 'single',
      question: '软件工程的核心目标是什么？',
      score: 2,
      options: [
        { value: 'A', text: '提高开发速度' },
        { value: 'B', text: '降低开发成本' },
        { value: 'C', text: '提高软件质量和可维护性' },
        { value: 'D', text: '增加代码量' }
      ],
      answer: null
    },
    {
      type: 'single',
      question: '瀑布模型的主要特点是什么？',
      score: 2,
      options: [
        { value: 'A', text: '迭代开发' },
        { value: 'B', text: '线性顺序开发' },
        { value: 'C', text: '敏捷开发' },
        { value: 'D', text: '原型开发' }
      ],
      answer: null
    },
    {
      type: 'multiple',
      question: '软件生命周期包括哪些阶段？（多选）',
      score: 3,
      options: [
        { value: 'A', text: '需求分析' },
        { value: 'B', text: '系统设计' },
        { value: 'C', text: '编码实现' },
        { value: 'D', text: '测试维护' }
      ],
      answer: []
    },
    {
      type: 'fill',
      question: '软件工程三要素是方法、工具和_______。',
      score: 5,
      answer: ''
    },
    {
      type: 'essay',
      question: '请简述软件测试的目的和重要性。',
      score: 10,
      answer: ''
    }
  ]

  examInfo.value.questions = questions
  examInfo.value.questionCount = questions.length
}

const handleScroll = () => {
  const scrollTop = document.querySelector('.answer-area').scrollTop
  const questionBlocks = document.querySelectorAll('.question-block')

  for (let i = 0; i < questionBlocks.length; i++) {
    const block = questionBlocks[i]
    const offsetTop = block.offsetTop - 100

    if (scrollTop >= offsetTop) {
      activeQuestion.value = i
    }
  }
}

onMounted(() => {
  loadExamData()
  startTimer()

  const answerArea = document.querySelector('.answer-area')
  if (answerArea) {
    answerArea.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }

  const answerArea = document.querySelector('.answer-area')
  if (answerArea) {
    answerArea.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="scss" scoped>
.exam-detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .header-left {
    flex: 1;

    .exam-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .exam-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #606266;
    }
  }

  .header-right {
    .timer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #fff3e0;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      color: #e6a23c;
    }
  }
}

.exam-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.answer-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.question-block {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .question-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f2f5;

    .question-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: #409eff;
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 14px;
    }

    .question-type {
      padding: 4px 12px;
      background: #ecf5ff;
      color: #409eff;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .question-score {
      margin-left: auto;
      color: #e6a23c;
      font-weight: 600;
    }
  }

  .question-content {
    .question-text {
      font-size: 16px;
      line-height: 1.8;
      color: #303133;
      margin-bottom: 20px;
    }

    .options {
      :deep(.el-radio-group),
      :deep(.el-checkbox-group) {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .option-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          border-color: #409eff;
          background: #f5f7fa;
        }

        .option-label {
          font-weight: 600;
          color: #606266;
          margin-right: 8px;
        }

        .option-text {
          flex: 1;
          color: #303133;
        }
      }
    }
  }
}

.submit-section {
  display: flex;
  justify-content: center;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-nav {
  width: 280px;
  background: white;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;

  .nav-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .progress-info {
      font-size: 13px;
      color: #606266;
    }
  }

  .nav-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    .question-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;

      .question-item {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        color: #606266;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #409eff;
          color: #409eff;
        }

        &.answered {
          background: #67c23a;
          border-color: #67c23a;
          color: white;
        }

        &.active {
          border-color: #409eff;
          border-width: 2px;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
      }
    }
  }

  .nav-footer {
    padding: 16px;
    border-top: 1px solid #e4e7ed;
  }
}
</style>
