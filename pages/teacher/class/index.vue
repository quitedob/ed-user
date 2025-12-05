<template>
  <div class="class-index">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>我的班级</h1>
        <p>管理班级学生和学习进度</p>
      </div>
    </div>

    <!-- 班级统计卡片 -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ classes.length }}</div>
        <div class="stat-label">总班级数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ totalStudents }}</div>
        <div class="stat-label">总学生数</div>
      </el-card>
    </div>

    <!-- 搜索 -->
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索班级名称或课程"
        style="width: 300px"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 班级网格 -->
    <div class="classes-grid">
      <el-card
        v-for="classInfo in filteredClasses"
        :key="classInfo.id"
        class="class-card"
        shadow="hover"
        @click="goToClassDetail(classInfo.id)"
      >
        <div class="class-header">
          <div class="class-info">
            <h3 class="class-name">{{ classInfo.name }}</h3>
            <div class="class-course">{{ classInfo.courseName }}</div>
          </div>
          <el-tag type="success">进行中</el-tag>
        </div>

        <div class="class-meta">
          <div class="meta-item">
            <el-icon><User /></el-icon>
            <span>{{ classInfo.studentCount }}名学生</span>
          </div>
        </div>

        <div class="class-actions">
          <el-button type="primary" size="small" @click.stop="manageClass(classInfo)">
            管理
          </el-button>
          <el-button size="small" @click.stop="goToAttendance(classInfo)">
            考勤
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredClasses.length === 0" class="empty-state">
      <el-empty description="暂无班级" />
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Search, User } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'teacher'
})

const router = useRouter()
const searchQuery = ref('')
const classes = ref([])

const filteredClasses = computed(() => {
  if (!searchQuery.value) return classes.value
  return classes.value.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalStudents = computed(() => classes.value.reduce((t, c) => t + c.studentCount, 0))

const loadClasses = async () => {
  // 模拟数据
  classes.value = [
    { id: 'class_t001', name: '计算机2101班', courseName: 'Python编程基础', studentCount: 28 },
    { id: 'class_t002', name: '软件工程2201班', courseName: 'JavaScript进阶开发', studentCount: 35 },
    { id: 'class_t003', name: '数据科学2201班', courseName: '数据结构与算法', studentCount: 42 }
  ]
}

const goBack = () => router.push('/teacher')
const goToClassDetail = (id) => router.push(`/teacher/class/${id}`)
const manageClass = (classInfo) => router.push(`/teacher/class/${classInfo.id}`)
const goToAttendance = (classInfo) => ElMessage.info(`考勤管理：${classInfo.name}`)

onMounted(() => loadClasses())
</script>

<style lang="scss" scoped>
.class-index {
  padding: 32px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;

    .header-info {
      flex: 1;
    }

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 4px 0;
    }

    p {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .stats-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    .stat-card {
      text-align: center;
      padding: 16px 32px;

      .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #303133;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .filter-section {
    margin-bottom: 24px;
  }

  .classes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;

    .class-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      .class-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;

        .class-info {
          .class-name {
            font-size: 20px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 4px 0;
          }
          .class-course {
            font-size: 14px;
            color: #4CAF50;
            font-weight: 500;
          }
        }
      }

      .class-meta {
        margin-bottom: 16px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #606266;
          .el-icon { font-size: 16px; color: #909399; }
        }
      }

      .class-actions {
        display: flex;
        gap: 8px;
      }
    }
  }

  .empty-state {
    margin-top: 60px;
    text-align: center;
  }
}
</style>
