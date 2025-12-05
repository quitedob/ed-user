<template>
  <div class="exam-page">
    <!-- 考试未开始 -->
    <div v-if="!examStarted && !isCompleted" class="exam-start-panel">
      <div class="start-content">
        <el-icon class="start-icon"><EditPen /></el-icon>
        <h2>{{ examInfo.basicInfo.title }}</h2>
        <div class="exam-rules">
          <h3>考试须知</h3>
          <ul>
            <li>考试时长：{{ examInfo.settings.duration }}分钟</li>
            <li>题目数量：{{ examInfo.statistics.totalQuestions }}题</li>
            <li>总分：{{ examInfo.statistics.totalScore }}分</li>
            <li>开始后请勿刷新页面或离开</li>
          </ul>
        </div>
        <el-button type="primary" size="large" @click="startExam">开始考试</el-button>
      </div>
    </div>

    <!-- 考试进行中/已完成 -->
    <QuestionPanel
      v-else
      :title="examInfo.basicInfo.title"
      :questions="examInfo.questions"
      :active-index="activeQuestion"
      :completed="isCompleted"
      :score="userScore"
      :total-score="examInfo.statistics.totalScore"
      submit-text="提交考试"
      @back="goBack"
      @submit="handleSubmit"
      @switch="switchQuestion"
    >
      <template #header-extra>
        <div v-if="examStarted && !isCompleted" class="timer-section">
          <el-icon><Clock /></el-icon>
          <span>剩余：{{ formatTime(remainingTime) }}</span>
        </div>
      </template>
    </QuestionPanel>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EditPen, Clock } from '@element-plus/icons-vue'
import QuestionPanel from '~/components/Question/QuestionPanel.vue'

definePageMeta({ title: '考试', layout: 'learning' })

const route = useRoute()
const router = useRouter()
const classId = computed(() => {
  const classIdFromQuery = route.query.classId
  if (classIdFromQuery) {
    return classIdFromQuery
  }
  // If no classId in query, try to get it from referrer or use a default that exists
  const classIds = ['class_001', 'class_002', 'class_003', 'class_004']
  return classIds.includes(route.params.id) ? route.params.id : 'class_003'
})

const examStarted = ref(false)
const isCompleted = ref(false)
const userScore = ref(0)
const activeQuestion = ref(0)
const remainingTime = ref(0)
let timerInterval = null

const examInfo = ref({
  basicInfo: { title: '' },
  settings: { duration: 120 },
  questions: [],
  statistics: { totalQuestions: 0, totalScore: 0 }
})

const formatTime = (s) => { const m = Math.floor(s / 60), sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}` }
const goBack = () => {
  const goBackAction = () => {
    clearInterval(timerInterval)
    const targetPath = `/student/class/${classId.value}/exams`
    router.push(targetPath)
  }

  if (examStarted.value && !isCompleted.value) {
    ElMessageBox.confirm('考试进行中，确定离开？', '提示', { type: 'warning' })
      .then(() => goBackAction())
      .catch(() => {})
  } else {
    goBackAction()
  }
}
const switchQuestion = (i) => { activeQuestion.value = i }

const startExam = () => {
  examStarted.value = true
  remainingTime.value = examInfo.value.settings.duration * 60
  timerInterval = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) { clearInterval(timerInterval); ElMessage.warning('时间到！'); submitExam() }
  }, 1000)
}

const handleSubmit = () => {
  ElMessageBox.confirm('确定提交考试？', '提示', { type: 'warning' }).then(() => submitExam()).catch(() => {})
}

const submitExam = () => {
  clearInterval(timerInterval)
  let score = 0
  examInfo.value.questions.forEach(q => {
    if (q.type === 'single' || q.type === 'judge') { if (q.userAnswer === q.correctAnswer) score += q.score }
    else if (q.type === 'multiple') { if (JSON.stringify([...(q.userAnswer || [])].sort()) === JSON.stringify([...q.correctAnswers].sort())) score += q.score }
    else if (q.type === 'fill') { if (q.userAnswer && q.correctAnswers?.some(a => q.userAnswer.toLowerCase().includes(a.toLowerCase()))) score += q.score }
    else if (q.type === 'essay') { score += Math.floor(q.score * 0.8) }
    else if (q.type === 'oj' && q.userAnswer?.trim()) { score += Math.floor(q.score * 0.7) }
  })
  userScore.value = score
  isCompleted.value = true
  ElMessage.success(`考试提交成功！得分：${score}分`)
}

// 考试数据JSON格式规范
const loadExamData = async () => {
  const examId = route.params.id

  // 动态加载不同的考试数据
  const examTemplates = {
    1: {
      id: 'exam_001',
      type: 'exam',
      basicInfo: { title: '软件工程期中考试', description: '软件工程期中测试' },
      settings: { duration: 120, allowReview: true },
      questions: [
        { id: 'q1', type: 'single', questionText: '软件工程的核心目标是什么？', score: 5, options: [{ id: 'a', value: 'A', text: '提高开发速度' }, { id: 'b', value: 'B', text: '降低开发成本' }, { id: 'c', value: 'C', text: '提高软件质量和可维护性' }, { id: 'd', value: 'D', text: '增加代码量' }], correctAnswer: 'C', userAnswer: '' },
        { id: 'q2', type: 'multiple', questionText: '软件生命周期包括哪些阶段？', score: 10, options: [{ id: 'a', value: 'A', text: '需求分析' }, { id: 'b', value: 'B', text: '系统设计' }, { id: 'c', value: 'C', text: '编码实现' }, { id: 'd', value: 'D', text: '测试维护' }], correctAnswers: ['A', 'B', 'C', 'D'], userAnswer: [] },
        { id: 'q3', type: 'judge', questionText: '瀑布模型是一种迭代式的软件开发模型。', score: 5, correctAnswer: 'false', userAnswer: '' },
        { id: 'q4', type: 'fill', questionText: '软件工程的三要素是方法、工具和______。', score: 5, correctAnswers: ['过程', '流程'], userAnswer: '' },
        { id: 'q5', type: 'essay', questionText: '请简述敏捷开发的核心原则。', score: 15, referenceAnswer: '敏捷开发强调个体和互动高于流程和工具...', userAnswer: '' },
        { id: 'q6', type: 'oj', title: '数组求和', description: '给定整数数组，求和。', input: '第一行n，第二行n个整数', output: '输出和', examples: '输入:\n3\n1 2 3\n输出:\n6', timeLimit: 1000, memoryLimit: 128, score: 20, language: 'cpp', userAnswer: '' }
      ]
    }
  }

  const examData = examTemplates[examId] || examTemplates[1]

  examInfo.value = {
    ...examData,
    statistics: { totalQuestions: examData.questions.length, totalScore: examData.questions.reduce((s, q) => s + q.score, 0) }
  }
}

onMounted(() => loadExamData())
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval) })
</script>

<style lang="scss" scoped>
.exam-page { height: 100vh; background: #f5f7fa; }
.exam-start-panel {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .start-content {
    text-align: center;
    padding: 48px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    .start-icon { font-size: 64px; color: #409eff; margin-bottom: 24px; }
    h2 { font-size: 24px; color: #303133; margin-bottom: 24px; }
    .exam-rules {
      text-align: left;
      margin-bottom: 32px;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 8px;
      h3 { font-size: 16px; margin-bottom: 12px; }
      ul { margin: 0; padding-left: 20px; li { line-height: 2; color: #606266; } }
    }
  }
}
.timer-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fef0f0;
  border-radius: 8px;
  color: #f56c6c;
  font-weight: 600;
}
</style>
