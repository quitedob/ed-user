<template>
  <div class="lesson-create">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ isEdit ? '编辑课时' : '添加课时' }}</h1>
        <p>{{ chapterInfo.title }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="saveLesson">保存</el-button>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 基本信息 -->
        <el-card shadow="never" class="form-card">
          <template #header><span class="card-title">基本信息</span></template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="课时标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入课时标题" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item label="课时类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio-button label="video">
                  <el-icon><VideoPlay /></el-icon> 视频
                </el-radio-button>
                <el-radio-button label="document">
                  <el-icon><Document /></el-icon> 文档
                </el-radio-button>
                <el-radio-button label="quiz">
                  <el-icon><EditPen /></el-icon> 测验
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="预计时长">
              <el-input-number v-model="form.duration" :min="1" :max="300" />
              <span class="form-tip">分钟</span>
            </el-form-item>
            <el-form-item label="课时简介">
              <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入课时简介" />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 视频上传 -->
        <el-card shadow="never" class="form-card" v-if="form.type === 'video'">
          <template #header><span class="card-title">视频内容</span></template>
          <div class="upload-area">
            <el-upload drag action="#" :auto-upload="false" :on-change="handleVideoChange" accept="video/*">
              <el-icon class="el-icon--upload"><Upload /></el-icon>
              <div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">支持 MP4、AVI、MOV 格式，单个文件不超过 500MB</div>
              </template>
            </el-upload>
            <div v-if="form.videoUrl" class="video-preview">
              <el-icon><VideoPlay /></el-icon>
              <span>已上传视频</span>
              <el-button link type="danger" @click="removeVideo">删除</el-button>
            </div>
          </div>
        </el-card>

        <!-- 文档内容 -->
        <el-card shadow="never" class="form-card" v-if="form.type === 'document'">
          <template #header><span class="card-title">文档内容</span></template>
          <el-input v-model="form.content" type="textarea" :rows="15" placeholder="请输入文档内容，支持Markdown格式" />
        </el-card>

        <!-- 测验设置 -->
        <el-card shadow="never" class="form-card" v-if="form.type === 'quiz'">
          <template #header>
            <div class="card-header-with-action">
              <span class="card-title">测验题目</span>
              <el-button type="primary" size="small" @click="addQuestion">
                <el-icon><Plus /></el-icon> 添加题目
              </el-button>
            </div>
          </template>
          <div class="quiz-questions" v-if="form.questions.length > 0">
            <div v-for="(q, index) in form.questions" :key="index" class="question-item">
              <div class="question-header">
                <span class="question-num">第{{ index + 1 }}题</span>
                <el-select v-model="q.type" size="small" style="width: 100px">
                  <el-option label="单选" value="single" />
                  <el-option label="多选" value="multiple" />
                  <el-option label="判断" value="judge" />
                </el-select>
                <el-button link type="danger" @click="removeQuestion(index)">删除</el-button>
              </div>
              <el-input v-model="q.text" placeholder="请输入题目内容" style="margin-bottom: 8px" />
              <div class="options-list" v-if="q.type !== 'judge'">
                <div v-for="(opt, optIdx) in q.options" :key="optIdx" class="option-item">
                  <el-radio v-if="q.type === 'single'" v-model="q.answer" :label="optIdx">{{ String.fromCharCode(65 + optIdx) }}</el-radio>
                  <el-checkbox v-else v-model="q.answers" :label="optIdx">{{ String.fromCharCode(65 + optIdx) }}</el-checkbox>
                  <el-input v-model="q.options[optIdx]" placeholder="选项内容" size="small" />
                </div>
              </div>
              <div v-else class="judge-options">
                <el-radio-group v-model="q.answer">
                  <el-radio :label="true">正确</el-radio>
                  <el-radio :label="false">错误</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无题目，点击上方按钮添加" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 课时设置 -->
        <el-card shadow="never" class="form-card">
          <template #header><span class="card-title">课时设置</span></template>
          <el-form label-width="80px">
            <el-form-item label="是否必修">
              <el-switch v-model="form.isRequired" />
            </el-form-item>
            <el-form-item label="允许跳过">
              <el-switch v-model="form.allowSkip" />
            </el-form-item>
            <el-form-item label="完成条件" v-if="form.type === 'video'">
              <el-select v-model="form.completeCondition" style="width: 100%">
                <el-option label="观看完整视频" value="full" />
                <el-option label="观看80%以上" value="80" />
                <el-option label="观看50%以上" value="50" />
              </el-select>
            </el-form-item>
            <el-form-item label="及格分数" v-if="form.type === 'quiz'">
              <el-input-number v-model="form.passScore" :min="0" :max="100" />
              <span class="form-tip">分</span>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 学习统计 -->
        <el-card shadow="never" class="form-card" v-if="isEdit">
          <template #header><span class="card-title">学习统计</span></template>
          <div class="stats-list">
            <div class="stat-row"><span class="label">完成人数</span><span class="value">{{ form.completedCount || 0 }}人</span></div>
            <div class="stat-row"><span class="label">平均学习时长</span><span class="value">{{ form.avgDuration || 0 }}分钟</span></div>
            <div class="stat-row" v-if="form.type === 'quiz'"><span class="label">平均得分</span><span class="value">{{ form.avgScore || 0 }}分</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft, VideoPlay, Document, EditPen, Upload, Plus } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '课时管理' })

const router = useRouter()
const route = useRoute()
const formRef = ref()
const isEdit = computed(() => !!route.query.id)
const chapterId = computed(() => route.query.chapterId)

// JSON格式的章节数据
const chaptersData = {
  ch001: { id: 'ch001', title: '第一章：Python基础语法' },
  ch007: { id: 'ch007', title: '第一章：数组与链表' }
}

const chapterInfo = ref({ id: '', title: '' })

const form = ref({
  title: '',
  type: 'video',
  duration: 15,
  description: '',
  videoUrl: '',
  content: '',
  questions: [],
  isRequired: true,
  allowSkip: false,
  completeCondition: 'full',
  passScore: 60,
  completedCount: 0,
  avgDuration: 0,
  avgScore: 0
})

const rules = {
  title: [{ required: true, message: '请输入课时标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择课时类型', trigger: 'change' }]
}

const goBack = () => router.back()
const handleVideoChange = (file) => {
  form.value.videoUrl = URL.createObjectURL(file.raw)
  ElMessage.success('视频上传成功')
}
const removeVideo = () => { form.value.videoUrl = '' }
const addQuestion = () => {
  form.value.questions.push({ type: 'single', text: '', options: ['', '', '', ''], answer: 0, answers: [] })
}
const removeQuestion = (index) => { form.value.questions.splice(index, 1) }
const saveLesson = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '课时保存成功' : '课时添加成功')
      router.back()
    }
  })
}

const loadData = () => {
  chapterInfo.value = chaptersData[chapterId.value] || chaptersData.ch001
  if (route.query.id) {
    // 编辑模式加载数据
    form.value = {
      title: '1.1 Python简介与环境搭建',
      type: 'video',
      duration: 15,
      description: '本课时介绍Python的发展历史和环境搭建方法',
      videoUrl: 'xxx',
      content: '',
      questions: [],
      isRequired: true,
      allowSkip: false,
      completeCondition: 'full',
      passScore: 60,
      completedCount: 42,
      avgDuration: 14,
      avgScore: 0
    }
  }
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.lesson-create {
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
    .form-tip { font-size: 13px; color: #909399; margin-left: 8px; }
  }

  .upload-area {
    .video-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f0f9eb;
      border-radius: 8px;
      margin-top: 16px;
      .el-icon { font-size: 24px; color: #67c23a; }
      span { flex: 1; color: #67c23a; font-weight: 500; }
    }
  }

  .quiz-questions {
    .question-item {
      padding: 16px;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      margin-bottom: 16px;
      .question-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .question-num { font-weight: 600; color: #409eff; }
      .options-list {
        .option-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
      }
      .judge-options { padding: 8px 0; }
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
