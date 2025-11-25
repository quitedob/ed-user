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
          <!-- OJ 题目描述内容 -->
          <div class="oj-description">
            <!-- 题目标题 -->
            <h2 class="oj-title">{{ currentQuestion.title }}</h2>
            
            <!-- 元数据行 -->
            <div class="oj-meta-row">
              <span class="meta-badge time">
                <el-icon><Clock /></el-icon>
                时间限制：{{ currentQuestion.timeLimit }}ms
              </span>
              <span class="meta-badge memory">
                <el-icon><Cpu /></el-icon>
                内存限制：{{ currentQuestion.memoryLimit }}MB
              </span>
              <span class="meta-badge difficulty" :class="`level-${currentQuestion.difficulty}`">
                难度：{{ getDifficultyText(currentQuestion.difficulty) }}
              </span>
            </div>

            <!-- 标签 -->
            <div v-if="currentQuestion.tags && currentQuestion.tags.length > 0" class="oj-tags-row">
              <el-tag
                v-for="tag in currentQuestion.tags"
                :key="tag.id"
                :style="{ backgroundColor: tag.color, borderColor: tag.color }"
                size="small"
              >
                {{ tag.name }}
              </el-tag>
            </div>

            <!-- 题目描述 -->
            <div class="oj-section">
              <h3 class="section-title">题目描述</h3>
              <div class="section-content" v-html="currentQuestion.description"></div>
            </div>

            <!-- 输入格式 -->
            <div class="oj-section">
              <h3 class="section-title">输入格式</h3>
              <div class="section-content" v-html="currentQuestion.input"></div>
            </div>

            <!-- 输出格式 -->
            <div class="oj-section">
              <h3 class="section-title">输出格式</h3>
              <div class="section-content" v-html="currentQuestion.output"></div>
            </div>

            <!-- 示例 -->
            <div v-if="currentQuestion.examples" class="oj-section">
              <h3 class="section-title">示例</h3>
              <div class="section-content">
                <div v-for="(example, idx) in parseExamples(currentQuestion.examples)" :key="idx" class="example-box">
                  <div class="example-title">示例 {{ idx + 1 }}</div>
                  <div class="example-group">
                    <div class="example-item">
                      <div class="example-label">输入</div>
                      <pre class="example-code">{{ example.input }}</pre>
                    </div>
                    <div class="example-item">
                      <div class="example-label">输出</div>
                      <pre class="example-code">{{ example.output }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 提示 -->
            <div v-if="currentQuestion.hint" class="oj-section">
              <h3 class="section-title">提示</h3>
              <div class="section-content hint-content" v-html="currentQuestion.hint"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间答题区 -->
      <div class="answer-area" ref="answerAreaRef">
        <div v-if="currentQuestion" class="question-detail">
          <!-- 非 OJ 题目：显示题目头部 -->
          <div v-if="currentQuestion.type !== 'oj'" class="question-header">
            <div class="header-main">
              <span class="question-number">{{ activeQuestion + 1 }}</span>
              <span class="question-type">{{ getQuestionTypeText(currentQuestion.type) }}</span>
              <span class="question-score">{{ currentQuestion.score }}分</span>
            </div>
            <div class="header-nav">
              <el-button
                :disabled="activeQuestion === 0"
                @click="switchQuestion(activeQuestion - 1)"
                size="small"
              >
                上一题
              </el-button>
              <el-button
                :disabled="activeQuestion === homeworkInfo.questions.length - 1"
                @click="switchQuestion(activeQuestion + 1)"
                size="small"
                type="primary"
              >
                下一题
              </el-button>
            </div>
          </div>

          <!-- 题目内容 -->
          <div class="question-content" :class="{ 'oj-content': currentQuestion.type === 'oj' }">
            <!-- 单选题 -->
            <div v-if="currentQuestion.type === 'single'" class="question-single">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="options">
                <el-radio-group v-model="currentQuestion.userAnswer">
                  <el-radio
                    v-for="option in currentQuestion.options"
                    :key="option.id"
                    :label="option.value"
                    class="option-item"
                  >
                    <span class="option-label">{{ option.value }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                  </el-radio>
                </el-radio-group>
              </div>
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label correct">
                    <el-icon><Check /></el-icon>
                    <span>正确答案</span>
                  </div>
                  <div class="answer-value">{{ currentQuestion.correctAnswer }}</div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="answer-value" :class="{ correct: currentQuestion.userAnswer === currentQuestion.correctAnswer, wrong: currentQuestion.userAnswer !== currentQuestion.correctAnswer }">
                    {{ currentQuestion.userAnswer }}
                    <el-icon v-if="currentQuestion.userAnswer !== currentQuestion.correctAnswer" class="wrong-icon"><Close /></el-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- 多选题 -->
            <div v-else-if="currentQuestion.type === 'multiple'" class="question-multiple">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="options">
                <el-checkbox-group v-model="currentQuestion.userAnswer">
                  <el-checkbox
                    v-for="option in currentQuestion.options"
                    :key="option.id"
                    :label="option.value"
                    class="option-item"
                  >
                    <span class="option-label">{{ option.value }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label correct">
                    <el-icon><Check /></el-icon>
                    <span>正确答案</span>
                  </div>
                  <div class="answer-value">{{ currentQuestion.correctAnswers.join(', ') }}</div>
                </div>
                <div v-if="currentQuestion.userAnswer && currentQuestion.userAnswer.length > 0" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="answer-value" :class="{ correct: isMultipleCorrect(currentQuestion), wrong: !isMultipleCorrect(currentQuestion) }">
                    {{ currentQuestion.userAnswer.join(', ') }}
                    <el-icon v-if="!isMultipleCorrect(currentQuestion)" class="wrong-icon"><Close /></el-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- 填空题 -->
            <div v-else-if="currentQuestion.type === 'fill'" class="question-fill">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="fill-input">
                <el-input
                  v-model="currentQuestion.userAnswer"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入答案"
                  maxlength="500"
                  show-word-limit
                />
              </div>
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label correct">
                    <el-icon><Check /></el-icon>
                    <span>正确答案</span>
                  </div>
                  <div class="answer-value">{{ currentQuestion.correctAnswers.join(' 或 ') }}</div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="answer-value">{{ currentQuestion.userAnswer }}</div>
                </div>
              </div>
            </div>

            <!-- 问答题 -->
            <div v-else-if="currentQuestion.type === 'essay'" class="question-essay">
              <div class="question-text" v-html="currentQuestion.questionText"></div>
              <div v-if="!isCompleted" class="essay-input">
                <el-input
                  v-model="currentQuestion.userAnswer"
                  type="textarea"
                  :rows="10"
                  placeholder="请输入答案..."
                  maxlength="2000"
                  show-word-limit
                />
              </div>
              <div v-else class="answer-display">
                <div v-if="currentQuestion.referenceAnswer" class="answer-section">
                  <div class="section-label correct">
                    <el-icon><Check /></el-icon>
                    <span>参考答案</span>
                  </div>
                  <div class="answer-value" v-html="currentQuestion.referenceAnswer"></div>
                </div>
                <div v-if="currentQuestion.userAnswer" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="answer-value" v-html="currentQuestion.userAnswer"></div>
                </div>
              </div>
            </div>

            <!-- OJ 编程题 -->
            <div v-else-if="currentQuestion.type === 'oj'" class="question-oj">
              <!-- 代码编辑器 -->
              <div v-if="!isCompleted" class="oj-editor-panel">
                <div class="editor-header">
                  <span class="editor-title">代码编辑器</span>
                  <el-select v-model="currentQuestion.language" placeholder="选择语言" size="small" style="width: 150px">
                    <el-option label="C++" value="cpp" />
                    <el-option label="Java" value="java" />
                    <el-option label="Python" value="python" />
                    <el-option label="JavaScript" value="javascript" />
                  </el-select>
                </div>
                <el-input
                  v-model="currentQuestion.userAnswer"
                  type="textarea"
                  :rows="25"
                  placeholder="请在此处编写代码..."
                  class="code-textarea"
                />
                <div class="editor-footer">
                  <el-button @click="handleRunCode">运行代码</el-button>
                  <el-button type="success" @click="handleSubmitCode">提交代码</el-button>
                </div>
              </div>

              <!-- 已完成：显示提交结果 -->
              <div v-else class="oj-result">
                <div class="result-header">
                  <div class="result-status" :class="getResultStatusClass(currentQuestion.result)">
                    {{ getResultStatusText(currentQuestion.result) }}
                  </div>
                  <div class="result-score">得分：{{ currentQuestion.earnedScore || 0 }} / {{ currentQuestion.score }}</div>
                </div>

                <div v-if="currentQuestion.testCases" class="test-cases">
                  <h4>测试用例结果</h4>
                  <div class="test-case-list">
                    <div
                      v-for="(testCase, idx) in currentQuestion.testCases.filter(tc => tc.sample)"
                      :key="testCase.id"
                      class="test-case-item"
                      :class="{ passed: testCase.passed, failed: !testCase.passed }"
                    >
                      <div class="test-case-header">
                        <span class="test-case-label">测试用例 {{ idx + 1 }}</span>
                        <el-icon v-if="testCase.passed" class="status-icon passed"><Check /></el-icon>
                        <el-icon v-else class="status-icon failed"><Close /></el-icon>
                      </div>
                      <div class="test-case-io">
                        <div class="io-block">
                          <div class="io-label">输入：</div>
                          <pre class="io-content">{{ testCase.input }}</pre>
                        </div>
                        <div class="io-block">
                          <div class="io-label">期望输出：</div>
                          <pre class="io-content">{{ testCase.output }}</pre>
                        </div>
                        <div v-if="testCase.userOutput" class="io-block">
                          <div class="io-label">你的输出：</div>
                          <pre class="io-content">{{ testCase.userOutput }}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="currentQuestion.userAnswer" class="submitted-code">
                  <h4>你提交的代码</h4>
                  <pre class="code-display">{{ currentQuestion.userAnswer }}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部操作按钮（非 OJ 题目） -->
          <div v-if="currentQuestion.type !== 'oj'" class="question-footer">
            <el-button
              :disabled="activeQuestion === 0"
              @click="switchQuestion(activeQuestion - 1)"
            >
              上一题
            </el-button>
            <el-button
              v-if="activeQuestion < homeworkInfo.questions.length - 1"
              type="primary"
              @click="switchQuestion(activeQuestion + 1)"
            >
              下一题
            </el-button>
            <el-button
              v-else-if="!isCompleted"
              type="success"
              @click="handleSubmit"
            >
              提交作业
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧答题卡 -->
      <div class="answer-card">
        <div class="card-header">
          <h3>答题卡</h3>
          <div class="progress-info">
            <span>已答：{{ answeredCount }}/{{ homeworkInfo.statistics.totalQuestions }}</span>
          </div>
        </div>

        <div class="card-content">
          <div class="card-grid">
            <div
              v-for="(question, index) in homeworkInfo.questions"
              :key="question.id"
              class="card-item"
              :class="{
                answered: isAnswered(question),
                active: activeQuestion === index
              }"
              @click="switchQuestion(index)"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <div v-if="!isCompleted" class="card-footer">
          <el-button type="primary" size="large" @click="handleSubmit" style="width: 100%">
            提交作业
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close, ArrowLeft, Clock, Cpu, TrendCharts, Document, Download, Upload, DataAnalysis, InfoFilled } from '@element-plus/icons-vue'

// 页面元数据配置
definePageMeta({
  title: '作业详情',
  layout: 'learning'
})

// 路由相关
const route = useRoute()
const router = useRouter()

// 计算路由参数
const courseId = computed(() => {
  const id = route.params.id && !isNaN(parseInt(route.params.id)) ? parseInt(route.params.id) : 1
  return id
})
const homeworkId = computed(() => {
  const id = route.params.homeworkId && !isNaN(parseInt(route.params.homeworkId)) ? parseInt(route.params.homeworkId) : 1
  return id
})

// 引用
const answerAreaRef = ref(null)
const ojDescriptionRef = ref(null)

// 作业信息
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

// 当前题目
const currentQuestion = computed(() => {
  return homeworkInfo.value.questions[activeQuestion.value]
})

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
  } else if (question.type === 'oj') {
    return typeof question.userAnswer === 'string' && question.userAnswer.trim() !== ''
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
    essay: '问答题',
    oj: '编程题'
  }
  return typeMap[type] || '未知题型'
}

// 解析示例
const parseExamples = (examplesText) => {
  if (!examplesText) return []

  const examples = []
  // 支持中英文标签解析
  const parts = examplesText.split(/Input:|输入:|Output:|输出:/i).filter(p => p.trim())

  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      examples.push({
        input: parts[i].trim(),
        output: parts[i + 1].trim()
      })
    }
  }

  return examples
}

// 获取难度文本
const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    0: '简单',
    1: '简单',
    2: '中等',
    3: '困难',
    4: '非常困难'
  }
  return difficultyMap[difficulty] || '未知'
}

// 获取结果状态类名
const getResultStatusClass = (result) => {
  if (!result) return 'pending'
  if (result === 'Accepted' || result === 'AC') return 'accepted'
  return 'rejected'
}

// 获取结果状态文本
const getResultStatusText = (result) => {
  const statusMap = {
    'Accepted': '通过',
    'AC': '通过',
    'Wrong Answer': '答案错误',
    'WA': '答案错误',
    'Time Limit Exceeded': '超时',
    'TLE': '超时',
    'Memory Limit Exceeded': '内存超限',
    'MLE': '内存超限',
    'Runtime Error': '运行错误',
    'RE': '运行错误',
    'Compile Error': '编译错误',
    'CE': '编译错误'
  }
  return statusMap[result] || result || '未提交'
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

// 切换题目
const switchQuestion = (index) => {
  if (index >= 0 && index < homeworkInfo.value.questions.length) {
    activeQuestion.value = index
    // 滚动到顶部
    if (answerAreaRef.value) {
      answerAreaRef.value.scrollTop = 0
    }
    if (ojDescriptionRef.value) {
      ojDescriptionRef.value.scrollTop = 0
    }
  }
}

// 运行代码
const handleRunCode = () => {
  ElMessage.info('运行代码功能开发中...')
}

// 提交代码
const handleSubmitCode = () => {
  if (!currentQuestion.value.userAnswer || !currentQuestion.value.userAnswer.trim()) {
    ElMessage.warning('请先编写代码')
    return
  }
  
  ElMessageBox.confirm(
    '确定要提交代码吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟评测
    const passedCount = Math.floor(Math.random() * (currentQuestion.value.testCases?.length || 3))
    const totalCases = currentQuestion.value.testCases?.length || 3
    
    if (currentQuestion.value.testCases) {
      currentQuestion.value.testCases.forEach((testCase, idx) => {
        testCase.passed = idx < passedCount
        testCase.userOutput = testCase.passed ? testCase.output : 'Wrong output'
      })
    }
    
    const passRate = passedCount / totalCases
    const earnedScore = Math.floor(currentQuestion.value.score * passRate)
    currentQuestion.value.earnedScore = earnedScore
    currentQuestion.value.result = passedCount === totalCases ? 'Accepted' : 'Wrong Answer'
    
    ElMessage.success('代码提交成功！')
  }).catch(() => {
    // 用户取消
  })
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
      if (question.userAnswer && question.correctAnswers.some(ans => 
        question.userAnswer.toLowerCase().includes(ans.toLowerCase())
      )) {
        totalScore += question.score
      }
    } else if (question.type === 'essay') {
      totalScore += question.score
    } else if (question.type === 'oj') {
      if (question.userAnswer && question.userAnswer.trim()) {
        const passedCount = Math.floor(Math.random() * (question.testCases?.length || 3))
        const totalCases = question.testCases?.length || 3
        
        if (question.testCases) {
          question.testCases.forEach((testCase, idx) => {
            testCase.passed = idx < passedCount
            testCase.userOutput = testCase.passed ? testCase.output : 'Wrong output'
          })
        }
        
        const passRate = passedCount / totalCases
        const earnedScore = Math.floor(question.score * passRate)
        question.earnedScore = earnedScore
        question.result = passedCount === totalCases ? 'Accepted' : 'Wrong Answer'
        
        totalScore += earnedScore
      }
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
}

// 加载作业数据
const loadHomeworkData = () => {
  const homeworkTemplates = {
    1: {
      basicInfo: {
        title: '第一周作业 - 软件工程基础',
        description: '完成软件工程基本概念的练习题',
        type: 'exercise',
        difficulty: 'easy'
      },
      questions: [
        {
          id: 'question_001',
          type: 'single',
          title: '软件工程三要素',
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
          title: '软件生命周期',
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
          id: '1001',
          problemId: 'CF-1001',
          type: 'oj',
          title: 'A. Array Sum',
          description: '给定一个整数数组，求所有元素的和。',
          input: '第一行包含整数 n (1 ≤ n ≤ 100000)。第二行包含 n 个整数 a₁, a₂, ..., aₙ (−10⁹ ≤ aᵢ ≤ 10⁹)。',
          output: '输出所有元素的和。',
          examples: '输入:\n3\n1 2 3\n\n输出:\n6\n\n输入:\n5\n-1 2 -3 4\n\n输出:\n2',
          hint: '使用简单的循环来求和。对于大数值，请注意整数溢出问题。',
          timeLimit: 1000,
          memoryLimit: 128,
          score: 20,
          difficulty: 2,
          order: 3,
          isRemote: true,
          source: 'CodeForces Round #123',
          tags: [
            { id: 'tag_001', name: 'array', color: '#409EFF' },
            { id: 'tag_002', name: 'implementation', color: '#67C23A' }
          ],
          testCases: [
            { id: 'case_001', input: '3\n1 2 3', output: '6', sample: true, order: 1 },
            { id: 'case_002', input: '5\n-1 2 -3 4', output: '2', sample: true, order: 2 }
          ],
          language: 'cpp',
          userAnswer: '',
          result: null,
          earnedScore: 0
        }
      ]
    }
  }

  const template = homeworkTemplates[homeworkId.value] || homeworkTemplates[1]

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
      ...template.basicInfo
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

  // 检查是否已完成
  try {
    const completed = localStorage.getItem('completedHomework')
    if (completed) {
      const completedIds = JSON.parse(completed)
      if (completedIds.includes(homeworkId.value)) {
        isCompleted.value = true

        const savedData = localStorage.getItem(`homework_${homeworkId.value}_data`)
        if (savedData) {
          const data = JSON.parse(savedData)
          userScore.value = data.totalScore

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

// 生命周期
onMounted(() => {
  loadHomeworkData()
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
    display: flex;
    align-items: center;
    gap: 16px;

    .homework-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;

    .homework-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #606266;
    }

    .score-display {
      text-align: center;
      padding: 8px 20px;
      background: #f0f9ff;
      border-radius: 6px;

      .score-value {
        font-size: 24px;
        font-weight: 700;
        color: #409eff;
      }

      .score-label {
        font-size: 13px;
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
  gap: 0;

  // OJ 题目特殊布局
  &.oj-layout {
    .answer-area {
      flex: 1;
    }
  }
}

// OJ 题目左侧描述面板
.oj-description-panel {
  width: 480px;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);

  .panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #409eff 0%, #5cadff 100%);
      border-radius: 4px;
      
      &:hover {
        background: linear-gradient(180deg, #3a8ee6 0%, #4c9de6 100%);
      }
    }
  }
}

// 中间答题区
.answer-area {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
  min-height: 0; // 防止 flex 子元素溢出

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 4px;

    &:hover {
      background: #909399;
    }
  }

  .oj-layout & {
    background: #1e1e1e;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}

.question-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;

  .oj-layout & {
    max-width: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .header-main {
    display: flex;
    align-items: center;
    gap: 12px;

    .question-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
      padding: 0 12px;
      background: linear-gradient(135deg, #409eff 0%, #5cadff 100%);
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 16px;
    }

    .question-type {
      padding: 6px 14px;
      background: #ecf5ff;
      color: #409eff;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
    }

    .question-score {
      color: #e6a23c;
      font-weight: 600;
      font-size: 15px;
    }
  }
}

.question-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .question-text {
    font-size: 16px;
    line-height: 1.8;
    color: #303133;
    margin-bottom: 24px;
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
      padding: 14px;
      margin: 0;
      border: 2px solid #e4e7ed;
      border-radius: 6px;
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
        color: #606266;

        &.correct {
          color: #67c23a;
        }

        .el-icon {
          font-size: 16px;
        }
      }

      .answer-value {
        padding: 12px 16px;
        background: #f5f7fa;
        border: 2px solid #e4e7ed;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.6;
        color: #303133;

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
          margin-left: 8px;
        }
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

  // OJ 题目内容区域特殊样式
  &.oj-content {
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    box-shadow: none;
  }

  // OJ 题目样式
  .question-oj {
    height: 100%;
    display: flex;
    flex-direction: column;

    .oj-editor-panel {
      height: 100%;
      min-height: 500px; // 确保最小高度，防止坍塌
      display: flex;
      flex-direction: column;
      background: #1e1e1e;
      flex: 1; // 确保占满父容器

      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #2d2d2d;
        border-bottom: 1px solid #3e3e3e;

        .editor-title {
          font-size: 14px;
          font-weight: 600;
          color: #d4d4d4;
        }
      }

      .code-textarea {
        flex: 1;
        display: flex;
        
        :deep(.el-textarea) {
          height: 100%;
          display: flex;
        }
        
        :deep(.el-textarea__inner) {
          height: 100% !important;
          border: none;
          border-radius: 0;
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
          resize: none;
        }
      }

      .editor-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 12px 16px;
        background: #2d2d2d;
        border-top: 1px solid #3e3e3e;
      }
    }

    .oj-result {
      padding: 24px;
      background: white;

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: #f5f7fa;
        border-radius: 6px;
        margin-bottom: 20px;

        .result-status {
          font-size: 16px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 4px;

          &.accepted {
            background: #67c23a;
            color: white;
          }

          &.rejected {
            background: #f56c6c;
            color: white;
          }

          &.pending {
            background: #e6a23c;
            color: white;
          }
        }

        .result-score {
          font-size: 18px;
          font-weight: 600;
          color: #409eff;
        }
      }

      .test-cases {
        margin-bottom: 24px;

        h4 {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 12px 0;
        }

        .test-case-list {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .test-case-item {
            padding: 16px;
            border-radius: 6px;
            border: 2px solid #e4e7ed;

            &.passed {
              border-color: #67c23a;
              background: #f0f9ff;
            }

            &.failed {
              border-color: #f56c6c;
              background: #fef0f0;
            }

            .test-case-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e4e7ed;

              .test-case-label {
                font-size: 14px;
                font-weight: 600;
                color: #303133;
              }

              .status-icon {
                font-size: 18px;

                &.passed {
                  color: #67c23a;
                }

                &.failed {
                  color: #f56c6c;
                }
              }
            }

            .test-case-io {
              display: flex;
              flex-direction: column;
              gap: 12px;

              .io-block {
                .io-label {
                  font-size: 12px;
                  color: #909399;
                  margin-bottom: 4px;
                }

                .io-content {
                  padding: 10px 12px;
                  background: white;
                  border: 1px solid #e4e7ed;
                  border-radius: 4px;
                  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                  font-size: 13px;
                  line-height: 1.6;
                  color: #303133;
                  margin: 0;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
              }
            }
          }
        }
      }

      .submitted-code {
        h4 {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 12px 0;
        }

        .code-display {
          padding: 16px;
          background: #f5f7fa;
          border: 1px solid #e4e7ed;
          border-radius: 6px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #303133;
          margin: 0;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      }
    }
  }

  // OJ 描述样式 - 华丽复杂风格
  .oj-description {
    .oj-title {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 20px 0;
      line-height: 1.3;
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: shimmer 3s infinite;
      }
    }

    .oj-meta-row {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
      flex-wrap: wrap;

      .meta-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: white;
        border-radius: 20px;
        font-size: 13px;
        color: #606266;
        border: 2px solid #e4e7ed;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          transition: left 0.5s;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

          &::before {
            left: 100%;
          }
        }

        .el-icon {
          font-size: 14px;
        }

        &.time {
          border-color: #409eff;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);

          .el-icon {
            color: #409eff;
          }
        }

        &.memory {
          border-color: #67c23a;
          background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);

          .el-icon {
            color: #67c23a;
          }
        }

        &.difficulty {
          font-weight: 700;
          font-size: 14px;

          &.level-0,
          &.level-1 {
            color: white;
            border-color: #67c23a;
            background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
            box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
          }

          &.level-2 {
            color: white;
            border-color: #e6a23c;
            background: linear-gradient(135deg, #e6a23c 0%, #f0b659 100%);
            box-shadow: 0 4px 12px rgba(230, 162, 60, 0.4);
          }

          &.level-3,
          &.level-4 {
            color: white;
            border-color: #f56c6c;
            background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
            box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
          }
        }
      }
    }

    .oj-tags-row {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;

      :deep(.el-tag) {
        padding: 6px 14px;
        border-radius: 16px;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }
      }
    }

    .oj-section {
      margin-bottom: 28px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid #e8e8e8;
      transition: all 0.3s;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #409eff 0%, #67c23a 100%);
        border-radius: 12px 0 0 12px;
      }

      &:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        transform: translateX(2px);
      }

      .section-title {
        font-size: 16px;
        font-weight: 700;
        color: #409eff;
        margin: 0 0 16px 0;
        padding: 0 0 12px 0;
        border-bottom: 2px solid #e8f4ff;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
          content: '▶';
          font-size: 12px;
          color: #409eff;
        }
      }

      .section-content {
        font-size: 14px;
        line-height: 1.9;
        color: #606266;
        padding: 16px 18px;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 10px;
        border: 2px solid #e8ecf0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.8);
        position: relative;
        transition: all 0.3s;

        &::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(103, 194, 58, 0.1) 100%);
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
        }

        &:hover {
          border-color: #409eff;
          box-shadow: 0 6px 16px rgba(64, 158, 255, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.8);

          &::before {
            opacity: 1;
          }
        }

        &.hint-content {
          padding: 18px 20px;
          background: linear-gradient(135deg, #fffbea 0%, #fff8dc 100%);
          border: 2px solid #fadb14;
          border-left: 5px solid #faad14;
          box-shadow: 0 4px 12px rgba(250, 173, 20, 0.2), inset 0 2px 8px rgba(250, 173, 20, 0.1);

          &::before {
            content: '💡';
            position: absolute;
            top: 14px;
            right: 14px;
            font-size: 22px;
            opacity: 0.7;
            animation: pulse 2s infinite;
          }

          &:hover {
            border-color: #faad14;
            box-shadow: 0 6px 16px rgba(250, 173, 20, 0.3), inset 0 2px 8px rgba(250, 173, 20, 0.15);
          }
        }
      }

      .example-box {
        margin-bottom: 16px;
        padding: 16px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 10px;
        border: 2px solid #dee2e6;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        .example-title {
          font-size: 14px;
          font-weight: 700;
          color: #409eff;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          display: inline-block;
          box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
        }

        .example-group {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .example-item {
            .example-label {
              font-size: 12px;
              font-weight: 700;
              color: #909399;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .example-code {
              padding: 14px 16px;
              background: #1e1e1e;
              border: 2px solid #333;
              border-radius: 8px;
              font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
              font-size: 13px;
              line-height: 1.6;
              color: #d4d4d4;
              margin: 0;
              white-space: pre-wrap;
              word-wrap: break-word;
              box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
              position: relative;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
              }
            }
          }
        }
      }
    }
  }
}

// 新增：修正左侧 OJ 面板样式作用域
// 目标：把样式明确绑定到 .oj-description-panel，且能命中 v-html 注入的内容
.oj-description-panel {
  // ——— 标题：渐变背景卡片 ———
  .oj-description .oj-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 20px 0;
    padding: 16px 20px;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    position: relative;
    overflow: hidden;
  }
  .oj-description .oj-title::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: shimmer 3s infinite;
  }

  // ——— 元数据徽章行 ———
  .oj-description .oj-meta-row {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .oj-description .oj-meta-row .meta-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #fff;
    border-radius: 20px;
    font-size: 13px;
    color: #606266;
    border: 2px solid #e4e7ed;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
    transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .oj-description .oj-meta-row .meta-badge.time {
    border-color: #409eff;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  }
  .oj-description .oj-meta-row .meta-badge.memory {
    border-color: #67c23a;
    background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
  }
  .oj-description .oj-meta-row .meta-badge.difficulty.level-1,
  .oj-description .oj-meta-row .meta-badge.difficulty.level-0 {
    color: #fff;
    border-color: #67c23a;
    background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
  }
  .oj-description .oj-meta-row .meta-badge.difficulty.level-2 {
    color: #fff;
    border-color: #e6a23c;
    background: linear-gradient(135deg, #e6a23c 0%, #f0b659 100%);
    box-shadow: 0 4px 12px rgba(230, 162, 60, 0.4);
  }
  .oj-description .oj-meta-row .meta-badge.difficulty.level-3,
  .oj-description .oj-meta-row .meta-badge.difficulty.level-4 {
    color: #fff;
    border-color: #f56c6c;
    background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
    box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
  }

  // ——— 标签行（Element Plus tag） ———
  .oj-description .oj-tags-row :deep(.el-tag) {
    padding: 6px 14px;
    border-radius: 16px;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(0,0,0,.1);
    transition: transform .2s, box-shadow .2s;
  }
  .oj-description .oj-tags-row :deep(.el-tag:hover) {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0,0,0,.15);
  }

  // ——— 分节卡片容器 ———
  .oj-description .oj-section {
    margin-bottom: 28px;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
    border: 1px solid #e8e8e8;
    position: relative;
    transition: box-shadow .2s, transform .2s;
  }
  .oj-description .oj-section::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    border-radius: 12px 0 0 12px;
    background: linear-gradient(180deg, #409eff 0%, #67c23a 100%);
  }
  .oj-description .oj-section:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,.12);
    transform: translateX(2px);
  }

  .oj-description .oj-section .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #409eff;
    margin: 0 0 16px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid #e8f4ff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .oj-description .oj-section .section-title::before {
    content: '▶';
    font-size: 12px;
    color: #409eff;
  }

  // ——— 命中 v-html 注入的正文：使用 :deep() ———
  :deep(.oj-description .section-content) {
    font-size: 14px;
    line-height: 1.9;
    color: #606266;
    padding: 16px 18px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 10px;
    border: 2px solid #e8ecf0;
    box-shadow: 0 4px 12px rgba(0,0,0,.06), inset 0 1px 2px rgba(255,255,255,.8);
  }

  // ——— v-html 内常见元素排版 ———
  :deep(.oj-description .section-content h1),
  :deep(.oj-description .section-content h2),
  :deep(.oj-description .section-content h3) {
    margin: 8px 0 12px;
    line-height: 1.35;
    color: #303133;
  }
  :deep(.oj-description .section-content p),
  :deep(.oj-description .section-content li) {
    margin: 6px 0;
  }
  :deep(.oj-description .section-content pre),
  :deep(.oj-description .example-code) {
    padding: 14px 16px;
    background: #1e1e1e;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: Consolas, Monaco, 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #d4d4d4;
    white-space: pre-wrap;
    word-wrap: break-word;
    box-shadow: inset 0 2px 8px rgba(0,0,0,.3);
    margin: 8px 0 0;
  }
  :deep(.oj-description .section-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
  }
  :deep(.oj-description .section-content th),
  :deep(.oj-description .section-content td) {
    border: 1px solid #ebeef5;
    padding: 8px 10px;
    text-align: left;
  }

  // ——— 示例框（左侧"示例1/2"那块） ———
  .oj-description .example-box {
    margin-bottom: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 10px;
    border: 2px solid #dee2e6;
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
  }
  .oj-description .example-box .example-title {
    font-size: 14px;
    font-weight: 700;
    color: #409eff;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: #fff;
    border-radius: 6px;
    display: inline-block;
    box-shadow: 0 2px 4px rgba(64,158,255,.2);
  }

  // ——— 让左侧面板跟随页面滚动更舒服 ———
  .panel-content {
    position: sticky;
    top: 64px; /* 根据头部高度微调 */
    max-height: calc(100vh - 64px);
    overflow: auto;
  }
}

@keyframes shimmer {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.question-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

// 右侧答题卡
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

  .card-content {
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

      &:hover {
        background: #909399;
      }
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;

      .card-item {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        border: 2px solid #e4e7ed;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #606266;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #409eff;
          color: #409eff;
          transform: scale(1.05);
        }

        &.answered {
          background: #67c23a;
          border-color: #67c23a;
          color: white;
        }

        &.active {
          border-color: #409eff;
          background: #409eff;
          color: white;
          box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
        }
      }
    }
  }

  .card-footer {
    padding: 16px;
    border-top: 1px solid #e4e7ed;
  }
}

@media (max-width: 1200px) {
  .question-list {
    width: 240px;
  }

  .answer-card {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .homework-body {
    flex-direction: column;
  }

  .question-list,
  .answer-card {
    width: 100%;
    max-height: 200px;
  }
}
</style>

