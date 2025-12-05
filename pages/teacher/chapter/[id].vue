<template>
  <div class="chapter-detail">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ chapter.title }}</h1>
        <p>{{ courseInfo.title }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="editChapter">编辑章节</el-button>
        <el-button type="primary" @click="manageLesson">管理课时</el-button>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 章节信息 -->
        <el-card shadow="never" class="info-card">
          <template #header><span class="card-title">章节信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="章节标题">{{ chapter.title }}</el-descriptions-item>
            <el-descriptions-item label="章节序号">第{{ chapter.order }}章</el-descriptions-item>
            <el-descriptions-item label="课时数量">{{ chapter.lessons.length }}课时</el-descriptions-item>
            <el-descriptions-item label="总时长">{{ totalDuration }}分钟</el-descriptions-item>
            <el-descriptions-item label="发布状态">
              <el-tag :type="chapter.isPublished ? 'success' : 'info'">{{ chapter.isPublished ? '已发布' : '草稿' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="解锁条件">{{ getUnlockText(chapter.unlockCondition) }}</el-descriptions-item>
            <el-descriptions-item label="章节简介" :span="2">{{ chapter.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 课时列表 -->
        <el-card shadow="never" class="lessons-card">
          <template #header><span class="card-title">课时列表</span></template>
          <div class="lessons-list">
            <div v-for="(lesson, index) in chapter.lessons" :key="index" class="lesson-item">
              <div class="lesson-index">{{ index + 1 }}</div>
              <div class="lesson-info">
                <div class="lesson-title">{{ lesson.title }}</div>
                <div class="lesson-meta">
                  <el-tag :type="getLessonTypeTag(lesson.type)" size="small">{{ getLessonTypeText(lesson.type) }}</el-tag>
                  <span>{{ lesson.duration }}分钟</span>
                </div>
              </div>
              <div class="lesson-stats">
                <span class="completed">{{ lesson.completedCount || 0 }}人完成</span>
              </div>
              <div class="lesson-actions">
                <el-button link type="primary" size="small" @click="previewLesson(lesson)">预览</el-button>
                <el-button link size="small" @click="editLesson(lesson)">编辑</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 学习统计 -->
        <el-card shadow="never" class="stats-card">
          <template #header><span class="card-title">学习统计</span></template>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ chapter.totalStudents }}</div>
              <div class="stat-label">总学员</div>
            </div>
            <div class="stat-item">
              <div class="stat-number text-success">{{ chapter.completedStudents }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-number text-primary">{{ chapter.learningStudents }}</div>
              <div class="stat-label">学习中</div>
            </div>
            <div class="stat-item">
              <div class="stat-number text-warning">{{ chapter.notStartedStudents }}</div>
              <div class="stat-label">未开始</div>
            </div>
          </div>
          <el-progress :percentage="completionRate" :stroke-width="12" style="margin-top: 16px" />
          <div class="progress-label">完成率 {{ completionRate }}%</div>
        </el-card>

        <!-- 关联资源 -->
        <el-card shadow="never" class="resources-card">
          <template #header><span class="card-title">关联资源</span></template>
          <div class="resource-list">
            <div class="resource-item" v-if="chapter.homeworkId">
              <el-icon><EditPen /></el-icon>
              <span>关联作业</span>
              <el-button link type="primary" size="small" @click="viewHomework">查看</el-button>
            </div>
            <div class="resource-item" v-if="chapter.examId">
              <el-icon><Document /></el-icon>
              <span>关联考试</span>
              <el-button link type="primary" size="small" @click="viewExam">查看</el-button>
            </div>
            <el-empty v-if="!chapter.homeworkId && !chapter.examId" description="暂无关联资源" :image-size="60" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft, EditPen, Document } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '章节详情' })

const router = useRouter()
const route = useRoute()
const chapterId = computed(() => route.params.id)

// JSON格式的课程数据
const coursesData = {
  course_t001: { id: 'course_t001', title: 'Python编程基础' },
  course_t002: { id: 'course_t002', title: 'JavaScript进阶开发' },
  course_t003: { id: 'course_t003', title: '数据结构与算法' }
}

// JSON格式的章节详情数据
const chaptersData = {
  ch001: {
    id: 'ch001', courseId: 'course_t001', title: '第一章：Python基础语法', order: 1,
    description: '本章介绍Python的基础语法，包括变量、数据类型、运算符等核心概念',
    isPublished: true, unlockCondition: 'none', homeworkId: 'hw001', examId: '',
    totalStudents: 45, completedStudents: 38, learningStudents: 5, notStartedStudents: 2,
    lessons: [
      { id: 'l001', title: '1.1 Python简介与环境搭建', type: 'video', duration: 15, completedCount: 42 },
      { id: 'l002', title: '1.2 变量与数据类型', type: 'video', duration: 20, completedCount: 40 },
      { id: 'l003', title: '1.3 运算符详解', type: 'video', duration: 18, completedCount: 39 },
      { id: 'l004', title: '1.4 章节测验', type: 'quiz', duration: 10, completedCount: 38 }
    ]
  },
  ch007: {
    id: 'ch007', courseId: 'course_t003', title: '第一章：数组与链表', order: 1,
    description: '本章介绍数组和链表两种基本数据结构，包括其原理、实现和应用场景',
    isPublished: true, unlockCondition: 'none', homeworkId: 'hw004', examId: '',
    totalStudents: 42, completedStudents: 35, learningStudents: 5, notStartedStudents: 2,
    lessons: [
      { id: 'l010', title: '1.1 数组的基本概念', type: 'video', duration: 20, completedCount: 40 },
      { id: 'l011', title: '1.2 数组的常见操作', type: 'video', duration: 25, completedCount: 38 },
      { id: 'l012', title: '1.3 链表的基本概念', type: 'video', duration: 22, completedCount: 36 },
      { id: 'l013', title: '1.4 链表的实现', type: 'document', duration: 15, completedCount: 35 }
    ]
  }
}

const courseInfo = ref({ id: '', title: '' })
const chapter = ref({
  id: '', title: '', description: '', order: 1, isPublished: false, unlockCondition: 'none',
  homeworkId: '', examId: '', totalStudents: 0, completedStudents: 0, learningStudents: 0, notStartedStudents: 0, lessons: []
})

const totalDuration = computed(() => chapter.value.lessons.reduce((sum, l) => sum + (l.duration || 0), 0))
const completionRate = computed(() => chapter.value.totalStudents ? Math.round(chapter.value.completedStudents / chapter.value.totalStudents * 100) : 0)

const getUnlockText = (condition) => ({ none: '无限制', prev_chapter: '完成上一章节', date: '指定日期后' }[condition] || '无限制')
const getLessonTypeText = (type) => ({ video: '视频', document: '文档', quiz: '测验' }[type] || type)
const getLessonTypeTag = (type) => ({ video: 'primary', document: 'success', quiz: 'warning' }[type] || '')

const goBack = () => router.back()
const editChapter = () => router.push(`/teacher/chapter/create?id=${chapterId.value}&courseId=${chapter.value.courseId}`)
const manageLesson = () => router.push(`/teacher/lesson?chapterId=${chapterId.value}`)
const previewLesson = (lesson) => ElMessage.info(`预览课时：${lesson.title}`)
const editLesson = (lesson) => router.push(`/teacher/lesson/create?id=${lesson.id}&chapterId=${chapterId.value}`)
const viewHomework = () => router.push(`/teacher/homework/${chapter.value.homeworkId}`)
const viewExam = () => router.push(`/teacher/exam/${chapter.value.examId}`)

const loadData = () => {
  const data = chaptersData[chapterId.value] || chaptersData.ch001
  chapter.value = data
  courseInfo.value = coursesData[data.courseId] || coursesData.course_t001
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.chapter-detail {
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
  .info-card, .lessons-card { margin-bottom: 24px; }

  .lessons-card {
    .lessons-list {
      .lesson-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 12px;
        &:last-child { margin-bottom: 0; }
        .lesson-index { width: 32px; height: 32px; background: #409eff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .lesson-info { flex: 1; }
        .lesson-title { font-size: 15px; font-weight: 500; color: #303133; margin-bottom: 4px; }
        .lesson-meta { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #909399; }
        .lesson-stats { .completed { font-size: 13px; color: #67c23a; } }
        .lesson-actions { display: flex; gap: 8px; }
      }
    }
  }

  .stats-card {
    margin-bottom: 24px;
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      .stat-item {
        text-align: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        .stat-number { font-size: 24px; font-weight: 700; color: #303133; }
        .stat-number.text-success { color: #67c23a; }
        .stat-number.text-primary { color: #409eff; }
        .stat-number.text-warning { color: #e6a23c; }
        .stat-label { font-size: 13px; color: #909399; }
      }
    }
    .progress-label { text-align: center; font-size: 13px; color: #909399; margin-top: 8px; }
  }

  .resources-card {
    .resource-list {
      .resource-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 12px;
        &:last-child { margin-bottom: 0; }
        .el-icon { font-size: 20px; color: #409eff; }
        span { flex: 1; color: #606266; }
      }
    }
  }
}
</style>
