<template>
  <div class="teacher-courses">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">我教的课程</h1>
        <p class="page-subtitle">管理和监控您的所有课程</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreateCourse">
          <el-icon><Plus /></el-icon>
          新建课程
        </el-button>
      </div>
    </div>

    <!-- 课程统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ courses.length }}</div>
          <div class="stat-label">总课程数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ totalStudents }}</div>
          <div class="stat-label">总学员数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ avgProgress }}%</div>
          <div class="stat-label">平均进度</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ activeCourses }}</div>
          <div class="stat-label">进行中课程</div>
        </div>
      </el-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="filter-left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索课程名称"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="filter-right">
        <el-select v-model="statusFilter" placeholder="课程状态" style="width: 120px" clearable>
          <el-option label="全部" value="" />
          <el-option label="进行中" value="active" />
          <el-option label="已完成" value="completed" />
          <el-option label="草稿" value="draft" />
        </el-select>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="courses-grid">
      <el-card
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-card"
        shadow="hover"
        @click="goToCourseDetail(course.id)"
      >
        <div class="course-cover">
          <img :src="course.cover" :alt="course.title" />
          <div class="course-status" :class="course.status">
            {{ getStatusText(course.status) }}
          </div>
        </div>
        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-description">{{ course.description }}</p>

          <div class="course-meta">
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ course.totalStudents }}名学员</span>
            </div>
            <div class="meta-item">
              <el-icon><Reading /></el-icon>
              <span>{{ course.totalLessons }}课时</span>
            </div>
            <div class="meta-item">
              <el-icon><DataLine /></el-icon>
              <span>{{ course.avgProgress }}%进度</span>
            </div>
          </div>

          <div class="course-progress">
            <el-progress
              :percentage="course.avgProgress"
              :stroke-width="6"
              :show-text="false"
            />
          </div>

          <div class="course-actions">
            <el-button type="primary" size="small" @click.stop="manageCourse(course)">
              管理
            </el-button>
            <el-button size="small" @click.stop="viewStudents(course)">
              学员
            </el-button>
            <el-dropdown @command="(cmd) => handleCommand(cmd, course)" @click.stop>
              <el-button size="small" text>
                更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑课程</el-dropdown-item>
                  <el-dropdown-item command="stats">统计数据</el-dropdown-item>
                  <el-dropdown-item command="duplicate">复制课程</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除课程</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredCourses.length === 0" class="empty-state">
      <el-empty description="暂无课程">
        <el-button type="primary" @click="handleCreateCourse">创建第一门课程</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import {
  Plus, Search, User, Reading, DataLine, ArrowDown
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: 'teacher'
})

// 响应式数据
const searchQuery = ref('')
const statusFilter = ref('')
const courses = ref([])
const loading = ref(false)

// 计算属性
const filteredCourses = computed(() => {
  let filtered = courses.value

  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter(course => course.status === statusFilter.value)
  }

  return filtered
})

const totalStudents = computed(() => {
  return courses.value.reduce((total, course) => total + course.totalStudents, 0)
})

const avgProgress = computed(() => {
  if (courses.value.length === 0) return 0
  const total = courses.value.reduce((total, course) => total + course.avgProgress, 0)
  return Math.round(total / courses.value.length)
})

const activeCourses = computed(() => {
  return courses.value.filter(course => course.status === 'active').length
})

// 方法
const loadCourses = async () => {
  loading.value = true
  try {
    // 使用模拟API加载数据
    const { teacherApi } = await import('~/api/mock')
    const response = await teacherApi.getTeacherCourses()
    courses.value = response.data.list
  } catch (error) {
    console.error('加载课程失败:', error)
    ElMessage.error('加载课程失败')
  } finally {
    loading.value = false
  }
}

const goToCourseDetail = (courseId) => {
  navigateTo(`/teacher/course/${courseId}`)
}

const manageCourse = (course) => {
  navigateTo(`/teacher/course/${course.id}`)
}

const viewStudents = (course) => {
  navigateTo(`/teacher/course/${course.id}/students`)
}

const handleCreateCourse = () => {
  router.push('/teacher/course/create')
}

const handleCommand = (command, course) => {
  switch (command) {
    case 'edit':
      ElMessage.info(`编辑课程: ${course.title}`)
      break
    case 'stats':
      ElMessage.info(`查看统计数据: ${course.title}`)
      break
    case 'duplicate':
      ElMessage.info(`复制课程: ${course.title}`)
      break
    case 'delete':
      ElMessageBox.confirm(`确定要删除课程"${course.title}"吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('删除成功')
        loadCourses()
      })
      break
  }
}

const getStatusText = (status) => {
  const statusMap = {
    active: '进行中',
    completed: '已完成',
    draft: '草稿'
  }
  return statusMap[status] || '未知'
}

// 生命周期
onMounted(() => {
  loadCourses()
})
</script>

<style lang="scss" scoped>
.teacher-courses {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .header-left {
      .page-title {
        font-size: 28px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
      }

      .page-subtitle {
        font-size: 16px;
        color: #606266;
        margin: 0;
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  // 统计卡片
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      text-align: center;

      .stat-content {
        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  // 筛选区域
  .filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;

    .filter-left {
      display: flex;
      gap: 12px;
    }

    .filter-right {
      display: flex;
      gap: 12px;
    }
  }

  // 课程网格
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;

    .course-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .course-cover {
        position: relative;
        width: 100%;
        height: 180px;
        border-radius: 8px 8px 0 0;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-status {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;

          &.active {
            background: #4CAF50;
            color: white;
          }

          &.completed {
            background: #2196F3;
            color: white;
          }

          &.draft {
            background: #FF9800;
            color: white;
          }
        }
      }

      .course-content {
        padding: 16px;

        .course-title {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .course-description {
          font-size: 14px;
          color: #606266;
          margin: 0 0 16px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: #909399;

            .el-icon {
              font-size: 14px;
            }
          }
        }

        .course-progress {
          margin-bottom: 16px;
        }

        .course-actions {
          display: flex;
          gap: 8px;

          .el-button {
            flex: 1;
          }
        }
      }
    }
  }

  // 空状态
  .empty-state {
    margin-top: 60px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .teacher-courses {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .filter-section {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }

    .courses-grid {
      grid-template-columns: 1fr;
    }

    .stats-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>