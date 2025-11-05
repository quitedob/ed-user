<template>
  <div class="ai-page">
    <CourseAI />
  </div>
</template>

<script setup>
import CourseAI from '~/components/Course/CourseAI.vue'

definePageMeta({
  title: 'AI助教'
})
</script>

<style lang="scss" scoped>
.ai-page {
  padding: 24px;
  background: white;
  min-height: 100%;
}
</style>