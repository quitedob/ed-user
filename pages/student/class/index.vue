<template>
  <div class="class-redirect">
    <el-empty description="请先选择要进入的班级">
      <el-button type="primary" @click="goToStudentHome">返回选择班级</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 页面元数据
definePageMeta({
  layout: false
})

const router = useRouter()

const goToStudentHome = () => {
  router.push('/student')
}
</script>

<style lang="scss" scoped>
.class-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>