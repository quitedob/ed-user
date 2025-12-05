<template>
  <div class="teacher-homework">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>作业管理</h1>
        <p>管理所有班级的作业</p>
      </div>
      <el-button type="primary" @click="createHomework">
        <el-icon><Plus /></el-icon> 发布作业
      </el-button>
    </div>

    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ allHomeworks.length }}</div>
        <div class="stat-label">总作业数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ pendingGradingCount }}</div>
        <div class="stat-label">待批改</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ avgSubmitRate }}%</div>
        <div class="stat-label">平均提交率</div>
      </el-card>
    </div>

    <div class="filter-section">
      <el-select v-model="selectedClass" placeholder="选择班级" style="width: 200px" clearable>
        <el-option label="全部班级" value="" />
        <el-option v-for="cls in classes" :key="cls.id" :label="cls.name" :value="cls.id" />
      </el-select>
      <el-select v-model="selectedStatus" placeholder="选择状态" style="width: 150px" clearable>
        <el-option label="全部状态" value="" />
        <el-option label="未开始" value="pending" />
        <el-option label="收集中" value="collecting" />
        <el-option label="批改中" value="grading" />
        <el-option label="已完成" value="completed" />
      </el-select>
    </div>

    <div class="homework-list">
      <el-card v-for="hw in filteredHomeworks" :key="hw.id" class="homework-card" shadow="hover">
        <div class="homework-header">
          <div class="homework-info">
            <h3>{{ hw.title }}</h3>
            <div class="homework-meta">
              <span class="class-name">{{ getClassName(hw.classId) }}</span>
              <span>截止：{{ hw.deadline }}</span>
              <span>题目数：{{ hw.questionCount }}</span>
            </div>
          </div>
          <el-tag :type="getStatusType(hw.status)">{{ getStatusText(hw.status) }}</el-tag>
        </div>

        <div class="homework-stats">
          <div class="stat-item">
            <span class="label">提交情况</span>
            <span class="value">{{ hw.submittedCount }}/{{ hw.totalCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">已批改</span>
            <span class="value">{{ hw.gradedCount }}/{{ hw.submittedCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">平均分</span>
            <span class="value">{{ hw.avgScore || '-' }}</span>
          </div>
        </div>

        <el-progress :percentage="getGradingProgress(hw)" :stroke-width="8" />

        <div class="homework-actions">
          <el-button type="primary" size="small" @click="startGrading(hw)" :disabled="hw.submittedCount === hw.gradedCount">
            批改作业
          </el-button>
          <el-button size="small" @click="viewDetail(hw)">查看详情</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '作业管理' })

const router = useRouter()
const selectedClass = ref('')
const selectedStatus = ref('')

// JSON格式的班级数据
const classes = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

// JSON格式的作业数据
const allHomeworks = ref([
  { id: 'hw001', title: 'Python基础语法练习', classId: 'class_t001', deadline: '2024-12-25', questionCount: 10, totalCount: 28, submittedCount: 25, gradedCount: 20, avgScore: 82, status: 'grading' },
  { id: 'hw002', title: '函数与模块作业', classId: 'class_t001', deadline: '2024-12-30', questionCount: 8, totalCount: 28, submittedCount: 18, gradedCount: 0, avgScore: null, status: 'collecting' },
  { id: 'hw003', title: 'ES6新特性练习', classId: 'class_t002', deadline: '2024-12-28', questionCount: 12, totalCount: 35, submittedCount: 30, gradedCount: 25, avgScore: 78, status: 'grading' },
  { id: 'hw004', title: '异步编程作业', classId: 'class_t002', deadline: '2025-01-02', questionCount: 8, totalCount: 35, submittedCount: 20, gradedCount: 0, avgScore: null, status: 'collecting' },
  { id: 'hw005', title: '链表操作练习', classId: 'class_t003', deadline: '2024-12-26', questionCount: 6, totalCount: 65, submittedCount: 58, gradedCount: 50, avgScore: 85, status: 'grading' },
  { id: 'hw006', title: '树结构作业', classId: 'class_t003', deadline: '2025-01-05', questionCount: 8, totalCount: 65, submittedCount: 0, gradedCount: 0, avgScore: null, status: 'pending' }
])

const filteredHomeworks = computed(() => {
  let result = allHomeworks.value
  if (selectedClass.value) {
    result = result.filter(hw => hw.classId === selectedClass.value)
  }
  if (selectedStatus.value) {
    result = result.filter(hw => hw.status === selectedStatus.value)
  }
  return result
})

const pendingGradingCount = computed(() => allHomeworks.value.reduce((sum, hw) => sum + (hw.submittedCount - hw.gradedCount), 0))

const avgSubmitRate = computed(() => {
  const total = allHomeworks.value.reduce((sum, hw) => sum + hw.totalCount, 0)
  const submitted = allHomeworks.value.reduce((sum, hw) => sum + hw.submittedCount, 0)
  return total ? Math.round(submitted / total * 100) : 0
})

const getClassName = (classId) => classes.find(c => c.id === classId)?.name || '未知班级'
const getGradingProgress = (hw) => hw.submittedCount ? Math.round(hw.gradedCount / hw.submittedCount * 100) : 0
const getStatusType = (s) => ({ pending: 'info', collecting: 'warning', grading: 'primary', completed: 'success' }[s] || 'info')
const getStatusText = (s) => ({ pending: '未开始', collecting: '收集中', grading: '批改中', completed: '已完成' }[s] || '未知')

const goBack = () => router.push('/teacher')
const createHomework = () => router.push('/teacher/homework/create')
const viewDetail = (hw) => router.push(`/teacher/homework/${hw.id}`)
const startGrading = (hw) => router.push(`/teacher/homework/grading/${hw.id}`)
</script>

<style lang="scss" scoped>
.teacher-homework {
  padding: 32px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    .header-info { flex: 1; }
    h1 { font-size: 24px; font-weight: 600; color: #303133; margin: 0 0 4px 0; }
    p { font-size: 14px; color: #909399; margin: 0; }
  }

  .stats-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
    .stat-card {
      text-align: center;
      padding: 16px 32px;
      .stat-number { font-size: 32px; font-weight: 700; color: #303133; }
      .stat-label { font-size: 14px; color: #909399; }
    }
  }

  .filter-section {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  .homework-list {
    display: grid;
    gap: 20px;
    .homework-card {
      .homework-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        h3 { font-size: 18px; font-weight: 600; color: #303133; margin: 0 0 8px 0; }
        .homework-meta {
          font-size: 13px;
          color: #909399;
          display: flex;
          gap: 16px;
          .class-name { color: #409eff; font-weight: 500; }
        }
      }
      .homework-stats {
        display: flex;
        gap: 32px;
        margin-bottom: 16px;
        .stat-item {
          .label { font-size: 13px; color: #909399; margin-right: 8px; }
          .value { font-size: 15px; font-weight: 600; color: #303133; }
        }
      }
      .homework-actions { display: flex; gap: 8px; margin-top: 16px; }
    }
  }
}
</style>
