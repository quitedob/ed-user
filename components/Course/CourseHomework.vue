<template>
  <div class="course-homework">
    <!-- 作业列表视图 -->
    <div v-if="!selectedHomework" class="homework-list-view">
      <el-tabs v-model="activeTab">
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
    </div>

    <!-- 作业详情视图 -->
    <div v-else class="homework-detail-view">
      <div class="homework-content">
        <!-- 作业头部 -->
        <div class="homework-detail-header">
          <div class="header-left">
            <h2>{{ selectedHomework.title }}</h2>
            <div class="homework-info">
              <span>总分: {{ selectedHomework.totalScore }}分</span>
              <span v-if="selectedHomework.completed">
                作答时间: {{ selectedHomework.answerTime }}
              </span>
              <span v-if="selectedHomework.completed">
                提交时间: {{ selectedHomework.submitTime }}
              </span>
            </div>
          </div>
          <div class="header-right">
            <div v-if="selectedHomework.completed" class="score-display">
              <span class="score-value">{{ selectedHomework.score }}</span>
              <span class="score-label">分</span>
            </div>
          </div>
        </div>

        <!-- 题目列表 -->
        <div class="questions-container">
          <div
            v-for="(question, index) in selectedHomework.questions"
            :key="index"
            class="question-item"
            :id="`question-${index + 1}`"
          >
            <div class="question-header">
              <h3>{{ index + 1 }}. {{ question.type }}</h3>
            </div>
            <div class="question-content">
              <div class="question-text" v-html="question.text"></div>

              <!-- 未完成：显示富文本编辑器 -->
              <div v-if="!selectedHomework.completed" class="answer-editor">
                <el-input
                  v-model="question.answer"
                  type="textarea"
                  :rows="8"
                  placeholder="请输入答案..."
                />
              </div>

              <!-- 已完成：显示答案和评分 -->
              <div v-else class="answer-display">
                <div class="answer-section">
                  <div class="section-label">
                    <el-icon><Check /></el-icon>
                    <span>正确答案</span>
                  </div>
                  <div class="answer-content correct" v-html="question.correctAnswer"></div>
                </div>
                <div v-if="question.userAnswer" class="answer-section">
                  <div class="section-label">
                    <span>你的答案</span>
                  </div>
                  <div class="answer-content" v-html="question.userAnswer"></div>
                </div>
                <div class="question-score">
                  <el-icon color="#67c23a"><Check /></el-icon>
                  <span class="score-text">{{ question.score }} 分</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div v-if="!selectedHomework.completed" class="homework-actions">
          <el-button @click="closeHomework">返回</el-button>
          <el-button type="primary" @click="submitHomework">提交作业</el-button>
        </div>
        <div v-else class="homework-actions">
          <el-button @click="closeHomework">返回</el-button>
        </div>
      </div>

      <!-- 右侧题目导航 -->
      <div class="homework-sidebar">
        <div class="sidebar-header">
          <h3>一、简答题 ({{ selectedHomework.questions.length }}分)</h3>
        </div>
        <div class="question-nav">
          <div
            v-for="(question, index) in selectedHomework.questions"
            :key="index"
            class="nav-item"
            :class="{ active: currentQuestion === index + 1 }"
            @click="scrollToQuestion(index + 1)"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check, Edit, Document } from '@element-plus/icons-vue'

const activeTab = ref('pending')
const selectedHomework = ref(null)
const currentQuestion = ref(1)

// 未完成作业数据
const pendingHomework = ref([
  {
    id: 1,
    title: '实验报告1',
    totalScore: 100,
    deadline: '2024-12-01 14:29:16',
    completed: false,
    questions: [
      {
        type: '问答题',
        text: '英语1：基于Python(Beginner)或者C语言(初级)的软件',
        answer: ''
      }
    ]
  }
])

// 已完成作业数据
const completedHomework = ref([
  {
    id: 2,
    title: '第四章习题课',
    totalScore: 100,
    score: 100,
    submitTime: '2024-10-23 15:40',
    answerTime: '2024-10-23 15:25 至 2024-10-23 15:40',
    completed: true,
    questions: [
      {
        type: '单选题',
        text: '关于面向对象编程的描述',
        correctAnswer: '<p>A. <i>A<sub>max,x=0</sub></i> = 0.5可导出，B) <i>A<sub>max,x=0</sub></i> = 0.6可导出；</p>',
        userAnswer: '<p>A. <i>A<sub>max,x=0</sub></i> = 0.5可导出，B) <i>A<sub>max,x=0</sub></i> = 0.6可导出；</p>',
        score: 12.5
      }
    ]
  }
])

const openHomework = (homework) => {
  selectedHomework.value = { ...homework }
  currentQuestion.value = 1
}

const closeHomework = () => {
  selectedHomework.value = null
}

const scrollToQuestion = (questionNum) => {
  currentQuestion.value = questionNum
  const element = document.getElementById(`question-${questionNum}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const submitHomework = () => {
  ElMessageBox.confirm('确定要提交作业吗？提交后将无法修改。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('作业提交成功！')
    closeHomework()
  }).catch(() => {
    // 取消提交
  })
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
}

// 作业详情视图
.homework-detail-view {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 20px;
}

.homework-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;

  .homework-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 24px;

    .header-left {
      flex: 1;

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
      }

      .homework-info {
        display: flex;
        gap: 20px;
        font-size: 13px;
        color: #606266;
      }
    }

    .header-right {
      .score-display {
        text-align: center;
        padding: 12px 24px;
        background: #f0f9ff;
        border-radius: 8px;

        .score-value {
          font-size: 32px;
          font-weight: 700;
          color: #409eff;
        }

        .score-label {
          font-size: 14px;
          color: #606266;
          margin-left: 4px;
        }
      }
    }
  }

  .questions-container {
    .question-item {
      margin-bottom: 32px;
      padding: 24px;
      background: #fafafa;
      border-radius: 8px;

      .question-header {
        margin-bottom: 16px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }
      }

      .question-content {
        .question-text {
          font-size: 15px;
          line-height: 1.8;
          color: #303133;
          margin-bottom: 20px;
        }

        .answer-editor {
          .el-textarea {
            :deep(textarea) {
              font-size: 14px;
              line-height: 1.6;
            }
          }
        }

        .answer-display {
          .answer-section {
            margin-bottom: 20px;

            .section-label {
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              font-weight: 600;
              color: #67c23a;

              .el-icon {
                font-size: 16px;
              }
            }

            .answer-content {
              padding: 16px;
              background: white;
              border-radius: 6px;
              border: 1px solid #e4e7ed;
              font-size: 14px;
              line-height: 1.8;
              color: #303133;

              &.correct {
                border-color: #67c23a;
                background: #f0f9ff;
              }

              :deep(i) {
                font-style: italic;
              }

              :deep(sub) {
                font-size: 0.8em;
                vertical-align: sub;
              }
            }
          }

          .question-score {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: #f0f9ff;
            border-radius: 6px;
            border: 1px solid #67c23a;

            .el-icon {
              font-size: 18px;
            }

            .score-text {
              font-size: 15px;
              font-weight: 600;
              color: #67c23a;
            }
          }
        }
      }
    }
  }

  .homework-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 24px 0;
    border-top: 1px solid #e4e7ed;
    margin-top: 24px;
  }
}

.homework-sidebar {
  width: 240px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  flex-shrink: 0;

  .sidebar-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .question-nav {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;

    .nav-item {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: #606266;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        color: #409eff;
      }

      &.active {
        background: #409eff;
        border-color: #409eff;
        color: white;
      }
    }
  }
}
</style>
