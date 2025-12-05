<template>
  <div class="chapters-page">
    <div class="chapters-header">
      <h2>课程章节</h2>
      <el-button type="primary" @click="continueStudy">
        <el-icon><VideoPlay /></el-icon>
        继续学习
      </el-button>
    </div>
    <div class="chapters-list">
      <div v-for="chapter in chapters" :key="chapter.id" class="chapter-card">
        <div class="chapter-header" @click="toggleChapter(chapter.id)">
          <el-icon class="expand-icon" :class="{ expanded: chapter.expanded }">
            <ArrowRight />
          </el-icon>
          <div class="chapter-info">
            <h4>{{ chapter.number }} {{ chapter.title }}</h4>
            <div class="chapter-progress">
              <span>{{ chapter.completedSections }}/{{ chapter.totalSections }} 节完成</span>
              <el-progress :percentage="chapter.progress" :show-text="false" :stroke-width="4" />
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
            :class="{ completed: section.completed, current: section.isCurrent }"
            @click="goToSection(chapter.id, section.id)"
          >
            <div class="section-status-wrapper">
              <el-icon v-if="section.completed" color="#67c23a" class="section-status"><Check /></el-icon>
              <el-icon v-else-if="section.isCurrent" color="#409eff" class="section-status"><CaretRight /></el-icon>
              <el-icon v-else color="#c0c4cc" class="section-status"><VideoPlay /></el-icon>
            </div>
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
</template>

<script setup>
import { ArrowRight, Check, CaretRight, VideoPlay } from '@element-plus/icons-vue'

definePageMeta({ title: '课程章节' })

const route = useRoute()
const router = useRouter()

const chapters = ref([])

const toggleChapter = (chapterId) => {
  const chapter = chapters.value.find(c => c.id === chapterId)
  if (chapter) chapter.expanded = !chapter.expanded
}

const startChapter = (chapterId) => {
  const chapter = chapters.value.find(c => c.id === chapterId)
  if (chapter && chapter.sections.length > 0) {
    goToSection(chapterId, chapter.sections[0].id)
  }
}

const goToSection = (chapterId, sectionId) => {
  router.push(`/student/course/${route.params.id}/section/${sectionId}`)
}

const continueStudy = () => {
  const currentChapter = chapters.value.find(c => c.sections.some(s => s.isCurrent))
  if (currentChapter) {
    const currentSection = currentChapter.sections.find(s => s.isCurrent)
    if (currentSection) goToSection(currentChapter.id, currentSection.id)
  }
}

const loadChaptersData = () => {
  chapters.value = [
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
        { id: 2, number: '1.2', title: '软件工程的发展历程', duration: '40分钟', completed: true, isCurrent: false }
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
        { id: 6, number: '2.4', title: '需求验证', duration: '45分钟', completed: false, isCurrent: false }
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
        { id: 10, number: '3.4', title: '接口设计', duration: '50分钟', completed: false, isCurrent: false }
      ]
    }
  ]
}

onMounted(() => loadChaptersData())
</script>

<style lang="scss" scoped>
.chapters-page {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.chapters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;

  h2 { font-size: 20px; font-weight: 600; color: #303133; margin: 0; }
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

      &:hover { background: #f5f7fa; }

      .expand-icon {
        color: #909399;
        transition: transform 0.3s;
        &.expanded { transform: rotate(90deg); }
      }

      .chapter-info {
        flex: 1;
        h4 { font-size: 16px; font-weight: 600; color: #303133; margin: 0 0 8px 0; }
        .chapter-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #606266;
          .el-progress { width: 120px; }
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

        &:hover { background: #f8f9fa; }
        &.completed .section-title { color: #67c23a; }
        &.current {
          background: #ecf5ff;
          border-left: 3px solid #409eff;
          padding-left: 45px;
        }

        .section-status-wrapper {
          display: flex;
          align-items: center;
          .section-status { font-size: 16px; }
        }

        .section-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          .section-number { font-size: 12px; color: #909399; min-width: 35px; }
          .section-title { flex: 1; font-size: 14px; color: #303133; }
          .section-duration { font-size: 12px; color: #909399; }
        }
      }
    }
  }
}
</style>
