<template>
  <div class="homework-grading">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>批改作业：{{ homework.title }}</h1>
        <p>{{ getClassName(homework.classId) }} · 已批改 {{ gradedCount }}/{{ submissions.length }}</p>
      </div>
      <div class="header-actions">
        <el-button @click="prevSubmission" :disabled="currentIndex === 0">
          <el-icon><ArrowLeft /></el-icon> 上一份
        </el-button>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ submissions.length }}</span>
        <el-button @click="nextSubmission" :disabled="currentIndex >= submissions.length - 1">
          下一份 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <el-row :gutter="24" v-if="currentSubmission">
      <!-- 左侧：学生答案 -->
      <el-col :span="16">
        <el-card shadow="never" class="answers-card">
          <template #header>
            <div class="student-header">
              <el-avatar :size="40" :src="currentSubmission.avatar" />
              <div class="student-info">
                <div class="name">{{ currentSubmission.studentName }}</div>
                <div class="meta">学号：{{ currentSubmission.studentId }} · 提交时间：{{ currentSubmission.submitTime }}</div>
              </div>
              <el-tag v-if="currentSubmission.isGraded" type="success">已批改</el-tag>
              <el-tag v-else type="warning">待批改</el-tag>
            </div>
          </template>

          <div class="answers-list">
            <div v-for="(answer, index) in currentSubmission.answers" :key="index" class="answer-item">
              <div class="question-header">
                <span class="question-num">第{{ index + 1 }}题</span>
                <el-tag :type="getTypeTagType(answer.type)" size="small">{{ getTypeLabel(answer.type) }}</el-tag>
              </div>
              <div class="question-text">{{ answer.questionText }}</div>
              
              <!-- 学生答案 -->
              <div class="student-answer">
                <div class="answer-label">学生答案：</div>
                <div class="answer-content" :class="{ correct: answer.isCorrect, wrong: answer.isCorrect === false }">
                  {{ answer.userAnswer || '未作答' }}
                </div>
              </div>

              <!-- 参考答案 -->
              <div class="correct-answer" v-if="answer.correctAnswer">
                <div class="answer-label">参考答案：</div>
                <div class="answer-content correct">{{ answer.correctAnswer }}</div>
              </div>

              <!-- 评语输入 -->
              <div class="comment-section">
                <div class="answer-label">批改评语：</div>
                <el-input v-model="answer.comment" type="textarea" :rows="2" placeholder="输入评语（可选）" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：批改操作 -->
      <el-col :span="8">
        <el-card shadow="never" class="grading-panel">
          <template #header><span class="card-title">作业评价</span></template>
          
          <div class="total-comment">
            <div class="label">总体评语</div>
            <el-input v-model="currentSubmission.totalComment" type="textarea" :rows="4" placeholder="输入总体评语" />
          </div>

          <div class="grading-actions">
            <el-button type="primary" size="large" @click="submitGrading" style="width: 100%">
              <el-icon><Check /></el-icon> 提交批改
            </el-button>
          </div>
        </el-card>

        <!-- 提交列表 -->
        <el-card shadow="never" class="submissions-list-card">
          <template #header><span class="card-title">提交列表</span></template>
          <div class="submissions-list">
            <div 
              v-for="(sub, idx) in submissions" 
              :key="sub.id" 
              class="submission-item"
              :class="{ active: idx === currentIndex, graded: sub.isGraded }"
              @click="switchSubmission(idx)"
            >
              <el-avatar :size="32" :src="sub.avatar" />
              <div class="sub-info">
                <div class="sub-name">{{ sub.studentName }}</div>
                <div class="sub-status">
                  <el-tag v-if="sub.isGraded" type="success" size="small">已批改</el-tag>
                  <el-tag v-else type="info" size="small">待批改</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '批改作业' })

const router = useRouter()
const route = useRoute()
const homeworkId = computed(() => route.params.id)

// JSON格式的班级数据
const classes = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

// JSON格式的作业数据
const homeworksData = {
  hw001: { id: 'hw001', title: 'Python基础语法练习', classId: 'class_t001' },
  hw005: { id: 'hw005', title: '链表操作练习', classId: 'class_t003' }
}

// JSON格式的提交数据
const submissionsData = [
  {
    id: 'sub001', studentId: '2021001', studentName: '张三', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    submitTime: '2024-12-25 14:30', isGraded: false, totalComment: '',
    answers: [
      { type: 'single', questionText: '单链表的特点是什么？', userAnswer: 'A', correctAnswer: 'A', isCorrect: true, comment: '' },
      { type: 'fill', questionText: '在单链表中插入节点的时间复杂度是____', userAnswer: 'O(1)', correctAnswer: 'O(1)', isCorrect: true, comment: '' },
      { type: 'essay', questionText: '简述链表和数组的区别', userAnswer: '链表是动态分配内存，数组是静态分配...', correctAnswer: null, isCorrect: null, comment: '' }
    ]
  },
  {
    id: 'sub002', studentId: '2021002', studentName: '李四', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    submitTime: '2024-12-25 15:20', isGraded: true, totalComment: '整体不错',
    answers: [
      { type: 'single', questionText: '单链表的特点是什么？', userAnswer: 'B', correctAnswer: 'A', isCorrect: false, comment: '答案错误' },
      { type: 'fill', questionText: '在单链表中插入节点的时间复杂度是____', userAnswer: 'O(n)', correctAnswer: 'O(1)', isCorrect: false, comment: '' },
      { type: 'essay', questionText: '简述链表和数组的区别', userAnswer: '数组连续存储，链表不连续...', correctAnswer: null, isCorrect: null, comment: '回答较好' }
    ]
  },
  {
    id: 'sub003', studentId: '2021003', studentName: '王五', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    submitTime: '2024-12-25 16:00', isGraded: false, totalComment: '',
    answers: [
      { type: 'single', questionText: '单链表的特点是什么？', userAnswer: 'A', correctAnswer: 'A', isCorrect: true, comment: '' },
      { type: 'fill', questionText: '在单链表中插入节点的时间复杂度是____', userAnswer: 'O(1)', correctAnswer: 'O(1)', isCorrect: true, comment: '' },
      { type: 'essay', questionText: '简述链表和数组的区别', userAnswer: '链表插入删除快，数组查询快...', correctAnswer: null, isCorrect: null, comment: '' }
    ]
  }
]

const homework = ref({ id: '', title: '', classId: '' })
const submissions = ref([])
const currentIndex = ref(0)

const currentSubmission = computed(() => submissions.value[currentIndex.value] || null)
const gradedCount = computed(() => submissions.value.filter(s => s.isGraded).length)

const getClassName = (classId) => classes.find(c => c.id === classId)?.name || '未知班级'
const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger' }[type] || '')

const goBack = () => router.back()
const prevSubmission = () => { if (currentIndex.value > 0) currentIndex.value-- }
const nextSubmission = () => { if (currentIndex.value < submissions.value.length - 1) currentIndex.value++ }

const submitGrading = () => {
  if (currentSubmission.value) {
    currentSubmission.value.isGraded = true
    ElMessage.success(`已完成 ${currentSubmission.value.studentName} 的作业批改`)
    if (currentIndex.value < submissions.value.length - 1) {
      currentIndex.value++
    }
  }
}

const loadData = () => {
  homework.value = homeworksData[homeworkId.value] || homeworksData.hw005
  submissions.value = JSON.parse(JSON.stringify(submissionsData))

  // 自动批改有预设答案的题目
  autoGradeSubmission(currentSubmission.value)
}

// 自动批改功能
const autoGradeSubmission = (submission) => {
  if (!submission) return

  submission.answers.forEach(answer => {
    if (answer.correctAnswer) {
      // 单选题
      if (answer.type === 'single') {
        answer.isCorrect = answer.userAnswer === answer.correctAnswer
        if (!answer.comment) {
          answer.comment = answer.isCorrect ? '答案正确' : '答案错误'
        }
      }
      // 填空题
      else if (answer.type === 'fill') {
        const isCorrect = answer.userAnswer.trim().toLowerCase() === answer.correctAnswer.trim().toLowerCase()
        answer.isCorrect = isCorrect
        if (!answer.comment) {
          answer.comment = isCorrect ? '答案正确' : '答案错误'
        }
      }
    }
    // 主观题（问答）不自动批改，保留人工批改
    else {
      if (answer.isCorrect === null) answer.isCorrect = null
    }
  })
}

// 切换到新的提交记录时也进行自动批改
const switchSubmission = (idx) => {
  currentIndex.value = idx
  autoGradeSubmission(currentSubmission.value)
}

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
.homework-grading {
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    .header-info { flex: 1; }
    h1 { font-size: 20px; font-weight: 600; color: #303133; margin: 0 0 4px 0; }
    p { font-size: 14px; color: #909399; margin: 0; }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .progress-text { font-size: 14px; color: #606266; font-weight: 500; }
  }

  .answers-card {
    .student-header {
      display: flex;
      align-items: center;
      gap: 12px;
      .student-info {
        flex: 1;
        .name { font-size: 16px; font-weight: 600; color: #303133; }
        .meta { font-size: 13px; color: #909399; }
      }
    }

    .answers-list {
      .answer-item {
        padding: 16px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        margin-bottom: 16px;
        &:last-child { margin-bottom: 0; }

        .question-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .question-num { font-weight: 600; color: #409eff; }
        .question-text { font-size: 14px; color: #303133; margin-bottom: 12px; line-height: 1.6; }

        .student-answer, .correct-answer {
          margin-bottom: 12px;
          .answer-label { font-size: 13px; color: #909399; margin-bottom: 4px; }
          .answer-content {
            padding: 12px;
            background: #f5f7fa;
            border-radius: 6px;
            font-size: 14px;
            &.correct { background: #f0f9eb; color: #67c23a; }
            &.wrong { background: #fef0f0; color: #f56c6c; }
          }
        }

        .comment-section {
          .answer-label { font-size: 13px; color: #909399; margin-bottom: 4px; }
        }
      }
    }
  }

  .grading-panel {
    margin-bottom: 24px;
    .card-title { font-size: 16px; font-weight: 600; }
    .total-comment { margin-bottom: 20px; }
    .label { font-size: 14px; color: #606266; margin-bottom: 8px; }
  }

  .submissions-list-card {
    .card-title { font-size: 16px; font-weight: 600; }
    .submissions-list {
      max-height: 400px;
      overflow-y: auto;
      .submission-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover { background: #f5f7fa; }
        &.active { background: #ecf5ff; border: 1px solid #409eff; }
        &.graded { opacity: 0.7; }
        .sub-info {
          flex: 1;
          .sub-name { font-size: 14px; font-weight: 500; color: #303133; }
        }
      }
    }
  }
}
</style>
