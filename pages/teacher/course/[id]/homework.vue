<template>
  <div class="course-homework">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>作业管理</h1>
        <p>{{ courseInfo.title }}</p>
      </div>
      <el-button type="primary" @click="createHomework">
        <el-icon><Plus /></el-icon> 发布作业
      </el-button>
    </div>

    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ homeworkList.length }}</div>
        <div class="stat-label">总作业数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ pendingCount }}</div>
        <div class="stat-label">待批改</div>
      </el-card>
    </div>

    <div class="homework-list">
      <el-card v-for="hw in homeworkList" :key="hw.id" class="homework-card" shadow="hover">
        <div class="homework-header">
          <div class="homework-info">
            <h3>{{ hw.title }}</h3>
            <div class="homework-meta">
              <span>截止：{{ hw.deadline }}</span>
              <span>题目数：{{ hw.questionCount }}</span>
            </div>
          </div>
          <el-tag :type="getStatusType(hw.status)">{{ getStatusText(hw.status) }}</el-tag>
        </div>

        <div class="homework-stats">
          <div class="stat-item">
            <span class="label">提交</span>
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

        <el-progress :percentage="getProgress(hw)" :stroke-width="8" />

        <div class="homework-actions">
          <el-button type="primary" size="small" @click="startGrading(hw)" :disabled="hw.submittedCount === hw.gradedCount">批改</el-button>
          <el-button size="small" @click="viewDetail(hw)">详情</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '课程作业管理' })

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.id)

// JSON格式的课程数据
const coursesData = {
  course_t001: { id: 'course_t001', title: 'Python编程基础', teacher: '张老师' },
  course_t002: { id: 'course_t002', title: 'JavaScript进阶开发', teacher: '张老师' },
  course_t003: { id: 'course_t003', title: '数据结构与算法', teacher: '张老师' },
  course_t004: { id: 'course_t004', title: 'React框架开发', teacher: '张老师' },
  course_t005: { id: 'course_t005', title: 'Java Web开发', teacher: '张老师' },
  course_t006: { id: 'course_t006', title: '机器学习基础', teacher: '张老师' },
  course_t007: { id: 'course_t007', title: '数据库设计与优化', teacher: '张老师' },
  course_t008: { id: 'course_t008', title: '移动应用开发', teacher: '张老师' },
  course_t009: { id: 'course_t009', title: '软件工程实践', teacher: '张老师' }
}

// JSON格式的作业数据
const homeworksData = {
  course_t001: [
    { id: 'hw001', title: 'Python基础语法练习', deadline: '2024-12-25', questionCount: 10, totalCount: 45, submittedCount: 40, gradedCount: 35, avgScore: 82, totalScore: 100, status: 'grading' },
    { id: 'hw002', title: '函数与模块作业', deadline: '2024-12-30', questionCount: 8, totalCount: 45, submittedCount: 30, gradedCount: 0, avgScore: null, totalScore: 100, status: 'collecting' }
  ],
  course_t002: [
    { id: 'hw003', title: 'ES6新特性练习', deadline: '2024-12-28', questionCount: 12, totalCount: 38, submittedCount: 35, gradedCount: 30, avgScore: 78, totalScore: 100, status: 'grading' }
  ],
  course_t003: [
    { id: 'hw004', title: '链表操作练习', deadline: '2024-12-26', questionCount: 6, totalCount: 42, submittedCount: 38, gradedCount: 38, avgScore: 85, totalScore: 100, status: 'completed' },
    { id: 'hw005', title: '树结构作业', deadline: '2025-01-05', questionCount: 8, totalCount: 42, submittedCount: 0, gradedCount: 0, avgScore: null, totalScore: 100, status: 'pending' }
  ],
  course_t004: [
    { id: 'hw008', title: 'React组件基础练习', deadline: '2024-01-27', questionCount: 6, totalCount: 41, submittedCount: 35, gradedCount: 30, avgScore: 86, totalScore: 100, status: 'grading' },
    { id: 'hw009', title: 'React Hooks实战', deadline: '2024-02-03', questionCount: 7, totalCount: 41, submittedCount: 20, gradedCount: 15, avgScore: 84, totalScore: 100, status: 'collecting' },
    { id: 'hw010', title: 'React项目实战', deadline: '2024-02-10', questionCount: 5, totalCount: 41, submittedCount: 8, gradedCount: 3, avgScore: null, totalScore: 100, status: 'collecting' }
  ],
  course_t005: [
    { id: 'hw011', title: 'Servlet基础练习', deadline: '2024-01-28', questionCount: 8, totalCount: 36, submittedCount: 30, gradedCount: 25, avgScore: 83, totalScore: 100, status: 'grading' },
    { id: 'hw012', title: 'Spring IoC与DI练习', deadline: '2024-02-04', questionCount: 7, totalCount: 36, submittedCount: 18, gradedCount: 12, avgScore: 81, totalScore: 100, status: 'collecting' },
    { id: 'hw013', title: 'MyBatis数据库操作', deadline: '2024-02-11', questionCount: 6, totalCount: 36, submittedCount: 10, gradedCount: 5, avgScore: null, totalScore: 100, status: 'collecting' }
  ],
  course_t006: [
    { id: 'hw014', title: 'Python数据科学库练习', deadline: '2024-01-29', questionCount: 7, totalCount: 29, submittedCount: 25, gradedCount: 20, avgScore: 85, totalScore: 100, status: 'grading' },
    { id: 'hw015', title: '监督学习算法实现', deadline: '2024-02-05', questionCount: 6, totalCount: 29, submittedCount: 12, gradedCount: 8, avgScore: 79, totalScore: 100, status: 'collecting' },
    { id: 'hw016', title: '深度学习项目实战', deadline: '2024-02-12', questionCount: 5, totalCount: 29, submittedCount: 5, gradedCount: 2, avgScore: null, totalScore: 100, status: 'collecting' }
  ],
  course_t007: [
    { id: 'hw017', title: 'SQL语句练习', deadline: '2024-01-30', questionCount: 10, totalCount: 44, submittedCount: 40, gradedCount: 35, avgScore: 88, totalScore: 100, status: 'grading' },
    { id: 'hw018', title: '数据库设计实践', deadline: '2024-02-06', questionCount: 6, totalCount: 44, submittedCount: 28, gradedCount: 22, avgScore: 84, totalScore: 100, status: 'grading' },
    { id: 'hw019', title: '数据库性能优化', deadline: '2024-02-13', questionCount: 7, totalCount: 44, submittedCount: 15, gradedCount: 10, avgScore: null, totalScore: 100, status: 'collecting' }
  ],
  course_t008: [
    { id: 'hw020', title: 'Dart语言练习', deadline: '2024-01-31', questionCount: 8, totalCount: 33, submittedCount: 28, gradedCount: 23, avgScore: 86, totalScore: 100, status: 'grading' },
    { id: 'hw021', title: 'Flutter UI组件练习', deadline: '2024-02-07', questionCount: 7, totalCount: 33, submittedCount: 18, gradedCount: 12, avgScore: 82, totalScore: 100, status: 'collecting' },
    { id: 'hw022', title: 'Flutter网络请求实战', deadline: '2024-02-14', questionCount: 6, totalCount: 33, submittedCount: 8, gradedCount: 3, avgScore: null, totalScore: 100, status: 'collecting' }
  ],
  course_t009: [
    { id: 'hw023', title: '需求分析文档编写', deadline: '2024-02-01', questionCount: 5, totalCount: 48, submittedCount: 42, gradedCount: 38, avgScore: 89, totalScore: 100, status: 'grading' },
    { id: 'hw024', title: 'Git版本控制练习', deadline: '2024-02-08', questionCount: 7, totalCount: 48, submittedCount: 35, gradedCount: 30, avgScore: 87, totalScore: 100, status: 'grading' },
    { id: 'hw025', title: '单元测试编写', deadline: '2024-02-15', questionCount: 6, totalCount: 48, submittedCount: 20, gradedCount: 15, avgScore: null, totalScore: 100, status: 'collecting' }
  ]
}

const courseInfo = ref({ id: '', title: '' })
const homeworkList = ref([])

const pendingCount = computed(() => homeworkList.value.reduce((sum, hw) => sum + (hw.submittedCount - hw.gradedCount), 0))

const getProgress = (hw) => hw.submittedCount ? Math.round(hw.gradedCount / hw.submittedCount * 100) : 0
const getStatusType = (s) => ({ pending: 'info', collecting: 'warning', grading: 'primary', completed: 'success' }[s] || 'info')
const getStatusText = (s) => ({ pending: '未开始', collecting: '收集中', grading: '批改中', completed: '已完成' }[s] || '未知')

const goBack = () => {
  // 使用 router.back() 返回上一页，如果上一页不是课程详情页，则跳转到课程详情页
  if (document.referrer && document.referrer.includes('/teacher/course/')) {
    router.back()
  } else {
    router.push(`/teacher/course/${courseId.value}`)
  }
}
const createHomework = () => router.push(`/teacher/homework/create?courseId=${courseId.value}`)
const viewDetail = (hw) => router.push(`/teacher/homework/${hw.id}`)
const startGrading = (hw) => router.push(`/teacher/homework/grading/${hw.id}`)

const loadData = () => {
  courseInfo.value = coursesData[courseId.value] || coursesData.course_t001
  homeworkList.value = homeworksData[courseId.value] || []
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.course-homework {
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
        .homework-meta { font-size: 13px; color: #909399; display: flex; gap: 16px; }
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
