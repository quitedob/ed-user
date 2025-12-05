<template>
  <div class="chapter-create">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ isEdit ? '编辑章节' : '新建章节' }}</h1>
        <p>{{ courseInfo.title }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="saveDraft">保存草稿</el-button>
        <el-button type="primary" @click="publishChapter">{{ isEdit ? '保存' : '发布章节' }}</el-button>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 基本信息 -->
        <el-card shadow="never" class="form-card">
          <template #header><span class="card-title">基本信息</span></template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="章节标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入章节标题" maxlength="50" show-word-limit />
            </el-form-item>
            <el-form-item label="章节简介" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入章节简介" maxlength="500" show-word-limit />
            </el-form-item>
            <el-form-item label="章节序号" prop="order">
              <el-input-number v-model="form.order" :min="1" :max="100" />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 课时列表 -->
        <el-card shadow="never" class="form-card lessons-card">
          <template #header>
            <div class="card-header-with-action">
              <span class="card-title">课时列表</span>
              <el-button type="primary" size="small" @click="addLesson">
                <el-icon><Plus /></el-icon> 添加课时
              </el-button>
            </div>
          </template>

          <div class="lessons-list" v-if="form.lessons.length > 0">
            <div v-for="(lesson, index) in form.lessons" :key="index" class="lesson-item">
              <div class="lesson-drag"><el-icon><Rank /></el-icon></div>
              <div class="lesson-index">{{ index + 1 }}</div>
              <div class="lesson-content">
                <el-input v-model="lesson.title" placeholder="课时标题" style="margin-bottom: 8px" />
                <div class="lesson-type">
                  <el-radio-group v-model="lesson.type" size="small">
                    <el-radio-button label="video">视频</el-radio-button>
                    <el-radio-button label="document">文档</el-radio-button>
                    <el-radio-button label="quiz">测验</el-radio-button>
                  </el-radio-group>
                  <el-input-number v-model="lesson.duration" :min="1" size="small" style="width: 100px; margin-left: 12px" />
                  <span class="duration-label">分钟</span>
                </div>
              </div>
              <el-button link type="danger" @click="removeLesson(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          <el-empty v-else description="暂无课时，点击上方按钮添加" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 章节设置 -->
        <el-card shadow="never" class="form-card">
          <template #header><span class="card-title">章节设置</span></template>
          <el-form label-width="80px">
            <el-form-item label="发布状态">
              <el-switch v-model="form.isPublished" active-text="已发布" inactive-text="草稿" />
            </el-form-item>
            <el-form-item label="学习要求">
              <el-checkbox v-model="form.requireSequential">按顺序学习</el-checkbox>
            </el-form-item>
            <el-form-item label="解锁条件">
              <el-select v-model="form.unlockCondition" placeholder="选择解锁条件" style="width: 100%">
                <el-option label="无限制" value="none" />
                <el-option label="完成上一章节" value="prev_chapter" />
                <el-option label="指定日期后" value="date" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 关联资源 -->
        <el-card shadow="never" class="form-card">
          <template #header><span class="card-title">关联资源</span></template>
          <div class="resource-list">
            <div class="resource-item" @click="linkHomework">
              <el-icon><EditPen /></el-icon>
              <span>关联作业</span>
              <el-tag v-if="form.homeworkId" size="small" type="success">已关联</el-tag>
            </div>
            <div class="resource-item" @click="linkExam">
              <el-icon><Document /></el-icon>
              <span>关联考试</span>
              <el-tag v-if="form.examId" size="small" type="success">已关联</el-tag>
            </div>
          </div>
        </el-card>

        <!-- 章节统计 -->
        <el-card shadow="never" class="form-card" v-if="isEdit">
          <template #header><span class="card-title">学习统计</span></template>
          <div class="stats-list">
            <div class="stat-row"><span class="label">总课时</span><span class="value">{{ form.lessons.length }}</span></div>
            <div class="stat-row"><span class="label">总时长</span><span class="value">{{ totalDuration }}分钟</span></div>
            <div class="stat-row"><span class="label">完成人数</span><span class="value">{{ form.completedStudents || 0 }}人</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Rank, Delete, EditPen, Document } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '章节管理' })

const router = useRouter()
const route = useRoute()
const formRef = ref()
const isEdit = computed(() => !!route.query.id)
const courseId = computed(() => route.query.courseId)

// JSON格式的课程数据
const coursesData = {
  course_t001: { id: 'course_t001', title: 'Python编程基础' },
  course_t002: { id: 'course_t002', title: 'JavaScript进阶开发' },
  course_t003: { id: 'course_t003', title: '数据结构与算法' }
}

const courseInfo = ref({ id: '', title: '' })

const form = ref({
  title: '',
  description: '',
  order: 1,
  isPublished: false,
  requireSequential: true,
  unlockCondition: 'none',
  homeworkId: '',
  examId: '',
  completedStudents: 0,
  lessons: []
})

const rules = {
  title: [{ required: true, message: '请输入章节标题', trigger: 'blur' }]
}

const totalDuration = computed(() => form.value.lessons.reduce((sum, l) => sum + (l.duration || 0), 0))

const goBack = () => router.back()
const addLesson = () => {
  form.value.lessons.push({ title: '', type: 'video', duration: 10 })
}
const removeLesson = (index) => { form.value.lessons.splice(index, 1) }
const linkHomework = () => ElMessage.info('关联作业功能开发中...')
const linkExam = () => ElMessage.info('关联考试功能开发中...')
const saveDraft = () => {
  form.value.isPublished = false
  ElMessage.success('草稿保存成功')
}
const publishChapter = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.lessons.length === 0) {
        ElMessage.warning('请至少添加一个课时')
        return
      }
      ElMessage.success(isEdit.value ? '章节保存成功' : '章节发布成功')
      router.back()
    }
  })
}

const loadData = () => {
  courseInfo.value = coursesData[courseId.value] || coursesData.course_t001
  if (route.query.id) {
    // 编辑模式加载数据
    form.value = {
      title: '第一章：Python基础语法',
      description: '本章介绍Python的基础语法，包括变量、数据类型、运算符等',
      order: 1,
      isPublished: true,
      requireSequential: true,
      unlockCondition: 'none',
      homeworkId: 'hw001',
      examId: '',
      completedStudents: 38,
      lessons: [
        { title: '1.1 Python简介', type: 'video', duration: 15 },
        { title: '1.2 变量与数据类型', type: 'video', duration: 20 },
        { title: '1.3 运算符', type: 'video', duration: 18 },
        { title: '1.4 章节测验', type: 'quiz', duration: 10 }
      ]
    }
  }
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.chapter-create {
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

  .form-card {
    margin-bottom: 24px;
    .card-title { font-size: 16px; font-weight: 600; }
    .card-header-with-action { display: flex; justify-content: space-between; align-items: center; }
  }

  .lessons-card {
    .lessons-list {
      .lesson-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 12px;
        background: #fafafa;
        .lesson-drag { cursor: move; color: #909399; padding-top: 8px; }
        .lesson-index { width: 28px; height: 28px; background: #409eff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
        .lesson-content { flex: 1; }
        .lesson-type { display: flex; align-items: center; }
        .duration-label { font-size: 13px; color: #909399; margin-left: 4px; }
      }
    }
  }

  .resource-list {
    .resource-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px dashed #dcdfe6;
      border-radius: 8px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { border-color: #409eff; background: #ecf5ff; }
      .el-icon { font-size: 20px; color: #409eff; }
      span { flex: 1; color: #606266; }
    }
  }

  .stats-list {
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      &:last-child { border-bottom: none; }
      .label { color: #909399; }
      .value { font-weight: 600; color: #303133; }
    }
  }
}
</style>
