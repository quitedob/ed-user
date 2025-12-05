<template>
  <div class="question-fill">
    <div class="question-text" v-html="question.questionText"></div>
    <div v-if="!completed" class="fill-input">
      <el-input v-model="question.userAnswer" type="textarea" :rows="3" placeholder="请输入答案" maxlength="500" show-word-limit />
    </div>
    <div v-else class="answer-display">
      <div class="answer-section">
        <div class="section-label correct"><el-icon><Check /></el-icon><span>正确答案</span></div>
        <div class="answer-value">{{ question.correctAnswers?.join(' 或 ') }}</div>
      </div>
      <div v-if="question.userAnswer" class="answer-section">
        <div class="section-label"><span>你的答案</span></div>
        <div class="answer-value">{{ question.userAnswer }}</div>
      </div>
      <div v-if="question.explanation" class="explanation"><el-icon><InfoFilled /></el-icon>{{ question.explanation }}</div>
    </div>
  </div>
</template>

<script setup>
import { Check, InfoFilled } from '@element-plus/icons-vue'
defineProps({ question: Object, completed: Boolean })
</script>
