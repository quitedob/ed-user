<template>
  <div class="question-essay">
    <div class="question-text" v-html="question.questionText"></div>
    <div v-if="!completed" class="essay-input">
      <el-input v-model="question.userAnswer" type="textarea" :rows="10" placeholder="请输入答案..." maxlength="2000" show-word-limit />
    </div>
    <div v-else class="answer-display">
      <div v-if="question.referenceAnswer" class="answer-section">
        <div class="section-label correct"><el-icon><Check /></el-icon><span>参考答案</span></div>
        <div class="answer-value" v-html="question.referenceAnswer"></div>
      </div>
      <div v-if="question.userAnswer" class="answer-section">
        <div class="section-label"><span>你的答案</span></div>
        <div class="answer-value" v-html="question.userAnswer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from '@element-plus/icons-vue'
defineProps({ question: Object, completed: Boolean })
</script>
