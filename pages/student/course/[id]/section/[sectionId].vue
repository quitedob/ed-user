<template>
  <div class="section-page">
    <!-- 顶部导航栏 -->
    <div class="learning-header">
      <el-button @click="goBack" text class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回课程</span>
      </el-button>
      <h1 class="section-title">{{ sectionInfo.title }}</h1>
      <div class="header-spacer"></div>
    </div>

    <!-- 学习状态提示 -->
    <div v-if="sectionInfo.completed" class="status-badge">
      <el-icon><Check /></el-icon>
      <span>任务点已完成</span>
    </div>

    <!-- 主体内容区 -->
    <div class="learning-body">
      <!-- 左侧内容展示区域 -->
      <div class="content-display">
        <!-- 遍历所有内容块 -->
        <div v-for="(block, index) in sectionInfo.contentBlocks" :key="index" class="content-block">
        <!-- 视频播放器 -->
        <div v-if="block.type === 'video'" class="video-container">
            <VideoPlayer
              :videoId="block.id"
              :title="block.title"
              :description="block.description"
              :videoSrc="block.videoUrl || '/sample.mp4'"
              :thumbnail="block.cover"
              :duration="block.durationInSeconds"
              :subtitles="block.subtitles"
              :coursewareSync="block.coursewareSync"
              @play="onVideoPlay"
              @pause="onVideoPause"
              @ended="onVideoComplete"
              @progress="onVideoProgress"
              @coursewareSync="onCoursewareSync"
            />

          </div>

        <!-- PDF查看器 -->
        <div v-else-if="block.type === 'pdf'" class="pdf-container">
          <h3 class="block-title">{{ block.title }}</h3>
          <iframe :src="block.pdfUrl" frameborder="0"></iframe>
        </div>

        <!-- 富文本内容 -->
        <div v-else-if="block.type === 'text'" class="text-content">
          <h3 class="block-title">{{ block.title }}</h3>
          <div v-html="block.content"></div>
        </div>

        <!-- 题目展示 -->
        <div v-else-if="block.type === 'quiz'" class="quiz-container">
          <div class="quiz-header">
            <h3>{{ block.title }}</h3>
            <div class="quiz-meta">
              <span>题型：{{ block.quizType }}</span>
              <span>满分：{{ block.quizScore }}</span>
            </div>
          </div>
          <div class="quiz-content">
            <div class="question">
              <div class="question-text" v-html="block.question"></div>
              <div class="options">
                <div
                  v-for="(option, optIndex) in block.options"
                  :key="optIndex"
                  class="option-item"
                  :class="{ 
                    selected: block.selectedOption === optIndex, 
                    correct: block.showAnswer && option.isCorrect, 
                    wrong: block.showAnswer && block.selectedOption === optIndex && !option.isCorrect 
                  }"
                  @click="selectOption(index, optIndex)"
                >
                  <span class="option-label">{{ String.fromCharCode(65 + optIndex) }}.</span>
                  <span class="option-text">{{ option.text }}</span>
                </div>
              </div>
            </div>
            <div class="quiz-actions">
              <el-button v-if="!block.showAnswer" type="primary" @click="submitAnswer(index)">提交答案</el-button>
              <div v-else class="answer-result">
                <div v-if="block.isCorrect" class="result-correct">
                  <el-icon><Check /></el-icon>
                  <span>回答正确！得分：{{ block.quizScore }}</span>
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

      <!-- 右侧章节列表 -->
      <div class="sidebar">
        <el-tabs v-model="activeTab" class="sidebar-tabs">
          <!-- 目录标签 -->
          <el-tab-pane label="目录" name="outline">
            <div class="course-outline">
              <div
                v-for="chapter in courseInfo.chapters"
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
                      active: section.id === sectionInfo.id || parseInt(section.id.replace('section_', '')) === sectionId,
                      completed: section.completed
                    }"
                    @click="goToSection(parseInt(section.id.replace('section_', '')))"
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
  Check,
  Close,
  ArrowLeft,
  VideoPlay
} from '@element-plus/icons-vue'
import VideoPlayer from '~/components/Course/VideoPlayer.vue'

definePageMeta({
  title: '课程学习',
  layout: 'learning' // 使用学习布局，完全空白
})

const route = useRoute()
const router = useRouter()

// 添加调试日志
console.log('当前路由参数:', route.params)

// 使用更安全的方式获取路由参数
const courseId = computed(() => {
  const id = route.params.id ? parseInt(route.params.id) : 1
  console.log('解析课程ID:', id, '原始值:', route.params.id)
  return isNaN(id) ? 1 : id
})

const sectionId = computed(() => {
  const id = route.params.sectionId ? parseInt(route.params.sectionId) : 1
  console.log('解析章节ID:', id, '原始值:', route.params.sectionId)
  return isNaN(id) ? 1 : id
})

// 监听路由变化，确保参数正确更新
watch(() => route.params, (newParams) => {
  console.log('路由参数变化:', newParams)
}, { immediate: true })

// 视频播放器引用
const videoPlayer = ref(null)



// 课程信息 - 采用JSON格式规范
const courseInfo = ref({
  id: courseId.value,
  type: 'course',
  metadata: {
    version: '1.0',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'teacher_001',
    courseId: courseId.value
  },
  basicInfo: {
    title: '软件工程导论',
    description: '本课程介绍软件工程的基本概念和开发方法',
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    duration: 48,
    level: 'intermediate',
    teacher: {
      id: 'teacher_001',
      name: '李教授',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    },
    tags: ['软件工程', '编程', '计算机']
  },
  schedule: {
    startDate: '2024-08-31',
    endDate: '2025-06-30',
    publishStatus: 'published'
  },
  chapters: []
})

// 当前课时信息 - 采用JSON格式规范中的section结构
const sectionInfo = ref({
  id: '',
  number: '',
  title: '',
  description: '',
  order: 0,
  contentType: 'video',
  contentUrl: '',
  duration: 0,
  resources: {
    materials: [],
    attachments: []
  },
  practice: {
    practiceId: '',
    questions: 0,
    optional: false
  },
  progress: 0,
  completed: false,
  contentBlocks: [] // 兼容现有的内容块结构
})

// 导航状态
const hasPrevSection = ref(false)
const hasNextSection = ref(false)

// 右侧标签页
const activeTab = ref('outline')

// 方法
const goToSection = (targetSectionId) => {
  if (targetSectionId !== sectionId.value) {
    router.push(`/student/course/${courseId.value}/section/${targetSectionId}`)
  }
}

// 方法
const goBack = () => {
  router.push(`/student/course/${courseId.value}/chapters`)
}

const goToPrevSection = () => {
  // 简单的上一节逻辑
  const prevId = sectionId.value - 1
  if (prevId >= 1) {
    router.push(`/student/course/${courseId.value}/section/${prevId}`)
  }
}

const goToNextSection = () => {
  // 简单的下一节逻辑
  const nextId = sectionId.value + 1
  if (nextId <= 6) { // 假设最多6节
    router.push(`/student/course/${courseId.value}/section/${nextId}`)
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
  ElMessage.success('恭喜完成本节学习！')
}

// 题目相关方法
const selectOption = (blockIndex, optionIndex) => {
  const block = sectionInfo.value.contentBlocks[blockIndex]
  if (!block.showAnswer) {
    block.selectedOption = optionIndex
  }
}

const submitAnswer = (blockIndex) => {
  const block = sectionInfo.value.contentBlocks[blockIndex]
  
  if (block.selectedOption === null || block.selectedOption === undefined) {
    ElMessage.warning('请选择一个答案')
    return
  }
  
  block.showAnswer = true
  const selectedOpt = block.options[block.selectedOption]
  block.isCorrect = selectedOpt.isCorrect
  
  if (block.isCorrect) {
    ElMessage.success('回答正确！')
  } else {
    ElMessage.error('回答错误，请重新思考')
  }
}






// 加载数据
const loadData = async () => {
  loadChaptersData()
  loadSectionData()
  updateNavigationState()
}

const loadChaptersData = () => {
  // 采用JSON格式规范的章节数据
  const chaptersData = [
    {
      id: 'chapter_001',
      number: '1',
      title: '软件工程概述',
      description: '介绍软件工程的基本概念和发展历程',
      order: 1,
      sections: [
        {
          id: 'section_001',
          number: '1.1',
          title: '软件工程的基本概念',
          description: '什么是软件工程，软件工程的定义和特征',
          order: 1,
          contentType: 'video',
          contentUrl: '/sample.mp4',
          duration: 1800,
          resources: {
            materials: [
              {
                id: 'material_001',
                type: 'pdf',
                title: '课件讲义',
                url: '/sample.pdf'
              }
            ],
            attachments: []
          },
          practice: {
            practiceId: 'practice_001',
            questions: 5,
            optional: false
          },
          completed: true
        },
        {
          id: 'section_002',
          number: '1.2',
          title: '软件生命周期模型',
          description: '瀑布模型、敏捷开发等软件生命周期模型',
          order: 2,
          contentType: 'video',
          contentUrl: '/sample.mp4',
          duration: 2400,
          resources: {
            materials: [
              {
                id: 'material_002',
                type: 'pdf',
                title: '生命周期模型对比',
                url: '/sample.pdf'
              }
            ],
            attachments: []
          },
          practice: {
            practiceId: 'practice_002',
            questions: 3,
            optional: false
          },
          completed: false
        }
      ]
    },
    {
      id: 'chapter_002',
      number: '2',
      title: '需求分析',
      description: '需求获取、分析、规格说明和验证',
      order: 2,
      sections: [
        {
          id: 'section_003',
          number: '2.1',
          title: '需求获取',
          description: '需求获取的方法和技巧',
          order: 1,
          contentType: 'video',
          contentUrl: '/sample.mp4',
          duration: 2100,
          resources: {
            materials: [],
            attachments: []
          },
          practice: {
            practiceId: 'practice_003',
            questions: 4,
            optional: false
          },
          completed: false
        },
        {
          id: 'section_004',
          number: '2.2',
          title: '需求分析',
          description: '需求分析的方法和工具',
          order: 2,
          contentType: 'video',
          contentUrl: '/sample.mp4',
          duration: 1800,
          resources: {
            materials: [],
            attachments: []
          },
          practice: {
            practiceId: 'practice_004',
            questions: 6,
            optional: false
          },
          completed: false
        },
        {
          id: 'section_005',
          number: '2.3',
          title: '需求规格说明',
          description: '如何编写需求规格说明书',
          order: 3,
          contentType: 'video',
          contentUrl: '/sample.mp4',
          duration: 1600,
          resources: {
            materials: [],
            attachments: []
          },
          practice: {
            practiceId: 'practice_005',
            questions: 3,
            optional: false
          },
          completed: false
        },
        {
          id: 'section_006',
          number: '2.4',
          title: '需求验证',
          description: '需求验证的方法和标准',
          order: 4,
          contentType: 'video',
          contentUrl: '/sample.mp4',
          duration: 1900,
          resources: {
            materials: [],
            attachments: []
          },
          practice: {
            practiceId: 'practice_006',
            questions: 4,
            optional: false
          },
          completed: false
        }
      ]
    }
  ]

  courseInfo.value.chapters = chaptersData
}

const loadSectionData = () => {
  // 从JSON格式规范的数据中查找当前章节
  let targetSection = null
  let chapterTitle = ''

  // 遍历所有章节查找目标section
  for (const chapter of courseInfo.value.chapters) {
    const section = chapter.sections.find(s =>
      s.id === `section_${sectionId.value.toString().padStart(3, '0')}` ||
      s.id === `section_${sectionId.value}` ||
      parseInt(s.id.replace('section_', '')) === sectionId.value
    )

    if (section) {
      targetSection = section
      chapterTitle = `${chapter.number} ${chapter.title}`
      break
    }
  }

  if (targetSection) {
    // 映射JSON格式到现有的展示结构
    sectionInfo.value = {
      id: targetSection.id,
      number: targetSection.number,
      title: targetSection.title,
      description: targetSection.description,
      order: targetSection.order,
      contentType: targetSection.contentType,
      contentUrl: targetSection.contentUrl,
      duration: targetSection.duration,
      resources: targetSection.resources,
      practice: targetSection.practice,
      progress: 0,
      completed: targetSection.completed,
      chapterTitle: chapterTitle,
      contentBlocks: generateContentBlocks(targetSection)
    }
  } else {
    // 默认数据
    sectionInfo.value = {
      id: `section_${sectionId.value}`,
      number: `1.${sectionId.value}`,
      title: '章节内容',
      description: '章节描述',
      order: sectionId.value,
      contentType: 'video',
      contentUrl: '/sample.mp4',
      duration: 1800,
      resources: {
        materials: [],
        attachments: []
      },
      practice: {
        practiceId: '',
        questions: 0,
        optional: false
      },
      progress: 0,
      completed: false,
      chapterTitle: '章节',
      contentBlocks: []
    }
  }
}

// 根据JSON格式数据生成内容块
const generateContentBlocks = (section) => {
  const blocks = []

  // 视频块
  if (section.contentType === 'video' && section.contentUrl) {
    blocks.push({
      type: 'video',
      id: `video-${section.id}`,
      title: section.title,
      description: section.description,
      videoUrl: section.contentUrl, // 使用本地的sample.mp4
      cover: '/images/common_head.jpg',
      durationInSeconds: section.duration,
      subtitles: [
        {
          id: 'zh',
          label: '中文字幕',
          language: 'zh',
          data: [
            { start: 5, end: 8, text: '欢迎使用软件工程课程' },
            { start: 10, end: 15, text: '今天我们将学习软件工程的基本概念' }
          ]
        }
      ],
      coursewareSync: {
        enabled: true,
        pages: [
          { pageNumber: 1, startTime: 0, endTime: 180, title: '课程封面', content: section.title },
          { pageNumber: 2, startTime: 180, endTime: 600, title: '内容讲解', content: section.description }
        ]
      }
    })
  }

  // 材料块 - PDF课件
  if (section.resources.materials && section.resources.materials.length > 0) {
    section.resources.materials.forEach(material => {
      if (material.type === 'pdf') {
        blocks.push({
          type: 'pdf',
          title: material.title,
          pdfUrl: material.url || '/sample.pdf'
        })
      } else if (material.type === 'text') {
        blocks.push({
          type: 'text',
          title: material.title,
          content: `
            <h2>${material.title}</h2>
            <p>${section.description}</p>
            <h3>核心概念</h3>
            <ul>
              <li>软件工程基本概念</li>
              <li>开发方法和流程</li>
              <li>质量保证措施</li>
            </ul>
          `
        })
      }
    })
  }

  // 题目块
  if (section.practice && section.practice.questions > 0) {
    blocks.push({
      type: 'quiz',
      title: '知识点测试',
      quizType: '单选题',
      quizScore: 10,
      question: getQuizQuestion(section.id),
      options: getQuizOptions(section.id),
      selectedOption: null,
      showAnswer: false,
      isCorrect: false
    })
  }

  return blocks
}

// 根据章节ID生成对应的题目
const getQuizQuestion = (sectionId) => {
  const questions = {
    'section_001': '软件工程的核心目标是什么？',
    'section_002': '以下哪个不属于软件生命周期模型？',
    'section_003': '需求获取的最主要方法是？',
    'section_004': '数据流图主要用于描述？',
    'section_005': '需求规格说明书的编写原则不包括？',
    'section_006': '需求验证的主要目的是？'
  }
  return questions[sectionId] || '请根据本节内容回答相关问题。'
}

// 根据章节ID生成对应的选项
const getQuizOptions = (sectionId) => {
  const options = {
    'section_001': [
      { text: '提高开发速度', isCorrect: false },
      { text: '降低开发成本', isCorrect: false },
      { text: '提高软件质量和可维护性', isCorrect: true },
      { text: '增加代码量', isCorrect: false }
    ],
    'section_002': [
      { text: '瀑布模型', isCorrect: false },
      { text: '敏捷开发', isCorrect: false },
      { text: '螺旋模型', isCorrect: false },
      { text: '随机模型', isCorrect: true }
    ],
    'section_003': [
      { text: '查阅文档', isCorrect: false },
      { text: '访谈用户', isCorrect: true },
      { text: '代码分析', isCorrect: false },
      { text: '测试验证', isCorrect: false }
    ],
    'section_004': [
      { text: '数据结构', isCorrect: false },
      { text: '数据变换', isCorrect: true },
      { text: '算法逻辑', isCorrect: false },
      { text: '界面设计', isCorrect: false }
    ],
    'section_005': [
      { text: '完整性', isCorrect: false },
      { text: '一致性', isCorrect: false },
      { text: '可修改性', isCorrect: false },
      { text: '复杂性', isCorrect: true }
    ],
    'section_006': [
      { text: '检查文档格式', isCorrect: false },
      { text: '确认需求正确性', isCorrect: true },
      { text: '评估开发难度', isCorrect: false },
      { text: '制定开发计划', isCorrect: false }
    ]
  }
  return options[sectionId] || [
    { text: '选项A', isCorrect: false },
    { text: '选项B', isCorrect: false },
    { text: '选项C', isCorrect: true },
    { text: '选项D', isCorrect: false }
  ]
}

const updateNavigationState = () => {
  // 简单判断：假设有6节课
  hasPrevSection.value = sectionId.value > 1
  hasNextSection.value = sectionId.value < 6
}

// 生命周期
onMounted(() => {
  loadData()
})

onUnmounted(() => {

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
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.learning-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #606266;

    &:hover {
      color: #409eff;
    }
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

.status-badge {
  position: absolute;
  top: 90px;
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

.learning-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-display {
  flex: 1;
  background: #f5f7fa;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content-block {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }
}

.block-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #409eff;
}

.video-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}



.pdf-container {
  width: 100%;

  iframe {
    width: 100%;
    height: 600px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }
}

.text-content {
  line-height: 1.8;
  font-size: 16px;
  color: #303133;

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
  margin-top: auto;
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
            color: #67c23a;
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
  .learning-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e4e7ed;
    max-height: 300px;
  }

  
  }
</style>