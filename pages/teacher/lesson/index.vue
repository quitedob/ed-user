<template>
  <div class="lesson-manage">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>课时管理</h1>
        <p>{{ chapterInfo.title }}</p>
      </div>
      <el-button type="primary" @click="createLesson">
        <el-icon><Plus /></el-icon> 添加课时
      </el-button>
    </div>

    <div class="lessons-list">
      <div v-for="(lesson, index) in lessons" :key="lesson.id" class="lesson-card">
        <div class="lesson-order">
          <el-button :icon="Top" link :disabled="index === 0" @click="moveUp(index)" />
          <span class="order-num">{{ index + 1 }}</span>
          <el-button :icon="Bottom" link :disabled="index === lessons.length - 1" @click="moveDown(index)" />
        </div>
        
        <div class="lesson-content">
          <div class="lesson-header">
            <h3>{{ lesson.title }}</h3>
            <el-tag :type="getLessonTypeTag(lesson.type)" size="small">{{ getLessonTypeText(lesson.type) }}</el-tag>
          </div>
          <div class="lesson-meta">
            <span><el-icon><Clock /></el-icon> {{ lesson.duration }}分钟</span>
            <span><el-icon><User /></el-icon> {{ lesson.completedCount }}人完成</span>
            <span v-if="lesson.videoUrl"><el-icon><VideoPlay /></el-icon> 已上传视频</span>
          </div>
        </div>

        <div class="lesson-actions">
          <el-button size="small" @click="previewLesson(lesson)">预览</el-button>
          <el-button size="small" @click="editLesson(lesson)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteLesson(lesson)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Top, Bottom, Clock, User, VideoPlay } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '课时管理' })

const router = useRouter()
const route = useRoute()
const chapterId = computed(() => route.query.chapterId)

// JSON格式的章节数据
const chaptersData = {
  ch001: { id: 'ch001', title: '第一章：Python基础语法', courseId: 'course_t001' },
  ch007: { id: 'ch007', title: '第一章：数组与链表', courseId: 'course_t003' }
}

// JSON格式的课时数据
const lessonsData = {
  ch001: [
    { id: 'l001', title: '1.1 Python简介与环境搭建', type: 'video', duration: 15, completedCount: 42, videoUrl: 'xxx' },
    { id: 'l002', title: '1.2 变量与数据类型', type: 'video', duration: 20, completedCount: 40, videoUrl: 'xxx' },
    { id: 'l003', title: '1.3 运算符详解', type: 'video', duration: 18, completedCount: 39, videoUrl: 'xxx' },
    { id: 'l004', title: '1.4 章节测验', type: 'quiz', duration: 10, completedCount: 38, videoUrl: '' }
  ],
  ch007: [
    { id: 'l010', title: '1.1 数组的基本概念', type: 'video', duration: 20, completedCount: 40, videoUrl: 'xxx' },
    { id: 'l011', title: '1.2 数组的常见操作', type: 'video', duration: 25, completedCount: 38, videoUrl: 'xxx' },
    { id: 'l012', title: '1.3 链表的基本概念', type: 'video', duration: 22, completedCount: 36, videoUrl: 'xxx' },
    { id: 'l013', title: '1.4 链表的实现', type: 'document', duration: 15, completedCount: 35, videoUrl: '' }
  ]
}

const chapterInfo = ref({ id: '', title: '' })
const lessons = ref([])

const getLessonTypeText = (type) => ({ video: '视频', document: '文档', quiz: '测验' }[type] || type)
const getLessonTypeTag = (type) => ({ video: 'primary', document: 'success', quiz: 'warning' }[type] || '')

const goBack = () => router.back()
const createLesson = () => router.push(`/teacher/lesson/create?chapterId=${chapterId.value}`)
const editLesson = (lesson) => router.push(`/teacher/lesson/create?id=${lesson.id}&chapterId=${chapterId.value}`)
const previewLesson = (lesson) => ElMessage.info(`预览课时：${lesson.title}`)
const deleteLesson = (lesson) => {
  ElMessageBox.confirm(`确定要删除课时 "${lesson.title}" 吗？`, '提示', { type: 'warning' })
    .then(() => {
      lessons.value = lessons.value.filter(l => l.id !== lesson.id)
      ElMessage.success('删除成功')
    }).catch(() => {})
}
const moveUp = (index) => {
  if (index > 0) {
    const temp = lessons.value[index]
    lessons.value[index] = lessons.value[index - 1]
    lessons.value[index - 1] = temp
  }
}
const moveDown = (index) => {
  if (index < lessons.value.length - 1) {
    const temp = lessons.value[index]
    lessons.value[index] = lessons.value[index + 1]
    lessons.value[index + 1] = temp
  }
}

const loadData = () => {
  chapterInfo.value = chaptersData[chapterId.value] || chaptersData.ch001
  lessons.value = lessonsData[chapterId.value] || lessonsData.ch001
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.lesson-manage {
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
  }

  .lessons-list {
    .lesson-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);

      .lesson-order {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        .order-num { font-size: 18px; font-weight: 700; color: #409eff; }
      }

      .lesson-content {
        flex: 1;
        .lesson-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        h3 { font-size: 16px; font-weight: 600; color: #303133; margin: 0; }
        .lesson-meta { display: flex; gap: 20px; font-size: 13px; color: #909399; }
        .lesson-meta span { display: flex; align-items: center; gap: 4px; }
      }

      .lesson-actions { display: flex; gap: 8px; }
    }
  }
}
</style>
