<template>
  <Course />
</template>

<script setup>
import Course from './Course.vue'

definePageMeta({
  layout: false,
  // middleware: ['auth'], // 暂时注释，开发时使用
  title: '我的课程'
})
</script>