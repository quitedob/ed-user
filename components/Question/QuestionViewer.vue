<template>
  <div class="question-viewer" :class="{ 'question-viewer--readonly': readonly }">
    <!-- 题目头部 -->
    <div class="question-header">
      <div class="question-info">
        <div class="question-number">
          题目 {{ questionNumber }}
          <el-tag
            :type="getStatusType()"
            size="small"
            v-if="showStatus"
          >
            {{ getStatusText() }}
          </el-tag>
          <span v-if="showScore" class="question-score">{{ question.score }}分</span>
        </div>
        <div v-if="question.type" class="question-type">
          {{ getQuestionTypeLabel() }}
        </div>
      </div>
    </div>

    <!-- 题目内容 -->
    <div class="question-content">
      <div class="question-text">{{ question.questionText || question.description }}</div>

      <!-- 单选题 -->
      <div v-if="question.type === 'single'" class="single-choice">
        <el-radio-group
          v-model="localAnswer"
          :disabled="readonly"
          @change="handleAnswerChange"
        >
          <div
            v-for="option in question.options"
            :key="option.id"
            class="option-item"
            :class="{ 'option-selected': localAnswer === option.value }"
          >
            <el-radio :value="option.value">
              <span class="option-label">{{ option.value }}.</span>
              <span class="option-text">{{ option.text }}</span>
            </el-radio>
          </div>
        </el-radio-group>
      </div>

      <!-- 多选题 -->
      <div v-else-if="question.type === 'multiple'" class="multiple-choice">
        <el-checkbox-group
          v-model="localMultipleAnswer"
          :disabled="readonly"
          @change="handleAnswerChange"
        >
          <div
            v-for="option in question.options"
            :key="option.id"
            class="option-item"
            :class="{ 'option-selected': localMultipleAnswer.includes(option.value) }"
          >
            <el-checkbox :value="option.value">
              <span class="option-label">{{ option.value }}.</span>
              <span class="option-text">{{ option.text }}</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>

      <!-- 判断题 -->
      <div v-else-if="question.type === 'judge'" class="judge-question">
        <el-radio-group
          v-model="localAnswer"
          :disabled="readonly"
          @change="handleAnswerChange"
        >
          <div class="judge-options">
            <div class="option-item">
              <el-radio value="true">正确</el-radio>
            </div>
            <div class="option-item">
              <el-radio value="false">错误</el-radio>
            </div>
          </div>
        </el-radio-group>
      </div>

      <!-- 填空题 -->
      <div v-else-if="question.type === 'fill'" class="fill-question">
        <div class="fill-inputs">
          <div
            v-for="(blank, index) in getBlankCount()"
            :key="index"
            class="fill-item"
          >
            <span class="blank-label">第{{ index + 1 }}空：</span>
            <el-input
              v-model="localFillAnswers[index]"
              :placeholder="`请填写第${index + 1}个空`"
              :disabled="readonly"
              @input="handleAnswerChange"
            />
          </div>
        </div>
        <div v-if="showHints && question.hints" class="fill-hints">
          <div class="hint-title">提示：</div>
          <div class="hint-content">{{ question.hints }}</div>
        </div>
      </div>

      <!-- 简答题 -->
      <div v-else-if="question.type === 'essay'" class="essay-question">
        <el-input
          v-model="localEssayAnswer"
          type="textarea"
          :rows="6"
          :placeholder="essayPlaceholder"
          :disabled="readonly"
          @input="handleAnswerChange"
          class="essay-textarea"
        />
        <div v-if="showHints && question.referenceAnswer" class="essay-hint">
          <el-collapse>
            <el-collapse-item title="参考答案">
              <div class="reference-answer">{{ question.referenceAnswer }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <!-- OJ编程题 -->
      <div v-else-if="question.type === 'oj'" class="oj-question">
        <div class="oj-info">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">时间限制：</span>
              <span class="info-value">{{ question.timeLimit }}ms</span>
            </div>
            <div class="info-item">
              <span class="info-label">内存限制：</span>
              <span class="info-value">{{ question.memoryLimit }}MB</span>
            </div>
            <div class="info-item">
              <span class="info-label">编程语言：</span>
              <el-select
                v-model="selectedLanguage"
                :disabled="readonly"
                @change="handleLanguageChange"
                class="language-select"
              >
                <el-option
                  v-for="lang in supportedLanguages"
                  :key="lang.value"
                  :label="lang.label"
                  :value="lang.value"
                />
              </el-select>
            </div>
          </div>
        </div>

        <div class="oj-description">
          <div class="section-title">题目描述</div>
          <div class="description-content">{{ question.description }}</div>
        </div>

        <div class="oj-io">
          <div class="io-section">
            <div class="section-title">输入格式</div>
            <div class="io-content">
              <pre>{{ question.input || '无特殊输入要求' }}</pre>
            </div>
          </div>
          <div class="io-section">
            <div class="section-title">输出格式</div>
            <div class="io-content">
              <pre>{{ question.output || '按题目要求输出' }}</pre>
            </div>
          </div>
        </div>

        <div v-if="question.examples" class="oj-examples">
          <div class="section-title">样例输入输出</div>
          <div class="example-content">
            <pre>{{ question.examples }}</pre>
          </div>
        </div>

        <div class="oj-code-editor">
          <div class="section-title">代码编辑器</div>
          <div class="code-editor-wrapper">
            <el-input
              v-model="localCodeAnswer"
              type="textarea"
              :rows="15"
              :placeholder="codePlaceholder"
              :disabled="readonly"
              @input="handleAnswerChange"
              class="code-textarea"
            />
          </div>
          <div v-if="!readonly" class="code-actions">
            <el-button type="primary" @click="runCode" :loading="codeRunning">
              <el-icon><VideoPlay /></el-icon>
              运行代码
            </el-button>
            <el-button @click="resetCode">
              <el-icon><Refresh /></el-icon>
              重置代码
            </el-button>
          </div>
        </div>

        <div v-if="codeResult" class="oj-result">
          <div class="section-title">运行结果</div>
          <div class="result-content">
            <el-alert
              :type="codeResult.status"
              :title="codeResult.message"
              :description="codeResult.details"
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 答案对比（仅在查看结果时显示） -->
    <div v-if="showResult && hasResult()" class="answer-comparison">
      <div class="comparison-header">
        <span class="comparison-title">答案对比</span>
        <el-tag
          :type="isAnswerCorrect() ? 'success' : 'danger'"
          size="small"
        >
          {{ isAnswerCorrect() ? '正确' : '错误' }}
        </el-tag>
      </div>

      <!-- 选择题答案对比 -->
      <div v-if="isChoiceQuestion()" class="choice-comparison">
        <div class="correct-answer">
          <span class="answer-label">正确答案：</span>
          <span class="answer-value">{{ getCorrectAnswerDisplay() }}</span>
        </div>
        <div class="user-answer">
          <span class="answer-label">你的答案：</span>
          <span class="answer-value" :class="{ 'answer-wrong': !isAnswerCorrect() }">
            {{ getUserAnswerDisplay() || '未作答' }}
          </span>
        </div>
      </div>

      <!-- 填空题答案对比 -->
      <div v-else-if="question.type === 'fill'" class="fill-comparison">
        <div
          v-for="(blank, index) in getBlankCount()"
          :key="index"
          class="blank-comparison"
        >
          <div class="blank-number">第{{ index + 1 }}空：</div>
          <div class="blank-answers">
            <span class="correct-answer">
              正确：{{ question.correctAnswers?.[index] || '--' }}
            </span>
            <span class="user-answer" :class="{ 'answer-wrong': !isBlankCorrect(index) }">
              你的：{{ localFillAnswers[index] || '未作答' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 简答题评分 -->
      <div v-else-if="question.type === 'essay'" class="essay-comparison">
        <div v-if="showScore" class="essay-score">
          <span class="score-label">得分：</span>
          <span class="score-value">{{ question.userScore || 0 }}/{{ question.score }}分</span>
        </div>
      </div>

      <!-- OJ题测试结果 -->
      <div v-else-if="question.type === 'oj'" class="oj-comparison">
        <div v-if="showScore" class="oj-score">
          <span class="score-label">得分：</span>
          <span class="score-value">{{ question.userScore || 0 }}/{{ question.score }}分</span>
        </div>
        <div v-if="question.testResults" class="test-results">
          <span class="results-label">测试结果：</span>
          <span class="results-value">{{ question.testResults }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { VideoPlay, Refresh } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  // 题目数据
  question: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.type && (value.questionText || value.description)
    }
  },
  // 题目编号
  questionNumber: {
    type: Number,
    default: 1
  },
  // 是否只读模式（查看结果时使用）
  readonly: {
    type: Boolean,
    default: false
  },
  // 是否显示状态标签
  showStatus: {
    type: Boolean,
    default: false
  },
  // 是否显示答案对比
  showResult: {
    type: Boolean,
    default: false
  },
  // 是否显示提示信息
  showHints: {
    type: Boolean,
    default: false
  },
  // 是否显示分数
  showScore: {
    type: Boolean,
    default: true
  },
  // 初始答案
  initialAnswer: {
    type: [String, Array, Object],
    default: null
  }
})

// Emits
const emit = defineEmits(['answer-change', 'language-change'])

// 响应式数据
const localAnswer = ref('')
const localMultipleAnswer = ref([])
const localFillAnswers = ref([])
const localEssayAnswer = ref('')
const localCodeAnswer = ref('')
const selectedLanguage = ref('cpp')
const codeRunning = ref(false)
const codeResult = ref(null)

// 支持的编程语言
const supportedLanguages = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'c', label: 'C' }
]

// 计算属性
const essayPlaceholder = computed(() => {
  return `请输入你的答案${props.question.minLength ? `（至少${props.question.minLength}字）` : ''}`
})

const codePlaceholder = computed(() => {
  const language = supportedLanguages.find(lang => lang.value === selectedLanguage.value)
  return `请在此输入${language?.label || '代码'}...`
})

// 方法
const getQuestionTypeLabel = () => {
  const labels = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    fill: '填空题',
    essay: '简答题',
    oj: '编程题'
  }
  return labels[props.question.type] || '未知题型'
}

const getStatusType = () => {
  if (!props.question.status) return 'info'

  const statusMap = {
    correct: 'success',
    wrong: 'danger',
    partial: 'warning',
    unanswered: 'info'
  }
  return statusMap[props.question.status] || 'info'
}

const getStatusText = () => {
  if (!props.question.status) return '未作答'

  const statusMap = {
    correct: '正确',
    wrong: '错误',
    partial: '部分正确',
    unanswered: '未作答'
  }
  return statusMap[props.question.status] || '未作答'
}

const getBlankCount = () => {
  // 根据题目文本中的空格数计算填空数量，或使用指定的数量
  if (props.question.blankCount) {
    return props.question.blankCount
  }

  // 从问题文本中计算空格数（简单实现）
  const text = props.question.questionText || ''
  const matches = text.match(/_{3,}/g)
  return matches ? matches.length : 1
}

const isChoiceQuestion = () => {
  return ['single', 'multiple'].includes(props.question.type)
}

const getCorrectAnswerDisplay = () => {
  if (props.question.type === 'single') {
    return props.question.correctAnswer || '--'
  } else if (props.question.type === 'multiple') {
    return props.question.correctAnswers?.join('、') || '--'
  }
  return '--'
}

const getUserAnswerDisplay = () => {
  if (props.question.type === 'single') {
    return localAnswer.value
  } else if (props.question.type === 'multiple') {
    return localMultipleAnswer.value.join('、')
  }
  return ''
}

const isAnswerCorrect = () => {
  if (props.question.type === 'single') {
    return localAnswer.value === props.question.correctAnswer
  } else if (props.question.type === 'multiple') {
    const userAnswers = localMultipleAnswer.value.sort()
    const correctAnswers = [...(props.question.correctAnswers || [])].sort()
    return JSON.stringify(userAnswers) === JSON.stringify(correctAnswers)
  } else if (props.question.type === 'judge') {
    return localAnswer.value === props.question.correctAnswer
  }
  return props.question.status === 'correct'
}

const isBlankCorrect = (index) => {
  const userAnswer = localFillAnswers.value[index]?.toLowerCase().trim()
  const correctAnswers = props.question.correctAnswers?.[index]

  if (!correctAnswers || !userAnswer) return false

  // 支持多个正确答案
  const answers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]
  return answers.some(answer => userAnswer === answer.toLowerCase())
}

const hasResult = () => {
  return props.question.correctAnswer ||
         props.question.correctAnswers ||
         props.question.userScore !== undefined ||
         props.question.status !== undefined
}

const handleAnswerChange = () => {
  let answer = null

  switch (props.question.type) {
    case 'single':
    case 'judge':
      answer = localAnswer.value
      break
    case 'multiple':
      answer = localMultipleAnswer.value
      break
    case 'fill':
      answer = localFillAnswers.value
      break
    case 'essay':
      answer = localEssayAnswer.value
      break
    case 'oj':
      answer = {
        code: localCodeAnswer.value,
        language: selectedLanguage.value
      }
      break
  }

  emit('answer-change', answer)
}

const handleLanguageChange = (language) => {
  emit('language-change', language)
}

const runCode = async () => {
  codeRunning.value = true
  codeResult.value = null

  try {
    // 模拟代码运行
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟运行结果
    codeResult.value = {
      status: 'success',
      message: '编译通过',
      details: '所有测试用例通过'
    }
  } catch (error) {
    codeResult.value = {
      status: 'error',
      message: '编译错误',
      details: error.message
    }
  } finally {
    codeRunning.value = false
  }
}

const resetCode = () => {
  localCodeAnswer.value = ''
  codeResult.value = null
}

// 初始化答案
const initializeAnswer = () => {
  if (props.initialAnswer) {
    switch (props.question.type) {
      case 'single':
      case 'judge':
        localAnswer.value = props.initialAnswer
        break
      case 'multiple':
        localMultipleAnswer.value = Array.isArray(props.initialAnswer) ? props.initialAnswer : []
        break
      case 'fill':
        localFillAnswers.value = Array.isArray(props.initialAnswer) ? props.initialAnswer : []
        break
      case 'essay':
        localEssayAnswer.value = props.initialAnswer
        break
      case 'oj':
        if (typeof props.initialAnswer === 'object') {
          localCodeAnswer.value = props.initialAnswer.code || ''
          selectedLanguage.value = props.initialAnswer.language || 'cpp'
        }
        break
    }
  }

  // 从问题数据中获取已保存的答案
  if (props.question.userAnswer !== undefined) {
    switch (props.question.type) {
      case 'single':
      case 'judge':
        localAnswer.value = props.question.userAnswer
        break
      case 'multiple':
        localMultipleAnswer.value = Array.isArray(props.question.userAnswer) ? props.question.userAnswer : []
        break
      case 'fill':
        localFillAnswers.value = Array.isArray(props.question.userAnswer) ? props.question.userAnswer : []
        break
      case 'essay':
        localEssayAnswer.value = props.question.userAnswer || ''
        break
      case 'oj':
        if (props.question.userAnswer?.code) {
          localCodeAnswer.value = props.question.userAnswer.code
        }
        if (props.question.userAnswer?.language) {
          selectedLanguage.value = props.question.userAnswer.language
        }
        break
    }
  }

  // 初始化填空题数组
  if (props.question.type === 'fill' && localFillAnswers.value.length === 0) {
    const blankCount = getBlankCount()
    localFillAnswers.value = new Array(blankCount).fill('')
  }
}

// 监听问题变化
watch(() => props.question, () => {
  initializeAnswer()
}, { immediate: true })

onMounted(() => {
  initializeAnswer()
})
</script>

<style lang="scss" scoped>
.question-viewer {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;

  &--readonly {
    background: #f8f9fa;
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .question-info {
      flex: 1;

      .question-number {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 8px;

        .question-score {
          margin-left: auto;
          font-size: 14px;
          color: #909399;
          font-weight: 400;
        }
      }

      .question-type {
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .question-content {
    .question-text {
      font-size: 16px;
      color: #303133;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    // 选项样式
    .option-item {
      padding: 12px 16px;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      margin-bottom: 8px;
      transition: all 0.3s;

      &:hover {
        background: #f5f7fa;
      }

      &.option-selected {
        background: #ecf5ff;
        border-color: #409eff;
      }

      .option-label {
        font-weight: 600;
        margin-right: 8px;
      }

      .option-text {
        flex: 1;
      }
    }

    // 判断题样式
    .judge-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    // 填空题样式
    .fill-inputs {
      .fill-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .blank-label {
          font-weight: 500;
          color: #606266;
          min-width: 80px;
        }
      }
    }

    .fill-hints {
      margin-top: 16px;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 6px;

      .hint-title {
        font-weight: 600;
        color: #409eff;
        margin-bottom: 8px;
      }

      .hint-content {
        color: #606266;
        line-height: 1.5;
      }
    }

    // 简答题样式
    .essay-textarea {
      width: 100%;

      :deep(.el-textarea__inner) {
        font-family: 'Microsoft YaHei', sans-serif;
        line-height: 1.6;
      }
    }

    .essay-hint {
      margin-top: 16px;
    }

    // OJ题样式
    .oj-info {
      margin-bottom: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .info-label {
            font-weight: 500;
            color: #606266;
          }

          .info-value {
            color: #303133;
          }

          .language-select {
            width: 120px;
          }
        }
      }
    }

    .oj-description, .oj-io, .oj-examples {
      margin-bottom: 16px;

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 8px;
      }

      .description-content {
        line-height: 1.6;
        color: #303133;
      }

      .io-content, .example-content {
        background: #f8f9fa;
        border: 1px solid #e4e7ed;
        border-radius: 6px;
        padding: 12px;

        pre {
          margin: 0;
          font-family: 'Courier New', monospace;
          line-height: 1.4;
          color: #303133;
        }
      }
    }

    .oj-code-editor {
      margin-bottom: 16px;

      .code-editor-wrapper {
        margin-bottom: 12px;
      }

      .code-textarea {
        :deep(.el-textarea__inner) {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.4;
        }
      }

      .code-actions {
        display: flex;
        gap: 12px;
      }
    }

    .oj-result {
      .result-content {
        margin-top: 8px;
      }
    }
  }

  // 答案对比样式
  .answer-comparison {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;

    .comparison-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .comparison-title {
        font-weight: 600;
        color: #303133;
      }
    }

    .choice-comparison, .fill-comparison {
      .correct-answer, .user-answer {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .answer-label {
          font-weight: 500;
          color: #606266;
          min-width: 80px;
        }

        .answer-value {
          color: #303133;

          &.answer-wrong {
            color: #f56c6c;
          }
        }
      }
    }

    .blank-comparison {
      margin-bottom: 12px;

      .blank-number {
        font-weight: 500;
        color: #303133;
        margin-bottom: 8px;
      }

      .blank-answers {
        display: flex;
        gap: 16px;

        .correct-answer {
          color: #67c23a;
        }

        .user-answer {
          color: #303133;

          &.answer-wrong {
            color: #f56c6c;
          }
        }
      }
    }

    .essay-comparison, .oj-comparison {
      .essay-score, .oj-score {
        display: flex;
        align-items: center;
        gap: 8px;

        .score-label {
          font-weight: 500;
          color: #606266;
        }

        .score-value {
          color: #303133;
          font-weight: 600;
        }
      }

      .test-results {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 8px;

        .results-label {
          font-weight: 500;
          color: #606266;
        }

        .results-value {
          color: #303133;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .question-viewer {
    padding: 16px;

    .question-header {
      flex-direction: column;
      gap: 8px;
    }

    .oj-info .info-grid {
      grid-template-columns: 1fr;
    }

    .code-actions {
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>