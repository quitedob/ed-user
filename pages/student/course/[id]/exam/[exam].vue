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
        <div class="timer" :class="{ 'timer-warning': remainingTime < 600 }">
          <el-icon><Clock /></el-icon>
          <span>剩余时间：{{ formatTime(remainingTime) }}</span>
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="exam-body">
      <!-- 左侧答题区 -->
      <div class="answer-area" ref="answerAreaRef">
        <!-- 遍历所有题目 -->
        <div
          v-for="(question, index) in examInfo.questions"
          :key="question.id || index"
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
                maxlength="500"
                show-word-limit
              />
            </div>

            <!-- 问答题 -->
            <div v-else-if="question.type === 'essay'" class="essay-answer">
              <el-input
                v-model="question.answer"
                type="textarea"
                :rows="6"
                placeholder="请输入答案"
                maxlength="2000"
                show-word-limit
              />
            </div>
          </div>
        </div>

        <!-- 底部提交按钮 -->
        <div class="submit-section">
          <el-button type="primary" size="large" @click="handleSubmit">
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
              :key="question.id || index"
              class="question-item"
              :class="{
                answered: isAnswered(question),
                active: activeQuestion === index
              }"
              @click="scrollToQuestion(index)"
              :title="`题目 ${index + 1}`"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <div class="nav-footer">
          <el-button type="primary" size="large" @click="handleSubmit" style="width: 100%">
            提交考卷
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'

// 页面元数据配置
definePageMeta({
  title: '考试',
  layout: 'learning'
})

// 路由相关
const route = useRoute()
const router = useRouter()

// 计算路由参数
const courseId = computed(() => parseInt(route.params.id) || 1)
const examId = computed(() => parseInt(route.params.exam) || 1)

// 调试信息
console.log('考试详情页加载', {
  path: route.path,
  params: route.params,
  examId: examId.value
})

// 引用
const answerAreaRef = ref(null)

// 考试信息
const examInfo = ref({
  id: examId.value,
  title: '软件工程期中考试',
  totalScore: 100,
  passScore: 60,
  duration: 90, // 分钟
  questionCount: 0,
  questions: []
})

// 剩余时间（秒）
const remainingTime = ref(5400) // 90分钟 = 5400秒
const activeQuestion = ref(0)

// 定时器
let timer = null
let scrollTimeout = null

// 计算已答题数
const answeredCount = computed(() => {
  return examInfo.value.questions.filter(q => isAnswered(q)).length
})

// 判断题目是否已答
const isAnswered = (question) => {
  if (!question.answer) {
    return false
  }
  
  if (question.type === 'single') {
    return question.answer !== null && question.answer !== ''
  } else if (question.type === 'multiple') {
    return Array.isArray(question.answer) && question.answer.length > 0
  } else {
    return typeof question.answer === 'string' && question.answer.trim() !== ''
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

// 格式化时间
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

// 滚动到指定题目（使用防抖优化）
const scrollToQuestion = (index) => {
  activeQuestion.value = index
  const element = document.getElementById(`question-${index}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 提交考卷处理
const handleSubmit = () => {
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
      submitExam()
    }).catch(() => {
      // 用户取消提交
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
      submitExam()
    }).catch(() => {
      // 用户取消提交
    })
  }
}

// 执行提交
const submitExam = () => {
  // 停止计时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  // 保存到localStorage
  try {
    const completed = localStorage.getItem('completedExams')
    let completedIds = completed ? JSON.parse(completed) : []
    if (!completedIds.includes(examId.value)) {
      completedIds.push(examId.value)
      localStorage.setItem('completedExams', JSON.stringify(completedIds))
    }

    // 保存答题数据
    const examData = {
      examId: examId.value,
      answers: examInfo.value.questions.map(q => ({
        question: q.question,
        type: q.type,
        answer: q.answer,
        score: q.score
      })),
      submittedAt: new Date().toISOString(),
      timeSpent: examInfo.value.duration * 60 - remainingTime.value
    }
    localStorage.setItem(`exam_${examId.value}_data`, JSON.stringify(examData))
  } catch (error) {
    console.error('保存考试数据失败:', error)
  }

  ElMessage.success('考卷提交成功！')

  // 返回考试列表页
  setTimeout(() => {
    router.push(`/student/course/${courseId.value}/exam`)
  }, 1000)
}

// 开始计时
const startTimer = () => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
      
      // 时间低于10分钟时提醒
      if (remainingTime.value === 600) {
        ElMessage.warning('考试还剩10分钟，请注意时间！')
      }
      
      // 时间低于5分钟时再次提醒
      if (remainingTime.value === 300) {
        ElMessage.warning('考试还剩5分钟，请抓紧时间！')
      }
    } else {
      // 时间到，自动提交
      ElMessage.error('考试时间已到，系统将自动提交！')
      submitExam()
    }
  }, 1000)
}

// 加载考试数据
const loadExamData = () => {
  // 模拟考试数据
  const questions = [
    // 单选题
    {
      id: 1,
      type: 'single',
      question: '软件工程的核心目标是什么？',
      score: 2,
      options: [
        { value: 'A', text: '提高开发速度' },
        { value: 'B', text: '降低开发成本' },
        { value: 'C', text: '提高软件质量和可维护性' },
        { value: 'D', text: '增加代码量' }
      ],
      answer: ''
    },
    {
      id: 2,
      type: 'single',
      question: '瀑布模型的主要特点是什么？',
      score: 2,
      options: [
        { value: 'A', text: '迭代开发' },
        { value: 'B', text: '线性顺序开发' },
        { value: 'C', text: '敏捷开发' },
        { value: 'D', text: '原型开发' }
      ],
      answer: ''
    },
    {
      id: 3,
      type: 'single',
      question: '以下哪个不是软件生命周期模型？',
      score: 2,
      options: [
        { value: 'A', text: '瀑布模型' },
        { value: 'B', text: '螺旋模型' },
        { value: 'C', text: '增量模型' },
        { value: 'D', text: '递归模型' }
      ],
      answer: ''
    },
    {
      id: 4,
      type: 'single',
      question: 'UML中用例图的主要作用是什么？',
      score: 2,
      options: [
        { value: 'A', text: '描述系统的功能需求' },
        { value: 'B', text: '描述系统的架构设计' },
        { value: 'C', text: '描述系统的数据库设计' },
        { value: 'D', text: '描述系统的部署方案' }
      ],
      answer: ''
    },
    {
      id: 5,
      type: 'single',
      question: '黑盒测试主要关注的是什么？',
      score: 2,
      options: [
        { value: 'A', text: '代码的逻辑结构' },
        { value: 'B', text: '输入和输出的关系' },
        { value: 'C', text: '代码的执行效率' },
        { value: 'D', text: '代码的可读性' }
      ],
      answer: ''
    },
    // 多选题
    {
      id: 6,
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
      id: 7,
      type: 'multiple',
      question: '敏捷开发的核心价值观包括？（多选）',
      score: 3,
      options: [
        { value: 'A', text: '个体和互动高于流程和工具' },
        { value: 'B', text: '工作的软件高于详尽的文档' },
        { value: 'C', text: '客户合作高于合同谈判' },
        { value: 'D', text: '响应变化高于遵循计划' }
      ],
      answer: []
    },
    {
      id: 8,
      type: 'multiple',
      question: '软件测试的类型包括哪些？（多选）',
      score: 3,
      options: [
        { value: 'A', text: '单元测试' },
        { value: 'B', text: '集成测试' },
        { value: 'C', text: '系统测试' },
        { value: 'D', text: '验收测试' }
      ],
      answer: []
    },
    {
      id: 9,
      type: 'multiple',
      question: '以下哪些是面向对象的基本特征？（多选）',
      score: 3,
      options: [
        { value: 'A', text: '封装' },
        { value: 'B', text: '继承' },
        { value: 'C', text: '多态' },
        { value: 'D', text: '抽象' }
      ],
      answer: []
    },
    // 填空题
    {
      id: 10,
      type: 'fill',
      question: '软件工程三要素是方法、工具和_______。',
      score: 5,
      answer: ''
    },
    {
      id: 11,
      type: 'fill',
      question: 'UML是_______的缩写。',
      score: 5,
      answer: ''
    },
    {
      id: 12,
      type: 'fill',
      question: '软件测试的目的是发现软件中的_______。',
      score: 5,
      answer: ''
    },
    {
      id: 13,
      type: 'fill',
      question: 'MVC架构模式中的V代表_______。',
      score: 5,
      answer: ''
    },
    // 问答题
    {
      id: 14,
      type: 'essay',
      question: '请简述软件测试的目的和重要性。',
      score: 10,
      answer: ''
    },
    {
      id: 15,
      type: 'essay',
      question: '请描述你对敏捷开发的理解，并举例说明其优缺点。',
      score: 15,
      answer: ''
    },
    {
      id: 16,
      type: 'essay',
      question: '请解释什么是软件重构，以及为什么需要进行软件重构。',
      score: 15,
      answer: ''
    },
    {
      id: 17,
      type: 'essay',
      question: '请论述软件项目管理中风险管理的重要性，并举例说明常见的风险类型。',
      score: 20,
      answer: ''
    }
  ]

  examInfo.value.questions = questions
  examInfo.value.questionCount = questions.length
}

// 监听滚动，更新当前题目（使用节流优化性能）
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

// 页面离开前提醒
const handleBeforeUnload = (e) => {
  const answeredCount = examInfo.value.questions.filter(q => isAnswered(q)).length
  if (answeredCount > 0 && timer) {
    e.preventDefault()
    e.returnValue = '您的答题数据还未提交，确定要离开吗？'
    return e.returnValue
  }
}

// 生命周期
onMounted(() => {
  loadExamData()
  startTimer()

  // 监听滚动
  if (answerAreaRef.value) {
    answerAreaRef.value.addEventListener('scroll', handleScroll)
  }

  // 监听页面离开
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // 清理定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  // 清理滚动超时
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }

  // 移除滚动监听
  if (answerAreaRef.value) {
    answerAreaRef.value.removeEventListener('scroll', handleScroll)
  }

  // 移除页面离开监听
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  z-index: 100;

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
      transition: all 0.3s ease;

      .el-icon {
        font-size: 16px;
      }

      &.timer-warning {
        background: #fef0f0;
        color: #f56c6c;
        animation: pulse 1s infinite;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.exam-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
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
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

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
      flex-shrink: 0;
    }

    .question-type {
      padding: 4px 12px;
      background: #ecf5ff;
      color: #409eff;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .question-score {
      margin-left: auto;
      color: #e6a23c;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }
  }

  .question-content {
    .question-text {
      font-size: 16px;
      line-height: 1.8;
      color: #303133;
      margin-bottom: 20px;
      word-wrap: break-word;
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

      :deep(.el-radio__input),
      :deep(.el-checkbox__input) {
        margin-top: 2px;
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
        flex-shrink: 0;
      }

      .option-text {
        flex: 1;
        color: #303133;
        line-height: 1.6;
      }
    }

    .fill-answer,
    .essay-answer {
      :deep(.el-textarea__inner) {
        font-size: 14px;
        line-height: 1.6;
        resize: vertical;
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

  .el-button {
    min-width: 200px;
    font-size: 16px;
    height: 44px;
  }
}

.question-nav {
  width: 280px;
  background: white;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .nav-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
    flex-shrink: 0;

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

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 3px;
    }

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
        user-select: none;

        &:hover {
          border-color: #409eff;
          color: #409eff;
          transform: translateY(-2px);
        }

        &.answered {
          background: #67c23a;
          border-color: #67c23a;
          color: white;

          &:hover {
            background: #85ce61;
            border-color: #85ce61;
          }
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
    flex-shrink: 0;

    .el-button {
      height: 44px;
      font-size: 16px;
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .exam-header {
    padding: 12px 16px;

    .header-left {
      .exam-title {
        font-size: 16px;
      }

      .exam-meta {
        font-size: 12px;
        gap: 12px;
      }
    }

    .header-right {
      .timer {
        font-size: 13px;
        padding: 6px 12px;
      }
    }
  }

  .question-nav {
    width: 240px;
  }

  .answer-area {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .exam-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .header-right {
      width: 100%;

      .timer {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .exam-body {
    flex-direction: column;
  }

  .answer-area {
    padding: 12px;
  }

  .question-block {
    padding: 16px;
    margin-bottom: 16px;

    .question-header {
      flex-wrap: wrap;
      gap: 8px;

      .question-score {
        margin-left: 0;
      }
    }
  }

  .question-nav {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e4e7ed;
    max-height: 300px;
    order: 2;

    .nav-content {
      .question-grid {
        grid-template-columns: repeat(6, 1fr);
      }
    }
  }

  .submit-section {
    padding: 16px;

    .el-button {
      width: 100%;
      min-width: auto;
    }
  }
}

@media (max-width: 480px) {
  .question-nav {
    .nav-content {
      .question-grid {
        grid-template-columns: repeat(5, 1fr);
        gap: 6px;

        .question-item {
          font-size: 12px;
        }
      }
    }
  }

  .question-block {
    .question-content {
      .question-text {
        font-size: 14px;
      }
    }
  }
}
</style>
