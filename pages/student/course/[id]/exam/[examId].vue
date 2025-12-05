<template>
  <div class="exam-detail-page">
    <!-- 顶部导航栏 -->
    <div class="exam-header">
      <div class="header-left">
        <el-button @click="goBack" text>
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1 class="exam-title">{{ examInfo.basicInfo.title }}</h1>
      </div>
      <div class="header-right">
        <div class="exam-meta">
          <span>总分：{{ examInfo.statistics.totalScore }}分</span>
          <span v-if="!isCompleted" class="timer">
            <el-icon><Clock /></el-icon>
            剩余时间：{{ formatTime(remainingTime) }}
          </span>
        </div>
        <div v-if="isCompleted" class="score-display">
          <span class="score-value">{{ userScore }}</span>
          <span class="score-label">分</span>
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="exam-body">
      <!-- 答题区 -->
      <div class="answer-area">
        <div v-if="currentQuestion" class="question-detail">
          <!-- 题目头部 -->
          <div class="question-header">
            <div class="header-main">
              <span class="question-number">{{ activeQuestion + 1 }}</span>
              <span class="question-type">{{ getQuestionTypeText(currentQuestion.type) }}</span>
              <span class="question-score">{{ currentQuestion.score }}分</span>
            </div>
            <div class="header-nav">
              <el-button :disabled="activeQuestion === 0" @click="switchQuestion(activeQuestion - 1)" size="small">上一题</el-button>
              <el-button :disabled="activeQuestion === examInfo.questions.length - 1" @click="switchQuestion(activeQuestion + 1)" size="small" type="primary">下一题</el-button>
            </div>
          </div>

          <!-- 题目内容 -->
          <div class="question-content">
            <!-- 单选题 -->
            <div v-if="currentQuestion.type === 'single'" class="question-single">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="options">
                <el-radio-group v-model="currentQuestion.userAnswer">
                  <el-radio v-for="opt in currentQuestion.options" :key="opt.id" :label="opt.value" class="option-item">
                    <span class="option-label">{{ opt.value }}.</span>
                    <span class="option-text">{{ opt.text }}</span>
                  </el-radio>
                </el-radio-group>
              </div>
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label correct"><el-icon><Check /></el-icon><span>正确答案</span></div>
                  <div class="answer-value">{{ currentQuestion.correctAnswer }}</div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label"><span>你的答案</span></div>
                  <div class="answer-value" :class="{ correct: currentQuestion.userAnswer === currentQuestion.correctAnswer, wrong: currentQuestion.userAnswer !== currentQuestion.correctAnswer }">
                    {{ currentQuestion.userAnswer }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 多选题 -->
            <div v-else-if="currentQuestion.type === 'multiple'" class="question-multiple">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="options">
                <el-checkbox-group v-model="currentQuestion.userAnswer">
                  <el-checkbox v-for="opt in currentQuestion.options" :key="opt.id" :label="opt.value" class="option-item">
                    <span class="option-label">{{ opt.value }}.</span>
                    <span class="option-text">{{ opt.text }}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label correct"><el-icon><Check /></el-icon><span>正确答案</span></div>
                  <div class="answer-value">{{ currentQuestion.correctAnswers?.join(', ') }}</div>
                </div>
                <div v-if="currentQuestion.userAnswer?.length" class="answer-section">
                  <div class="section-label"><span>你的答案</span></div>
                  <div class="answer-value" :class="{ correct: isMultipleCorrect(currentQuestion), wrong: !isMultipleCorrect(currentQuestion) }">
                    {{ currentQuestion.userAnswer.join(', ') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 填空题 -->
            <div v-else-if="currentQuestion.type === 'fill'" class="question-fill">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="fill-input">
                <el-input v-model="currentQuestion.userAnswer" type="textarea" :rows="3" placeholder="请输入答案" />
              </div>
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label correct"><el-icon><Check /></el-icon><span>正确答案</span></div>
                  <div class="answer-value">{{ currentQuestion.correctAnswers?.join(' 或 ') }}</div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label"><span>你的答案</span></div>
                  <div class="answer-value">{{ currentQuestion.userAnswer }}</div>
                </div>
              </div>
            </div>

            <!-- 问答题 -->
            <div v-else-if="currentQuestion.type === 'essay'" class="question-essay">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="essay-input">
                <el-input v-model="currentQuestion.userAnswer" type="textarea" :rows="10" placeholder="请输入答案..." />
              </div>
              <div v-else class="answer-display">
                <div v-if="currentQuestion.referenceAnswer" class="answer-section">
                  <div class="section-label correct"><el-icon><Check /></el-icon><span>参考答案</span></div>
                  <div class="answer-value" v-html="currentQuestion.referenceAnswer"></div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label"><span>你的答案</span></div>
                  <div class="answer-value" v-html="currentQuestion.userAnswer"></div>
                </div>
              </div>
            </div>

            <!-- 判断题 -->
            <div v-else-if="currentQuestion.type === 'judge'" class="question-judge">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="options">
                <el-radio-group v-model="currentQuestion.userAnswer">
                  <el-radio label="true" class="option-item">
                    <span class="option-text">正确</span>
                  </el-radio>
                  <el-radio label="false" class="option-item">
                    <span class="option-text">错误</span>
                  </el-radio>
                </el-radio-group>
              </div>
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label correct"><el-icon><Check /></el-icon><span>正确答案</span></div>
                  <div class="answer-value">{{ currentQuestion.correctAnswer === 'true' ? '正确' : '错误' }}</div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label"><span>你的答案</span></div>
                  <div class="answer-value" :class="{ correct: currentQuestion.userAnswer === currentQuestion.correctAnswer, wrong: currentQuestion.userAnswer !== currentQuestion.correctAnswer }">
                    {{ currentQuestion.userAnswer === 'true' ? '正确' : '错误' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 编程题 -->
            <div v-else-if="currentQuestion.type === 'programming'" class="question-programming">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="programming-input">
                <el-input v-model="currentQuestion.userAnswer" type="textarea" :rows="15" placeholder="请输入代码..." />
              </div>
              <div v-else class="answer-display">
                <div v-if="currentQuestion.referenceAnswer" class="answer-section">
                  <div class="section-label correct"><el-icon><Check /></el-icon><span>参考答案</span></div>
                  <div class="answer-value"><pre>{{ currentQuestion.referenceAnswer }}</pre></div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label"><span>你的答案</span></div>
                  <div class="answer-value"><pre>{{ currentQuestion.userAnswer }}</pre></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部操作按钮 -->
          <div class="question-footer">
            <el-button :disabled="activeQuestion === 0" @click="switchQuestion(activeQuestion - 1)">上一题</el-button>
            <el-button v-if="activeQuestion < examInfo.questions.length - 1" type="primary" @click="switchQuestion(activeQuestion + 1)">下一题</el-button>
            <el-button v-else-if="!isCompleted" type="success" @click="handleSubmit">提交考试</el-button>
          </div>
        </div>
      </div>

      <!-- 右侧答题卡 -->
      <div class="answer-card">
        <div class="card-header">
          <h3>答题卡</h3>
          <div class="progress-info">已答：{{ answeredCount }}/{{ examInfo.statistics.totalQuestions }}</div>
        </div>
        <div class="card-content">
          <div class="card-grid">
            <div v-for="(q, idx) in examInfo.questions" :key="q.id" class="card-item" :class="{ answered: isAnswered(q), active: activeQuestion === idx }" @click="switchQuestion(idx)">{{ idx + 1 }}</div>
          </div>
        </div>
        <div v-if="!isCompleted" class="card-footer">
          <el-button type="primary" size="large" @click="handleSubmit" style="width: 100%">提交考试</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, ArrowLeft, Clock } from '@element-plus/icons-vue'

definePageMeta({ title: '考试详情', layout: 'learning' })

const route = useRoute()
const router = useRouter()
const courseId = computed(() => parseInt(route.params.id) || 1)
const examId = computed(() => parseInt(route.params.examId) || 1)

const isCompleted = ref(false)
const userScore = ref(0)
const activeQuestion = ref(0)
const remainingTime = ref(5400) // 90分钟 = 5400秒
let timerInterval = null

const examInfo = ref({
  basicInfo: { title: '', description: '' },
  schedule: { startTime: '', endTime: '', duration: 90 },
  questions: [],
  statistics: { totalQuestions: 0, totalScore: 0 }
})

const currentQuestion = computed(() => examInfo.value.questions[activeQuestion.value])
const answeredCount = computed(() => examInfo.value.questions.filter(q => isAnswered(q)).length)

const isAnswered = (q) => {
  if (!q.userAnswer) return false
  if (q.type === 'multiple') return Array.isArray(q.userAnswer) && q.userAnswer.length > 0
  return typeof q.userAnswer === 'string' && q.userAnswer.trim() !== ''
}

const getQuestionTypeText = (type) => ({ single: '单选题', multiple: '多选题', fill: '填空题', essay: '问答题', judge: '判断题', programming: '编程题' }[type] || '未知')
const isMultipleCorrect = (q) => q.userAnswer && q.correctAnswers && JSON.stringify([...q.userAnswer].sort()) === JSON.stringify([...q.correctAnswers].sort())

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const switchQuestion = (idx) => {
  if (idx >= 0 && idx < examInfo.value.questions.length) activeQuestion.value = idx
}

const goBack = () => router.push(`/student/course/${courseId.value}/exam`)

const handleSubmit = () => {
  const unanswered = examInfo.value.statistics.totalQuestions - answeredCount.value
  ElMessageBox.confirm(unanswered > 0 ? `还有 ${unanswered} 道题未作答，确定提交？` : '确定提交考试？', '提示', { type: 'warning' })
    .then(() => submitExam()).catch(() => {})
}

const submitExam = () => {
  clearInterval(timerInterval)
  let total = 0
  examInfo.value.questions.forEach(q => {
    if (q.type === 'single' && q.userAnswer === q.correctAnswer) total += q.score
    else if (q.type === 'multiple' && isMultipleCorrect(q)) total += q.score
    else if (q.type === 'fill' && q.correctAnswers?.some(a => q.userAnswer?.toLowerCase().includes(a.toLowerCase()))) total += q.score
    else if (q.type === 'judge' && q.userAnswer === q.correctAnswer) total += q.score
    else if (q.type === 'essay' || q.type === 'programming') total += Math.floor(q.score * 0.8) // 主观题给80%分数
  })
  userScore.value = total
  isCompleted.value = true
  ElMessage.success(`考试提交成功！得分：${total}分`)
}

const loadExamData = () => {
  const mockQuestions = [
    { id: 'q1', type: 'single', questionText: '软件工程的三要素是什么？', score: 5, options: [{ id: 'a', value: 'A', text: '方法、工具、过程' }, { id: 'b', value: 'B', text: '代码、文档、测试' }, { id: 'c', value: 'C', text: '需求、设计、实现' }, { id: 'd', value: 'D', text: '计划、执行、验收' }], correctAnswer: 'A', userAnswer: '' },
    { id: 'q2', type: 'multiple', questionText: '软件生命周期包括哪些阶段？', score: 10, options: [{ id: 'a', value: 'A', text: '需求分析' }, { id: 'b', value: 'B', text: '系统设计' }, { id: 'c', value: 'C', text: '编码实现' }, { id: 'd', value: 'D', text: '测试维护' }], correctAnswers: ['A', 'B', 'C', 'D'], userAnswer: [] },
    { id: 'q3', type: 'judge', questionText: '瀑布模型是一种迭代式开发模型。', score: 5, correctAnswer: 'false', userAnswer: '' },
    { id: 'q4', type: 'fill', questionText: '敏捷开发强调____和____优先于流程和工具。', score: 10, correctAnswers: ['个体', '交互'], userAnswer: '' },
    { id: 'q5', type: 'essay', questionText: '简述软件测试的目的和重要性。', score: 20, referenceAnswer: '软件测试的目的是发现软件中的缺陷，确保软件质量。重要性体现在：1.提高软件可靠性 2.降低维护成本 3.提升用户满意度 4.保证项目成功。', userAnswer: '' },
    { id: 'q6', type: 'programming', questionText: '编写一个函数，实现冒泡排序算法。', score: 25, referenceAnswer: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr', userAnswer: '' }
  ]
  examInfo.value = {
    basicInfo: { title: '软件工程期中考试', description: '测试软件工程基础知识' },
    schedule: { startTime: new Date().toISOString(), duration: 90 },
    questions: mockQuestions,
    statistics: { totalQuestions: mockQuestions.length, totalScore: mockQuestions.reduce((s, q) => s + q.score, 0) }
  }
  
  // 启动倒计时
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      ElMessage.warning('考试时间已到，自动提交')
      submitExam()
    }
  }, 1000)
}

onMounted(() => loadExamData())
onBeforeUnmount(() => clearInterval(timerInterval))
</script>

<style lang="scss" scoped>
.exam-detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
  overflow: hidden;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    .exam-title { font-size: 18px; font-weight: 600; color: #303133; margin: 0; }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;
    .exam-meta { display: flex; gap: 16px; font-size: 13px; color: #606266; }
    .timer { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #e6a23c; font-weight: 600; }
    .score-display {
      padding: 8px 20px;
      background: #f0f9ff;
      border-radius: 6px;
      .score-value { font-size: 24px; font-weight: 700; color: #409eff; }
      .score-label { font-size: 13px; color: #606266; margin-left: 4px; }
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
  background: #f5f7fa;
}

.question-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;

  .header-main {
    display: flex;
    align-items: center;
    gap: 12px;
    .question-number {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #409eff, #5cadff);
      color: white; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600;
    }
    .question-type { padding: 6px 14px; background: #ecf5ff; color: #409eff; border-radius: 4px; font-size: 13px; }
    .question-score { color: #e6a23c; font-weight: 600; }
  }
}

.question-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;

  .question-text { font-size: 16px; line-height: 1.8; color: #303133; margin-bottom: 24px; }

  .options {
    :deep(.el-radio-group), :deep(.el-checkbox-group) { display: flex; flex-direction: column; gap: 12px; }
    :deep(.el-radio), :deep(.el-checkbox) {
      display: flex; align-items: flex-start; padding: 14px; margin: 0;
      border: 2px solid #e4e7ed; border-radius: 6px; height: auto; white-space: normal;
      &:hover { border-color: #409eff; background: #f5f7fa; }
      &.is-checked { border-color: #409eff; background: #ecf5ff; }
    }
    .option-label { font-weight: 600; color: #606266; margin-right: 8px; }
    .option-text { color: #303133; line-height: 1.6; }
  }

  .fill-input, .essay-input, .programming-input {
    :deep(.el-textarea__inner) {
      font-size: 14px;
      line-height: 1.6;
    }
  }

  .answer-display .answer-section {
    margin-bottom: 20px;
    .section-label {
      display: flex; align-items: center; gap: 6px;
      margin-bottom: 12px; font-size: 14px; font-weight: 600; color: #606266;
      &.correct { color: #67c23a; }
    }
    .answer-value {
      padding: 12px 16px; background: #f5f7fa; border: 2px solid #e4e7ed; border-radius: 6px;
      &.correct { border-color: #67c23a; background: #f0f9eb; }
      &.wrong { border-color: #f56c6c; background: #fef0f0; }
      pre { margin: 0; font-family: 'Courier New', monospace; white-space: pre-wrap; }
    }
  }
}

.question-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
}

.answer-card {
  width: 280px;
  background: white;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .card-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
    h3 { font-size: 16px; font-weight: 600; color: #303133; margin: 0 0 8px 0; }
    .progress-info { font-size: 13px; color: #606266; }
  }

  .card-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    .card-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      .card-item {
        aspect-ratio: 1;
        display: flex; align-items: center; justify-content: center;
        background: #f5f7fa; border: 2px solid #e4e7ed; border-radius: 6px;
        font-size: 14px; font-weight: 600; color: #606266; cursor: pointer;
        &:hover { border-color: #409eff; color: #409eff; }
        &.answered { background: #67c23a; border-color: #67c23a; color: white; }
        &.active { background: #409eff; border-color: #409eff; color: white; }
      }
    }
  }

  .card-footer { padding: 16px; border-top: 1px solid #e4e7ed; }
}

@media (max-width: 768px) {
  .exam-body { flex-direction: column; }
  .answer-card { width: 100%; max-height: 200px; }
}
</style>
