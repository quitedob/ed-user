<template>
  <div class="exam-create">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ isEdit ? '编辑考试' : '发布考试' }}</h1>
      </div>
      <div class="header-actions">
        <el-button @click="saveDraft">保存草稿</el-button>
        <el-button type="primary" @click="publishExam">发布考试</el-button>
      </div>
    </div>

    <div class="form-content">
      <el-row :gutter="24">
        <!-- 左侧：基本信息 -->
        <el-col :span="12">
          <el-card shadow="never" class="form-card">
            <template #header><span class="card-title">基本信息</span></template>
            
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
              <el-form-item label="考试标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入考试标题" maxlength="50" show-word-limit />
              </el-form-item>

              <el-form-item label="考试描述" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入考试描述" />
              </el-form-item>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="关联班级" prop="classId">
                    <el-select v-model="form.classId" placeholder="请选择班级" style="width: 100%">
                      <el-option v-for="cls in classes" :key="cls.id" :label="cls.name" :value="cls.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="关联课程">
                    <el-select v-model="form.courseId" placeholder="请选择课程" style="width: 100%">
                      <el-option v-for="course in courses" :key="course.id" :label="course.name" :value="course.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="考试时长" prop="duration">
                    <el-input-number v-model="form.duration" :min="10" :max="300" :step="10" style="width: 100%" />
                    <span class="form-tip">分钟</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="总分" prop="totalScore">
                    <el-input-number v-model="calculatedTotalScore" :min="0" disabled style="width: 100%" />
                    <span class="form-tip">分（自动计算）</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="及格分数">
                <el-input-number v-model="form.passScore" :min="0" :max="calculatedTotalScore" style="width: 100%" />
                <span class="form-tip">分</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 右侧：题目设置 -->
        <el-col :span="12">
          <el-card shadow="never" class="form-card questions-card">
            <template #header>
              <div class="card-header-with-action">
                <span class="card-title">题目设置 (总分: {{ calculatedTotalScore }}分)</span>
                <el-button type="primary" size="small" @click="openQuestionSelector">
                  <el-icon><Plus /></el-icon> 从题库选题
                </el-button>
              </div>
            </template>

            <div class="questions-list" v-if="form.questions.length > 0">
              <div v-for="(q, index) in form.questions" :key="q.id" class="question-item">
                <div class="question-header">
                  <span class="question-index">{{ index + 1 }}</span>
                  <el-tag :type="getTypeTagType(q.type)" size="small">{{ getTypeLabel(q.type) }}</el-tag>
                  <el-tag :type="getDifficultyTagType(q.difficulty)" size="small">{{ getDifficultyLabel(q.difficulty) }}</el-tag>
                  <div class="score-input">
                    <el-input-number v-model="q.score" :min="1" :max="50" size="small" style="width: 80px" @change="handleScoreChange" />
                    <span>分</span>
                  </div>
                </div>
                <div class="question-content">{{ q.questionText }}</div>
                <div class="question-actions">
                  <el-button link type="danger" size="small" @click="removeQuestion(index)">删除</el-button>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂未添加题目，请从题库选题" />

            <div class="questions-summary" v-if="form.questions.length > 0">
              <span>共 {{ form.questions.length }} 道题目，总分 {{ calculatedTotalScore }} 分</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 题库选择对话框 -->
    <QuestionSelectorDialog
      v-model:visible="questionSelectorVisible"
      :selected-questions="form.questions"
      @confirm="handleQuestionConfirm"
    />
  </div>
</template>

<script setup>
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import QuestionSelectorDialog from '~/components/QuestionSelectorDialog.vue'

definePageMeta({ layout: 'teacher', title: '发布考试' })

const router = useRouter()
const route = useRoute()
const formRef = ref()
const isEdit = computed(() => !!route.query.id)

// JSON格式的班级数据
const classes = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

// JSON格式的课程数据
const courses = [
  { id: 'course_t001', name: 'Python编程基础' },
  { id: 'course_t002', name: 'JavaScript进阶开发' },
  { id: 'course_t003', name: '数据结构与算法' }
]

// JSON格式的题库数据 - 题目自带默认分数
const questionBank = [
  { id: 'q001', type: 'single', questionText: 'Python中用于定义函数的关键字是？', difficulty: 'easy', score: 5 },
  { id: 'q002', type: 'single', questionText: '以下哪个不是Python的内置数据类型？', difficulty: 'easy', score: 5 },
  { id: 'q003', type: 'multiple', questionText: '以下哪些是Python的循环语句？', difficulty: 'medium', score: 10 },
  { id: 'q004', type: 'fill', questionText: 'Python中使用____关键字导入模块', difficulty: 'easy', score: 5 },
  { id: 'q005', type: 'essay', questionText: '简述Python中列表和元组的区别', difficulty: 'medium', score: 15 },
  { id: 'q006', type: 'programming', questionText: '编写一个函数，计算斐波那契数列的第n项', difficulty: 'hard', score: 25 },
  { id: 'q007', type: 'single', questionText: 'JavaScript中声明变量的关键字不包括？', difficulty: 'easy', score: 5 },
  { id: 'q008', type: 'multiple', questionText: '以下哪些是ES6的新特性？', difficulty: 'medium', score: 10 }
]

const form = ref({
  title: '',
  description: '',
  classId: route.query.classId || '',
  courseId: route.query.courseId || '',
  startTime: null,
  endTime: null,
  duration: 120,
  totalScore: 100,
  passScore: 60,
  questions: []
})

const rules = {
  title: [{ required: true, message: '请输入考试标题', trigger: 'blur' }],
  classId: [{ required: true, message: '请选择班级', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  duration: [{ required: true, message: '请设置考试时长', trigger: 'change' }]
}

const questionSelectorVisible = ref(false)

const calculatedTotalScore = computed(() => form.value.questions.reduce((sum, q) => sum + (q.score || 0), 0))

const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程', judge: '判断', scratch: 'Scratch' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger', judge: '', scratch: 'success' }[type] || '')
const getDifficultyLabel = (d) => ({ easy: '简单', medium: '中等', hard: '困难' }[d] || d)
const getDifficultyTagType = (d) => ({ easy: 'success', medium: 'warning', hard: 'danger' }[d] || '')
const getDefaultScore = (d) => ({ easy: 5, medium: 10, hard: 20 }[d] || 5)

const goBack = () => router.back()
const openQuestionSelector = () => { questionSelectorVisible.value = true }
const handleQuestionConfirm = (questions) => {
  // 题目自带默认分数，如果没有则按难度设置
  const questionsWithScore = questions.map(q => ({
    ...q,
    score: q.score || getDefaultScore(q.difficulty)
  }))
  form.value.questions = questionsWithScore
  ElMessage.success(`已选择 ${questionsWithScore.length} 道题目，总分 ${calculatedTotalScore.value} 分`)
}
const removeQuestion = (index) => {
  form.value.questions.splice(index, 1)
  // 如果删除题目后总分减少，自动调整及格分数
  if (form.value.passScore > calculatedTotalScore.value) {
    form.value.passScore = calculatedTotalScore.value
  }
}
const handleScoreChange = () => {
  // 题目分数变化时，自动调整及格分数
  if (form.value.passScore > calculatedTotalScore.value) {
    form.value.passScore = calculatedTotalScore.value
  }
}
const saveDraft = () => ElMessage.success('草稿保存成功')
const publishExam = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.questions.length === 0) {
        ElMessage.warning('请至少添加一道题目')
        return
      }
      ElMessage.success('考试发布成功')
      router.back()
    }
  })
}

onMounted(() => {
  if (route.query.id) {
    // 编辑模式加载数据
    form.value = {
      title: '期中考试',
      description: '本学期期中考试',
      classId: 'class_t001',
      startTime: new Date('2024-12-20 09:00'),
      endTime: new Date('2024-12-20 11:00'),
      duration: 120,
      totalScore: 100,
      passScore: 60,
      questions: [
        { ...questionBank[0], score: 5 },
        { ...questionBank[1], score: 5 },
        { ...questionBank[2], score: 10 }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.exam-create {
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    .header-info { flex: 1; }
    h1 { font-size: 24px; font-weight: 600; color: #303133; margin: 0; }
    .header-actions { display: flex; gap: 12px; }
  }

  .form-card {
    height: 100%;
    .card-title { font-size: 16px; font-weight: 600; }
    .card-header-with-action { display: flex; justify-content: space-between; align-items: center; }
    .form-tip { font-size: 12px; color: #909399; margin-left: 8px; }
  }

  .questions-card {
    .questions-list {
      max-height: 400px;
      overflow-y: auto;
      .question-item {
        padding: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 12px;
        .question-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          .score-input { margin-left: auto; display: flex; align-items: center; gap: 4px; }
        }
        .question-index { width: 24px; height: 24px; background: #409eff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .question-content { font-size: 14px; color: #606266; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .question-actions { display: flex; gap: 8px; }
      }
    }
    .questions-summary { padding-top: 12px; border-top: 1px solid #e4e7ed; margin-top: 12px; font-size: 14px; color: #909399; }
  }

  .question-selector {
    .selector-filters { display: flex; gap: 12px; margin-bottom: 16px; }
  }
}
</style>
