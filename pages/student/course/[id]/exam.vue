<template>
  <div class="exam-page">
    <CourseExam />
  </div>
</template>

<script setup>
import CourseExam from '~/components/Course/CourseExam.vue'

definePageMeta({
  title: '课程考试'
})
</script>

<style lang="scss" scoped>
.exam-page {
  padding: 24px;
  background: white;
  min-height: 100%;
}
</style>