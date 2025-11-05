<template>
  <div class="assessment-page">
    <div class="page-header">
      <h1>能力测评</h1>
      <p class="page-desc">通过科学的测评题目，了解你的编程能力水平，制定个性化提升计划</p>
    </div>

    <!-- 测评状态 -->
    <div v-if="!hasCompletedAssessment" class="assessment-intro">
      <el-card class="intro-card">
        <div class="intro-content">
          <div class="intro-text">
            <h2>编程能力综合测评</h2>
            <p>本测评包含以下内容：</p>
            <ul>
              <li><strong>基础知识</strong>：编程语言基础语法</li>
              <li><strong>算法思维</strong>：常见算法和数据结构</li>
              <li><strong>代码能力</strong>：编程题解题能力</li>
              <li><strong>调试技巧</strong>：代码调试和优化</li>
            </ul>
            <p><strong>测评时长：</strong>约30分钟</p>
            <p><strong>题目数量：</strong>20道</p>
          </div>
          <div class="intro-actions">
            <el-button type="primary" size="large" @click="startAssessment">
              开始测评
            </el-button>
            <p class="hint">* 建议在安静的环境下完成测评</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 测评进行中 -->
    <div v-else-if="isTakingAssessment" class="assessment-taking">
      <div class="assessment-header">
        <div class="progress-info">
          <span>题目 {{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          <el-progress
            :percentage="progressPercentage"
            :show-text="false"
            :stroke-width="8"
          />
        </div>
        <div class="time-remaining">
          <el-icon><Clock /></el-icon>
          剩余时间: {{ formatTime(remainingTime) }}
        </div>
      </div>

      <el-card class="question-card">
        <div class="question-header">
          <div class="question-type">
            <el-tag :type="getQuestionTypeTag(currentQuestion.type)">
              {{ getQuestionTypeText(currentQuestion.type) }}
            </el-tag>
            <span class="difficulty">
              难度: {{ getDifficultyText(currentQuestion.difficulty) }}
            </span>
          </div>
          <div class="question-points">
            {{ currentQuestion.points }} 分
          </div>
        </div>

        <div class="question-content">
          <h3>{{ currentQuestion.title }}</h3>

          <!-- 单选题 -->
          <div v-if="currentQuestion.type === 'single-choice'" class="question-options">
            <el-radio-group v-model="currentAnswer" @change="saveAnswer">
              <el-radio
                v-for="option in currentQuestion.options"
                :key="option.id"
                :label="option.id"
                class="option-item"
              >
                <span class="option-label">{{ option.label }}.</span>
                <span class="option-text">{{ option.text }}</span>
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 多选题 -->
          <div v-else-if="currentQuestion.type === 'multiple-choice'" class="question-options">
            <el-checkbox-group v-model="currentAnswer" @change="saveAnswer">
              <el-checkbox
                v-for="option in currentQuestion.options"
                :key="option.id"
                :label="option.id"
                class="option-item"
              >
                <span class="option-label">{{ option.label }}.</span>
                <span class="option-text">{{ option.text }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- 判断题 -->
          <div v-else-if="currentQuestion.type === 'true-false'" class="question-options">
            <el-radio-group v-model="currentAnswer" @change="saveAnswer">
              <el-radio label="true" class="option-item">正确</el-radio>
              <el-radio label="false" class="option-item">错误</el-radio>
            </el-radio-group>
          </div>

          <!-- 填空题 -->
          <div v-else-if="currentQuestion.type === 'fill-blank'" class="question-options">
            <el-input
              v-model="currentAnswer"
              placeholder="请输入答案"
              @input="saveAnswer"
              style="max-width: 300px"
            />
          </div>

          <!-- 代码题 -->
          <div v-else-if="currentQuestion.type === 'coding'" class="question-options">
            <div class="code-question">
              <div class="code-description" v-html="currentQuestion.description"></div>
              <div class="code-editor">
                <el-input
                  v-model="currentAnswer"
                  type="textarea"
                  :rows="10"
                  placeholder="请编写代码..."
                  @input="saveAnswer"
                />
              </div>
              <div class="code-hints">
                <el-alert
                  title="提示"
                  :description="currentQuestion.hints"
                  type="info"
                  :closable="false"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="question-actions">
          <el-button
            :disabled="currentQuestionIndex === 0"
            @click="previousQuestion"
          >
            <el-icon><ArrowLeft /></el-icon>
            上一题
          </el-button>
          <el-button
            v-if="currentQuestionIndex < questions.length - 1"
            type="primary"
            @click="nextQuestion"
          >
            下一题
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-button
            v-else
            type="success"
            @click="submitAssessment"
          >
            提交测评
            <el-icon><Check /></el-icon>
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 测评结果 -->
    <div v-else class="assessment-result">
      <el-card class="result-card">
        <div class="result-header">
          <div class="score-display">
            <div class="score-circle">
              <span class="score-number">{{ assessmentResult.totalScore }}</span>
              <span class="score-total">/{{ assessmentResult.maxScore }}</span>
            </div>
            <div class="score-label">总分</div>
          </div>
          <div class="result-info">
            <h2>测评完成！</h2>
            <p class="result-description">{{ assessmentResult.description }}</p>
            <div class="result-stats">
              <div class="stat-item">
                <span class="stat-label">用时:</span>
                <span class="stat-value">{{ formatTime(assessmentResult.timeSpent) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">正确率:</span>
                <span class="stat-value">{{ assessmentResult.accuracy }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="result-analysis">
          <h3>能力分析</h3>
          <div class="analysis-grid">
            <div
              v-for="skill in assessmentResult.skillAnalysis"
              :key="skill.name"
              class="skill-item"
            >
              <div class="skill-name">{{ skill.name }}</div>
              <el-progress
                :percentage="skill.score"
                :stroke-width="8"
                :show-text="false"
              />
              <div class="skill-score">{{ skill.score }}/100</div>
            </div>
          </div>
        </div>

        <div class="result-recommendations">
          <h3>提升建议</h3>
          <div class="recommendations-list">
            <div
              v-for="rec in assessmentResult.recommendations"
              :key="rec.id"
              class="recommendation-item"
            >
              <el-icon :class="rec.icon"><component :is="rec.icon" /></el-icon>
              <div class="rec-content">
                <h4>{{ rec.title }}</h4>
                <p>{{ rec.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <el-button type="primary" @click="viewImprovementPlan">
            查看提分计划
          </el-button>
          <el-button @click="retakeAssessment">
            重新测评
          </el-button>
          <el-button @click="shareResult">
            分享结果
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import {
  Clock,
  Check,
  ArrowLeft,
  ArrowRight,
  QuestionFilled,
  Book,
  Promotion,
  Trophy
} from '@element-plus/icons-vue'

definePageMeta({
  title: '能力测评'
})

// 响应式数据
const hasCompletedAssessment = ref(false)
const isTakingAssessment = ref(false)
const currentQuestionIndex = ref(0)
const currentAnswer = ref(null)
const answers = ref({})
const startTime = ref(null)
const remainingTime = ref(30 * 60) // 30分钟
const timer = ref(null)

// 测评题目
const questions = ref([
  {
    id: 1,
    type: 'single-choice',
    difficulty: 'easy',
    points: 5,
    title: '以下哪个不是编程语言？',
    options: [
      { id: 'A', label: 'A', text: 'Python' },
      { id: 'B', label: 'B', text: 'Java' },
      { id: 'C', label: 'C', text: 'HTML' },
      { id: 'D', label: 'D', text: 'Word' }
    ],
    correctAnswer: 'D'
  },
  {
    id: 2,
    type: 'multiple-choice',
    difficulty: 'easy',
    points: 5,
    title: '以下哪些是循环结构？',
    options: [
      { id: 'A', label: 'A', text: 'if语句' },
      { id: 'B', label: 'B', text: 'for循环' },
      { id: 'C', label: 'C', text: 'while循环' },
      { id: 'D', label: 'D', text: 'switch语句' }
    ],
    correctAnswer: ['B', 'C']
  },
  {
    id: 3,
    type: 'true-false',
    difficulty: 'easy',
    points: 5,
    title: '数组索引从0开始。',
    correctAnswer: 'true'
  },
  {
    id: 4,
    type: 'coding',
    difficulty: 'medium',
    points: 10,
    title: '实现一个函数，计算斐波那契数列的第n项',
    description: '斐波那契数列定义：F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)',
    hints: '可以使用递归或迭代的方式实现',
    correctAnswer: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}'
  }
])

// 测评结果
const assessmentResult = ref(null)

// 计算属性
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const progressPercentage = computed(() =>
  Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100)
)

// 方法
const startAssessment = () => {
  isTakingAssessment.value = true
  startTime.value = Date.now()
  currentQuestionIndex.value = 0
  currentAnswer.value = null
  answers.value = {}

  // 开始倒计时
  startTimer()
}

const startTimer = () => {
  timer.value = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      submitAssessment()
    }
  }, 1000)
}

const saveAnswer = () => {
  answers.value[currentQuestion.value.id] = currentAnswer.value
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    loadCurrentAnswer()
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    loadCurrentAnswer()
  }
}

const loadCurrentAnswer = () => {
  currentAnswer.value = answers.value[currentQuestion.value.id] || null
}

const submitAssessment = () => {
  clearInterval(timer.value)

  // 计算结果
  const result = calculateResult()
  assessmentResult.value = result

  isTakingAssessment.value = false
  hasCompletedAssessment.value = true

  // 保存结果到本地存储
  const resultData = {
    ...result,
    completedAt: new Date().toISOString(),
    answers: answers.value
  }
  localStorage.setItem('assessmentResult', JSON.stringify(resultData))
}

const calculateResult = () => {
  const timeSpent = Math.floor((Date.now() - startTime.value) / 1000)
  let totalScore = 0
  let correctCount = 0

  // 计算分数
  questions.value.forEach(question => {
    const userAnswer = answers.value[question.id]
    const correctAnswer = question.correctAnswer

    if (question.type === 'single-choice' || question.type === 'true-false') {
      if (userAnswer === correctAnswer) {
        totalScore += question.points
        correctCount++
      }
    } else if (question.type === 'multiple-choice') {
      if (JSON.stringify(userAnswer?.sort()) === JSON.stringify(correctAnswer?.sort())) {
        totalScore += question.points
        correctCount++
      }
    } else {
      // 代码题暂时给部分分
      if (userAnswer && userAnswer.length > 10) {
        totalScore += Math.floor(question.points * 0.8)
        correctCount++
      }
    }
  })

  const maxScore = questions.value.reduce((sum, q) => sum + q.points, 0)
  const accuracy = Math.round((correctCount / questions.value.length) * 100)

  // 根据分数给出描述
  let description = ''
  if (totalScore >= maxScore * 0.8) {
    description = '优秀！你对编程基础知识掌握得很好。'
  } else if (totalScore >= maxScore * 0.6) {
    description = '良好！基础知识掌握扎实，还需加强算法思维。'
  } else if (totalScore >= maxScore * 0.4) {
    description = '一般！建议加强编程基础知识的学习。'
  } else {
    description = '需要努力！建议从基础编程知识开始学习。'
  }

  return {
    totalScore,
    maxScore,
    accuracy,
    timeSpent,
    description,
    skillAnalysis: [
      { name: '基础语法', score: Math.min(100, accuracy + 20) },
      { name: '算法思维', score: Math.min(100, accuracy + 10) },
      { name: '代码能力', score: Math.min(100, accuracy) },
      { name: '调试技巧', score: Math.min(100, accuracy - 10) }
    ],
    recommendations: [
      {
        id: 1,
        icon: 'Book',
        title: '加强基础学习',
        description: '建议系统学习编程语言的基础语法和数据结构'
      },
      {
        id: 2,
        icon: 'Promotion',
        title: '多做练习',
        description: '通过LeetCode等平台练习算法题目'
      },
      {
        id: 3,
        icon: 'QuestionFilled',
        title: '参与项目',
        description: '参与实际项目开发，提升编程能力'
      }
    ]
  }
}

const viewImprovementPlan = () => {
  // 跳转到提分计划页面
  navigateTo('/assessment/plan')
}

const retakeAssessment = () => {
  hasCompletedAssessment.value = false
  isTakingAssessment.value = false
  remainingTime.value = 30 * 60
  startAssessment()
}

const shareResult = () => {
  const shareText = `我在HOJ编程学习平台完成了能力测评，获得${assessmentResult.value.totalScore}分！快来测测你的水平吧！`
  navigator.share?.({
    title: '编程能力测评结果',
    text: shareText,
    url: window.location.href
  }).catch(() => {
    // 降级到复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      ElMessage.success('结果已复制到剪贴板')
    })
  })
}

// 辅助方法
const getQuestionTypeTag = (type) => {
  const typeMap = {
    'single-choice': 'primary',
    'multiple-choice': 'warning',
    'true-false': 'info',
    'fill-blank': 'success',
    'coding': 'danger'
  }
  return typeMap[type] || 'info'
}

const getQuestionTypeText = (type) => {
  const typeMap = {
    'single-choice': '单选题',
    'multiple-choice': '多选题',
    'true-false': '判断题',
    'fill-blank': '填空题',
    'coding': '编程题'
  }
  return typeMap[type] || type
}

const getDifficultyText = (difficulty) => {
  const textMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return textMap[difficulty] || difficulty
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 生命周期
onMounted(() => {
  // 检查是否已有测评结果
  const savedResult = localStorage.getItem('assessmentResult')
  if (savedResult) {
    assessmentResult.value = JSON.parse(savedResult)
    hasCompletedAssessment.value = true
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style lang="scss" scoped>
.assessment-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;

  .page-header {
    text-align: center;
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    .page-desc {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .assessment-intro {
    .intro-card {
      .intro-content {
        display: flex;
        gap: 40px;
        align-items: center;

        .intro-text {
          flex: 1;

          h2 {
            color: #303133;
            margin: 0 0 16px 0;
          }

          ul {
            margin: 16px 0;
            padding-left: 20px;

            li {
              margin-bottom: 8px;
              line-height: 1.6;
            }
          }

          p {
            margin: 8px 0;
            color: #606266;
          }
        }

        .intro-actions {
          text-align: center;

          .hint {
            margin: 16px 0 0 0;
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }

  .assessment-taking {
    .assessment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      .progress-info {
        display: flex;
        flex-direction: column;
        gap: 8px;

        span {
          font-weight: 500;
          color: #303133;
        }
      }

      .time-remaining {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #E6A23C;
        font-weight: 500;

        .el-icon {
          font-size: 18px;
        }
      }
    }

    .question-card {
      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .question-type {
          display: flex;
          align-items: center;
          gap: 12px;

          .difficulty {
            color: #909399;
            font-size: 14px;
          }
        }

        .question-points {
          font-weight: bold;
          color: #409EFF;
        }
      }

      .question-content {
        margin-bottom: 24px;

        h3 {
          color: #303133;
          margin: 0 0 20px 0;
          line-height: 1.4;
        }

        .question-options {
          .option-item {
            display: block;
            margin-bottom: 12px;
            padding: 12px;
            border: 1px solid #e4e7ed;
            border-radius: 6px;
            transition: all 0.2s;

            &:hover {
              border-color: #409EFF;
              background: #f5f7fa;
            }

            .option-label {
              font-weight: bold;
              margin-right: 8px;
              color: #409EFF;
            }
          }
        }

        .code-question {
          .code-description {
            margin-bottom: 16px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 6px;
            line-height: 1.6;
          }

          .code-editor {
            margin-bottom: 16px;
          }

          .code-hints {
            margin-top: 16px;
          }
        }
      }

      .question-actions {
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
        border-top: 1px solid #ebeef5;
      }
    }
  }

  .assessment-result {
    .result-card {
      .result-header {
        display: flex;
        gap: 40px;
        margin-bottom: 32px;

        .score-display {
          text-align: center;

          .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #67C23A, #85CE61);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            margin: 0 auto 16px;

            .score-number {
              font-size: 32px;
              font-weight: bold;
              line-height: 1;
            }

            .score-total {
              font-size: 16px;
              opacity: 0.9;
            }
          }

          .score-label {
            font-size: 16px;
            color: #303133;
            font-weight: 500;
          }
        }

        .result-info {
          flex: 1;

          h2 {
            color: #303133;
            margin: 0 0 12px 0;
          }

          .result-description {
            color: #606266;
            margin: 0 0 16px 0;
            line-height: 1.6;
          }

          .result-stats {
            display: flex;
            gap: 24px;

            .stat-item {
              .stat-label {
                color: #909399;
                font-size: 14px;
              }

              .stat-value {
                color: #303133;
                font-weight: 500;
              }
            }
          }
        }
      }

      .result-analysis {
        margin-bottom: 32px;

        h3 {
          color: #303133;
          margin: 0 0 20px 0;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;

          .skill-item {
            text-align: center;

            .skill-name {
              margin-bottom: 8px;
              color: #606266;
              font-size: 14px;
            }

            .skill-score {
              margin-top: 8px;
              color: #409EFF;
              font-weight: 500;
              font-size: 14px;
            }
          }
        }
      }

      .result-recommendations {
        margin-bottom: 32px;

        h3 {
          color: #303133;
          margin: 0 0 20px 0;
        }

        .recommendations-list {
          .recommendation-item {
            display: flex;
            gap: 12px;
            padding: 16px;
            border: 1px solid #ebeef5;
            border-radius: 8px;
            margin-bottom: 12px;

            .el-icon {
              color: #409EFF;
              font-size: 24px;
              flex-shrink: 0;
              margin-top: 2px;
            }

            .rec-content {
              h4 {
                margin: 0 0 8px 0;
                color: #303133;
              }

              p {
                margin: 0;
                color: #606266;
                line-height: 1.5;
              }
            }
          }
        }
      }

      .result-actions {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #ebeef5;

        .el-button {
          margin: 0 8px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .assessment-page {
    padding: 16px;

    .assessment-intro .intro-card .intro-content {
      flex-direction: column;
      gap: 24px;
    }

    .assessment-taking .assessment-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .assessment-result .result-card .result-header {
      flex-direction: column;
      gap: 24px;
    }

    .result-analysis .analysis-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
