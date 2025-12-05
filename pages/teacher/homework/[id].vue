<template>
  <div class="homework-detail">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ homework.title }}</h1>
        <p>{{ getClassName(homework.classId) }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="editHomework">编辑作业</el-button>
        <el-button type="primary" @click="startGrading" :disabled="homework.submittedCount === homework.gradedCount">批改作业</el-button>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 作业信息 -->
        <el-card shadow="never" class="info-card">
          <template #header><span class="card-title">作业信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="作业标题">{{ homework.title }}</el-descriptions-item>
            <el-descriptions-item label="关联班级">{{ getClassName(homework.classId) }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ homework.deadline }}</el-descriptions-item>
            <el-descriptions-item label="题目数量">{{ homework.questionCount }} 道</el-descriptions-item>
            <el-descriptions-item label="作业描述" :span="2">{{ homework.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 题目列表 -->
        <el-card shadow="never" class="questions-card">
          <template #header><span class="card-title">题目列表</span></template>
          <div class="questions-list">
            <div v-for="(q, index) in homework.questions" :key="q.id" class="question-item">
              <div class="question-header">
                <span class="question-index">{{ index + 1 }}</span>
                <el-tag :type="getTypeTagType(q.type)" size="small">{{ getTypeLabel(q.type) }}</el-tag>
                <el-tag :type="getDifficultyTagType(q.difficulty)" size="small">{{ getDifficultyLabel(q.difficulty) }}</el-tag>
              </div>
              <div class="question-content">{{ q.questionText }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 提交统计 -->
        <el-card shadow="never" class="stats-card">
          <template #header><span class="card-title">提交统计</span></template>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ homework.totalCount }}</div>
              <div class="stat-label">应交人数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number text-primary">{{ homework.submittedCount }}</div>
              <div class="stat-label">已提交</div>
            </div>
            <div class="stat-item">
              <div class="stat-number text-success">{{ homework.gradedCount }}</div>
              <div class="stat-label">已批改</div>
            </div>
            <div class="stat-item">
              <div class="stat-number text-warning">{{ homework.submittedCount - homework.gradedCount }}</div>
              <div class="stat-label">待批改</div>
            </div>
          </div>
          <el-progress :percentage="Math.round(homework.submittedCount / homework.totalCount * 100)" :stroke-width="12" style="margin-top: 16px" />
          <div class="progress-label">提交率 {{ Math.round(homework.submittedCount / homework.totalCount * 100) }}%</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '作业详情' })

const router = useRouter()
const route = useRoute()
const homeworkId = computed(() => route.params.id)

// JSON格式的班级数据
const classes = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

// JSON格式的作业详情数据
const homeworksData = {
  hw005: {
    id: 'hw005',
    title: '链表操作练习',
    description: '完成链表的基本操作，包括插入、删除、查找等',
    classId: 'class_t003',
    deadline: '2024-12-26 23:59',
    questionCount: 6,
    totalCount: 65,
    submittedCount: 58,
    gradedCount: 50,
    status: 'grading',
    questions: [
      { id: 'q1', type: 'single', questionText: '单链表的特点是什么？', difficulty: 'easy' },
      { id: 'q2', type: 'single', questionText: '双向链表相比单链表的优势是？', difficulty: 'easy' },
      { id: 'q3', type: 'fill', questionText: '在单链表中插入节点的时间复杂度是____', difficulty: 'medium' },
      { id: 'q4', type: 'essay', questionText: '简述链表和数组的区别', difficulty: 'medium' },
      { id: 'q5', type: 'programming', questionText: '实现单链表的反转', difficulty: 'hard' },
      { id: 'q6', type: 'programming', questionText: '判断链表是否有环', difficulty: 'hard' }
    ]
  }
}

const homework = ref({
  id: '', title: '', description: '', classId: '', deadline: '', questionCount: 0,
  totalCount: 0, submittedCount: 0, gradedCount: 0, questions: []
})

const getClassName = (classId) => classes.find(c => c.id === classId)?.name || '未知班级'
const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger' }[type] || '')
const getDifficultyLabel = (d) => ({ easy: '简单', medium: '中等', hard: '困难' }[d] || d)
const getDifficultyTagType = (d) => ({ easy: 'success', medium: 'warning', hard: 'danger' }[d] || '')

const goBack = () => router.back()
const editHomework = () => router.push(`/teacher/homework/create?id=${homeworkId.value}`)
const startGrading = () => router.push(`/teacher/homework/grading/${homeworkId.value}`)

const loadHomework = () => {
  homework.value = homeworksData[homeworkId.value] || homeworksData.hw005
}

onMounted(() => loadHomework())
</script>

<style lang="scss" scoped>
.homework-detail {
  padding: 24px;
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
    .header-actions { display: flex; gap: 12px; }
  }

  .card-title { font-size: 16px; font-weight: 600; }

  .info-card { margin-bottom: 24px; }

  .questions-card {
    .questions-list {
      .question-item {
        padding: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 12px;
        &:last-child { margin-bottom: 0; }
        .question-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .question-index { width: 24px; height: 24px; background: #409eff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .question-content { font-size: 14px; color: #606266; }
      }
    }
  }

  .stats-card {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      .stat-item {
        text-align: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        .stat-number { font-size: 28px; font-weight: 700; color: #303133; }
        .stat-number.text-primary { color: #409eff; }
        .stat-number.text-success { color: #67c23a; }
        .stat-number.text-warning { color: #e6a23c; }
        .stat-label { font-size: 13px; color: #909399; }
      }
    }
    .progress-label { text-align: center; font-size: 13px; color: #909399; margin-top: 8px; }
  }
}
</style>
