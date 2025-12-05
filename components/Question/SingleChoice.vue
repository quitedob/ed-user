<template>
  <div class="question-single">
    <div class="question-text" v-html="question.questionText"></div>
    <div v-if="!completed" class="options">
      <el-radio-group v-model="question.userAnswer">
        <el-radio v-for="option in question.options" :key="option.id" :label="option.value" class="option-item">
          <span class="option-label">{{ option.value }}.</span>
          <span class="option-text">{{ option.text }}</span>
        </el-radio>
      </el-radio-group>
    </div>
    <div v-else class="answer-display">
      <div class="answer-section">
        <div class="section-label correct"><el-icon><Check /></el-icon><span>正确答案</span></div>
        <div class="answer-value">{{ question.correctAnswer }}</div>
      </div>
      <div v-if="question.userAnswer" class="answer-section">
        <div class="section-label"><span>你的答案</span></div>
        <div class="answer-value" :class="{ correct: question.userAnswer === question.correctAnswer, wrong: question.userAnswer !== question.correctAnswer }">
          {{ question.userAnswer }}
          <el-icon v-if="question.userAnswer !== question.correctAnswer" class="wrong-icon"><Close /></el-icon>
        </div>
      </div>
      <div v-if="question.explanation" class="explanation"><el-icon><InfoFilled /></el-icon>{{ question.explanation }}</div>
    </div>
  </div>
</template>

<script setup>
import { Check, Close, InfoFilled } from '@element-plus/icons-vue'
defineProps({ question: Object, completed: Boolean })
</script>
