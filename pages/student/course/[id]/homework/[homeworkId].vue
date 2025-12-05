<template>
  <div class="homework-detail-page">
    <!-- 顶部导航栏 -->
    <div class="homework-header">
      <div class="header-left">
        <el-button @click="goBack" text>
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1 class="homework-title">{{ homeworkInfo.basicInfo.title }}</h1>
      </div>
      <div class="header-right">
        <div class="homework-meta">
          <span>总分：{{ homeworkInfo.statistics.totalScore }}分</span>
          <span v-if="homeworkInfo.schedule.dueDate">截止：{{ formatDate(homeworkInfo.schedule.dueDate) }}</span>
        </div>
        <div v-if="isCompleted" class="score-display">
          <span class="score-value">{{ userScore }}</span>
          <span class="score-label">分</span>
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="homework-body" :class="{ 'oj-layout': currentQuestion?.type === 'oj' }">
      <!-- OJ 题目左侧：题目描述 -->
      <div v-if="currentQuestion?.type === 'oj'" class="oj-description-panel">
        <div class="panel-content" ref="ojDescriptionRef">
          <OjDescription :question="currentQuestion" />
        </div>
      </div>

      <!-- 中间答题区 -->
      <div class="answer-area" ref="answerAreaRef">
        <div v-if="currentQuestion" class="question-detail">
          <!-- 非 OJ 题目头部 -->
          <div v-if="currentQuestion.type !== 'oj'" class="question-header">
            <div class="header-main">
              <span class="question-number">{{ activeQuestion + 1 }}</span>
              <span class="question-type">{{ getQuestionTypeText(currentQuestion.type) }}</span>
              <span class="question-score">{{ currentQuestion.score }}分</span>
            </div>
            <div class="header-nav">
              <el-button :disabled="activeQuestion === 0" @click="switchQuestion(activeQuestion - 1)" size="small">上一题</el-button>
              <el-button :disabled="activeQuestion === homeworkInfo.questions.length - 1" @click="switchQuestion(activeQuestion + 1)" size="small" type="primary">下一题</el-button>
            </div>
          </div>

          <!-- 题目内容 -->
          <div class="question-content" :class="{ 'oj-content': currentQuestion.type === 'oj' }">
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

            <!-- OJ 编程题 -->
            <div v-else-if="currentQuestion.type === 'oj'" class="question-oj">
              <OjQuestion :question="currentQuestion" :completed="isCompleted" @run="handleRunCode" @submit-code="handleSubmitCode" />
            </div>
          </div>

          <!-- 底部操作按钮 -->
          <div v-if="currentQuestion.type !== 'oj'" class="question-footer">
            <el-button :disabled="activeQuestion === 0" @click="switchQuestion(activeQuestion - 1)">上一题</el-button>
            <el-button v-if="activeQuestion < homeworkInfo.questions.length - 1" type="primary" @click="switchQuestion(activeQuestion + 1)">下一题</el-button>
            <el-button v-else-if="!isCompleted" type="success" @click="handleSubmit">提交作业</el-button>
          </div>
        </div>
      </div>

      <!-- 右侧答题卡 -->
      <div class="answer-card">
        <div class="card-header">
          <h3>答题卡</h3>
          <div class="progress-info">已答：{{ answeredCount }}/{{ homeworkInfo.statistics.totalQuestions }}</div>
        </div>
        <div class="card-content">
          <div class="card-grid">
            <div v-for="(q, idx) in homeworkInfo.questions" :key="q.id" class="card-item" :class="{ answered: isAnswered(q), active: activeQuestion === idx }" @click="switchQuestion(idx)">{{ idx + 1 }}</div>
          </div>
        </div>
        <div v-if="!isCompleted" class="card-footer">
          <el-button type="primary" size="large" @click="handleSubmit" style="width: 100%">提交作业</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close, ArrowLeft } from '@element-plus/icons-vue'
import OjDescription from '~/components/Question/OjDescription.vue'
import OjQuestion from '~/components/Question/OjQuestion.vue'

definePageMeta({ title: '作业详情', layout: 'learning' })

const route = useRoute()
const router = useRouter()
const courseId = computed(() => parseInt(route.params.id) || 1)
const homeworkId = computed(() => parseInt(route.params.homeworkId) || 1)

const answerAreaRef = ref(null)
const ojDescriptionRef = ref(null)
const isCompleted = ref(false)
const userScore = ref(0)
const activeQuestion = ref(0)

const homeworkInfo = ref({
  basicInfo: { title: '', description: '' },
  schedule: { dueDate: '' },
  questions: [],
  statistics: { totalQuestions: 0, totalScore: 0 }
})

const currentQuestion = computed(() => homeworkInfo.value.questions[activeQuestion.value])
const answeredCount = computed(() => homeworkInfo.value.questions.filter(q => isAnswered(q)).length)

const isAnswered = (q) => {
  if (!q.userAnswer) return false
  if (q.type === 'multiple') return Array.isArray(q.userAnswer) && q.userAnswer.length > 0
  return typeof q.userAnswer === 'string' && q.userAnswer.trim() !== ''
}

const getQuestionTypeText = (type) => ({ single: '单选题', multiple: '多选题', fill: '填空题', essay: '问答题', oj: '编程题' }[type] || '未知')
const formatDate = (str) => str ? new Date(str).toLocaleString('zh-CN') : ''
const isMultipleCorrect = (q) => q.userAnswer && q.correctAnswers && JSON.stringify([...q.userAnswer].sort()) === JSON.stringify([...q.correctAnswers].sort())

const switchQuestion = (idx) => {
  if (idx >= 0 && idx < homeworkInfo.value.questions.length) activeQuestion.value = idx
}

const goBack = () => router.push(`/student/course/${courseId.value}/homework`)
const handleRunCode = () => ElMessage.info('运行代码功能开发中...')

const handleSubmitCode = () => {
  if (!currentQuestion.value.userAnswer?.trim()) return ElMessage.warning('请先编写代码')
  ElMessageBox.confirm('确定要提交代码吗？', '提示', { type: 'warning' }).then(() => {
    const tc = currentQuestion.value.testCases || []
    const passed = Math.floor(Math.random() * (tc.length + 1))
    tc.forEach((t, i) => { t.passed = i < passed; t.userOutput = t.passed ? t.output : 'Wrong' })
    currentQuestion.value.earnedScore = Math.floor(currentQuestion.value.score * passed / (tc.length || 1))
    currentQuestion.value.result = passed === tc.length ? 'Accepted' : 'Wrong Answer'
    ElMessage.success('代码提交成功！')
  }).catch(() => {})
}

const handleSubmit = () => {
  const unanswered = homeworkInfo.value.statistics.totalQuestions - answeredCount.value
  ElMessageBox.confirm(unanswered > 0 ? `还有 ${unanswered} 道题未作答，确定提交？` : '确定提交作业？', '提示', { type: 'warning' })
    .then(() => submitHomework()).catch(() => {})
}

const submitHomework = () => {
  let total = 0
  homeworkInfo.value.questions.forEach(q => {
    if (q.type === 'single' && q.userAnswer === q.correctAnswer) total += q.score
    else if (q.type === 'multiple' && isMultipleCorrect(q)) total += q.score
    else if (q.type === 'fill' && q.correctAnswers?.some(a => q.userAnswer?.toLowerCase().includes(a.toLowerCase()))) total += q.score
    else if (q.type === 'essay') total += q.score
    else if (q.type === 'oj' && q.userAnswer?.trim()) {
      const tc = q.testCases || [], passed = Math.floor(Math.random() * (tc.length + 1))
      tc.forEach((t, i) => { t.passed = i < passed; t.userOutput = t.passed ? t.output : 'Wrong' })
      q.earnedScore = Math.floor(q.score * passed / (tc.length || 1))
      q.result = passed === tc.length ? 'Accepted' : 'Wrong Answer'
      total += q.earnedScore
    }
  })
  userScore.value = total
  isCompleted.value = true
  ElMessage.success(`作业提交成功！得分：${total}分`)
}

const loadHomeworkData = () => {
  const mockQuestions = [
    { id: 'q1', type: 'single', questionText: '什么是软件工程的三要素？', score: 5, options: [{ id: 'a', value: 'A', text: '方法、工具、过程' }, { id: 'b', value: 'B', text: '代码、文档、测试' }, { id: 'c', value: 'C', text: '需求、设计、实现' }, { id: 'd', value: 'D', text: '计划、执行、验收' }], correctAnswer: 'A', userAnswer: '' },
    { id: 'q2', type: 'multiple', questionText: '软件生命周期包括哪些阶段？', score: 10, options: [{ id: 'a', value: 'A', text: '需求分析' }, { id: 'b', value: 'B', text: '系统设计' }, { id: 'c', value: 'C', text: '编码实现' }, { id: 'd', value: 'D', text: '测试维护' }], correctAnswers: ['A', 'B', 'C', 'D'], userAnswer: [] },
    { id: 'q3', type: 'oj', title: 'A. Array Sum', description: '给定一个整数数组，求所有元素的和。', input: '第一行包含整数 n，第二行包含 n 个整数。', output: '输出所有元素的和。', examples: '输入:\n3\n1 2 3\n\n输出:\n6', hint: '注意整数溢出。', timeLimit: 1000, memoryLimit: 128, score: 20, difficulty: 2, tags: [{ id: 't1', name: 'array', color: '#409EFF' }], testCases: [{ id: 'c1', input: '3\n1 2 3', output: '6', sample: true }, { id: 'c2', input: '5\n-1 2 -3 4 0', output: '2', sample: true }], language: 'cpp', userAnswer: '', result: null, earnedScore: 0 }
  ]
  homeworkInfo.value = {
    basicInfo: { title: '第一周作业 - 软件工程基础', description: '' },
    schedule: { dueDate: '2024-12-31T23:59:59Z' },
    questions: mockQuestions,
    statistics: { totalQuestions: mockQuestions.length, totalScore: mockQuestions.reduce((s, q) => s + q.score, 0) }
  }
}

onMounted(() => loadHomeworkData())
</script>


<style lang="scss" scoped>
.homework-detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
  overflow: hidden;
}

.homework-header {
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
    .homework-title { font-size: 18px; font-weight: 600; color: #303133; margin: 0; }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;
    .homework-meta { display: flex; gap: 16px; font-size: 13px; color: #606266; }
    .score-display {
      padding: 8px 20px;
      background: #f0f9ff;
      border-radius: 6px;
      .score-value { font-size: 24px; font-weight: 700; color: #409eff; }
      .score-label { font-size: 13px; color: #606266; margin-left: 4px; }
    }
  }
}

.homework-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  &.oj-layout .answer-area { flex: 1; background: #1e1e1e; }
}

.oj-description-panel {
  width: 480px;
  background: #f8f9fa;
  border-right: 1px solid #e4e7ed;
  flex-shrink: 0;
  .panel-content { height: 100%; overflow-y: auto; padding: 20px; }
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
  .oj-layout & { max-width: none; margin: 0; padding: 0; height: 100%; display: flex; flex-direction: column; }
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
  &.oj-content { height: 100%; padding: 0; margin: 0; background: transparent; }

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
    }
  }

  .question-oj { height: 100%; display: flex; flex-direction: column; }
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
  .homework-body { flex-direction: column; }
  .oj-description-panel, .answer-card { width: 100%; max-height: 200px; }
}
</style>
