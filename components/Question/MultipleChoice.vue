<template>
  <div class="question-multiple">
    <div class="question-text" v-html="question.questionText"></div>
    <div v-if="!completed" class="options">
      <el-checkbox-group v-model="question.userAnswer">
        <el-checkbox v-for="option in question.options" :key="option.id" :label="option.value" class="option-item">
          <span class="option-label">{{ option.value }}.</span>
          <span class="option-text">{{ option.text }}</span>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else class="answer-display">
      <div class="answer-section">
        <div class="section-label correct"><el-icon><Check /></el-icon><span>正确答案</span></div>
        <div class="answer-value">{{ question.correctAnswers?.join(', ') }}</div>
      </div>
      <div v-if="question.userAnswer?.length" class="answer-section">
        <div class="section-label"><span>你的答案</span></div>
        <div class="answer-value" :class="{ correct: isCorrect, wrong: !isCorrect }">
          {{ question.userAnswer?.join(', ') }}
          <el-icon v-if="!isCorrect" class="wrong-icon"><Close /></el-icon>
        </div>
      </div>
      <div v-if="question.explanation" class="explanation"><el-icon><InfoFilled /></el-icon>{{ question.explanation }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Close, InfoFilled } from '@element-plus/icons-vue'
const props = defineProps({ question: Object, completed: Boolean })
const isCorrect = computed(() => {
  if (!props.question.userAnswer || !props.question.correctAnswers) return false
  return JSON.stringify([...props.question.userAnswer].sort()) === JSON.stringify([...props.question.correctAnswers].sort())
})
</script>
