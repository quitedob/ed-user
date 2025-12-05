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

console.log('🟢 homework/index.vue 页面已初始化 - 路径:', window.location.pathname)
</script>

<style lang="scss" scoped>
.homework-page {
  padding: 24px;
  background: white;
  min-height: 100%;
}
</style>