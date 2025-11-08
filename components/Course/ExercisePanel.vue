<template>
  <div class="exercise-panel">
    <!-- 练习头部 -->
    <div class="exercise-header">
      <div class="exercise-title">
        <el-icon class="exercise-icon"><EditPen /></el-icon>
        <h3>{{ exercise.title }}</h3>
        <span class="exercise-score">{{ totalScore }}分</span>
      </div>
      <div class="exercise-description">{{ exercise.description }}</div>
      <div class="exercise-progress" v-if="submission.status !== 'not_started'">
        <el-progress
          :percentage="submission.percentage"
          :show-text="false"
          :stroke-width="6"
        />
        <span class="progress-text">
          {{ submission.status === 'graded' ? `已得分: ${submission.totalScore}/${submission.maxScore}` : '进行中...' }}
        </span>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="questions-container">
      <div
        v-for="(question, index) in exercise.questions"
        :key="question.id"
        class="question-item"
        :class="{
          'question-answered': isQuestionAnswered(question.id),
          'question-correct': isQuestionCorrect(question.id),
          'question-wrong': isQuestionAnswered(question.id) && !isQuestionCorrect(question.id)
        }"
      >
        <!-- 题目头部 -->
        <div class="question-header">
          <div class="question-info">
            <span class="question-number">第{{ index + 1 }}题</span>
            <span class="question-type">{{ getQuestionTypeLabel(question.type) }}</span>
            <span class="question-score">{{ question.score }}分</span>
            <el-tag v-if="question.difficulty" :type="getDifficultyType(question.difficulty)" size="small">
              {{ getDifficultyLabel(question.difficulty) }}
            </el-tag>
          </div>
          <div v-if="submission.status === 'graded' && isQuestionAnswered(question.id)" class="question-result">
            <el-icon v-if="isQuestionCorrect(question.id)" color="#67c23a"><Check /></el-icon>
            <el-icon v-else color="#f56c6c"><Close /></el-icon>
          </div>
        </div>

        <!-- 题目内容 -->
        <div class="question-content">
          <div class="question-text" v-html="question.questionText"></div>

          <!-- 单选题 -->
          <div v-if="question.type === 'single'" class="options-container">
            <div
              v-for="option in question.options"
              :key="option.id"
              class="option-item"
              :class="{
                selected: getAnswer(question.id) === option.value,
                correct: submission.status === 'graded' && option.value === question.correctAnswer,
                wrong: submission.status === 'graded' && getAnswer(question.id) === option.value && option.value !== question.correctAnswer
              }"
              @click="selectSingleAnswer(question.id, option.value)"
            >
              <span class="option-label">{{ option.value }}.</span>
              <span class="option-text">{{ option.text }}</span>
            </div>
          </div>

          <!-- 多选题 -->
          <div v-else-if="question.type === 'multiple'" class="options-container">
            <div
              v-for="option in question.options"
              :key="option.id"
              class="option-item"
              :class="{
                selected: getMultipleAnswers(question.id).includes(option.value),
                correct: submission.status === 'graded' && question.correctAnswers.includes(option.value),
                wrong: submission.status === 'graded' && getMultipleAnswers(question.id).includes(option.value) && !question.correctAnswers.includes(option.value)
              }"
              @click="toggleMultipleAnswer(question.id, option.value)"
            >
              <span class="option-label">{{ option.value }}.</span>
              <span class="option-text">{{ option.text }}</span>
            </div>
          </div>

          <!-- 填空题 -->
          <div v-else-if="question.type === 'fill'" class="fill-container">
            <div
              v-for="(blank, blankIndex) in getBlankCount(question.questionText)"
              :key="blankIndex"
              class="fill-item"
            >
              <el-input
                v-model="fillAnswers[`${question.id}_${blankIndex}`]"
                :placeholder="`请填写第${blankIndex + 1}个空`"
                :disabled="submission.status === 'submitted'"
                @blur="validateFillAnswer(question.id, blankIndex)"
              />
            </div>
          </div>

          <!-- 问答题 -->
          <div v-else-if="question.type === 'essay'" class="essay-container">
            <el-input
              v-model="essayAnswers[question.id]"
              type="textarea"
              :rows="6"
              placeholder="请输入你的答案..."
              :disabled="submission.status === 'submitted'"
              maxlength="1000"
              show-word-limit
            />
          </div>
        </div>

        <!-- 答案解析 (已提交且显示答案时) -->
        <div v-if="shouldShowExplanation(question)" class="explanation">
          <div class="explanation-header">
            <el-icon><InfoFilled /></el-icon>
            <span>解析</span>
          </div>
          <div class="explanation-content">
            <div v-if="question.type === 'single' || question.type === 'multiple'">
              <strong>正确答案：</strong>{{ getCorrectAnswerText(question) }}
            </div>
            <div v-if="question.explanation">
              <strong>解析：</strong>{{ question.explanation }}
            </div>
            <div v-if="question.knowledgePoints && question.knowledgePoints.length">
              <strong>知识点：</strong>
              <el-tag v-for="point in question.knowledgePoints" :key="point" size="small" class="knowledge-tag">
                {{ point }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="exercise-actions">
      <div class="action-info">
        <span>已答题：{{ answeredCount }}/{{ totalQuestions }}</span>
        <span v-if="estimatedScore > 0">预计得分：{{ estimatedScore }}</span>
      </div>
      <div class="action-buttons">
        <el-button @click="saveProgress" :disabled="submission.status === 'submitted'">
          保存进度
        </el-button>
        <el-button
          type="primary"
          @click="submitExercise"
          :disabled="!canSubmit || submission.status === 'submitted'"
          :loading="submitting"
        >
          {{ submission.status === 'submitted' ? '已提交' : '提交练习' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  EditPen,
  Check,
  Close,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  submission: {
    type: Object,
    default: () => ({
      status: 'not_started', // not_started, in_progress, submitted, graded
      totalScore: 0,
      maxScore: 0,
      percentage: 0,
      answers: {}
    })
  }
})

const emit = defineEmits(['answer-changed', 'submit', 'save-progress'])

// 答案数据
const singleAnswers = ref({})
const multipleAnswers = ref({})
const fillAnswers = ref({})
const essayAnswers = ref({})

const submitting = ref(false)

// 计算属性
const totalQuestions = computed(() => props.exercise.questions.length)
const totalScore = computed(() => props.exercise.questions.reduce((sum, q) => sum + q.score, 0))
const answeredCount = computed(() => {
  let count = 0
  props.exercise.questions.forEach(question => {
    if (isQuestionAnswered(question.id)) count++
  })
  return count
})

const estimatedScore = computed(() => {
  let score = 0
  props.exercise.questions.forEach(question => {
    if (isQuestionAnswered(question.id)) {
      // 这里简化处理，实际应该根据题目类型和答案计算
      score += Math.floor(question.score * 0.7) // 假设答对70%
    }
  })
  return score
})

const canSubmit = computed(() => {
  // 检查必答题是否都已完成
  return props.exercise.questions.every(question => {
    if (props.exercise.settings?.required !== false) {
      return isQuestionAnswered(question.id)
    }
    return true
  })
})

// 方法
const getQuestionTypeLabel = (type) => {
  const labels = {
    single: '单选题',
    multiple: '多选题',
    fill: '填空题',
    essay: '问答题'
  }
  return labels[type] || '未知题型'
}

const getDifficultyType = (difficulty) => {
  const types = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return types[difficulty] || 'info'
}

const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return labels[difficulty] || '未知'
}

const isQuestionAnswered = (questionId) => {
  const question = props.exercise.questions.find(q => q.id === questionId)
  if (!question) return false

  switch (question.type) {
    case 'single':
      return !!singleAnswers.value[questionId]
    case 'multiple':
      return multipleAnswers.value[questionId] && multipleAnswers.value[questionId].length > 0
    case 'fill':
      const blanks = getBlankCount(question.questionText)
      for (let i = 0; i < blanks; i++) {
        if (!fillAnswers.value[`${questionId}_${i}`]) return false
      }
      return true
    case 'essay':
      return !!essayAnswers.value[questionId] && essayAnswers.value[questionId].trim().length > 0
    default:
      return false
  }
}

const isQuestionCorrect = (questionId) => {
  if (props.submission.status !== 'graded') return false

  const question = props.exercise.questions.find(q => q.id === questionId)
  if (!question) return false

  switch (question.type) {
    case 'single':
      return getAnswer(questionId) === question.correctAnswer
    case 'multiple':
      const userAnswers = getMultipleAnswers(questionId)
      const correctAnswers = question.correctAnswers || []
      return userAnswers.length === correctAnswers.length &&
             userAnswers.every(answer => correctAnswers.includes(answer))
    case 'fill':
      const userFillAnswers = []
      const blanks = getBlankCount(question.questionText)
      for (let i = 0; i < blanks; i++) {
        userFillAnswers.push(fillAnswers.value[`${questionId}_${i}`])
      }
      const correctFillAnswers = question.correctAnswers || []
      return userFillAnswers.every((answer, index) =>
        answer && correctFillAnswers[index] &&
        answer.toLowerCase().trim() === correctFillAnswers[index].toLowerCase().trim()
      )
    case 'essay':
      // 问答题需要人工评分，这里暂时返回true
      return true
    default:
      return false
  }
}

const getAnswer = (questionId) => {
  return singleAnswers.value[questionId] || ''
}

const getMultipleAnswers = (questionId) => {
  return multipleAnswers.value[questionId] || []
}

const getBlankCount = (questionText) => {
  const matches = questionText.match(/___+/g)
  return matches ? matches.length : 1
}

const selectSingleAnswer = (questionId, value) => {
  if (props.submission.status === 'submitted') return

  singleAnswers.value[questionId] = value
  emitAnswerChange()
}

const toggleMultipleAnswer = (questionId, value) => {
  if (props.submission.status === 'submitted') return

  if (!multipleAnswers.value[questionId]) {
    multipleAnswers.value[questionId] = []
  }

  const index = multipleAnswers.value[questionId].indexOf(value)
  if (index > -1) {
    multipleAnswers.value[questionId].splice(index, 1)
  } else {
    multipleAnswers.value[questionId].push(value)
  }

  emitAnswerChange()
}

const validateFillAnswer = (questionId, blankIndex) => {
  // 可以在这里添加填空题验证逻辑
  emitAnswerChange()
}

const getCorrectAnswerText = (question) => {
  if (question.type === 'single') {
    const correctOption = question.options.find(opt => opt.value === question.correctAnswer)
    return correctOption ? `${question.correctAnswer}. ${correctOption.text}` : question.correctAnswer
  } else if (question.type === 'multiple') {
    const correctTexts = (question.correctAnswers || []).map(answer => {
      const option = question.options.find(opt => opt.value === answer)
      return option ? `${answer}. ${option.text}` : answer
    })
    return correctTexts.join(', ')
  } else if (question.type === 'fill') {
    return (question.correctAnswers || []).join(', ')
  }
  return ''
}

const shouldShowExplanation = (question) => {
  return props.submission.status === 'graded' &&
         props.exercise.settings?.showCorrectAnswers !== false &&
         isQuestionAnswered(question.id)
}

const emitAnswerChange = () => {
  const answers = collectAllAnswers()
  emit('answer-changed', answers)
}

const collectAllAnswers = () => {
  const answers = {}

  props.exercise.questions.forEach(question => {
    switch (question.type) {
      case 'single':
        if (singleAnswers.value[question.id]) {
          answers[question.id] = {
            type: 'single',
            answer: singleAnswers.value[question.id]
          }
        }
        break
      case 'multiple':
        if (multipleAnswers.value[question.id] && multipleAnswers.value[question.id].length > 0) {
          answers[question.id] = {
            type: 'multiple',
            answer: multipleAnswers.value[question.id]
          }
        }
        break
      case 'fill':
        const fillAnswer = []
        const blanks = getBlankCount(question.questionText)
        for (let i = 0; i < blanks; i++) {
          const answer = fillAnswers.value[`${question.id}_${i}`]
          if (answer) fillAnswer.push(answer)
        }
        if (fillAnswer.length > 0) {
          answers[question.id] = {
            type: 'fill',
            answer: fillAnswer
          }
        }
        break
      case 'essay':
        if (essayAnswers.value[question.id]) {
          answers[question.id] = {
            type: 'essay',
            answer: essayAnswers.value[question.id]
          }
        }
        break
    }
  })

  return answers
}

const saveProgress = () => {
  const answers = collectAllAnswers()
  emit('save-progress', answers)
  ElMessage.success('进度已保存')
}

const submitExercise = async () => {
  if (!canSubmit.value) {
    ElMessage.warning('请完成所有必答题')
    return
  }

  try {
    await ElMessageBox.confirm('确定要提交练习吗？提交后将无法修改答案。', '确认提交', {
      confirmButtonText: '确定提交',
      cancelButtonText: '取消',
      type: 'warning'
    })

    submitting.value = true
    const answers = collectAllAnswers()
    emit('submit', answers)

    // 模拟提交过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('练习提交成功！')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('提交失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

// 初始化答案数据
const initializeAnswers = () => {
  if (props.submission.answers) {
    Object.keys(props.submission.answers).forEach(questionId => {
      const answer = props.submission.answers[questionId]
      switch (answer.type) {
        case 'single':
          singleAnswers.value[questionId] = answer.answer
          break
        case 'multiple':
          multipleAnswers.value[questionId] = answer.answer
          break
        case 'fill':
          answer.answer.forEach((fill, index) => {
            fillAnswers.value[`${questionId}_${index}`] = fill
          })
          break
        case 'essay':
          essayAnswers.value[questionId] = answer.answer
          break
      }
    })
  }
}

// 监听props变化
watch(() => props.submission, () => {
  initializeAnswers()
}, { immediate: true })

onMounted(() => {
  initializeAnswers()
})
</script>

<style lang="scss" scoped>
.exercise-panel {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.exercise-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;

  .exercise-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .exercise-icon {
      color: #409eff;
      font-size: 20px;
    }

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      flex: 1;
    }

    .exercise-score {
      background: #ecf5ff;
      color: #409eff;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .exercise-description {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .exercise-progress {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-progress {
      flex: 1;
      max-width: 200px;
    }

    .progress-text {
      font-size: 14px;
      color: #606266;
    }
  }
}

.questions-container {
  .question-item {
    margin-bottom: 32px;
    padding: 24px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      border-color: #c6e2ff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
    }

    &.question-answered {
      border-color: #e1f3d8;
      background: #f9fffe;
    }

    &.question-correct {
      border-color: #67c23a;
      background: #f0f9ff;
    }

    &.question-wrong {
      border-color: #f56c6c;
      background: #fef0f0;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .question-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .question-number {
          background: #409eff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .question-type {
          color: #909399;
          font-size: 13px;
        }

        .question-score {
          color: #e6a23c;
          font-weight: 600;
          font-size: 13px;
        }
      }

      .question-result {
        font-size: 18px;
      }
    }

    .question-content {
      .question-text {
        font-size: 16px;
        line-height: 1.8;
        color: #303133;
        margin-bottom: 20px;
      }

      .options-container {
        .option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          margin-bottom: 12px;
          border: 2px solid #e4e7ed;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #409eff;
            background: #f5f7fa;
          }

          &.selected {
            border-color: #409eff;
            background: #ecf5ff;
          }

          &.correct {
            border-color: #67c23a;
            background: #f0f9ff;
          }

          &.wrong {
            border-color: #f56c6c;
            background: #fef0f0;
          }

          .option-label {
            font-weight: 600;
            color: #606266;
            min-width: 24px;
          }

          .option-text {
            flex: 1;
            color: #303133;
          }
        }
      }

      .fill-container {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .fill-item {
          .el-input {
            max-width: 400px;
          }
        }
      }

      .essay-container {
        .el-textarea {
          :deep(.el-textarea__inner) {
            font-size: 15px;
            line-height: 1.6;
          }
        }
      }
    }

    .explanation {
      margin-top: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #409eff;

      .explanation-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: #409eff;
        font-weight: 600;
      }

      .explanation-content {
        color: #606266;
        line-height: 1.6;

        div {
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .knowledge-tag {
          margin-right: 8px;
          margin-top: 4px;
        }
      }
    }
  }
}

.exercise-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  margin-top: 24px;

  .action-info {
    display: flex;
    gap: 20px;
    color: #606266;
    font-size: 14px;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .exercise-panel {
    padding: 16px;
  }

  .exercise-header {
    .exercise-title {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      h3 {
        width: 100%;
      }
    }

    .exercise-progress {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .el-progress {
        width: 100%;
        max-width: none;
      }
    }
  }

  .questions-container {
    .question-item {
      padding: 16px;

      .question-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;

        .question-info {
          flex-wrap: wrap;
        }
      }

      .question-content {
        .options-container {
          .option-item {
            padding: 12px;

            .option-text {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .exercise-actions {
    flex-direction: column;
    gap: 16px;

    .action-info {
      justify-content: center;
    }

    .action-buttons {
      width: 100%;

      .el-button {
        flex: 1;
      }
    }
  }
}
</style>