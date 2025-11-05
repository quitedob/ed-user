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
            <VideoPlayer
              :videoId="sectionInfo.id"
              :title="sectionInfo.title"
              :description="sectionInfo.description"
              :videoSrc="sectionInfo.videoUrl"
              :thumbnail="sectionInfo.cover"
              :duration="sectionInfo.durationInSeconds"
              :subtitles="sectionInfo.subtitles"
              :coursewareSync="sectionInfo.coursewareSync"
              @play="onVideoPlay"
              @pause="onVideoPause"
              @ended="onVideoComplete"
              @progress="onVideoProgress"
              @coursewareSync="onCoursewareSync"
            />

            <!-- 学习工具栏 -->
            <div class="learning-toolbar">
              <!-- AI助教快捷菜单 -->
              <div class="toolbar-section ai-assistant-section">
                <el-popover
                  placement="top"
                  :width="320"
                  trigger="click"
                  title="AI学习助手"
                >
                  <template #reference>
                    <el-button type="primary" size="small" :icon="ChatLineSquare">
                      AI助手
                    </el-button>
                  </template>
                  <div class="ai-shortcuts">
                    <div class="shortcuts-header">快速提问</div>
                    <div class="shortcuts-list">
                      <el-button
                        v-for="question in aiQuickQuestions"
                        :key="question.id"
                        size="small"
                        text
                        class="shortcut-btn"
                        @click="askAI(question.text)"
                      >
                        {{ question.text }}
                      </el-button>
                    </div>
                  </div>
                </el-popover>
              </div>

              <!-- 笔记工具 -->
              <div class="toolbar-section notes-section">
                <el-button
                  size="small"
                  :icon="EditPen"
                  @click="openNoteDialog"
                >
                  {{ currentTimeNote ? '编辑笔记' : '记笔记' }}
                </el-button>
              </div>

              <!-- 学习进度指示器 -->
              <div class="toolbar-section progress-section">
                <div class="progress-indicator">
                  <el-progress
                    :percentage="Math.round(sectionInfo.progress)"
                    :show-text="false"
                    :stroke-width="4"
                  />
                  <span class="progress-text">{{ Math.round(sectionInfo.progress) }}%</span>
                </div>
              </div>

              <!-- 课件切换 -->
              <div class="toolbar-section courseware-section" v-if="sectionInfo.coursewareSync">
                <el-dropdown @command="switchCoursewarePage">
                  <el-button size="small" :icon="Document">
                    课件 ({{ currentCoursewarePage || 1 }}/{{ sectionInfo.coursewareSync.pages.length }})
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="page in sectionInfo.coursewareSync.pages"
                        :key="page.pageNumber"
                        :command="page.pageNumber"
                        :class="{ active: currentCoursewarePage === page.pageNumber }"
                      >
                        第{{ page.pageNumber }}页 - {{ page.title }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>

              <!-- 学习时长统计 -->
              <div class="toolbar-section time-section">
                <div class="time-stats">
                  <el-icon><Timer /></el-icon>
                  <span>学习时长: {{ formatLearningTime(totalLearningTime) }}</span>
                </div>
              </div>
            </div>
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
  Close,
  ChatLineSquare,
  EditPen,
  Document,
  Timer
} from '@element-plus/icons-vue'
import VideoPlayer from '~/components/Course/VideoPlayer.vue'

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

// 学习工具栏相关状态
const aiQuickQuestions = ref([
  { id: 1, text: '这个概念是什么意思？' },
  { id: 2, text: '能举个例子说明吗？' },
  { id: 3, text: '这个知识点如何应用？' },
  { id: 4, text: '相关的重点是什么？' }
])

const totalLearningTime = ref(0)
const currentTimeNote = ref(null)
const currentCoursewarePage = ref(null)
const learningSessionStart = ref(null)

// 学习时长定时器
let learningTimer = null

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

// 学习工具栏相关方法
const askAI = (question) => {
  // 打开AI助教并预设问题
  ElMessage.info(`AI助手: ${question}`)
  // 这里可以调用AI助教组件的方法
}

const openNoteDialog = () => {
  if (currentTimeNote.value) {
    // 编辑现有笔记
    ElMessage.info('编辑笔记功能待实现')
  } else {
    // 创建新笔记
    ElMessage.info('创建笔记功能待实现')
  }
}

const switchCoursewarePage = (pageNumber) => {
  currentCoursewarePage.value = pageNumber
  ElMessage.info(`切换到课件第${pageNumber}页`)
  // 这里可以实现课件页面切换逻辑
}

const formatLearningTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`
  } else {
    return `${secs}秒`
  }
}

// 视频事件处理
const onVideoPlay = () => {
  if (!learningSessionStart.value) {
    learningSessionStart.value = Date.now()
    startLearningTimer()
  }
}

const onVideoPause = () => {
  stopLearningTimer()
}


const onCoursewareSync = (data) => {
  if (data.type === 'pageChange') {
    currentCoursewarePage.value = data.pageNumber
    ElMessage.info(`课件同步: 第${data.pageNumber}页 - ${data.pageData.title}`)
  }
}

// 学习时长统计
const startLearningTimer = () => {
  stopLearningTimer() // 确保没有重复的定时器
  learningTimer = setInterval(() => {
    totalLearningTime.value++
  }, 1000)
}

const stopLearningTimer = () => {
  if (learningTimer) {
    clearInterval(learningTimer)
    learningTimer = null
  }
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
      videoUrl: '/sample.mp4',
      cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      duration: '45分钟',
      durationInSeconds: 2700,
      progress: 0,
      completed: true,
      description: '介绍软件工程的基本概念、发展历程和核心原则',
      // 字幕数据
      subtitles: [
        {
          id: 'zh',
          label: '中文字幕',
          language: 'zh',
          data: [
            { start: 5, end: 8, text: '欢迎使用软件工程课程' },
            { start: 10, end: 15, text: '今天我们将学习软件工程的基本概念' },
            { start: 16, end: 22, text: '软件工程是应用系统化、严格化、可量化的方法' },
            { start: 23, end: 28, text: '来开发和维护软件的工程学科' },
            { start: 30, end: 35, text: '它涵盖了软件的整个生命周期' },
            { start: 36, end: 42, text: '从需求分析到系统维护的全过程' },
            { start: 44, end: 50, text: '理解软件工程对于现代软件开发至关重要' }
          ]
        },
        {
          id: 'en',
          label: 'English Subtitles',
          language: 'en',
          data: [
            { start: 5, end: 8, text: 'Welcome to Software Engineering course' },
            { start: 10, end: 15, text: 'Today we will learn the basic concepts of software engineering' },
            { start: 16, end: 22, text: 'Software engineering applies systematic, disciplined, quantifiable approaches' },
            { start: 23, end: 28, text: 'to the development and maintenance of software' },
            { start: 30, end: 35, text: 'It covers the entire software lifecycle' },
            { start: 36, end: 42, text: 'From requirements analysis to system maintenance' },
            { start: 44, end: 50, text: 'Understanding software engineering is crucial for modern software development' }
          ]
        }
      ],
      // 课件同步数据
      coursewareSync: {
        enabled: true,
        pages: [
          {
            pageNumber: 1,
            startTime: 0,
            endTime: 180,
            title: '课程封面',
            content: '软件工程导论 - 第一章',
            preview: '/api/courseware/1/preview'
          },
          {
            pageNumber: 2,
            startTime: 180,
            endTime: 600,
            title: '软件工程定义',
            content: '软件工程的定义和特征',
            preview: '/api/courseware/2/preview'
          },
          {
            pageNumber: 3,
            startTime: 600,
            endTime: 1200,
            title: '生命周期模型',
            content: '瀑布模型、螺旋模型、敏捷开发',
            preview: '/api/courseware/3/preview'
          },
          {
            pageNumber: 4,
            startTime: 1200,
            endTime: 1800,
            title: '核心原则',
            content: '模块化、抽象化、信息隐藏',
            preview: '/api/courseware/4/preview'
          },
          {
            pageNumber: 5,
            startTime: 1800,
            endTime: 2700,
            title: '课程总结',
            content: '关键知识点回顾和思考题',
            preview: '/api/courseware/5/preview'
          }
        ]
      }
    },
    2: {
      title: '软件生命周期模型',
      chapterTitle: '第一章 软件工程概述',
      type: 'text',
      content: `
        <h2>软件生命周期模型</h2>
        <p>软件生命周期模型是软件工程中的重要概念，它描述了软件从需求分析到维护的全过程。</p>

        <h3>主要生命周期模型</h3>
        <ol>
          <li><strong>瀑布模型</strong>：线性顺序的开发过程，每个阶段完成后才能进入下一阶段</li>
          <li><strong>螺旋模型</strong>：结合了瀑布模型和原型法的优点，强调风险分析</li>
          <li><strong>增量模型</strong>：将软件系统分解为多个增量，每个增量都是一个可运行的软件子集</li>
          <li><strong>敏捷开发</strong>：强调适应性和快速响应变化，代表方法有Scrum、XP等</li>
        </ol>

        <h3>模型选择原则</h3>
        <ul>
          <li>根据项目规模和复杂度选择合适的模型</li>
          <li>考虑团队经验和客户需求</li>
          <li>评估项目风险和不确定性</li>
          <li>考虑交付时间和质量要求</li>
        </ul>

        <p>理解和选择合适的生命周期模型是软件项目成功的关键。</p>
      `,
      duration: '60分钟',
      progress: 0,
      completed: true,
      description: '介绍软件生命周期的各种模型和选择原则'
    },
    3: {
      title: '需求获取方法',
      chapterTitle: '第二章 需求分析',
      type: 'text',
      content: `
        <h2>需求获取方法</h2>
        <p>需求获取是软件工程中至关重要的第一步，它决定了整个项目的成败。</p>

        <h3>主要获取方法</h3>
        <ol>
          <li><strong>访谈法</strong>：与用户、利益相关者进行深入交流</li>
          <li><strong>问卷调查</strong>：大规模收集用户需求和偏好</li>
          <li><strong>观察法</strong>：实地观察用户工作流程和操作习惯</li>
          <li><strong>文档分析</strong>：研究现有文档和业务流程</li>
          <li><strong>原型法</strong>：通过原型快速获取用户反馈</li>
        </ol>

        <h3>最佳实践</h3>
        <ul>
          <li>多角度、多渠道获取需求</li>
          <li>注重用户隐性需求的挖掘</li>
          <li>建立持续的需求反馈机制</li>
          <li>使用标准化的需求文档模板</li>
        </ul>

        <p>掌握有效的需求获取方法，是软件工程师的核心技能之一。</p>
      `,
      duration: '50分钟',
      progress: 0,
      completed: true,
      description: '详细介绍软件需求获取的各种方法和最佳实践'
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
      type: 'text',
      content: `
        <h2>需求规格说明</h2>
        <p>需求规格说明(SRS)是软件工程中至关重要的文档，它详细描述了软件系统的功能需求和非功能需求。</p>

        <h3>SRS的主要内容</h3>
        <ol>
          <li><strong>引言</strong>：目的、范围、定义、参考文献</li>
          <li><strong>总体描述</strong>：产品前景、用户特性、约束条件</li>
          <li><strong>具体需求</strong>：外部接口需求、功能需求、性能需求等</li>
          <li><strong>附录</strong>：分析模型、问题跟踪等</li>
        </ol>

        <h3>编写原则</h3>
        <ul>
          <li>使用清晰、简洁的语言</li>
          <li>采用标准化的格式和模板</li>
          <li>确保需求的可验证性</li>
          <li>保持文档的一致性和完整性</li>
          <li>及时更新和维护文档</li>
        </ul>

        <h3>质量保证</h3>
        <p>SRS的质量直接影响软件开发的成败，应通过同行评审、原型验证等方式确保其准确性和完整性。</p>
      `,
      duration: '65分钟',
      progress: 0,
      completed: false,
      description: '详细讲解需求规格说明的编写方法和质量保证'
    },
    6: {
      title: '需求验证技术',
      chapterTitle: '第二章 需求分析',
      type: 'video',
      videoUrl: '/sample.mp4',
      cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
      duration: '40分钟',
      durationInSeconds: 2400,
      progress: 0,
      completed: false,
      description: '深入讲解需求验证的各种技术和方法',
      // 字幕数据
      subtitles: [
        {
          id: 'zh',
          label: '中文字幕',
          language: 'zh',
          data: [
            { start: 3, end: 7, text: '需求验证是软件工程中的关键环节' },
            { start: 8, end: 15, text: '它确保我们开发的产品真正满足用户需求' },
            { start: 16, end: 24, text: '今天我们将学习多种需求验证技术' },
            { start: 25, end: 32, text: '包括需求评审、原型验证和测试用例设计' },
            { start: 33, end: 40, text: '掌握这些技术将大大提高项目成功率' }
          ]
        }
      ],
      // 课件同步数据
      coursewareSync: {
        enabled: true,
        pages: [
          {
            pageNumber: 1,
            startTime: 0,
            endTime: 200,
            title: '需求验证概述',
            content: '需求验证的定义、目的和重要性',
            preview: '/api/courseware/6/1/preview'
          },
          {
            pageNumber: 2,
            startTime: 200,
            endTime: 800,
            title: '需求评审方法',
            content: '评审的类型、流程和最佳实践',
            preview: '/api/courseware/6/2/preview'
          },
          {
            pageNumber: 3,
            startTime: 800,
            endTime: 1400,
            title: '原型验证技术',
            content: '低保真原型和高保真原型的应用',
            preview: '/api/courseware/6/3/preview'
          },
          {
            pageNumber: 4,
            startTime: 1400,
            endTime: 2400,
            title: '验证最佳实践',
            content: '需求验证的检查清单和常见陷阱',
            preview: '/api/courseware/6/4/preview'
          }
        ]
      }
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

onUnmounted(() => {
  stopLearningTimer()
})

watch(() => route.params.sectionId, () => {
  if (route.params.sectionId) {
    stopLearningTimer()
    loadSectionData()
    updateNavigationState()
    // 重置学习状态
    totalLearningTime.value = 0
    learningSessionStart.value = null
    currentCoursewarePage.value = null
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// 学习工具栏样式
.learning-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  flex-wrap: wrap;

  .toolbar-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ai-assistant-section {
    flex-shrink: 0;
  }

  .notes-section {
    flex-shrink: 0;
  }

  .progress-section {
    flex: 1;
    min-width: 200px;

    .progress-indicator {
      display: flex;
      align-items: center;
      gap: 12px;

      .progress-text {
        font-size: 14px;
        font-weight: 600;
        color: #409eff;
        min-width: 40px;
      }
    }
  }

  .courseware-section {
    flex-shrink: 0;

    :deep(.el-dropdown-menu) {
      .el-dropdown-item {
        &.active {
          background-color: #ecf5ff;
          color: #409eff;
          font-weight: 600;
        }
      }
    }
  }

  .time-section {
    flex-shrink: 0;

    .time-stats {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #606266;

      .el-icon {
        color: #409eff;
      }
    }
  }
}

// AI快捷问题样式
.ai-shortcuts {
  .shortcuts-header {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
  }

  .shortcuts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .shortcut-btn {
      text-align: left;
      white-space: normal;
      height: auto;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        background-color: #ecf5ff;
        color: #409eff;
      }
    }
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

// 响应式设计
@media (max-width: 768px) {
  .top-header {
    padding: 8px 16px;

    .section-title {
      font-size: 16px;
    }

    .back-btn {
      position: relative;
      left: auto;
    }
  }

  .page-content {
    flex-direction: column;
  }

  .main-content {
    padding: 16px;
  }

  .sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e4e7ed;
    max-height: 300px;
  }

  // 学习工具栏响应式
  .learning-toolbar {
    padding: 12px 16px;
    gap: 12px;

    .toolbar-section {
      flex-shrink: 1;
    }

    .progress-section {
      order: 5;
      flex-basis: 100%;
      min-width: auto;
    }

    .time-section {
      order: 6;
      flex-basis: 100%;
      justify-content: center;

      .time-stats {
        font-size: 12px;
      }
    }

    .ai-assistant-section,
    .notes-section,
    .courseware-section {
      flex-shrink: 0;
    }
  }

  .ai-shortcuts {
    .shortcuts-list {
      .shortcut-btn {
        font-size: 13px;
        padding: 6px 10px;
      }
    }
  }
}
</style>