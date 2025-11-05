<template>
  <div class="course-detail-page">
    <div class="content-header">
      <el-button @click="goBack" :icon="ArrowLeft" text>返回课程列表</el-button>
      <h1>{{ courseInfo.title }}</h1>
      <div class="header-actions">
        <el-button type="primary" @click="continueStudy">
          {{ courseInfo.progress > 0 ? '继续学习' : '开始学习' }}
        </el-button>
      </div>
    </div>

    <div class="page-layout">
      <!-- 左侧导航 -->
      <div class="left-sidebar">
        <div class="nav-menu">
          <div
            v-for="item in navItems"
            :key="item.key"
            :class="['nav-item', { active: activeTab === item.key }]"
            @click="switchTab(item.key)"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-content">
        <!-- 课程信息卡片（仅在章节标签页显示） -->
        <div v-if="activeTab === 'chapters'" class="course-info-card">
          <div class="course-cover">
            <img :src="courseInfo.cover" :alt="courseInfo.title" />
            <div class="course-progress-overlay">
              <div class="progress-circle" :style="{ '--progress': courseInfo.progress }">
                <span class="progress-text">{{ courseInfo.progress }}%</span>
              </div>
            </div>
          </div>

          <div class="course-details">
            <h2>{{ courseInfo.title }}</h2>
            <div class="course-meta">
              <div class="meta-item">
                <el-icon><School /></el-icon>
                <span>{{ courseInfo.school }}</span>
              </div>
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ courseInfo.teacher }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Clock /></el-icon>
                <span>{{ courseInfo.duration }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ courseInfo.startDate }} ~ {{ courseInfo.endDate }}</span>
              </div>
            </div>

            <div class="course-description">
              <h3>课程介绍</h3>
              <p>{{ courseInfo.description }}</p>
            </div>

            <div class="course-stats">
              <div class="stat-item">
                <span class="stat-label">已学章节</span>
                <span class="stat-value">{{ courseInfo.completedChapters }}/{{ courseInfo.totalChapters }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">学习时长</span>
                <span class="stat-value">{{ courseInfo.studyTime }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">最后学习</span>
                <span class="stat-value">{{ courseInfo.lastStudyTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 章节内容 -->
        <div v-if="activeTab === 'chapters'" class="chapters-section">
          <h3>课程章节</h3>
          <div class="chapters-list">
            <div
              v-for="chapter in chapters"
              :key="chapter.id"
              class="chapter-card"
            >
              <div class="chapter-header" @click="toggleChapter(chapter.id)">
                <el-icon class="expand-icon" :class="{ expanded: chapter.expanded }">
                  <ArrowRight />
                </el-icon>
                <div class="chapter-info">
                  <h4>{{ chapter.number }} {{ chapter.title }}</h4>
                  <div class="chapter-progress">
                    <span>{{ chapter.completedSections }}/{{ chapter.totalSections }} 节完成</span>
                    <el-progress
                      :percentage="chapter.progress"
                      :show-text="false"
                      :stroke-width="4"
                    />
                  </div>
                </div>
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="startChapter(chapter.id)"
                  :disabled="chapter.locked"
                >
                  {{ chapter.locked ? '待解锁' : (chapter.progress > 0 ? '继续学习' : '开始学习') }}
                </el-button>
              </div>

              <div v-if="chapter.expanded" class="sections-list">
                <div
                  v-for="section in chapter.sections"
                  :key="section.id"
                  class="section-item"
                  :class="{
                    completed: section.completed,
                    current: section.isCurrent
                  }"
                  @click="goToSection(chapter.id, section.id)"
                >
                  <el-icon v-if="section.completed" color="#67c23a" class="section-status">
                    <Check />
                  </el-icon>
                  <el-icon v-else-if="section.isCurrent" color="#409eff" class="section-status">
                    <CaretRight />
                  </el-icon>
                  <el-icon v-else color="#c0c4cc" class="section-status">
                    <VideoPlay />
                  </el-icon>
                  <div class="section-info">
                    <span class="section-number">{{ section.number }}</span>
                    <span class="section-title">{{ section.title }}</span>
                    <span class="section-duration">{{ section.duration }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 作业内容 -->
        <CourseHomework v-if="activeTab === 'homework'" />

        <!-- 考试内容 -->
        <CourseExam v-if="activeTab === 'exam'" />

        <!-- AI助教内容 -->
        <CourseAI v-if="activeTab === 'ai'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CaretRight,
  VideoPlay,
  School,
  User,
  Clock,
  Calendar,
  Edit,
  Document,
  ChatDotRound,
  Files,
  Help
} from '@element-plus/icons-vue'

// 导入课程组件
import CourseHomework from '~/components/Course/CourseHomework.vue'
import CourseExam from '~/components/Course/CourseExam.vue'
import CourseAI from '~/components/Course/CourseAI.vue'

definePageMeta({
  layout: 'student',
  title: '课程详情'
})

const route = useRoute()
const router = useRouter()

// 课程信息
const courseInfo = ref({
  id: parseInt(route.params.id),
  title: '',
  school: '',
  teacher: '',
  duration: '',
  startDate: '',
  endDate: '',
  cover: '',
  description: '',
  progress: 0,
  completedChapters: 0,
  totalChapters: 0,
  studyTime: '',
  lastStudyTime: '',
  studyStreak: 0,
  totalStudyTime: '',
  estimatedTime: ''
})

// 章节数据
const chapters = ref([])

// 导航数据
const navItems = [
  { key: 'chapters', label: '章节', icon: Files },
  { key: 'homework', label: '作业', icon: Edit },
  { key: 'exam', label: '考试', icon: Help },
  { key: 'ai', label: 'AI助教', icon: ChatDotRound }
]

// 当前激活的标签页
const activeTab = ref('chapters')

// 方法
const goBack = () => {
  router.push('/student/course')
}

const switchTab = (tabKey) => {
  activeTab.value = tabKey
}

const toggleChapter = (chapterId) => {
  const chapter = chapters.value.find(c => c.id === chapterId)
  if (chapter) {
    chapter.expanded = !chapter.expanded
  }
}

const continueStudy = () => {
  // 找到当前应该学习的章节
  const currentChapter = chapters.value.find(chapter =>
    chapter.sections.some(section => section.isCurrent)
  )

  if (currentChapter) {
    const currentSection = currentChapter.sections.find(section => section.isCurrent)
    if (currentSection) {
      goToSection(currentChapter.id, currentSection.id)
    } else {
      startChapter(currentChapter.id)
    }
  } else {
    // 如果没有当前学习节点，开始第一章
    startChapter(chapters.value[0]?.id)
  }
}

const startChapter = (chapterId) => {
  const chapter = chapters.value.find(c => c.id === chapterId)
  if (chapter && chapter.sections.length > 0) {
    goToSection(chapterId, chapter.sections[0].id)
  }
}

const goToSection = (chapterId, sectionId) => {
  // 重定向到新的学生门户学习页面
  router.push(`/student/course/${route.params.id}/section/${sectionId}`)
}

const goToHomework = () => {
  switchTab('homework')
}

const goToNotes = () => {
  ElMessage.info('笔记功能开发中...')
}

const goToDiscussion = () => {
  ElMessage.info('讨论功能开发中...')
}

// 加载课程数据
const loadCourseData = async () => {
  // 模拟课程数据
  const courseData = {
    1: {
      title: '软件工程导论',
      school: '芝麻编程',
      teacher: '李教授',
      duration: '48课时',
      startDate: '2024-08-31',
      endDate: '2025-06-31',
      cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
      description: '本课程介绍软件工程的基本概念、原理和方法，包括软件开发过程、需求分析、系统设计、编码实现、测试维护等内容。通过本课程的学习，学生将掌握软件工程的基本理论和实践方法，具备软件开发的基本能力。',
      progress: 92,
      completedChapters: 46,
      totalChapters: 50,
      studyTime: '36小时',
      lastStudyTime: '2小时前',
      studyStreak: 7,
      totalStudyTime: '36小时25分钟',
      estimatedTime: '还需2小时'
    },
    2: {
      title: '编译原理',
      school: '芝麻编程',
      teacher: '王教授',
      duration: '40课时',
      startDate: '2024-09-01',
      endDate: '2025-01-15',
      cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
      description: '编译原理是计算机科学与技术专业的核心课程，主要介绍编译器的设计和实现原理。课程内容包括词法分析、语法分析、语义分析、中间代码生成、代码优化和目标代码生成等编译器各个阶段的设计和实现技术。',
      progress: 30,
      completedChapters: 12,
      totalChapters: 40,
      studyTime: '18小时',
      lastStudyTime: '1天前',
      studyStreak: 3,
      totalStudyTime: '18小时15分钟',
      estimatedTime: '还需42小时'
    }
  }

  const course = courseData[route.params.id]
  if (course) {
    courseInfo.value = { ...course, id: parseInt(route.params.id) }
    loadChaptersData()
  }
}

// 加载章节数据
const loadChaptersData = () => {
  // 模拟章节数据
  const chaptersData = [
    {
      id: 1,
      number: '第一章',
      title: '软件工程概述',
      expanded: true,
      progress: 100,
      completedSections: 2,
      totalSections: 2,
      locked: false,
      sections: [
        { id: 1, number: '1.1', title: '软件工程的基本概念', duration: '45分钟', completed: true, isCurrent: false },
        { id: 2, number: '1.2', title: '软件生命周期模型', duration: '60分钟', completed: true, isCurrent: false }
      ]
    },
    {
      id: 2,
      number: '第二章',
      title: '需求分析',
      expanded: true,
      progress: 75,
      completedSections: 3,
      totalSections: 4,
      locked: false,
      sections: [
        { id: 3, number: '2.1', title: '需求获取', duration: '50分钟', completed: true, isCurrent: false },
        { id: 4, number: '2.2', title: '需求分析', duration: '55分钟', completed: true, isCurrent: false },
        { id: 5, number: '2.3', title: '需求规格说明', duration: '65分钟', completed: true, isCurrent: true },
        { id: 6, number: '2.4', title: '需求验证', duration: '40分钟', completed: false, isCurrent: false }
      ]
    },
    {
      id: 3,
      number: '第三章',
      title: '系统设计',
      expanded: false,
      progress: 25,
      completedSections: 1,
      totalSections: 4,
      locked: false,
      sections: [
        { id: 7, number: '3.1', title: '总体设计', duration: '70分钟', completed: true, isCurrent: false },
        { id: 8, number: '3.2', title: '详细设计', duration: '65分钟', completed: false, isCurrent: false },
        { id: 9, number: '3.3', title: '数据库设计', duration: '80分钟', completed: false, isCurrent: false },
        { id: 10, number: '3.4', title: '界面设计', duration: '45分钟', completed: false, isCurrent: false }
      ]
    }
  ]

  chapters.value = chaptersData
}

// 生命周期
onMounted(() => {
  loadCourseData()
})
</script>

<style lang="scss" scoped>
.course-detail-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    flex: 1;
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.page-layout {
  display: flex;
  gap: 24px;
}

.left-sidebar {
  width: 200px;
  flex-shrink: 0;

  .nav-menu {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      color: #606266;

      &:hover {
        background: #f5f7fa;
        color: #409eff;
      }

      &.active {
        background: #ecf5ff;
        color: #409eff;
        font-weight: 600;
      }

      .el-icon {
        font-size: 18px;
      }

      span {
        font-size: 14px;
      }
    }
  }
}

.right-content {
  flex: 1;
  min-width: 0;
}

.course-info-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
}

.course-cover {
  position: relative;
  width: 320px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 240px;
  }

  .course-progress-overlay {
    position: absolute;
    top: 16px;
    right: 16px;

    .progress-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: conic-gradient(#409eff 0deg, #409eff calc(3.6deg * var(--progress)), #f0f2f5 calc(3.6deg * var(--progress)));
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 48px;
        height: 48px;
        background: white;
        border-radius: 50%;
      }

      .progress-text {
        position: relative;
        font-size: 12px;
        font-weight: 600;
        color: #409eff;
      }
    }
  }
}

.course-details {
  flex: 1;
  padding: 24px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
  }

  .course-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #606266;

      .el-icon {
        color: #909399;
      }
    }
  }

  .course-description {
    margin-bottom: 20px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    p {
      font-size: 14px;
      line-height: 1.6;
      color: #606266;
      margin: 0;
    }
  }

  .course-stats {
    display: flex;
    gap: 24px;
    padding-top: 20px;
    border-top: 1px solid #f0f2f5;

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .stat-label {
        font-size: 12px;
        color: #909399;
      }

      .stat-value {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
}

.chapters-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 20px 0;
  }

  .chapters-list {
    .chapter-card {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;

      .chapter-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        background: #fafafa;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background: #f5f7fa;
        }

        .expand-icon {
          color: #909399;
          transition: transform 0.3s;

          &.expanded {
            transform: rotate(90deg);
          }
        }

        .chapter-info {
          flex: 1;

          h4 {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 8px 0;
          }

          .chapter-progress {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            color: #606266;

            .el-progress {
              width: 120px;
            }
          }
        }
      }

      .sections-list {
        background: white;
        border-top: 1px solid #e4e7ed;

        .section-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px 12px 48px;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background: #f8f9fa;
          }

          &.completed {
            .section-title {
              color: #67c23a;
            }
          }

          &.current {
            background: #ecf5ff;
            border-left: 3px solid #409eff;
            padding-left: 45px;
          }

          .section-status {
            flex-shrink: 0;
          }

          .section-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;

            .section-number {
              font-size: 12px;
              color: #909399;
              min-width: 35px;
            }

            .section-title {
              flex: 1;
              font-size: 14px;
              color: #303133;
            }

            .section-duration {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}


// 响应式设计
@media (max-width: 1200px) {
  .course-detail-page {
    padding: 16px;
  }

  .page-layout {
    flex-direction: column;
  }

  .left-sidebar {
    width: 100%;
    margin-bottom: 24px;

    .nav-menu {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;

      .nav-item {
        flex: 1;
        min-width: 120px;
        margin-bottom: 0;
        justify-content: center;
        padding: 16px 12px;

        span {
          font-size: 13px;
        }
      }
    }
  }

  .course-info-card {
    flex-direction: column;
  }

  .course-cover {
    width: 100%;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    h1 {
      font-size: 22px;
    }

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .course-details {
    .course-meta {
      grid-template-columns: 1fr;
    }

    .course-stats {
      flex-direction: column;
      gap: 12px;
    }
  }

  .chapters-section {
    padding: 16px;
  }

  .chapter-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px !important;

    .chapter-info {
      width: 100%;
    }
  }
}
</style>