<template>
  <div class="course-homework">
    <!-- 作业列表视图 -->
    <div class="homework-list-view">
      <el-tabs v-model="activeTab" class="homework-tabs">
        <!-- 作业标签页 -->
        <el-tab-pane label="作业" name="traditional">
          <el-tabs v-model="traditionalTab" class="sub-tabs">
            <el-tab-pane label="未完成" name="pending">
              <div class="homework-list">
                <div
                  v-for="homework in pendingHomework"
                  :key="homework.id"
                  class="homework-card"
                  @click="openHomework(homework)"
                >
                  <div class="homework-header">
                    <h3>{{ homework.title }}</h3>
                    <el-tag type="warning">未完成</el-tag>
                  </div>
                  <div class="homework-meta">
                    <span>总分: {{ homework.totalScore }}分</span>
                    <span>截止时间: {{ homework.deadline }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="completed">
              <div class="homework-list">
                <div
                  v-for="homework in completedHomework"
                  :key="homework.id"
                  class="homework-card completed"
                  @click="openHomework(homework)"
                >
                  <div class="homework-header">
                    <h3>{{ homework.title }}</h3>
                    <el-tag type="success">已完成</el-tag>
                  </div>
                  <div class="homework-meta">
                    <span>得分: {{ homework.score }}/{{ homework.totalScore }}分</span>
                    <span>提交时间: {{ homework.submitTime }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 章节作业标签页 -->
        <el-tab-pane label="章节作业" name="chapter-homeworks">
          <el-tabs v-model="chapterHomeworkTab" class="sub-tabs">
            <el-tab-pane label="未完成" name="pending">
              <div class="chapter-homework-list">
                <div
                  v-for="homework in pendingChapterHomeworks"
                  :key="homework.id"
                  class="chapter-homework-card"
                  @click="openChapterHomework(homework)"
                >
                  <div class="homework-header">
                    <h3>{{ homework.title }}</h3>
                    <div class="homework-badges">
                      <el-tag type="info" size="small">{{ homework.chapterTitle }}</el-tag>
                      <el-tag type="warning" size="small">未完成</el-tag>
                      <el-tag type="primary" size="small">{{ homework.sectionNumber }}</el-tag>
                    </div>
                  </div>
                  <div class="homework-meta">
                    <span>题目数量: {{ homework.questionCount }}题</span>
                    <span>总分: {{ homework.totalScore }}分</span>
                    <span>类型: 章节作业</span>
                  </div>
                  <div class="homework-progress">
                    <span>完成进度: {{ homework.completedCount }}/{{ homework.questionCount }}</span>
                    <el-progress
                      :percentage="homework.progress"
                      :show-text="false"
                      :stroke-width="4"
                      class="mini-progress"
                    />
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="completed">
              <div class="chapter-homework-list">
                <div
                  v-for="homework in completedChapterHomeworks"
                  :key="homework.id"
                  class="chapter-homework-card completed"
                  @click="openChapterHomework(homework)"
                >
                  <div class="homework-header">
                    <h3>{{ homework.title }}</h3>
                    <div class="homework-badges">
                      <el-tag type="info" size="small">{{ homework.chapterTitle }}</el-tag>
                      <el-tag type="success" size="small">已完成</el-tag>
                      <el-tag type="primary" size="small">{{ homework.sectionNumber }}</el-tag>
                    </div>
                  </div>
                  <div class="homework-meta">
                    <span>得分: {{ homework.score }}/{{ homework.totalScore }}分</span>
                    <span>提交时间: {{ homework.submitTime }}</span>
                    <span>类型: 章节作业</span>
                  </div>
                  <div class="homework-score-display">
                    <span class="score-percentage">{{ homework.percentage }}%</span>
                    <el-rate
                      v-model="homework.stars"
                      disabled
                      show-score
                      text-color="#ff9900"
                      :max="5"
                    />
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

console.log('🔵 CourseHomework 组件已初始化 - 当前路径:', route.path)

const courseId = computed(() => {
  const id = route.params.id && !isNaN(parseInt(route.params.id)) ? parseInt(route.params.id) : 1
  console.log('CourseHomework - courseId:', id, 'route.params:', route.params)
  return id
})

const activeTab = ref('traditional')
const traditionalTab = ref('pending')
const exerciseTab = ref('pending')
const chapterHomeworkTab = ref('pending')

// 未完成作业数据
const pendingHomework = ref([
  {
    id: 1,
    title: '第一章综合练习',
    totalScore: 100,
    deadline: '2024-12-01 14:29:16',
    completed: false
  }
])

// 已完成作业数据
const completedHomework = ref([
  {
    id: 2,
    title: '第四章习题课',
    totalScore: 100,
    score: 85,
    submitTime: '2024-10-23 15:40',
    completed: true
  }
])

// 章节作业数据 - 未完成
const pendingChapterHomeworks = ref([
  {
    id: 'section_002',
    title: '第一章作业：软件工程概述',
    chapterTitle: '第一章 软件工程概述',
    sectionId: 'section_002',
    sectionNumber: '1.2',
    type: 'chapter_homework',
    questionCount: 2,
    totalScore: 30,
    completedCount: 0,
    progress: 0,
    submitted: false
  },
  {
    id: 'section_006',
    title: '第二章作业：需求分析',
    chapterTitle: '第二章 需求分析',
    sectionId: 'section_006',
    sectionNumber: '2.4',
    type: 'chapter_homework',
    questionCount: 1,
    totalScore: 40,
    completedCount: 0,
    progress: 0,
    submitted: false
  },
  {
    id: 'section_010',
    title: '第三章作业：系统设计',
    chapterTitle: '第三章 系统设计',
    sectionId: 'section_010',
    sectionNumber: '3.4',
    type: 'chapter_homework',
    questionCount: 3,
    totalScore: 50,
    completedCount: 0,
    progress: 0,
    submitted: false
  }
])

// 章节作业数据 - 已完成
const completedChapterHomeworks = ref([
  {
    id: 'section_001',
    title: '第一章作业：软件工程概述',
    chapterTitle: '第一章 软件工程概述',
    sectionId: 'section_001',
    sectionNumber: '1.1',
    type: 'chapter_homework',
    questionCount: 2,
    totalScore: 30,
    score: 25,
    percentage: 83,
    stars: 4,
    submitTime: '2024-11-08 09:15',
    submitted: true
  }
])

const openHomework = (homework) => {
  const targetUrl = `/student/course/${courseId.value}/homework/${homework.id}`
  console.log('🚀 准备跳转到作业详情:', targetUrl, 'homework:', homework)
  console.log('🚀 当前 courseId:', courseId.value, 'homeworkId:', homework.id)
  router.push(targetUrl)
}

const openChapterHomework = (homework) => {
  // 章节作业直接跳转到对应的章节页面
  const sectionId = homework.sectionId.replace('section_', '')
  const targetUrl = `/student/course/${courseId.value}/section/${sectionId}`
  console.log('🚀 准备跳转到章节作业:', targetUrl, 'homework:', homework)
  console.log('🚀 当前 courseId:', courseId.value, 'sectionId:', sectionId)
  router.push(targetUrl)
}
</script>

<style lang="scss" scoped>
.course-homework {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 作业列表视图
.homework-list-view {
  // 主标签页样式
  .homework-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-tabs__content) {
      padding-top: 0;
    }
  }

  // 子标签页样式
  .sub-tabs {
    :deep(.el-tabs__header) {
      margin: 0 16px;
      background: #f8f9fa;
      border-radius: 6px;
      padding: 0 12px;
    }

    :deep(.el-tabs__content) {
      padding: 16px 0 0 0;
    }
  }

  .homework-list {
    padding: 16px;

    .homework-card {
      background: white;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
      }

      &.completed {
        border-color: #67c23a;
      }

      .homework-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }
      }

      .homework-meta {
        display: flex;
        gap: 24px;
        font-size: 13px;
        color: #606266;
      }
    }
  }

  // 章节作业列表样式
  .chapter-homework-list {
    padding: 16px;

    .chapter-homework-card {
      background: white;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
      }

      &.completed {
        border-color: #67c23a;
        background: #f0f9ff;
      }

      .homework-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0;
          flex: 1;
        }

        .homework-badges {
          display: flex;
          gap: 8px;
          margin-left: 12px;

          .el-tag {
            font-size: 11px;
          }
        }
      }

      .homework-meta {
        display: flex;
        gap: 24px;
        font-size: 13px;
        color: #606266;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .homework-progress {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        color: #909399;

        .mini-progress {
          flex: 1;
          max-width: 120px;
        }
      }

      .homework-score-display {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;

        .score-percentage {
          font-size: 18px;
          font-weight: 600;
          color: #e6a23c;
        }

        .el-rate {
          :deep(.el-rate__text) {
            font-size: 14px;
            color: #ff9900;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
