<template>
  <div class="course-chapters">
    <div class="page-header">
      <h2>章节管理</h2>
      <el-button type="primary" @click="createChapter">
        <el-icon><Plus /></el-icon> 新建章节
      </el-button>
    </div>

    <div class="chapters-list">
      <el-card v-for="chapter in chapters" :key="chapter.id" class="chapter-card" shadow="hover">
        <div class="chapter-header">
          <div class="chapter-info">
            <h3>{{ chapter.title }}</h3>
            <div class="chapter-meta">
              <span>{{ chapter.lessons }}课时</span>
              <span>{{ chapter.completedStudents }}人完成</span>
            </div>
          </div>
          <el-tag :type="chapter.status === 'published' ? 'success' : 'info'">
            {{ chapter.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </div>

        <div class="chapter-resources">
          <el-tag v-if="chapter.hasVideo" size="small" type="success">视频</el-tag>
          <el-tag v-if="chapter.hasHomework" size="small" type="warning">作业</el-tag>
          <el-tag v-if="chapter.hasExam" size="small" type="danger">考试</el-tag>
        </div>

        <div class="chapter-actions">
          <el-button size="small" @click="viewChapter(chapter)">详情</el-button>
          <el-button size="small" @click="editChapter(chapter)">编辑</el-button>
          <el-button size="small" @click="viewLessons(chapter)">课时管理</el-button>
          <el-button size="small" type="danger" @click="deleteChapter(chapter)">删除</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'

const route = useRoute()
const courseId = computed(() => route.params.id)

// JSON格式的章节数据
const chaptersData = {
  course_t001: [
    { id: 'ch001', title: '第一章：Python基础语法', lessons: 4, completedStudents: 38, hasVideo: true, hasHomework: true, hasExam: false, status: 'published' },
    { id: 'ch002', title: '第二章：数据类型与控制流', lessons: 4, completedStudents: 32, hasVideo: true, hasHomework: true, hasExam: false, status: 'published' },
    { id: 'ch003', title: '第三章：函数与模块', lessons: 4, completedStudents: 25, hasVideo: true, hasHomework: true, hasExam: true, status: 'published' },
    { id: 'ch004', title: '第四章：面向对象编程', lessons: 5, completedStudents: 18, hasVideo: true, hasHomework: true, hasExam: false, status: 'draft' }
  ],
  course_t002: [
    { id: 'ch005', title: '第一章：ES6新特性', lessons: 3, completedStudents: 30, hasVideo: true, hasHomework: true, hasExam: false, status: 'published' },
    { id: 'ch006', title: '第二章：异步编程', lessons: 4, completedStudents: 25, hasVideo: true, hasHomework: true, hasExam: false, status: 'published' }
  ],
  course_t003: [
    { id: 'ch007', title: '第一章：数组与链表', lessons: 4, completedStudents: 35, hasVideo: true, hasHomework: true, hasExam: false, status: 'published' },
    { id: 'ch008', title: '第二章：栈与队列', lessons: 3, completedStudents: 30, hasVideo: true, hasHomework: true, hasExam: false, status: 'published' },
    { id: 'ch009', title: '第三章：树结构', lessons: 5, completedStudents: 22, hasVideo: true, hasHomework: true, hasExam: true, status: 'published' }
  ]
}

const chapters = ref([])

const loadChapters = () => {
  chapters.value = chaptersData[courseId.value] || chaptersData.course_t001
}

const router = useRouter()
const createChapter = () => router.push(`/teacher/chapter/create?courseId=${courseId.value}`)
const viewChapter = (chapter) => router.push(`/teacher/chapter/${chapter.id}`)
const editChapter = (chapter) => router.push(`/teacher/chapter/create?id=${chapter.id}&courseId=${courseId.value}`)
const viewLessons = (chapter) => router.push(`/teacher/lesson?chapterId=${chapter.id}`)
const deleteChapter = (chapter) => {
  ElMessageBox.confirm(`确定要删除章节 "${chapter.title}" 吗？`, '提示', { type: 'warning' })
    .then(() => {
      chapters.value = chapters.value.filter(c => c.id !== chapter.id)
      ElMessage.success('删除成功')
    }).catch(() => {})
}

onMounted(() => loadChapters())
</script>

<style lang="scss" scoped>
.course-chapters {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    h2 { font-size: 20px; font-weight: 600; color: #303133; margin: 0; }
  }

  .chapters-list {
    display: grid;
    gap: 16px;

    .chapter-card {
      .chapter-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        h3 { font-size: 16px; font-weight: 600; color: #303133; margin: 0 0 8px 0; }
        .chapter-meta { font-size: 13px; color: #909399; display: flex; gap: 16px; }
      }
      .chapter-resources { display: flex; gap: 8px; margin-bottom: 12px; }
      .chapter-actions { display: flex; gap: 8px; }
    }
  }
}
</style>
