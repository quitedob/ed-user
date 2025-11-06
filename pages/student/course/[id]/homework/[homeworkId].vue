<template>
  <div class="homework-detail-page">
    <!-- 顶部导航栏 -->
    <div class="homework-header">
      <div class="header-left">
        <h1 class="homework-title">{{ homeworkInfo.basicInfo.title }}</h1>
        <div class="homework-meta">
          <span>总分：{{ homeworkInfo.statistics.totalScore }}分</span>
          <span>题目数：{{ homeworkInfo.statistics.totalQuestions }}题</span>
          <span v-if="homeworkInfo.schedule.dueDate">截止时间：{{ formatDate(homeworkInfo.schedule.dueDate) }}</span>
        </div>
      </div>
      <div class="header-right">
        <div v-if="isCompleted" class="score-display">
          <span class="score-value">{{ userScore }}</span>
          <span class="score-label">分</span>
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="homework-body">
      <!-- 左侧答题区 -->
      <div class="answer-area" ref="answerAreaRef">
        <!-- 遍历所有题目 -->
        <div
          v-for="(question, index) in homeworkInfo.questions"
          :key="question.id"
          :id="`question-${index}`"
          class="question-block"
        >
          <div class="question-header">
            <span class="question-number">{{ index + 1 }}</span>
            <span class="question-type">{{ getQuestionTypeText(question.type) }}</span>
            <span class="question-score">{{ question.score }}分</span>
          </div>

          <div class="question-content">
            <div class="question-text" v-html="question.questionText"></div>

            <!-- 单选题 -->
            <div v-if="question.type === 'single'" class="options">
              <!-- 未完成：显示选项 -->
              <div v-if="!isCompleted" class="options-container">
                <el-radio-group v-model="question.userAnswer">
                  <el-radio
                    v-for="option in question.options"
                    :key="option.id"
                    :label="option.value"
                    class="option-item"
                  >
                    <span class="option-label">{{ option.value }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                  </el-radio>
                </el-radio-group>
              </div>

              <!-- 已完成：显示答案和评分 -->
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label">
                    <el-icon><Check /></el-icon>
                    <span>正确答案</span>
                  </div>
                  <div class="correct-answer">{{ question.correctAnswer }}</div>
                </div>
                <div v-if="question.userAnswer" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="user-answer" :class="{ correct: question.userAnswer === question.correctAnswer, wrong: question.userAnswer !== question.correctAnswer }">
                    {{ question.userAnswer }}
                    <el-icon v-if="question.userAnswer !== question.correctAnswer" class="wrong-icon"><Close /></el-icon>
                  </div>
                </div>
                <div v-if="question.explanation" class="explanation">
                  <div class="section-label">
                    <span>解析</span>
                  </div>
                  <div class="explanation-text">{{ question.explanation }}</div>
                </div>
              </div>
            </div>

            <!-- 多选题 -->
            <div v-else-if="question.type === 'multiple'" class="options">
              <!-- 未完成：显示选项 -->
              <div v-if="!isCompleted" class="options-container">
                <el-checkbox-group v-model="question.userAnswer">
                  <el-checkbox
                    v-for="option in question.options"
                    :key="option.id"
                    :label="option.value"
                    class="option-item"
                  >
                    <span class="option-label">{{ option.value }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <!-- 已完成：显示答案和评分 -->
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label">
                    <el-icon><Check /></el-icon>
                    <span>正确答案</span>
                  </div>
                  <div class="correct-answer">{{ question.correctAnswers.join(', ') }}</div>
                </div>
                <div v-if="question.userAnswer && question.userAnswer.length > 0" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="user-answer" :class="{ correct: isMultipleCorrect(question), wrong: !isMultipleCorrect(question) }">
                    {{ question.userAnswer.join(', ') }}
                    <el-icon v-if="!isMultipleCorrect(question)" class="wrong-icon"><Close /></el-icon>
                  </div>
                </div>
                <div v-if="question.explanation" class="explanation">
                  <div class="section-label">
                    <span>解析</span>
                  </div>
                  <div class="explanation-text">{{ question.explanation }}</div>
                </div>
              </div>
            </div>

            <!-- 填空题 -->
            <div v-else-if="question.type === 'fill'" class="fill-question">
              <!-- 未完成：显示输入框 -->
              <div v-if="!isCompleted" class="fill-input">
                <el-input
                  v-model="question.userAnswer"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入答案"
                  maxlength="500"
                  show-word-limit
                />
              </div>

              <!-- 已完成：显示答案和评分 -->
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label">
                    <el-icon><Check /></el-icon>
                    <span>正确答案</span>
                  </div>
                  <div class="correct-answer">{{ question.correctAnswers.join(' 或 ') }}</div>
                </div>
                <div v-if="question.userAnswer" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="user-answer">{{ question.userAnswer }}</div>
                </div>
              </div>
            </div>

            <!-- 问答题 -->
            <div v-else-if="question.type === 'essay'" class="essay-question">
              <!-- 未完成：显示富文本编辑器 -->
              <div v-if="!isCompleted" class="essay-input">
                <el-input
                  v-model="question.userAnswer"
                  type="textarea"
                  :rows="8"
                  placeholder="请输入答案..."
                  maxlength="2000"
                  show-word-limit
                />
              </div>

              <!-- 已完成：显示答案和评分 -->
              <div v-else class="answer-display">
                <div v-if="question.referenceAnswer" class="answer-section">
                  <div class="section-label">
                    <el-icon><Check /></el-icon>
                    <span>参考答案</span>
                  </div>
                  <div class="reference-answer" v-html="question.referenceAnswer"></div>
                </div>
                <div v-if="question.userAnswer" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="user-answer" v-html="question.userAnswer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部提交按钮 -->
        <div v-if="!isCompleted" class="submit-section">
          <el-button @click="goBack">返回</el-button>
          <el-button type="primary" size="large" @click="handleSubmit">
            提交作业
          </el-button>
        </div>
        <div v-else class="submit-section">
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>

      <!-- 右侧题目导航 -->
      <div class="question-nav">
        <div class="nav-header">
          <h3>答题卡</h3>
          <div class="progress-info">
            <span>已答：{{ answeredCount }}/{{ homeworkInfo.statistics.totalQuestions }}</span>
          </div>
        </div>

        <div class="nav-content">
          <div class="question-grid">
            <div
              v-for="(question, index) in homeworkInfo.questions"
              :key="question.id"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'

// 页面元数据配置
definePageMeta({
  title: '作业详情',
  layout: 'learning'
})

console.log('🔴 homework/[homeworkId].vue 页面已初始化 - 路径:', window.location.pathname)

// 路由相关
const route = useRoute()
const router = useRouter()

// 计算路由参数
const courseId = computed(() => {
  const id = route.params.id && !isNaN(parseInt(route.params.id)) ? parseInt(route.params.id) : 1
  console.log('作业详情页 - courseId:', id, '原始值:', route.params.id)
  return id
})
const homeworkId = computed(() => {
  const id = route.params.homeworkId && !isNaN(parseInt(route.params.homeworkId)) ? parseInt(route.params.homeworkId) : 1
  console.log('作业详情页 - homeworkId:', id, '原始值:', route.params.homeworkId)
  return id
})

// 引用
const answerAreaRef = ref(null)

// 作业信息 - 完全采用JSON格式规范
const homeworkInfo = ref({
  id: `homework_${homeworkId.value.toString().padStart(3, '0')}`,
  type: 'homework',
  metadata: {
    version: '1.0',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'teacher_001',
    courseId: courseId.value
  },
  basicInfo: {
    title: '',
    description: '',
    type: 'exercise',
    difficulty: 'easy'
  },
  schedule: {
    releaseDate: '2024-09-01T00:00:00Z',
    dueDate: '2024-12-31T23:59:59Z',
    remindDate: '2024-12-30T12:00:00Z'
  },
  questions: [],
  settings: {
    allowLateSubmission: true,
    latePenalty: 5,
    randomOrder: false,
    immediateGrading: true,
    showCorrectAnswers: true,
    reviewAfterSubmit: true
  },
  statistics: {
    totalQuestions: 0,
    totalScore: 0,
    submissionCount: 25,
    averageScore: 28,
    completionRate: 92
  }
})

// 状态
const isCompleted = ref(false)
const userScore = ref(0)
const activeQuestion = ref(0)

// 计算已答题数
const answeredCount = computed(() => {
  return homeworkInfo.value.questions.filter(q => isAnswered(q)).length
})

// 判断题目是否已答
const isAnswered = (question) => {
  if (!question.userAnswer) {
    return false
  }
  
  if (question.type === 'single') {
    return question.userAnswer !== null && question.userAnswer !== ''
  } else if (question.type === 'multiple') {
    return Array.isArray(question.userAnswer) && question.userAnswer.length > 0
  } else {
    return typeof question.userAnswer === 'string' && question.userAnswer.trim() !== ''
  }
}

// 获取题型文本
const getQuestionTypeText = (type) => {
  const typeMap = {
    single: '单选题',
    multiple: '多选题',
    fill: '填空题',
    essay: '问答题'
  }
  return typeMap[type] || '未知题型'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 判断多选题是否正确
const isMultipleCorrect = (question) => {
  if (!question.userAnswer || !question.correctAnswers) return false
  const userAnswers = [...question.userAnswer].sort()
  const correctAnswers = [...question.correctAnswers].sort()
  return JSON.stringify(userAnswers) === JSON.stringify(correctAnswers)
}

// 滚动到指定题目
const scrollToQuestion = (index) => {
  activeQuestion.value = index
  const element = document.getElementById(`question-${index}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 返回
const goBack = () => {
  router.push(`/student/course/${courseId.value}/homework`)
}

// 提交作业处理
const handleSubmit = () => {
  const unansweredCount = homeworkInfo.value.statistics.totalQuestions - answeredCount.value

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
      submitHomework()
    }).catch(() => {
      // 用户取消提交
    })
  } else {
    ElMessageBox.confirm(
      '确定要提交作业吗？提交后将无法修改。',
      '提示',
      {
        confirmButtonText: '确定提交',
        cancelButtonText: '再检查一下',
        type: 'warning'
      }
    ).then(() => {
      submitHomework()
    }).catch(() => {
      // 用户取消提交
    })
  }
}

// 执行提交
const submitHomework = () => {
  // 计算得分
  let totalScore = 0
  
  homeworkInfo.value.questions.forEach(question => {
    if (question.type === 'single') {
      if (question.userAnswer === question.correctAnswer) {
        totalScore += question.score
      }
    } else if (question.type === 'multiple') {
      if (isMultipleCorrect(question)) {
        totalScore += question.score
      }
    } else if (question.type === 'fill') {
      // 填空题简单判断（实际应该更复杂）
      if (question.userAnswer && question.correctAnswers.some(ans => 
        question.userAnswer.toLowerCase().includes(ans.toLowerCase())
      )) {
        totalScore += question.score
      }
    } else if (question.type === 'essay') {
      // 问答题需要人工评分，这里给满分
      totalScore += question.score
    }
  })

  userScore.value = totalScore
  isCompleted.value = true

  // 保存到localStorage
  try {
    const completed = localStorage.getItem('completedHomework')
    let completedIds = completed ? JSON.parse(completed) : []
    if (!completedIds.includes(homeworkId.value)) {
      completedIds.push(homeworkId.value)
      localStorage.setItem('completedHomework', JSON.stringify(completedIds))
    }

    // 保存答题数据
    const homeworkData = {
      homeworkId: homeworkId.value,
      answers: homeworkInfo.value.questions.map(q => ({
        questionId: q.id,
        userAnswer: q.userAnswer,
        score: q.score
      })),
      totalScore: totalScore,
      submittedAt: new Date().toISOString()
    }
    localStorage.setItem(`homework_${homeworkId.value}_data`, JSON.stringify(homeworkData))
  } catch (error) {
    console.error('保存作业数据失败:', error)
  }

  ElMessage.success(`作业提交成功！得分：${totalScore}分`)

  // 滚动到顶部
  if (answerAreaRef.value) {
    answerAreaRef.value.scrollTop = 0
  }
}

// 加载作业数据 - 完全采用JSON格式规范
const loadHomeworkData = () => {
  console.log('加载作业数据 - homeworkId:', homeworkId.value, 'courseId:', courseId.value)

  // 根据homeworkId生成不同的作业数据
  const homeworkTemplates = {
    1: {
      basicInfo: {
        title: '第一周作业 - 软件工程基础',
        description: '完成软件工程基本概念的练习题，包括单选题、多选题、填空题和问答题',
        type: 'exercise',
        difficulty: 'easy'
      },
      questions: [
        {
          id: 'question_001',
          type: 'single',
          questionText: '什么是软件工程的三要素？',
          score: 5,
          difficulty: 'easy',
          order: 1,
          options: [
            { id: 'opt_a', value: 'A', text: '方法、工具、过程' },
            { id: 'opt_b', value: 'B', text: '代码、文档、测试' },
            { id: 'opt_c', value: 'C', text: '需求、设计、实现' },
            { id: 'opt_d', value: 'D', text: '计划、执行、验收' }
          ],
          correctAnswer: 'A',
          explanation: '软件工程的三要素是方法、工具和过程',
          knowledgePoints: ['软件工程基础'],
          userAnswer: ''
        },
        {
          id: 'question_002',
          type: 'multiple',
          questionText: '软件生命周期包括哪些阶段？',
          score: 10,
          difficulty: 'medium',
          order: 2,
          options: [
            { id: 'opt_a', value: 'A', text: '需求分析' },
            { id: 'opt_b', value: 'B', text: '系统设计' },
            { id: 'opt_c', value: 'C', text: '编码实现' },
            { id: 'opt_d', value: 'D', text: '测试维护' }
          ],
          correctAnswers: ['A', 'B', 'C', 'D'],
          explanation: '软件生命周期包括需求分析、系统设计、编码实现和测试维护等阶段',
          knowledgePoints: ['软件生命周期'],
          userAnswer: []
        },
        {
          id: 'question_003',
          type: 'fill',
          questionText: '软件工程的目标是提高软件的___和___。',
          score: 5,
          difficulty: 'easy',
          order: 3,
          correctAnswers: ['质量', '可维护性'],
          knowledgePoints: ['软件工程基础'],
          userAnswer: ''
        },
        {
          id: 'question_004',
          type: 'essay',
          questionText: '请简述瀑布模型和敏捷开发的主要区别。',
          score: 15,
          difficulty: 'hard',
          order: 4,
          referenceAnswer: '瀑布模型是线性顺序的开发方法，强调文档和计划；敏捷开发是迭代增量的开发方法，强调快速响应变化和持续交付。',
          knowledgePoints: ['开发模型'],
          userAnswer: ''
        }
      ]
    },
    2: {
      basicInfo: {
        title: '第二周作业 - 需求分析',
        description: '完成需求分析相关的练习题',
        type: 'exercise',
        difficulty: 'medium'
      },
      questions: [
        {
          id: 'question_005',
          type: 'single',
          questionText: '需求获取的最主要方法是？',
          score: 5,
          difficulty: 'easy',
          order: 1,
          options: [
            { id: 'opt_a', value: 'A', text: '查阅文档' },
            { id: 'opt_b', value: 'B', text: '访谈用户' },
            { id: 'opt_c', value: 'C', text: '代码分析' },
            { id: 'opt_d', value: 'D', text: '测试验证' }
          ],
          correctAnswer: 'B',
          explanation: '访谈用户是获取需求最直接有效的方法',
          knowledgePoints: ['需求获取'],
          userAnswer: ''
        },
        {
          id: 'question_006',
          type: 'fill',
          questionText: '数据流图用于描述系统的___变换。',
          score: 8,
          difficulty: 'medium',
          order: 2,
          correctAnswers: ['数据'],
          knowledgePoints: ['需求分析'],
          userAnswer: ''
        }
      ]
    }
  }

  // 获取当前作业的模板数据
  const template = homeworkTemplates[homeworkId.value] || homeworkTemplates[1]

  // 构建完整的JSON格式作业数据
  const mockData = {
    id: `homework_${homeworkId.value.toString().padStart(3, '0')}`,
    type: 'homework',
    metadata: {
      version: '1.0',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      createdBy: 'teacher_001',
      courseId: courseId.value
    },
    basicInfo: {
      ...template.basicInfo,
      type: 'exercise',
      difficulty: template.basicInfo.difficulty
    },
    schedule: {
      releaseDate: '2024-09-01T00:00:00Z',
      dueDate: '2024-12-31T23:59:59Z',
      remindDate: '2024-12-30T12:00:00Z'
    },
    questions: template.questions,
    settings: {
      allowLateSubmission: true,
      latePenalty: 5,
      randomOrder: false,
      immediateGrading: true,
      showCorrectAnswers: true,
      reviewAfterSubmit: true
    },
    statistics: {
      totalQuestions: template.questions.length,
      totalScore: template.questions.reduce((sum, q) => sum + q.score, 0),
      submissionCount: 25,
      averageScore: 28,
      completionRate: 92
    }
  }

  homeworkInfo.value = mockData
  console.log('作业数据加载完成:', homeworkInfo.value)

  // 检查是否已完成
  try {
    const completed = localStorage.getItem('completedHomework')
    if (completed) {
      const completedIds = JSON.parse(completed)
      if (completedIds.includes(homeworkId.value)) {
        isCompleted.value = true

        // 加载已保存的答题数据
        const savedData = localStorage.getItem(`homework_${homeworkId.value}_data`)
        if (savedData) {
          const data = JSON.parse(savedData)
          userScore.value = data.totalScore

          // 恢复用户答案
          data.answers.forEach(answer => {
            const question = homeworkInfo.value.questions.find(q => q.id === answer.questionId)
            if (question) {
              question.userAnswer = answer.userAnswer
            }
          })
        }
      }
    }
  } catch (error) {
    console.error('加载作业数据失败:', error)
  }
}

// 监听滚动，更新当前题目
let scrollTimeout = null
const handleScroll = () => {
  if (scrollTimeout) {
    return
  }

  scrollTimeout = setTimeout(() => {
    const scrollTop = answerAreaRef.value?.scrollTop || 0
    const questionBlocks = document.querySelectorAll('.question-block')

    for (let i = 0; i < questionBlocks.length; i++) {
      const block = questionBlocks[i]
      const offsetTop = block.offsetTop - 100

      if (scrollTop >= offsetTop) {
        activeQuestion.value = i
      }
    }

    scrollTimeout = null
  }, 100)
}

// 生命周期
onMounted(() => {
  loadHomeworkData()

  // 监听滚动
  if (answerAreaRef.value) {
    answerAreaRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  // 清理滚动超时
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }

  // 移除滚动监听
  if (answerAreaRef.value) {
    answerAreaRef.value.removeEventListener('scroll', handleScroll)
  }
})
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  .header-left {
    flex: 1;

    .homework-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .homework-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #606266;

      span {
        display: flex;
        align-items: center;

        &::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #909399;
          border-radius: 50%;
          margin-right: 8px;
        }

        &:first-child::before {
          display: none;
        }
      }
    }
  }

  .header-right {
    .score-display {
      text-align: center;
      padding: 12px 24px;
      background: #f0f9ff;
      border-radius: 8px;

      .score-value {
        font-size: 32px;
        font-weight: 700;
        color: #409eff;
      }

      .score-label {
        font-size: 14px;
        color: #606266;
        margin-left: 4px;
      }
    }
  }
}

.homework-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.answer-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 4px;

    &:hover {
      background: #909399;
    }
  }
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
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      background: linear-gradient(135deg, #409eff 0%, #5cadff 100%);
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
      font-size: 14px;
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
        width: 100%;
      }

      :deep(.el-radio),
      :deep(.el-checkbox) {
        display: flex;
        align-items: flex-start;
        padding: 12px;
        margin: 0;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        transition: all 0.2s;
        height: auto;
        white-space: normal;

        &:hover {
          border-color: #409eff;
          background: #f5f7fa;
        }

        &.is-checked {
          border-color: #409eff;
          background: #ecf5ff;
        }
      }

      :deep(.el-radio__label),
      :deep(.el-checkbox__label) {
        flex: 1;
        display: flex;
        align-items: flex-start;
        white-space: normal;
        word-wrap: break-word;
      }

      .option-label {
        font-weight: 600;
        color: #606266;
        margin-right: 8px;
      }

      .option-text {
        flex: 1;
        color: #303133;
        line-height: 1.6;
      }
    }

    .answer-display {
      .answer-section {
        margin-bottom: 20px;

        .section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #67c23a;

          .el-icon {
            font-size: 16px;
          }
        }

        .correct-answer,
        .user-answer,
        .reference-answer {
          padding: 12px 16px;
          background: #f0f9ff;
          border: 1px solid #67c23a;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.6;
          color: #303133;
        }

        .user-answer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-color: #e4e7ed;
          background: white;

          &.correct {
            border-color: #67c23a;
            background: #f0f9ff;
          }

          &.wrong {
            border-color: #f56c6c;
            background: #fef0f0;
          }

          .wrong-icon {
            color: #f56c6c;
            font-size: 16px;
          }
        }
      }

      .explanation {
        .section-label {
          color: #909399;
        }

        .explanation-text {
          padding: 12px 16px;
          background: #f5f7fa;
          border: 1px solid #e4e7ed;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.6;
          color: #606266;
        }
      }
    }

    .fill-input,
    .essay-input {
      :deep(.el-textarea__inner) {
        font-size: 14px;
        line-height: 1.6;
      }
    }
  }
}

.submit-section {
  display: flex;
  justify-content: center;
  gap: 16px;
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
}

@media (max-width: 768px) {
  .homework-body {
    flex-direction: column;
  }

  .question-nav {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e4e7ed;
    max-height: 300px;
  }
}
</style>
