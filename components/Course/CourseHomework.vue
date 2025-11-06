<template>
  <div class="course-homework">
    <!-- 作业列表视图 -->
    <div class="homework-list-view">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="未完成" name="pending">
          <div class="homework-list">
            <div
              v-for="homework in pendingHomework"
              :key="homework.id"
              class="homework-card"
              @click="openHomework(homework)"
            >
              <div class="homework-header">
                <h3>{{ homework.title }}</h3>
                <el-tag type="warning">未完成</el-tag>
              </div>
              <div class="homework-meta">
                <span>总分: {{ homework.totalScore }}分</span>
                <span>截止时间: {{ homework.deadline }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="completed">
          <div class="homework-list">
            <div
              v-for="homework in completedHomework"
              :key="homework.id"
              class="homework-card completed"
              @click="openHomework(homework)"
            >
              <div class="homework-header">
                <h3>{{ homework.title }}</h3>
                <el-tag type="success">已完成</el-tag>
              </div>
              <div class="homework-meta">
                <span>得分: {{ homework.score }}/{{ homework.totalScore }}分</span>
                <span>提交时间: {{ homework.submitTime }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

console.log('🔵 CourseHomework 组件已初始化 - 当前路径:', route.path)

const courseId = computed(() => {
  const id = route.params.id && !isNaN(parseInt(route.params.id)) ? parseInt(route.params.id) : 1
  console.log('CourseHomework - courseId:', id, 'route.params:', route.params)
  return id
})

const activeTab = ref('pending')

// 未完成作业数据
const pendingHomework = ref([
  {
    id: 1,
    title: '第一章综合练习',
    totalScore: 100,
    deadline: '2024-12-01 14:29:16',
    completed: false
  }
])

// 已完成作业数据
const completedHomework = ref([
  {
    id: 2,
    title: '第四章习题课',
    totalScore: 100,
    score: 85,
    submitTime: '2024-10-23 15:40',
    completed: true
  }
])

const openHomework = (homework) => {
  const targetUrl = `/student/course/${courseId.value}/homework/${homework.id}`
  console.log('🚀 准备跳转到作业详情:', targetUrl, 'homework:', homework)
  console.log('🚀 当前 courseId:', courseId.value, 'homeworkId:', homework.id)
  router.push(targetUrl)
}
</script>

<style lang="scss" scoped>
.course-homework {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 作业列表视图
.homework-list-view {
  .homework-list {
    padding: 16px;

    .homework-card {
      background: white;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
      }

      &.completed {
        border-color: #67c23a;
      }

      .homework-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }
      }

      .homework-meta {
        display: flex;
        gap: 24px;
        font-size: 13px;
        color: #606266;
      }
    }
  }
}
</style>
