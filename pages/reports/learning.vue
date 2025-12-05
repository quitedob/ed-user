<template>
  <div class="learning-report-page">
    <div class="page-header">
      <h1>学习报告</h1>
      <p class="page-desc">查看你的学习进度、能力和成长轨迹</p>
    </div>

    <!-- 时间范围选择 -->
    <div class="time-filter">
      <el-radio-group v-model="timeRange" @change="loadReportData">
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="quarter">本季度</el-radio-button>
        <el-radio-button label="year">全年</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 概览卡片 -->
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon">
                <el-icon size="32" color="#409EFF"><Clock /></el-icon>
              </div>
              <div class="card-info">
                <h3>{{ formatTime(overview.totalStudyTime) }}</h3>
                <p>总学习时长</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon">
                <el-icon size="32" color="#67C23A"><Check /></el-icon>
              </div>
              <div class="card-info">
                <h3>{{ overview.completedCourses }}</h3>
                <p>完成课程数</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon">
                <el-icon size="32" color="#E6A23C"><Trophy /></el-icon>
              </div>
              <div class="card-info">
                <h3>{{ overview.solvedProblems }}</h3>
                <p>解决题目数</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="overview-card">
            <div class="card-content">
              <div class="card-icon">
                <el-icon size="32" color="#F56C6C"><TrendCharts /></el-icon>
              </div>
              <div class="card-info">
                <h3>{{ overview.abilityScore }}</h3>
                <p>能力评分</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 学习趋势图 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card title="学习时长趋势">
            <div class="chart-container">
              <div class="study-time-chart">
                <div class="chart-placeholder">
                  <el-icon size="48" color="#C0C4CC"><TrendCharts /></el-icon>
                  <p>学习时长趋势图表</p>
                  <small>显示最近{{ getTimeRangeText() }}的学习时长变化</small>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card title="能力雷达图">
            <div class="chart-container">
              <div class="radar-chart">
                <div class="radar-placeholder">
                  <el-icon size="48" color="#C0C4CC"><DataAnalysis /></el-icon>
                  <p>能力雷达图</p>
                  <small>展示各项编程能力的综合水平</small>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 详细数据 -->
    <div class="detailed-data">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card title="课程学习进度">
            <div class="course-progress">
              <div
                v-for="course in courseProgress"
                :key="course.id"
                class="course-item"
              >
                <div class="course-header">
                  <span class="course-name">{{ course.name }}</span>
                  <span class="course-progress-text">{{ course.progress }}%</span>
                </div>
                <el-progress
                  :percentage="course.progress"
                  :stroke-width="6"
                  :show-text="false"
                />
                <div class="course-stats">
                  <span>已学: {{ formatTime(course.studiedTime) }}</span>
                  <span>总时长: {{ formatTime(course.totalTime) }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card title="题目解决统计">
            <div class="problem-stats">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">{{ problemStats.totalAttempted }}</div>
                  <div class="stat-label">尝试题目</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ problemStats.totalSolved }}</div>
                  <div class="stat-label">解决题目</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ problemStats.accuracy }}%</div>
                  <div class="stat-label">正确率</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ problemStats.averageAttempts }}</div>
                  <div class="stat-label">平均尝试次数</div>
                </div>
              </div>

              <div class="difficulty-breakdown">
                <h4>难度分布</h4>
                <div class="difficulty-item" v-for="diff in problemStats.byDifficulty" :key="diff.level">
                  <span class="difficulty-label">{{ diff.level }}</span>
                  <el-progress
                    :percentage="diff.percentage"
                    :stroke-width="8"
                    :show-text="false"
                  />
                  <span class="difficulty-count">{{ diff.solved }}/{{ diff.total }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 学习建议 -->
    <div class="learning-suggestions">
      <el-card title="AI学习建议">
        <div class="suggestions-content">
          <el-alert
            v-for="suggestion in aiSuggestions"
            :key="suggestion.id"
            :type="suggestion.type"
            :title="suggestion.title"
            :description="suggestion.description"
            :closable="false"
            class="suggestion-item"
          />
        </div>
      </el-card>
    </div>

    <!-- 学习记录详情 -->
    <div class="learning-records">
      <el-card title="学习记录详情">
        <el-table :data="learningRecords" style="width: 100%">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="courseName" label="课程名称" min-width="200" />
          <el-table-column prop="contentName" label="学习内容" min-width="150" />
          <el-table-column label="学习时长" width="100">
            <template #default="scope">
              {{ formatTime(scope.row.studyTime) }}
            </template>
          </el-table-column>
          <el-table-column label="完成度" width="100">
            <template #default="scope">
              <el-progress
                :percentage="scope.row.completion"
                :stroke-width="6"
                :show-text="false"
              />
            </template>
          </el-table-column>
          <el-table-column label="学习状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import {
  Clock,
  Check,
  Trophy,
  TrendCharts,
  DataAnalysis
} from '@element-plus/icons-vue'

definePageMeta({
  title: '学习报告'
})

// 响应式数据
const timeRange = ref('month')

// 概览数据
const overview = ref({
  totalStudyTime: 45 * 3600, // 45小时
  completedCourses: 8,
  solvedProblems: 156,
  abilityScore: 85
})

// 课程进度
const courseProgress = ref([
  {
    id: 1,
    name: 'AI编程入门课程',
    progress: 85,
    studiedTime: 12 * 3600,
    totalTime: 15 * 3600
  },
  {
    id: 2,
    name: 'Python高级编程',
    progress: 92,
    studiedTime: 18 * 3600,
    totalTime: 20 * 3600
  },
  {
    id: 3,
    name: '机器学习实战',
    progress: 67,
    studiedTime: 8 * 3600,
    totalTime: 12 * 3600
  },
  {
    id: 4,
    name: '数据结构与算法',
    progress: 78,
    studiedTime: 7 * 3600,
    totalTime: 10 * 3600
  }
])

// 题目统计
const problemStats = ref({
  totalAttempted: 234,
  totalSolved: 156,
  accuracy: 67,
  averageAttempts: 1.8,
  byDifficulty: [
    { level: '简单', solved: 89, total: 120, percentage: 74 },
    { level: '中等', solved: 45, total: 80, percentage: 56 },
    { level: '困难', solved: 22, total: 34, percentage: 65 }
  ]
})

// AI学习建议
const aiSuggestions = ref([
  {
    id: 1,
    type: 'success',
    title: '基础知识掌握良好',
    description: '你在编程基础概念和语法方面的掌握程度很扎实，建议继续保持。'
  },
  {
    id: 2,
    type: 'warning',
    title: '算法思维需要加强',
    description: '动态规划和贪心算法是你的弱项，建议多做相关练习题目。'
  },
  {
    id: 3,
    type: 'info',
    title: '建议学习计划',
    description: '每周至少完成5道中等难度以上的算法题目，并复习错题。'
  },
  {
    id: 4,
    type: 'error',
    title: '学习时长不足',
    description: '本周学习时长较少，建议每天至少学习1-2小时以保持学习进度。'
  }
])

// 学习记录
const learningRecords = ref([
  {
    date: '2024-01-15',
    courseName: 'AI编程入门课程',
    contentName: '第一课：AI基础概念',
    studyTime: 1800,
    completion: 100,
    status: 'completed'
  },
  {
    date: '2024-01-14',
    courseName: 'Python高级编程',
    contentName: '面向对象编程',
    studyTime: 2400,
    completion: 85,
    status: 'in-progress'
  },
  {
    date: '2024-01-13',
    courseName: '机器学习实战',
    contentName: '线性回归算法',
    studyTime: 3600,
    completion: 100,
    status: 'completed'
  }
])

// 方法
const loadReportData = () => {
  // 根据时间范围重新加载数据
  console.log('Loading data for time range:', timeRange.value)
  // 这里可以根据时间范围从API获取数据
}

const getTimeRangeText = () => {
  const rangeMap = {
    week: '一周',
    month: '一个月',
    quarter: '一个季度',
    year: '一年'
  }
  return rangeMap[timeRange.value] || '一段时间'
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}时${minutes}分`
  }
  return `${minutes}分钟`
}

const getStatusType = (status) => {
  const typeMap = {
    completed: 'success',
    'in-progress': 'warning',
    not_started: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    completed: '已完成',
    'in-progress': '进行中',
    not_started: '未开始'
  }
  return textMap[status] || status
}

// 生命周期
onMounted(() => {
  loadReportData()
})
</script>

<style lang="scss" scoped>
.learning-report-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  .page-header {
    text-align: center;
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    .page-desc {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .time-filter {
    text-align: center;
    margin-bottom: 24px;
  }

  .overview-cards {
    margin-bottom: 24px;

    .overview-card {
      .card-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .card-icon {
          flex-shrink: 0;
        }

        .card-info {
          h3 {
            margin: 0 0 4px 0;
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }

          p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }

  .charts-section {
    margin-bottom: 24px;

    .chart-container {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;

      .chart-placeholder {
        text-align: center;
        color: #C0C4CC;

        .el-icon {
          margin-bottom: 16px;
        }

        p {
          margin: 8px 0;
          font-size: 16px;
          font-weight: 500;
        }

        small {
          color: #909399;
          font-size: 12px;
        }
      }
    }
  }

  .detailed-data {
    margin-bottom: 24px;

    .course-progress {
      .course-item {
        margin-bottom: 20px;
        padding: 16px;
        border: 1px solid #EBEEF5;
        border-radius: 8px;

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .course-name {
            font-weight: 500;
            color: #303133;
          }

          .course-progress-text {
            color: #409EFF;
            font-weight: 500;
          }
        }

        .course-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .problem-stats {
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 24px;

        .stat-item {
          text-align: center;
          padding: 16px;
          border: 1px solid #EBEEF5;
          border-radius: 8px;

          .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #409EFF;
            margin-bottom: 4px;
          }

          .stat-label {
            color: #606266;
            font-size: 14px;
          }
        }
      }

      .difficulty-breakdown {
        h4 {
          margin: 0 0 16px 0;
          color: #303133;
        }

        .difficulty-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .difficulty-label {
            min-width: 40px;
            font-size: 14px;
            color: #606266;
          }

          .difficulty-count {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }

  .learning-suggestions {
    margin-bottom: 24px;

    .suggestions-content {
      .suggestion-item {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .learning-records {
    :deep(.el-table) {
      .el-table__cell {
        padding: 12px 0;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .learning-report-page {
    padding: 16px;

    .overview-cards .el-col {
      margin-bottom: 16px;
    }

    .charts-section .el-col {
      :deep(.el-card__body) {
        padding: 16px;
      }
    }

    .detailed-data .el-col {
      margin-bottom: 16px;
    }
  }
}
</style>
