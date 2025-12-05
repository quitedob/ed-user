<template>
  <div class="course-exam">
    <div class="exam-header">
      <h3>课程考试</h3>
      <p>通过考试巩固所学知识，提升专业技能</p>
    </div>

    <div class="exam-content">
      <div class="exam-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="32" color="#67c23a"><Check /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ completedExams }}</div>
            <div class="stat-label">已完成考试</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="32" color="#e6a23c"><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ pendingExams }}</div>
            <div class="stat-label">待完成考试</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="32" color="#409eff"><Trophy /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ averageScore }}</div>
            <div class="stat-label">平均分数</div>
          </div>
        </div>
      </div>

      <div class="exam-tabs">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="待完成" name="pending">
            <div class="exam-list">
              <div v-for="exam in pendingExamsList" :key="exam.id" class="exam-card">
                <div class="exam-header">
                  <div class="exam-info">
                    <h4>{{ exam.title }}</h4>
                    <div class="exam-meta">
                      <span class="duration">
                        <el-icon><Clock /></el-icon>
                        考试时长: {{ exam.duration }}
                      </span>
                      <span class="questions">
                        <el-icon><Help /></el-icon>
                        题目数量: {{ exam.questionCount }}
                      </span>
                      <el-tag :type="getDeadlineType(exam.deadline)">
                        {{ getDeadlineText(exam.deadline) }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="exam-actions">
                    <el-button type="primary" @click="startExam(exam.id)">
                      开始考试
                    </el-button>
                  </div>
                </div>
                <div class="exam-description">
                  <p>{{ exam.description }}</p>
                </div>
                <div class="exam-footer">
                  <div class="exam-stats">
                    <span class="total-score">总分: {{ exam.totalScore }}分</span>
                    <span class="pass-score">及格分数: {{ exam.passScore }}分</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="已完成" name="completed">
            <div class="exam-list">
              <div v-for="exam in completedExamsList" :key="exam.id" class="exam-card completed">
                <div class="exam-header">
                  <div class="exam-info">
                    <h4>{{ exam.title }}</h4>
                    <div class="exam-meta">
                      <span class="score">
                        <el-icon><Trophy /></el-icon>
                        得分: {{ exam.score }}/{{ exam.totalScore }}
                      </span>
                      <span class="complete-time">完成时间: {{ exam.completeTime }}</span>
                      <el-tag :type="exam.passed ? 'success' : 'danger'">
                        {{ exam.passed ? '通过' : '未通过' }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="exam-actions">
                    <el-button @click="viewExamResult(exam.id)">查看详情</el-button>
                  </div>
                </div>
                <div class="exam-description">
                  <p>{{ exam.description }}</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check, Clock, Trophy, Help } from '@element-plus/icons-vue'

const activeTab = ref('pending')

// 统计数据
const completedExams = ref(2)
const pendingExams = ref(1)
const averageScore = ref(85)

// 待完成考试
const pendingExamsList = ref([
  {
    id: 1,
    title: '软件工程期中考试',
    description: '涵盖软件工程基础概念、需求分析、系统设计等章节内容。',
    duration: '90分钟',
    questionCount: 50,
    deadline: '2024-12-15',
    totalScore: 100,
    passScore: 60,
    status: 'pending' // pending, completed
  }
])

// 从localStorage加载已完成的考试
const loadCompletedExams = () => {
  const completed = localStorage.getItem('completedExams')
  if (completed) {
    const completedIds = JSON.parse(completed)
    // 将已完成的考试从待完成列表移除
    pendingExamsList.value = pendingExamsList.value.filter(exam => !completedIds.includes(exam.id))
  }
}

// 已完成考试
const completedExamsList = ref([
  {
    id: 2,
    title: '软件生命周期模型测试',
    description: '测试对软件生命周期模型的理解和应用。',
    score: 88,
    totalScore: 100,
    completeTime: '2024-11-10 10:30',
    passed: true,
    description: '测试对软件生命周期模型的理解...'
  },
  {
    id: 3,
    title: '需求分析基础考试',
    description: '考察需求获取、需求分析和需求验证的基本方法。',
    score: 75,
    totalScore: 100,
    completeTime: '2024-11-05 14:20',
    passed: true,
    description: '考察需求获取、需求分析...'
  }
])

const handleTabChange = (tab) => {
  activeTab.value = tab
}

const getDeadlineType = (deadline) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'danger'
  if (diffDays <= 3) return 'warning'
  return 'success'
}

const getDeadlineText = (deadline) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return '已过期'
  if (diffDays === 0) return '今日到期'
  if (diffDays <= 3) return `${diffDays}天后到期`
  return `${diffDays}天后到期`
}

const route = useRoute()
const router = useRouter()

const courseId = computed(() => parseInt(route.params.id) || 1)

const startExam = (examId) => {
  router.push(`/student/course/${courseId.value}/exam/${examId}`)
}

const viewExamResult = (examId) => {
  ElMessage.info(`查看考试结果 ${examId}`)
  // TODO: 跳转到考试结果页面
}

// 生命周期
onMounted(() => {
  loadCompletedExams()
})
</script>

<style lang="scss" scoped>
.course-exam {
  .exam-header {
    margin-bottom: 24px;

    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #606266;
      margin: 0;
    }
  }

  .exam-content {
    .exam-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;

      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          flex-shrink: 0;
        }

        .stat-info {
          .stat-number {
            font-size: 24px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 13px;
            color: #909399;
          }
        }
      }
    }

    .exam-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      .exam-list {
        padding: 24px;

        .exam-card {
          background: #fafafa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          border: 1px solid #e4e7ed;
          transition: all 0.2s;

          &:hover {
            border-color: #409eff;
            box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
          }

          &.completed {
            background: #f0f9ff;
            border-color: #67c23a;
          }

          .exam-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;

            .exam-info {
              flex: 1;

              h4 {
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                margin: 0 0 8px 0;
              }

              .exam-meta {
                display: flex;
                align-items: center;
                gap: 16px;
                font-size: 13px;
                color: #606266;
                flex-wrap: wrap;

                span {
                  display: flex;
                  align-items: center;
                  gap: 4px;

                  .el-icon {
                    color: #909399;
                  }
                }
              }
            }

            .exam-actions {
              flex-shrink: 0;
              margin-left: 16px;
            }
          }

          .exam-description {
            margin-bottom: 12px;

            p {
              font-size: 14px;
              color: #606266;
              line-height: 1.6;
              margin: 0;
            }
          }

          .exam-footer {
            .exam-stats {
              display: flex;
              gap: 16px;
              font-size: 13px;
              color: #909399;

              .total-score, .pass-score {
                display: flex;
                align-items: center;
                gap: 4px;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .course-exam {
    .exam-stats {
      grid-template-columns: 1fr;

      .stat-card {
        padding: 16px;
      }
    }

    .exam-list {
      padding: 16px;

      .exam-card {
        padding: 16px;

        .exam-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;

          .exam-actions {
            margin-left: 0;
            width: 100%;

            .el-button {
              width: 100%;
            }
          }
        }

        .exam-meta {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .exam-stats {
          flex-direction: column;
          gap: 8px;
        }
      }
    }
  }
}
</style>
