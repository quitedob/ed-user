<template>
  <div class="course-overview">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon students">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ courseStats.totalStudents }}</div>
            <div class="stat-label">总学员数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon progress">
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ courseStats.avgProgress }}%</div>
            <div class="stat-label">平均进度</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon homework">
            <el-icon><EditPen /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ courseStats.pendingHomework }}</div>
            <div class="stat-label">待批改作业</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon active">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ courseStats.activeRate }}%</div>
            <div class="stat-label">活跃度</div>
          </div>
        </div>
      </el-card>
    </div>

  
    <!-- 章节完成情况 -->
    <el-card class="chapters-card">
      <template #header>
        <div class="card-header">
          <h3>章节完成情况</h3>
        </div>
      </template>
      <div class="chapters-list">
        <div
          v-for="chapter in courseChapters"
          :key="chapter.id"
          class="chapter-item"
        >
          <div class="chapter-info">
            <h4 class="chapter-title">{{ chapter.title }}</h4>
            <div class="chapter-meta">
              <span>{{ chapter.lessons }}课时</span>
              <span>{{ chapter.completedStudents }}人完成</span>
            </div>
          </div>
          <div class="chapter-progress">
            <el-progress
              :percentage="courseStats.totalStudents > 0 ? Math.round((chapter.completedStudents / courseStats.totalStudents) * 100) : 0"
              :stroke-width="8"
              :format="(percentage) => `${percentage}%`"
            />
          </div>
          <div class="chapter-resources">
            <el-tag v-if="chapter.hasVideo" size="small" type="success">视频</el-tag>
            <el-tag v-if="chapter.hasHomework" size="small" type="warning">作业</el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {
  User, DataLine, EditPen, Monitor
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: 'teacher'
})

// 响应式数据
const route = useRoute()
const courseStats = ref({
  totalStudents: 45,
  avgProgress: 68,
  pendingHomework: 23,
  activeRate: 85
})


const courseChapters = ref([
  {
    id: 'chapter_001',
    title: 'Python基础语法',
    lessons: 4,
    completedStudents: 38,
    hasVideo: true,
    hasHomework: true
  },
  {
    id: 'chapter_002',
    title: '数据类型与控制流',
    lessons: 4,
    completedStudents: 32,
    hasVideo: true,
    hasHomework: true
  },
  {
    id: 'chapter_003',
    title: '函数与模块',
    lessons: 4,
    completedStudents: 25,
    hasVideo: true,
    hasHomework: true
  }
])


// 加载课程数据
const loadCourseData = async () => {
  try {
    const { teacherApi } = await import('~/api/mock')
    const response = await teacherApi.getTeacherCourseDetail(route.params.id)
    const courseData = response.data

    // 检查courseData是否存在
    if (courseData) {
      // 更新统计数据
      courseStats.value = {
        totalStudents: courseData.totalStudents || 0,
        avgProgress: courseData.avgProgress || 0,
        pendingHomework: 15, // 模拟数据
        activeRate: 85 // 模拟数据
      }

      // 更新章节数据
      courseChapters.value = (courseData.chapters || []).map(chapter => ({
        ...chapter,
        completedStudents: Math.floor((courseData.totalStudents || 0) * (Math.random() * 0.8 + 0.2))
      }))
    }
  } catch (error) {
    console.error('加载课程数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadCourseData()
})
</script>

<style lang="scss" scoped>
.course-overview {
  // 统计卡片网格
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          &.students {
            background: linear-gradient(135deg, #2196F3, #1976D2);
          }

          &.progress {
            background: linear-gradient(135deg, #4CAF50, #388E3C);
          }

          &.homework {
            background: linear-gradient(135deg, #FF9800, #F57C00);
          }

          &.active {
            background: linear-gradient(135deg, #9C27B0, #7B1FA2);
          }

          .el-icon {
            font-size: 28px;
          }
        }

        .stat-info {
          .stat-number {
            font-size: 32px;
            font-weight: 700;
            color: #303133;
            line-height: 1;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }

  
  // 章节卡片
  .chapters-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }

    .chapters-list {
      .chapter-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .chapter-info {
          flex: 1;

          .chapter-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 4px 0;
          }

          .chapter-meta {
            display: flex;
            gap: 16px;
            font-size: 14px;
            color: #909399;
          }
        }

        .chapter-progress {
          width: 200px;

          @media (max-width: 768px) {
            width: 150px;
          }
        }

        .chapter-resources {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .course-overview {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .chapters-card .chapters-list .chapter-item {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;

      .chapter-progress {
        width: 100%;
      }

      .chapter-resources {
        align-self: flex-start;
      }
    }
  }
}
</style>