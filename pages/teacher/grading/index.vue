<template>
  <div class="grading-center">
    <!-- 页面标题和统计 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">批阅中心</h1>
        <p class="page-subtitle">管理和批改学生作业与考试</p>
      </div>
      <div class="header-stats">
        <div class="stat-item urgent">
          <div class="stat-number">{{ gradingStats.totalPending }}</div>
          <div class="stat-label">待批改</div>
        </div>
        <div class="stat-item today">
          <div class="stat-number">{{ gradingStats.todayGraded }}</div>
          <div class="stat-label">今日批改</div>
        </div>
      </div>
    </div>

    <!-- 优先级筛选 -->
    <div class="priority-tabs">
      <div class="tab-container">
        <div
          v-for="priority in priorities"
          :key="priority.key"
          class="priority-tab"
          :class="{ active: activePriority === priority.key }"
          @click="setActivePriority(priority.key)"
        >
          <div class="tab-icon" :class="priority.key">
            <el-icon><component :is="priority.icon" /></el-icon>
          </div>
          <div class="tab-content">
            <div class="tab-title">{{ priority.label }}</div>
            <div class="tab-count">{{ priority.count }}项</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <div class="filter-left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索作业或考试名称"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="typeFilter" placeholder="类型" style="width: 120px" clearable>
          <el-option label="全部" value="" />
          <el-option label="作业" value="homework" />
          <el-option label="考试" value="exam" />
        </el-select>
      </div>
      <div class="filter-right">
        <el-button type="primary" @click="batchGrade">
          <el-icon><EditPen /></el-icon>
          批量批改
        </el-button>
        <el-button @click="exportData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 批改列表 -->
    <div class="grading-list">
      <el-card
        v-for="item in filteredGradingItems"
        :key="item.id"
        class="grading-item"
        :class="item.priority"
        shadow="hover"
        @click="openGrading(item)"
      >
        <div class="item-header">
          <div class="item-info">
            <div class="item-type">
              <el-tag :type="item.type === 'homework' ? 'warning' : 'success'" size="small">
                {{ item.type === 'homework' ? '作业' : '考试' }}
              </el-tag>
            </div>
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-meta">
              <span class="course-name">{{ item.courseName }}</span>
              <span class="class-name">{{ item.className }}</span>
            </div>
          </div>
          <div class="item-stats">
            <div class="stat-row">
              <span class="stat-label">提交情况：</span>
              <span class="stat-value">{{ item.submittedCount }}/{{ item.totalCount }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">待批改：</span>
              <span class="stat-value pending">{{ item.pendingCount }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">已批改：</span>
              <span class="stat-value graded">{{ item.gradedCount }}</span>
            </div>
          </div>
        </div>

        <div class="item-progress">
          <div class="progress-info">
            <span class="progress-label">批改进度</span>
            <span class="progress-percentage">
              {{ Math.round((item.gradedCount / item.submittedCount) * 100) }}%
            </span>
          </div>
          <el-progress
            :percentage="Math.round((item.gradedCount / item.submittedCount) * 100)"
            :stroke-width="8"
            :show-text="false"
            :color="getProgressColor(item.gradedCount / item.submittedCount)"
          />
        </div>

        <div class="item-actions">
          <div class="deadline-info" v-if="item.dueDate">
            <el-icon><Clock /></el-icon>
            <span>{{ formatDeadline(item.dueDate) }}</span>
          </div>
          <div class="action-buttons">
            <el-button type="primary" size="small" @click.stop="startGrading(item)">
              开始批改
            </el-button>
            <el-button size="small" @click.stop="viewDetails(item)">
              查看详情
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredGradingItems.length === 0" class="empty-state">
      <el-empty description="暂无待批改项目">
        <el-button type="primary" @click="refreshData">刷新数据</el-button>
      </el-empty>
    </div>

    <!-- 批改对话框 -->
    <el-dialog
      v-model="gradingDialogVisible"
      :title="currentGradingItem?.title"
      width="800px"
      destroy-on-close
    >
      <div v-if="currentGradingItem" class="grading-dialog">
        <div class="grading-header">
          <div class="grading-info">
            <span class="info-item">
              <strong>课程：</strong>{{ currentGradingItem.courseName }}
            </span>
            <span class="info-item">
              <strong>班级：</strong>{{ currentGradingItem.className }}
            </span>
            <span class="info-item">
              <strong>提交：</strong>{{ currentGradingItem.submittedCount }}人
            </span>
          </div>
        </div>
        <div class="grading-content">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="待批改" name="pending">
              <div class="submission-list">
                <div
                  v-for="submission in currentGradingItem.submissions?.filter(s => s.status === 'pending')"
                  :key="submission.id"
                  class="submission-item"
                >
                  <div class="student-info">
                    <el-avatar :size="40" :src="submission.avatar" />
                    <div class="student-details">
                      <div class="student-name">{{ submission.studentName }}</div>
                      <div class="submit-time">提交时间：{{ formatTime(submission.submitTime) }}</div>
                    </div>
                  </div>
                  <div class="submission-actions">
                    <el-button type="primary" size="small" @click="gradeSubmission(submission)">
                      批改
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已批改" name="graded">
              <div class="submission-list">
                <div
                  v-for="submission in currentGradingItem.submissions?.filter(s => s.status === 'graded')"
                  :key="submission.id"
                  class="submission-item graded"
                >
                  <div class="student-info">
                    <el-avatar :size="40" :src="submission.avatar" />
                    <div class="student-details">
                      <div class="student-name">{{ submission.studentName }}</div>
                      <div class="grade-info">
                        <span class="score">{{ submission.score }}分</span>
                        <span class="grade-time">{{ formatTime(submission.gradeTime) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="submission-actions">
                    <el-button size="small" @click="reviewGrading(submission)">
                      复查
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  Search, EditPen, Download, Clock, WarningFilled,
  InfoFilled, SuccessFilled, Document
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: 'teacher'
})

// 响应式数据
const searchQuery = ref('')
const typeFilter = ref('')
const activePriority = ref('all')
const activeTab = ref('pending')
const gradingItems = ref([])
const gradingStats = ref({})
const gradingDialogVisible = ref(false)
const currentGradingItem = ref(null)

// 优先级配置
const priorities = ref([
  { key: 'all', label: '全部', icon: Document, count: 0 },
  { key: 'high', label: '紧急', icon: WarningFilled, count: 0 },
  { key: 'medium', label: '一般', icon: InfoFilled, count: 0 },
  { key: 'low', label: '宽松', icon: SuccessFilled, count: 0 }
])

// 计算属性
const filteredGradingItems = computed(() => {
  let filtered = gradingItems.value

  // 优先级过滤
  if (activePriority.value !== 'all') {
    filtered = filtered.filter(item => item.priority === activePriority.value)
  }

  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 类型过滤
  if (typeFilter.value) {
    filtered = filtered.filter(item => item.type === typeFilter.value)
  }

  return filtered
})

// 方法
const loadGradingData = async () => {
  try {
    const { teacherApi } = await import('~/api/mock')

    // 加载待批改项目
    const pendingResponse = await teacherApi.getPendingGrading()
    gradingItems.value = pendingResponse.data.list

    // 加载统计数据
    const statsResponse = await teacherApi.getGradingStats()
    gradingStats.value = statsResponse.data

    // 更新优先级统计
    updatePriorityCounts()
  } catch (error) {
    console.error('加载批改数据失败:', error)
    ElMessage.error('加载数据失败')
  }
}

const updatePriorityCounts = () => {
  priorities.value.forEach(priority => {
    if (priority.key === 'all') {
      priority.count = gradingItems.value.length
    } else {
      priority.count = gradingItems.value.filter(item => item.priority === priority.key).length
    }
  })
}

const setActivePriority = (priority) => {
  activePriority.value = priority
}

const getProgressColor = (percentage) => {
  if (percentage === 1) return '#4CAF50'
  if (percentage >= 0.7) return '#2196F3'
  if (percentage >= 0.3) return '#FF9800'
  return '#F44336'
}

const formatDeadline = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `已逾期 ${Math.abs(diffDays)} 天`
  } else if (diffDays === 0) {
    return '今天截止'
  } else if (diffDays === 1) {
    return '明天截止'
  } else {
    return `${diffDays} 天后截止`
  }
}

const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openGrading = (item) => {
  currentGradingItem.value = item
  gradingDialogVisible.value = true
}

const startGrading = (item) => {
  // 查找第一个待批改的提交
  const pendingSubmission = item.submissions?.find(s => s.status === 'pending')
  if (pendingSubmission) {
    gradeSubmission(pendingSubmission)
  } else {
    ElMessage.info('没有待批改的提交')
  }
}

const gradeSubmission = (submission) => {
  ElMessage.info(`批改学生 ${submission.studentName} 的作业`)
  // 这里可以打开详细的批改界面
}

const reviewGrading = (submission) => {
  ElMessage.info(`复查学生 ${submission.studentName} 的批改结果`)
}

const viewDetails = (item) => {
  navigateTo(`/teacher/grading/${item.id}`)
}

const batchGrade = () => {
  ElMessage.info('批量批改功能开发中...')
}

const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

const refreshData = () => {
  loadGradingData()
  ElMessage.success('数据已刷新')
}

// 生命周期
onMounted(() => {
  loadGradingData()
})
</script>

<style lang="scss" scoped>
.grading-center {
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

    .header-stats {
      display: flex;
      gap: 20px;

      .stat-item {
        text-align: center;
        padding: 16px 24px;
        border-radius: 8px;
        min-width: 120px;

        &.urgent {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        &.today {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #303133;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  // 优先级标签页
  .priority-tabs {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;

    .tab-container {
      display: flex;
      padding: 16px 24px;
      gap: 8px;

      .priority-tab {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;

        &:hover {
          background: #f8f9fa;
        }

        &.active {
          background: #e8f5e8;
          border-color: #4CAF50;
        }

        .tab-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          &.all {
            background: #e3f2fd;
            color: #2196F3;
          }

          &.high {
            background: #ffebee;
            color: #F44336;
          }

          &.medium {
            background: #fff3e0;
            color: #FF9800;
          }

          &.low {
            background: #e8f5e8;
            color: #4CAF50;
          }
        }

        .tab-content {
          .tab-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 2px;
          }

          .tab-count {
            font-size: 14px;
            color: #606266;
          }
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

  // 批改列表
  .grading-list {
    .grading-item {
      margin-bottom: 16px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &.high {
        border-left: 4px solid #F44336;
      }

      &.medium {
        border-left: 4px solid #FF9800;
      }

      &.low {
        border-left: 4px solid #4CAF50;
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;

        .item-info {
          flex: 1;

          .item-type {
            margin-bottom: 8px;
          }

          .item-title {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 8px 0;
            line-height: 1.4;
          }

          .item-meta {
            display: flex;
            gap: 16px;

            .course-name {
              font-size: 14px;
              color: #606266;
            }

            .class-name {
              font-size: 14px;
              color: #909399;
            }
          }
        }

        .item-stats {
          text-align: right;
          flex-shrink: 0;

          .stat-row {
            margin-bottom: 4px;
            font-size: 14px;

            .stat-label {
              color: #909399;
            }

            .stat-value {
              font-weight: 500;
              color: #303133;

              &.pending {
                color: #F44336;
              }

              &.graded {
                color: #4CAF50;
              }
            }
          }
        }
      }

      .item-progress {
        margin-bottom: 16px;

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;

          .progress-label {
            color: #606266;
          }

          .progress-percentage {
            font-weight: 500;
            color: #303133;
          }
        }
      }

      .item-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .deadline-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: #F44336;

          .el-icon {
            font-size: 16px;
          }
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }
      }
    }
  }

  // 空状态
  .empty-state {
    margin-top: 60px;
    text-align: center;
  }

  // 批改对话框
  .grading-dialog {
    .grading-header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e4e7ed;

      .grading-info {
        display: flex;
        gap: 24px;

        .info-item {
          font-size: 14px;
          color: #606266;

          strong {
            color: #303133;
          }
        }
      }
    }

    .submission-list {
      .submission-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        &.graded {
          background: #f8f9fa;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .student-details {
            .student-name {
              font-size: 16px;
              font-weight: 500;
              color: #303133;
              margin-bottom: 4px;
            }

            .submit-time,
            .grade-info {
              font-size: 14px;
              color: #909399;

              .score {
                color: #4CAF50;
                font-weight: 500;
                margin-right: 8px;
              }
            }
          }
        }

        .submission-actions {
          flex-shrink: 0;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .grading-center {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .priority-tabs .tab-container {
      flex-direction: column;
      gap: 8px;
    }

    .filter-section {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }

    .grading-list .grading-item {
      .item-header {
        flex-direction: column;
        gap: 16px;
      }

      .item-actions {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }
    }

    .grading-dialog .grading-header .grading-info {
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>