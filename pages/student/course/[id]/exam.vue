<template>
  <div class="exam-page">
    <!-- 如果有子路由（examId），显示子路由内容 -->
    <NuxtPage v-if="hasSubRoute" />
    <!-- 否则显示考试列表 -->
    <CourseExam v-else />
  </div>
</template>

<script setup>
import CourseExam from '~/components/Course/CourseExam.vue'

definePageMeta({
  title: '课程考试'
})

const route = useRoute()

// 检查是否有子路由（examId参数）
const hasSubRoute = computed(() => {
  return route.params.examId !== undefined
})
</script>

<style lang="scss" scoped>
.exam-page {
  padding: 24px;
  background: white;
  min-height: 100%;
  
  // 当显示子路由时，移除padding
  &:has(> :not(.course-exam)) {
    padding: 0;
  }
}
</style>