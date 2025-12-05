<template>
  <div class="homework-create">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ isEdit ? '编辑作业' : '发布作业' }}</h1>
      </div>
      <div class="header-actions">
        <el-button @click="saveDraft">保存草稿</el-button>
        <el-button type="primary" @click="publishHomework">发布作业</el-button>
      </div>
    </div>

    <div class="form-content">
      <el-row :gutter="24">
        <!-- 左侧：基本信息 -->
        <el-col :span="12">
          <el-card shadow="never" class="form-card">
            <template #header><span class="card-title">基本信息</span></template>
            
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
              <el-form-item label="作业标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入作业标题" maxlength="50" show-word-limit />
              </el-form-item>

              <el-form-item label="作业描述" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入作业描述" maxlength="500" show-word-limit />
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
                  <el-form-item label="截止时间" prop="deadline">
                    <el-date-picker v-model="form.deadline" type="datetime" placeholder="选择截止时间" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="允许补交">
                <el-switch v-model="form.allowLateSubmit" />
                <span class="form-tip">开启后学生可在截止后继续提交</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 右侧：题目设置 -->
        <el-col :span="12">
          <el-card shadow="never" class="form-card questions-card">
            <template #header>
              <div class="card-header-with-action">
                <span class="card-title">题目设置</span>
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
                </div>
                <div class="question-content">{{ q.questionText }}</div>
                <div class="question-actions">
                  <el-button link type="primary" size="small" @click="previewQuestion(q)">预览</el-button>
                  <el-button link type="danger" size="small" @click="removeQuestion(index)">删除</el-button>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂未添加题目，请从题库选题" />

            <div class="questions-summary" v-if="form.questions.length > 0">
              <span>共 {{ form.questions.length }} 道题目</span>
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

definePageMeta({ layout: 'teacher', title: '发布作业' })

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

// JSON格式的题库数据
const questionBank = [
  { id: 'q001', type: 'single', questionText: 'Python中用于定义函数的关键字是？', difficulty: 'easy', options: ['def', 'function', 'func', 'define'], answer: 'A' },
  { id: 'q002', type: 'single', questionText: '以下哪个不是Python的内置数据类型？', difficulty: 'easy', options: ['list', 'tuple', 'array', 'dict'], answer: 'C' },
  { id: 'q003', type: 'multiple', questionText: '以下哪些是Python的循环语句？', difficulty: 'medium', options: ['for', 'while', 'loop', 'repeat'], answer: ['A', 'B'] },
  { id: 'q004', type: 'fill', questionText: 'Python中使用____关键字导入模块', difficulty: 'easy', answer: 'import' },
  { id: 'q005', type: 'essay', questionText: '简述Python中列表和元组的区别', difficulty: 'medium', answer: '' },
  { id: 'q006', type: 'programming', questionText: '编写一个函数，计算斐波那契数列的第n项', difficulty: 'hard', answer: '' },
  { id: 'q007', type: 'single', questionText: 'JavaScript中声明变量的关键字不包括？', difficulty: 'easy', options: ['var', 'let', 'const', 'int'], answer: 'D' },
  { id: 'q008', type: 'multiple', questionText: '以下哪些是ES6的新特性？', difficulty: 'medium', options: ['箭头函数', '模板字符串', 'Promise', '以上都是'], answer: ['A', 'B', 'C', 'D'] }
]

// JSON格式的课程数据
const courses = [
  { id: 'course_t001', name: 'Python编程基础' },
  { id: 'course_t002', name: 'JavaScript进阶开发' },
  { id: 'course_t003', name: '数据结构与算法' }
]

const form = ref({
  title: '',
  description: '',
  classId: route.query.classId || '',
  courseId: route.query.courseId || '',
  startTime: null,
  deadline: null,
  allowLateSubmit: false,
  questions: []
})

const rules = {
  title: [{ required: true, message: '请输入作业标题', trigger: 'blur' }],
  classId: [{ required: true, message: '请选择班级', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
}

const questionSelectorVisible = ref(false)

const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程', judge: '判断', scratch: 'Scratch' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger', judge: '', scratch: 'success' }[type] || '')
const getDifficultyLabel = (d) => ({ easy: '简单', medium: '中等', hard: '困难' }[d] || d)
const getDifficultyTagType = (d) => ({ easy: 'success', medium: 'warning', hard: 'danger' }[d] || '')

const goBack = () => router.back()
const openQuestionSelector = () => { questionSelectorVisible.value = true }
const handleQuestionConfirm = (questions) => {
  form.value.questions = questions
  ElMessage.success(`已选择 ${questions.length} 道题目`)
}
const removeQuestion = (index) => { form.value.questions.splice(index, 1) }
const previewQuestion = (q) => ElMessage.info(`预览题目：${q.questionText}`)
const saveDraft = () => ElMessage.success('草稿保存成功')
const publishHomework = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.questions.length === 0) {
        ElMessage.warning('请至少添加一道题目')
        return
      }
      ElMessage.success('作业发布成功')
      router.back()
    }
  })
}

// 编辑模式加载数据
const loadHomework = () => {
  if (route.query.id) {
    // 模拟加载作业数据
    form.value = {
      title: '链表操作练习',
      description: '完成链表的基本操作练习',
      classId: 'class_t003',
      startTime: new Date('2024-12-20'),
      deadline: new Date('2024-12-26'),
      allowLateSubmit: true,
      questions: [questionBank[0], questionBank[1], questionBank[2]]
    }
  }
}

onMounted(() => loadHomework())
</script>

<style lang="scss" scoped>
.homework-create {
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
    .form-tip { font-size: 12px; color: #909399; margin-left: 12px; }
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
        .question-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
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
