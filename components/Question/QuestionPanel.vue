<template>
  <div class="question-panel">
    <!-- 顶部导航栏 -->
    <div class="panel-header">
      <div class="header-left">
        <el-button @click="$emit('back')" text>
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1 class="panel-title">{{ title }}</h1>
      </div>
      <div class="header-right">
        <div class="panel-meta">
          <span v-if="totalScore">总分：{{ totalScore }}分</span>
          <span v-if="deadline">截止：{{ formatDate(deadline) }}</span>
          <slot name="header-extra"></slot>
        </div>
        <div v-if="completed && score !== undefined" class="score-display">
          <span class="score-value">{{ score }}</span>
          <span class="score-label">分</span>
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="panel-body" :class="{ 'oj-layout': currentQuestion?.type === 'oj' }">
      <!-- OJ 题目左侧：题目描述 -->
      <div v-if="currentQuestion?.type === 'oj'" class="oj-description-panel">
        <div class="oj-panel-content">
          <OjDescription :question="currentQuestion" />
        </div>
      </div>

      <!-- 中间答题区 -->
      <div class="answer-area">
        <div v-if="currentQuestion" class="question-detail">
          <!-- 题目头部 -->
          <div v-if="currentQuestion.type !== 'oj'" class="question-header">
            <div class="header-main">
              <span class="question-number">{{ activeIndex + 1 }}</span>
              <span class="question-type">{{ getQuestionTypeText(currentQuestion.type) }}</span>
              <span class="question-score">{{ currentQuestion.score }}分</span>
            </div>
            <div class="header-nav">
              <el-button :disabled="activeIndex === 0" @click="switchQuestion(activeIndex - 1)" size="small">上一题</el-button>
              <el-button :disabled="activeIndex === questions.length - 1" @click="switchQuestion(activeIndex + 1)" size="small" type="primary">下一题</el-button>
            </div>
          </div>

          <!-- 题目内容 -->
          <div class="question-content">
            <SingleChoice v-if="currentQuestion.type === 'single'" :question="currentQuestion" :completed="completed" />
            <MultipleChoice v-else-if="currentQuestion.type === 'multiple'" :question="currentQuestion" :completed="completed" />
            <JudgeQuestion v-else-if="currentQuestion.type === 'judge'" :question="currentQuestion" :completed="completed" />
            <FillBlank v-else-if="currentQuestion.type === 'fill'" :question="currentQuestion" :completed="completed" />
            <EssayQuestion v-else-if="currentQuestion.type === 'essay'" :question="currentQuestion" :completed="completed" />
            <OjQuestion v-else-if="currentQuestion.type === 'oj'" :question="currentQuestion" :completed="completed" @run="$emit('runCode')" @submit-code="$emit('submitCode')" />
          </div>

          <!-- 底部操作按钮 -->
          <div v-if="currentQuestion.type !== 'oj'" class="question-footer">
            <el-button :disabled="activeIndex === 0" @click="switchQuestion(activeIndex - 1)">上一题</el-button>
            <el-button v-if="activeIndex < questions.length - 1" type="primary" @click="switchQuestion(activeIndex + 1)">下一题</el-button>
            <el-button v-else-if="!completed" type="success" @click="$emit('submit')">{{ submitText }}</el-button>
          </div>
        </div>
      </div>

      <!-- 右侧答题卡 -->
      <div class="answer-card">
        <div class="card-header">
          <h3>答题卡</h3>
          <div class="progress-info"><span>已答：{{ answeredCount }}/{{ questions.length }}</span></div>
        </div>
        <div class="card-content">
          <div class="card-grid">
            <div v-for="(q, i) in questions" :key="q.id" class="card-item" :class="{ answered: isAnswered(q), active: activeIndex === i }" @click="switchQuestion(i)">{{ i + 1 }}</div>
          </div>
        </div>
        <div v-if="!completed" class="card-footer">
          <el-button type="primary" size="large" @click="$emit('submit')" style="width: 100%">{{ submitText }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import SingleChoice from './SingleChoice.vue'
import MultipleChoice from './MultipleChoice.vue'
import JudgeQuestion from './JudgeQuestion.vue'
import FillBlank from './FillBlank.vue'
import EssayQuestion from './EssayQuestion.vue'
import OjQuestion from './OjQuestion.vue'
import OjDescription from './OjDescription.vue'

const props = defineProps({
  title: { type: String, default: '' },
  questions: { type: Array, default: () => [] },
  activeIndex: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: undefined },
  totalScore: { type: Number, default: 0 },
  deadline: { type: String, default: '' },
  submitText: { type: String, default: '提交' }
})

const emit = defineEmits(['back', 'submit', 'switch', 'runCode', 'submitCode'])

const currentQuestion = computed(() => props.questions[props.activeIndex])
const answeredCount = computed(() => props.questions.filter(q => isAnswered(q)).length)

const isAnswered = (q) => {
  if (!q.userAnswer) return false
  if (q.type === 'single' || q.type === 'judge') return q.userAnswer !== ''
  if (q.type === 'multiple') return Array.isArray(q.userAnswer) && q.userAnswer.length > 0
  return typeof q.userAnswer === 'string' && q.userAnswer.trim() !== ''
}

const getQuestionTypeText = (type) => ({ single: '单选题', multiple: '多选题', judge: '判断题', fill: '填空题', essay: '简答题', oj: '编程题' }[type] || '未知')
const formatDate = (d) => d ? new Date(d).toLocaleString('zh-CN') : ''
const switchQuestion = (i) => emit('switch', i)
</script>

<style lang="scss" scoped>
@import './question-panel.scss';
@import './question-types.scss';
</style>
