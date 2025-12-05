<template>
  <QuestionPanel
    :title="homeworkInfo.basicInfo.title"
    :questions="homeworkInfo.questions"
    :active-index="activeQuestion"
    :completed="isCompleted"
    :score="userScore"
    :total-score="homeworkInfo.statistics.totalScore"
    :deadline="homeworkInfo.schedule.dueDate"
    submit-text="提交作业"
    @back="goBack"
    @submit="handleSubmit"
    @switch="switchQuestion"
    @run-code="handleRunCode"
    @submit-code="handleSubmitCode"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import QuestionPanel from '~/components/Question/QuestionPanel.vue'

definePageMeta({ title: '作业详情', layout: 'learning' })

const route = useRoute()
const router = useRouter()
const classId = computed(() => route.query.classId || 'class_002')
const homeworkId = computed(() => parseInt(route.params.id) || 1)

const homeworkInfo = ref({
  basicInfo: { title: '' },
  schedule: { dueDate: '' },
  questions: [],
  statistics: { totalQuestions: 0, totalScore: 0 }
})

const isCompleted = ref(false)
const userScore = ref(0)
const activeQuestion = ref(0)

const goBack = () => router.push(`/student/class/${classId.value}/homeworks`)
const switchQuestion = (i) => { activeQuestion.value = i }
const handleRunCode = () => ElMessage.info('运行代码功能开发中...')
const handleSubmitCode = () => ElMessage.success('代码已保存')

const handleSubmit = () => {
  ElMessageBox.confirm('确定要提交作业吗？', '提示', { type: 'warning' }).then(() => {
    let score = 0
    homeworkInfo.value.questions.forEach(q => {
      if (q.type === 'single' || q.type === 'judge') { if (q.userAnswer === q.correctAnswer) score += q.score }
      else if (q.type === 'multiple') { if (JSON.stringify([...(q.userAnswer || [])].sort()) === JSON.stringify([...q.correctAnswers].sort())) score += q.score }
      else if (q.type === 'fill') { if (q.userAnswer && q.correctAnswers?.some(a => q.userAnswer.toLowerCase().includes(a.toLowerCase()))) score += q.score }
      else if (q.type === 'essay') { score += Math.floor(q.score * 0.8) }
      else if (q.type === 'oj' && q.userAnswer?.trim()) { score += Math.floor(q.score * 0.7) }
    })
    userScore.value = score
    isCompleted.value = true
    ElMessage.success(`作业提交成功！得分：${score}分`)
  }).catch(() => {})
}

// 作业数据JSON格式规范
const loadHomeworkData = () => {
  const homeworkData = {
    1: {
      id: 'homework_001',
      type: 'homework',
      basicInfo: { title: '第一周作业 - 软件工程基础', description: '完成软件工程基本概念的练习题' },
      schedule: { dueDate: '2024-12-31T23:59:59Z' },
      questions: [
        { id: 'q1', type: 'single', questionText: '什么是软件工程的三要素？', score: 5, options: [{ id: 'a', value: 'A', text: '方法、工具、过程' }, { id: 'b', value: 'B', text: '代码、文档、测试' }, { id: 'c', value: 'C', text: '需求、设计、实现' }, { id: 'd', value: 'D', text: '计划、执行、验收' }], correctAnswer: 'A', explanation: '软件工程的三要素是方法、工具和过程', userAnswer: '' },
        { id: 'q2', type: 'multiple', questionText: '软件生命周期包括哪些阶段？', score: 10, options: [{ id: 'a', value: 'A', text: '需求分析' }, { id: 'b', value: 'B', text: '系统设计' }, { id: 'c', value: 'C', text: '编码实现' }, { id: 'd', value: 'D', text: '测试维护' }], correctAnswers: ['A', 'B', 'C', 'D'], explanation: '软件生命周期包括需求分析、系统设计、编码实现和测试维护等阶段', userAnswer: [] },
        { id: 'q3', type: 'judge', questionText: '瀑布模型是一种迭代式的软件开发模型。', score: 5, correctAnswer: 'false', explanation: '瀑布模型是线性顺序模型，不是迭代式的', userAnswer: '' },
        { id: 'q4', type: 'fill', questionText: '软件工程的三要素是方法、工具和______。', score: 5, correctAnswers: ['过程', '流程'], explanation: '软件工程的三要素是方法、工具和过程', userAnswer: '' },
        { id: 'q5', type: 'essay', questionText: '请简述敏捷开发的核心原则。', score: 15, referenceAnswer: '敏捷开发强调：1.个体和互动高于流程和工具；2.可工作的软件高于详尽的文档；3.客户合作高于合同谈判；4.响应变化高于遵循计划。', userAnswer: '' },
        { id: 'q6', type: 'oj', title: '数组求和', description: '给定一个整数数组，求所有元素的和。', input: '第一行n，第二行n个整数', output: '输出和', examples: '输入:\n3\n1 2 3\n输出:\n6', timeLimit: 1000, memoryLimit: 128, score: 20, language: 'cpp', userAnswer: '' }
      ]
    },
    2: {
      id: 'homework_002',
      type: 'homework',
      basicInfo: { title: '第一章作业：软件工程概述', description: '软件工程概述章节作业' },
      schedule: { dueDate: '2024-12-31T23:59:59Z' },
      questions: [
        { id: 'q1', type: 'single', questionText: '软件危机的主要表现不包括以下哪项？', score: 5, options: [{ id: 'a', value: 'A', text: '软件开发成本高' }, { id: 'b', value: 'B', text: '软件质量难以保证' }, { id: 'c', value: 'C', text: '软件运行速度快' }, { id: 'd', value: 'D', text: '软件维护困难' }], correctAnswer: 'C', userAnswer: '' },
        { id: 'q2', type: 'judge', questionText: '软件工程是一门研究用工程化方法构建和维护有效的、实用的和高质量的软件的学科。', score: 5, correctAnswer: 'true', userAnswer: '' },
        { id: 'q3', type: 'multiple', questionText: '软件工程的目标包括哪些？', score: 10, options: [{ id: 'a', value: 'A', text: '可维护性' }, { id: 'b', value: 'B', text: '可靠性' }, { id: 'c', value: 'C', text: '有效性' }, { id: 'd', value: 'D', text: '可理解性' }], correctAnswers: ['A', 'B', 'C', 'D'], userAnswer: [] },
        { id: 'q4', type: 'fill', questionText: '软件生命周期一般分为______、设计、编码、测试和维护五个阶段。', score: 5, correctAnswers: ['需求分析', '分析'], userAnswer: '' },
        { id: 'q5', type: 'essay', questionText: '请简述软件工程的定义及其重要性。', score: 15, referenceAnswer: '软件工程是应用计算机科学、数学及管理科学等原理，以工程化的原则和方法来解决软件问题的工程。', userAnswer: '' }
      ]
    }
  }
  const data = homeworkData[homeworkId.value] || homeworkData[1]
  homeworkInfo.value = {
    ...data,
    statistics: { totalQuestions: data.questions.length, totalScore: data.questions.reduce((s, q) => s + q.score, 0) }
  }
}

onMounted(() => loadHomeworkData())
</script>
