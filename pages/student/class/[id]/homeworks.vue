<template>
  <div class="class-homeworks">
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
                    <span>截止时间: {{ homework.deadline }}</span>
                    <span>题目数量: {{ homework.questionCount }}题</span>
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
              <div class="completed-list">
                <CompletedItemCard
                  v-for="homework in completedHomework"
                  :key="homework.id"
                  :item="{ ...homework, type: 'homework' }"
                  @click="openHomework(homework)"
                  @view-detail="openHomework(homework)"
                />
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
              <div class="completed-list">
                <CompletedItemCard
                  v-for="homework in completedChapterHomeworks"
                  :key="homework.id"
                  :item="{ ...homework, type: 'chapter_homework' }"
                  @click="openChapterHomework(homework)"
                  @view-detail="openChapterHomework(homework)"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import CompletedItemCard from '~/components/Student/CompletedItemCard.vue'

const route = useRoute()
const router = useRouter()

const activeTab = ref('traditional')
const traditionalTab = ref('pending')
const chapterHomeworkTab = ref('pending')

// 未完成作业数据
const pendingHomework = ref([
  {
    id: 1,
    title: '第一章综合练习',
    deadline: '2024-12-01 14:29:16',
    questionCount: 10,
    completedCount: 3,
    progress: 30,
    completed: false
  },
  {
    id: 2,
    title: '函数与递归练习',
    deadline: '2024-12-05 23:59:59',
    questionCount: 8,
    completedCount: 0,
    progress: 0,
    completed: false
  },
  {
    id: 3,
    title: '数据库设计作业',
    deadline: '2024-12-10 23:59:59',
    questionCount: 12,
    completedCount: 5,
    progress: 42,
    completed: false
  }
])

// 已完成作业数据
const completedHomework = ref([
  {
    id: 4,
    title: '第四章习题课',
    submitTime: '2024-10-23 15:40',
    questionCount: 15,
    completed: true,
    score: 92,
    totalScore: 100
  },
  {
    id: 5,
    title: 'Web开发项目',
    submitTime: '2024-11-15 20:30',
    questionCount: 5,
    completed: true,
    score: 85,
    totalScore: 100
  },
  {
    id: 6,
    title: '数据库设计作业',
    submitTime: '2024-11-20 16:15',
    questionCount: 8,
    completed: true,
    score: 78,
    totalScore: 100
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
    questionCount: 5,
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
    questionCount: 8,
    completedCount: 2,
    progress: 25,
    submitted: false
  },
  {
    id: 'section_010',
    title: '第三章作业：系统设计',
    chapterTitle: '第三章 系统设计',
    sectionId: 'section_010',
    sectionNumber: '3.4',
    type: 'chapter_homework',
    questionCount: 6,
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
    questionCount: 5,
    submitTime: '2024-11-08 09:15',
    submitted: true,
    score: 88,
    totalScore: 100
  },
  {
    id: 'section_002',
    title: '第二章作业：需求分析基础',
    chapterTitle: '第二章 需求分析',
    sectionId: 'section_002',
    sectionNumber: '2.3',
    type: 'chapter_homework',
    questionCount: 8,
    submitTime: '2024-11-12 14:20',
    submitted: true,
    score: 75,
    totalScore: 100
  }
])

const openHomework = (homework) => {
  // 判断是否是已完成的作业
  const isCompleted = homework.completed || homework.submitTime

  if (isCompleted) {
    // 已完成的作业跳转到结果详情页面
    router.push(`/student/homework-result/${homework.id}`)
  } else {
    // 未完成的作业跳转到答题页面
    router.push(`/student/class-homework/${homework.id}?classId=${route.params.id}`)
  }
}

const openChapterHomework = (homework) => {
  // 判断是否是已完成的章节作业
  const isCompleted = homework.completed || homework.submitted || homework.submitTime

  const homeworkId = homework.sectionId ? homework.sectionId.replace('section_', '') : homework.id

  if (isCompleted) {
    // 已完成的作业跳转到结果详情页面
    router.push(`/student/homework-result/${homeworkId}`)
  } else {
    // 未完成的作业跳转到答题页面
    router.push(`/student/class-homework/${homeworkId}?classId=${route.params.id}`)
  }
}
</script>

<style lang="scss" scoped>
.class-homeworks {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  padding: 20px;
}

// 作业列表视图
.homework-list-view {
  height: 100%;

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
    }

    // 已完成列表
    .completed-list {
      padding: 16px;
    }
  }
}
</style>