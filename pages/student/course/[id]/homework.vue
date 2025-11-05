<template>
  <div class="homework-page">
    <CourseHomework />
  </div>
</template>

<script setup>
import CourseHomework from '~/components/Course/CourseHomework.vue'

definePageMeta({
  title: '课程作业'
})
</script>

<style lang="scss" scoped>
.homework-page {
  padding: 24px;
  background: white;
  min-height: 100%;
}
</style>