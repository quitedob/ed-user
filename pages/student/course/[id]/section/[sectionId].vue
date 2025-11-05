<template>
  <div class="section-page">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <el-button @click="goBack" :icon="ArrowLeft" text class="back-btn">返回课程</el-button>
      <h1 class="section-title">{{ sectionInfo.title }}</h1>
      <div class="header-spacer"></div>
    </div>

    <!-- 主体内容区 -->
    <div class="page-content">
      <!-- 左侧内容展示区 -->
      <div class="main-content">
        <!-- 学习状态提示 -->
        <div v-if="sectionInfo.completed" class="status-badge">
          <el-icon><Check /></el-icon>
          <span>任务点已完成</span>
        </div>

        <!-- 内容展示区域 -->
        <div class="content-display">
          <!-- 视频播放器 -->
          <div v-if="sectionInfo.type === 'video'" class="video-container">
            <video
              ref="videoPlayer"
              :src="sectionInfo.videoUrl"
              :poster="sectionInfo.cover"
              controls
              @timeupdate="onVideoProgress"
              @ended="onVideoComplete"
            >
              您的浏览器不支持视频播放
            </video>
          </div>

          <!-- PDF查看器 -->
          <div v-else-if="sectionInfo.type === 'pdf'" class="pdf-container">
            <iframe :src="sectionInfo.pdfUrl" frameborder="0"></iframe>
          </div>

          <!-- 富文本内容 -->
          <div v-else-if="sectionInfo.type === 'text'" class="text-content">
            <div v-html="sectionInfo.content"></div>
          </div>

          <!-- 题目展示 -->
          <div v-else-if="sectionInfo.type === 'quiz'" class="quiz-container">
            <div class="quiz-header">
              <h2>{{ sectionInfo.quizTitle }}</h2>
              <div class="quiz-meta">
                <span>题型：{{ sectionInfo.quizType }}</span>
                <span>满分：{{ sectionInfo.quizScore }}</span>
              </div>
            </div>
            <div class="quiz-content">
              <div class="question">
                <div class="question-text" v-html="sectionInfo.question"></div>
                <div class="options">
                  <div
                    v-for="(option, index) in sectionInfo.options"
                    :key="index"
                    class="option-item"
                    :class="{ selected: selectedOption === index, correct: showAnswer && option.isCorrect, wrong: showAnswer && selectedOption === index && !option.isCorrect }"
                    @click="selectOption(index)"
                  >
                    <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                  </div>
                </div>
              </div>
              <div class="quiz-actions">
                <el-button v-if="!showAnswer" type="primary" @click="submitAnswer">提交答案</el-button>
                <div v-else class="answer-result">
                  <div v-if="isCorrect" class="result-correct">
                    <el-icon><Check /></el-icon>
                    <span>回答正确！得分：{{ sectionInfo.quizScore }}</span>
                  </div>
                  <div v-else class="result-wrong">
                    <el-icon><Close /></el-icon>
                    <span>回答错误，请重新作答</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部导航按钮 -->
        <div class="bottom-navigation">
          <el-button
            :disabled="!hasPrevSection"
            @click="goToPrevSection"
            size="large"
          >
            上一节
          </el-button>
          <el-button
            type="primary"
            :disabled="!hasNextSection"
            @click="goToNextSection"
            size="large"
          >
            下一节
          </el-button>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="sidebar">
        <el-tabs v-model="activeTab" class="sidebar-tabs">
          <!-- 目录标签 -->
          <el-tab-pane label="目录" name="outline">
            <div class="course-outline">
              <div
                v-for="chapter in chapters"
                :key="chapter.id"
                class="outline-chapter"
              >
                <div class="chapter-header">
                  <span class="chapter-title">{{ chapter.number }} {{ chapter.title }}</span>
                </div>
                <div class="outline-sections">
                  <div
                    v-for="section in chapter.sections"
                    :key="section.id"
                    class="outline-section"
                    :class="{
                      active: section.id === parseInt(sectionId),
                      completed: section.completed
                    }"
                    @click="goToSection(section.id)"
                  >
                    <el-icon v-if="section.completed" color="#67c23a" class="section-icon">
                      <Check />
                    </el-icon>
                    <span class="section-number">{{ section.number }}</span>
                    <span class="section-title">{{ section.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 讨论标签 -->
          <el-tab-pane label="讨论" name="discussion">
            <div class="discussion-content">
              <p class="empty-tip">暂无讨论内容</p>
            </div>
          </el-tab-pane>

          <!-- 笔记标签 -->
          <el-tab-pane label="笔记" name="notes">
            <div class="notes-content">
              <p class="empty-tip">暂无笔记</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  Check,
  Close
} from '@element-plus/icons-vue'

definePageMeta({
  title: '课程学习',
  layout: false
})

const route = useRoute()
const router = useRouter()

const courseId = computed(() => parseInt(route.params.id))
const sectionId = computed(() => parseInt(route.params.sectionId))

// 右侧标签页
const activeTab = ref('outline')

// 视频播放器引用
const videoPlayer = ref(null)

// 题目相关状态
const selectedOption = ref(null)
const showAnswer = ref(false)
const isCorrect = ref(false)

// 课程信息
const courseInfo = ref({
  id: courseId.value,
  title: '',
  cover: ''
})

// 当前课时信息
const sectionInfo = ref({
  id: sectionId.value,
  title: '',
  chapterTitle: '',
  type: 'video', // video, pdf, text, quiz
  videoUrl: '',
  pdfUrl: '',
  cover: '',
  content: '',
  duration: '',
  progress: 0,
  completed: false,
  // 题目相关
  quizTitle: '',
  quizType: '',
  quizScore: 0,
  question: '',
  options: []
})

// 章节数据
const chapters = ref([])

// 导航状态
const hasPrevSection = ref(false)
const hasNextSection = ref(false)

// 方法
const goBack = () => {
  router.push(`/student/course/${courseId.value}/chapters`)
}

const toggleChapter = (chapterId) => {
  const chapter = chapters.value.find(c => c.id === chapterId)
  if (chapter) {
    chapter.expanded = !chapter.expanded
  }
}

const goToSection = (targetSectionId) => {
  if (targetSectionId !== sectionId.value) {
    router.push(`/student/course/${courseId.value}/section/${targetSectionId}`)
  }
}

const goToPrevSection = () => {
  // 查找上一节
  for (let i = 0; i < chapters.value.length; i++) {
    const chapter = chapters.value[i]
    for (let j = 0; j < chapter.sections.length; j++) {
      const section = chapter.sections[j]
      if (section.id === sectionId.value && j > 0) {
        goToSection(chapter.sections[j - 1].id)
        return
      }
      if (section.id === sectionId.value && i > 0) {
        const prevChapter = chapters.value[i - 1]
        const lastSection = prevChapter.sections[prevChapter.sections.length - 1]
        goToSection(lastSection.id)
        return
      }
    }
  }
}

const goToNextSection = () => {
  // 查找下一节
  for (let i = 0; i < chapters.value.length; i++) {
    const chapter = chapters.value[i]
    for (let j = 0; j < chapter.sections.length; j++) {
      const section = chapter.sections[j]
      if (section.id === sectionId.value && j < chapter.sections.length - 1) {
        goToSection(chapter.sections[j + 1].id)
        return
      }
      if (section.id === sectionId.value && i < chapters.value.length - 1) {
        const nextChapter = chapters.value[i + 1]
        goToSection(nextChapter.sections[0].id)
        return
      }
    }
  }
}

const onVideoProgress = (event) => {
  if (videoPlayer.value) {
    const progress = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100
    sectionInfo.value.progress = Math.floor(progress)
  }
}

const onVideoComplete = () => {
  sectionInfo.value.completed = true
  const currentSection = findSectionById(sectionId.value)
  if (currentSection) {
    currentSection.completed = true
  }
  ElMessage.success('恭喜完成本节学习！')
}

// 题目相关方法
const selectOption = (index) => {
  if (!showAnswer.value) {
    selectedOption.value = index
  }
}

const submitAnswer = () => {
  if (selectedOption.value === null) {
    ElMessage.warning('请选择一个答案')
    return
  }
  
  showAnswer.value = true
  const selectedOpt = sectionInfo.value.options[selectedOption.value]
  isCorrect.value = selectedOpt.isCorrect
  
  if (isCorrect.value) {
    sectionInfo.value.completed = true
    const currentSection = findSectionById(sectionId.value)
    if (currentSection) {
      currentSection.completed = true
    }
  }
}

const findSectionById = (targetSectionId) => {
  for (const chapter of chapters.value) {
    const section = chapter.sections.find(s => s.id === targetSectionId)
    if (section) return section
  }
  return null
}

// 加载数据
const loadData = async () => {
  // 模拟课程数据
  const courseData = {
    1: {
      title: '软件工程导论',
      cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
    },
    2: {
      title: '编译原理',
      cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400'
    }
  }

  const course = courseData[courseId.value]
  if (course) {
    courseInfo.value = { ...course, id: courseId.value }
    loadChaptersData()
    loadSectionData()
  }
}

const loadChaptersData = () => {
  // 模拟章节数据
  const chaptersData = [
    {
      id: 1,
      number: '第一章',
      title: '软件工程概述',
      expanded: true,
      sections: [
        { id: 1, number: '1.1', title: '软件工程的基本概念', duration: '45分钟', completed: true },
        { id: 2, number: '1.2', title: '软件生命周期模型', duration: '60分钟', completed: true }
      ]
    },
    {
      id: 2,
      number: '第二章',
      title: '需求分析',
      expanded: true,
      sections: [
        { id: 3, number: '2.1', title: '需求获取', duration: '50分钟', completed: true },
        { id: 4, number: '2.2', title: '需求分析', duration: '55分钟', completed: true },
        { id: 5, number: '2.3', title: '需求规格说明', duration: '65分钟', completed: false },
        { id: 6, number: '2.4', title: '需求验证', duration: '40分钟', completed: false }
      ]
    }
  ]

  chapters.value = chaptersData
  updateNavigationState()
}

const loadSectionData = () => {
  // 模拟课时数据
  const sectionData = {
    1: {
      title: '软件工程的基本概念',
      chapterTitle: '第一章 软件工程概述',
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      duration: '45分钟',
      progress: 0,
      completed: true
    },
    2: {
      title: '软件生命周期模型',
      chapterTitle: '第一章 软件工程概述',
      type: 'pdf',
      pdfUrl: 'https://example.com/sample.pdf',
      duration: '60分钟',
      progress: 0,
      completed: true
    },
    3: {
      title: '需求获取',
      chapterTitle: '第二章 需求分析',
      type: 'text',
      content: `
        <h2>软件生命周期</h2>
        <p>软件生命周期（Software Life Cycle）是软件从开始规划到最终废弃的整个过程。</p>
        <h3>主要阶段</h3>
        <ol>
          <li><strong>需求分析</strong>：确定软件系统的功能和性能需求</li>
          <li><strong>系统设计</strong>：设计软件的架构和模块</li>
          <li><strong>编码实现</strong>：根据设计文档编写代码</li>
          <li><strong>测试</strong>：验证软件是否满足需求</li>
          <li><strong>维护</strong>：修复缺陷和添加新功能</li>
        </ol>
        <p>理解软件生命周期对于软件工程实践至关重要。</p>
      `,
      duration: '50分钟',
      progress: 0,
      completed: true
    },
    4: {
      title: '需求分析',
      chapterTitle: '第二章 需求分析',
      type: 'quiz',
      quizTitle: '第二章',
      quizType: '单选题（共2题）',
      quizScore: 100,
      question: '1【单选题】为使一个软件能在不同的环境下运行，应当对软件的（）进行修改。',
      options: [
        { text: '适应性', isCorrect: false },
        { text: '可移植性', isCorrect: true },
        { text: '可靠性', isCorrect: false },
        { text: '可维护性', isCorrect: false }
      ],
      duration: '55分钟',
      progress: 0,
      completed: false
    },
    5: {
      title: '需求规格说明',
      chapterTitle: '第二章 需求分析',
      type: 'pdf',
      pdfUrl: 'https://example.com/requirements.pdf',
      duration: '65分钟',
      progress: 0,
      completed: false
    },
    6: {
      title: '需求验证',
      chapterTitle: '第二章 需求分析',
      type: 'text',
      content: '<h2>需求验证</h2><p>需求验证是确保需求文档准确、完整、一致的过程...</p>',
      duration: '40分钟',
      progress: 0,
      completed: false
    }
  }

  const section = sectionData[sectionId.value]
  if (section) {
    sectionInfo.value = { ...section, id: sectionId.value }
  }
  
  // 重置题目状态
  selectedOption.value = null
  showAnswer.value = false
  isCorrect.value = false
}

const updateNavigationState = () => {
  let currentIndex = -1
  let totalSections = 0

  for (let i = 0; i < chapters.value.length; i++) {
    const chapter = chapters.value[i]
    for (let j = 0; j < chapter.sections.length; j++) {
      totalSections++
      if (chapter.sections[j].id === sectionId.value) {
        currentIndex = totalSections - 1
      }
    }
  }

  hasPrevSection.value = currentIndex > 0
  hasNextSection.value = currentIndex < totalSections - 1
}

// 生命周期
onMounted(() => {
  loadData()
})

watch(() => route.params.sectionId, () => {
  if (route.params.sectionId) {
    loadSectionData()
    updateNavigationState()
  }
})
</script>

<style lang="scss" scoped>
.section-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

.top-header {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  position: relative;

  .back-btn {
    position: absolute;
    left: 24px;
  }

  .section-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }

  .header-spacer {
    width: 100px;
  }
}

.page-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  position: relative;
}

.status-badge {
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f0f9ff;
  border: 1px solid #67c23a;
  border-radius: 4px;
  color: #67c23a;
  font-size: 13px;
  z-index: 10;
}

.content-display {
  flex: 1;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.video-container {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  video {
    width: 100%;
    height: 100%;
    max-height: 70vh;
  }
}

.pdf-container {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
    min-height: 70vh;
  }
}

.text-content {
  padding: 40px;
  line-height: 1.8;
  font-size: 16px;
  color: #303133;
  overflow-y: auto;

  :deep(h2) {
    font-size: 24px;
    font-weight: 600;
    margin: 24px 0 16px;
    color: #303133;
  }

  :deep(h3) {
    font-size: 20px;
    font-weight: 600;
    margin: 20px 0 12px;
    color: #606266;
  }

  :deep(p) {
    margin: 12px 0;
  }

  :deep(ol), :deep(ul) {
    padding-left: 24px;
    margin: 12px 0;
  }

  :deep(li) {
    margin: 8px 0;
  }
}

.quiz-container {
  padding: 40px;
  overflow-y: auto;

  .quiz-header {
    margin-bottom: 32px;

    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    .quiz-meta {
      display: flex;
      gap: 24px;
      font-size: 14px;
      color: #606266;
    }
  }

  .quiz-content {
    .question {
      margin-bottom: 24px;

      .question-text {
        font-size: 16px;
        line-height: 1.8;
        color: #303133;
        margin-bottom: 20px;
      }

      .options {
        .option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          margin-bottom: 12px;
          border: 2px solid #e4e7ed;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #409eff;
            background: #f5f7fa;
          }

          &.selected {
            border-color: #409eff;
            background: #ecf5ff;
          }

          &.correct {
            border-color: #67c23a;
            background: #f0f9ff;
          }

          &.wrong {
            border-color: #f56c6c;
            background: #fef0f0;
          }

          .option-label {
            font-weight: 600;
            color: #606266;
            min-width: 24px;
          }

          .option-text {
            flex: 1;
            color: #303133;
          }
        }
      }
    }

    .quiz-actions {
      margin-top: 24px;

      .answer-result {
        .result-correct,
        .result-wrong {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 15px;
        }

        .result-correct {
          background: #f0f9ff;
          color: #67c23a;
        }

        .result-wrong {
          background: #fef0f0;
          color: #f56c6c;
        }
      }
    }
  }
}

.bottom-navigation {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.sidebar {
  width: 320px;
  background: white;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .sidebar-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 16px;
      border-bottom: 1px solid #e4e7ed;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
  }
}

.course-outline {
  .outline-chapter {
    margin-bottom: 20px;

    .chapter-header {
      padding: 8px 0;
      margin-bottom: 8px;
      border-bottom: 1px solid #f0f2f5;

      .chapter-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .outline-sections {
      .outline-section {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin-bottom: 4px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        font-size: 13px;

        &:hover {
          background: #f5f7fa;
        }

        &.active {
          background: #ecf5ff;
          color: #409eff;
          font-weight: 600;
        }

        &.completed {
          .section-title {
            text-decoration: line-through;
            color: #909399;
          }
        }

        .section-icon {
          font-size: 14px;
          flex-shrink: 0;
        }

        .section-number {
          color: #909399;
          font-size: 12px;
          min-width: 32px;
        }

        .section-title {
          flex: 1;
          color: #606266;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.discussion-content,
.notes-content {
  .empty-tip {
    text-align: center;
    color: #909399;
    font-size: 14px;
    padding: 40px 0;
  }
}
</style>