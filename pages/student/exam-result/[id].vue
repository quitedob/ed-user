<template>
  <div class="exam-result-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <h1 class="page-title">考试结果详情</h1>
    </div>

    <!-- 考试基本信息 -->
    <div class="exam-info-card">
      <div class="exam-header">
        <div class="exam-title-section">
          <h2 class="exam-title">{{ examInfo.title }}</h2>
          <div class="exam-meta">
            <el-tag :type="examInfo.passed ? 'success' : 'danger'" size="large">
              {{ examInfo.passed ? '通过' : '未通过' }}
            </el-tag>
            <span class="exam-time">考试时间：{{ examInfo.examTime }}</span>
          </div>
        </div>
        <div class="score-section">
          <div class="total-score">
            <span class="score-number">{{ examInfo.score }}</span>
            <span class="score-total">/ {{ examInfo.totalScore }}分</span>
          </div>
          <div class="score-percentage">{{ scorePercentage }}%</div>
        </div>
      </div>
    </div>

    <!-- 考试统计信息 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Check /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ examStats.correctCount }}</div>
          <div class="stat-label">答对题数</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Close /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ examStats.wrongCount }}</div>
          <div class="stat-label">答错题数</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ examInfo.duration }}</div>
          <div class="stat-label">考试时长</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Trophy /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ examInfo.rank || '--' }}</div>
          <div class="stat-label">班级排名</div>
        </div>
      </div>
    </div>

    <!-- 题目详情 -->
    <div class="questions-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <h3>题目详情</h3>
            <div class="filter-buttons">
              <el-button-group>
                <el-button
                  :type="questionFilter === 'all' ? 'primary' : 'default'"
                  @click="questionFilter = 'all'"
                >
                  全部题目 ({{ examInfo.questions.length }})
                </el-button>
                <el-button
                  :type="questionFilter === 'correct' ? 'success' : 'default'"
                  @click="questionFilter = 'correct'"
                >
                  正确 ({{ examStats.correctCount }})
                </el-button>
                <el-button
                  :type="questionFilter === 'wrong' ? 'danger' : 'default'"
                  @click="questionFilter = 'wrong'"
                >
                  错误 ({{ examStats.wrongCount }})
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <div class="questions-list">
          <div
            v-for="(question, index) in filteredQuestions"
            :key="question.id"
            class="question-item"
            :class="{ 'question-wrong': !question.isCorrect }"
          >
            <div class="question-header">
              <div class="question-number">
                题目 {{ index + 1 }}
                <el-tag
                  :type="question.isCorrect ? 'success' : 'danger'"
                  size="small"
                >
                  {{ question.isCorrect ? '正确' : '错误' }}
                </el-tag>
                <span class="question-score">{{ question.score }}分</span>
              </div>
            </div>

            <div class="question-content">
              <!-- 使用统一的答题组件 -->
            <QuestionViewer
              :question="question"
              :question-number="index + 1"
              :readonly="true"
              :show-status="true"
              :show-result="true"
            />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Check, Close, Clock, Trophy
} from '@element-plus/icons-vue'
import QuestionViewer from '~/components/Question/QuestionViewer.vue'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.id)
const questionFilter = ref('all')

const examInfo = ref({
  title: '',
  score: 0,
  totalScore: 0,
  passed: false,
  examTime: '',
  duration: '',
  rank: null,
  questions: []
})

const examStats = computed(() => {
  const correct = examInfo.value.questions.filter(q => q.isCorrect).length
  const wrong = examInfo.value.questions.length - correct
  return {
    correctCount: correct,
    wrongCount: wrong
  }
})

const scorePercentage = computed(() => {
  return examInfo.value.totalScore > 0
    ? Math.round((examInfo.value.score / examInfo.value.totalScore) * 100)
    : 0
})

const filteredQuestions = computed(() => {
  switch (questionFilter.value) {
    case 'correct':
      return examInfo.value.questions.filter(q => q.isCorrect)
    case 'wrong':
      return examInfo.value.questions.filter(q => !q.isCorrect)
    default:
      return examInfo.value.questions
  }
})

const goBack = () => {
  // 返回到考试列表页面
  router.push('/student/class/class_003/exams')
}


const loadExamResult = async () => {
  // 模拟考试结果数据
  const mockData = {
    2: {
      title: '软件生命周期模型测试',
      score: 88,
      totalScore: 100,
      passed: true,
      examTime: '2024-11-10 08:30 - 10:30',
      duration: '120分钟',
      rank: 5,
      questions: [
        {
          id: 'q1',
          type: 'single',
          questionText: '软件工程的核心目标是什么？',
          score: 5,
          options: [
            { id: 'a', value: 'A', text: '提高开发速度' },
            { id: 'b', value: 'B', text: '降低开发成本' },
            { id: 'c', value: 'C', text: '提高软件质量和可维护性' },
            { id: 'd', value: 'D', text: '增加代码量' }
          ],
          correctAnswer: 'C',
          userAnswer: 'C',
          status: 'correct'
        },
        {
          id: 'q2',
          type: 'multiple',
          questionText: '软件生命周期包括哪些阶段？',
          score: 10,
          options: [
            { id: 'a', value: 'A', text: '需求分析' },
            { id: 'b', value: 'B', text: '系统设计' },
            { id: 'c', value: 'C', text: '编码实现' },
            { id: 'd', value: 'D', text: '测试维护' }
          ],
          correctAnswers: ['A', 'B', 'C', 'D'],
          userAnswer: ['A', 'B', 'C'], // 少选了D
          status: 'partial',
          userScore: 7
        },
        {
          id: 'q3',
          type: 'judge',
          questionText: '瀑布模型是一种迭代式的软件开发模型。',
          score: 5,
          correctAnswer: 'false',
          userAnswer: 'false',
          status: 'correct'
        },
        {
          id: 'q4',
          type: 'fill',
          questionText: '软件工程的三要素是方法、工具和______。',
          score: 5,
          correctAnswers: ['过程', '流程'],
          userAnswer: ['过程'],
          status: 'correct'
        },
        {
          id: 'q5',
          type: 'essay',
          questionText: '请简述敏捷开发的核心原则。',
          score: 15,
          referenceAnswer: '敏捷开发强调个体和互动高于流程和工具，可工作的软件高于详尽的文档，客户合作高于合同谈判，响应变化高于遵循计划。',
          userAnswer: '敏捷开发的核心是快速响应变化，重视团队协作和客户反馈。我认为最重要的原则是可持续开发和技术卓越。',
          status: 'correct',
          userScore: 12
        },
        {
          id: 'q6',
          type: 'oj',
          title: '两数之和',
          description: '给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。',
          input: '第一行包含数组长度n，第二行包含n个整数，第三行包含目标值target。',
          output: '输出两个数的索引，以空格分隔。',
          examples: '输入：\n4\n2 7 11 15\n9\n输出：\n0 1',
          timeLimit: 1000,
          memoryLimit: 128,
          score: 20,
          userAnswer: {
            code: '#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for(int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if(map.find(complement) != map.end()) {\n            return {map[complement], i};\n        }\n        map[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    // test implementation\n    return 0;\n}',
            language: 'cpp'
          },
          status: 'correct',
          userScore: 20,
          testResults: '所有测试用例通过'
        }
      ]
    },
    3: {
      title: '需求分析基础考试',
      score: 75,
      totalScore: 100,
      passed: true,
      examTime: '2024-11-05 14:00 - 16:20',
      duration: '140分钟',
      rank: 8,
      questions: [
        {
          id: 'q1',
          type: 'single',
          questionText: '在软件设计中，高内聚低耦合是指什么？',
          score: 10,
          options: [
            { id: 'a', value: 'A', text: '模块内部功能相关性强，模块间依赖性低' },
            { id: 'b', value: 'B', text: '模块内部功能相关性低，模块间依赖性高' },
            { id: 'c', value: 'C', text: '模块大小要小，模块数量要多' },
            { id: 'd', value: 'D', text: '模块复杂度要高，模块简单度要低' }
          ],
          correctAnswer: 'A',
          userAnswer: 'A',
          status: 'correct'
        },
        {
          id: 'q2',
          type: 'fill',
          questionText: '需求分析是软件工程的重要阶段，其主要任务是获取用户______，并进行______分析。',
          score: 8,
          correctAnswers: ['需求', '可行性'],
          userAnswer: ['需求', '系统'],
          status: 'partial',
          userScore: 4
        },
        {
          id: 'q3',
          type: 'judge',
          questionText: '原型模型是一种快速开发软件需求规格说明的方法。',
          score: 5,
          correctAnswer: 'true',
          userAnswer: 'true',
          status: 'correct'
        }
      ]
    }
  }

  examInfo.value = mockData[examId.value] || {
    title: '考试结果',
    score: 0,
    totalScore: 100,
    passed: false,
    examTime: '',
    duration: '',
    rank: null,
    questions: []
  }
}

onMounted(() => {
  loadExamResult()
})
</script>

<style lang="scss" scoped>
.exam-result-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.exam-info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .exam-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;

    .exam-title-section {
      flex: 1;

      .exam-title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
      }

      .exam-meta {
        display: flex;
        align-items: center;
        gap: 16px;

        .exam-time {
          font-size: 14px;
          color: #606266;
        }
      }
    }

    .score-section {
      text-align: right;

      .total-score {
        font-size: 36px;
        font-weight: 700;
        color: #303133;
        line-height: 1;

        .score-total {
          font-size: 18px;
          color: #909399;
          font-weight: 400;
        }
      }

      .score-percentage {
        font-size: 16px;
        color: #409eff;
        font-weight: 600;
        margin-top: 4px;
      }
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      background: linear-gradient(135deg, #409eff, #66b1ff);
    }

    .stat-content {
      .stat-number {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        line-height: 1;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}

.questions-section {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .questions-list {
    .question-item {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
      background: white;

      &.question-wrong {
        border-left: 4px solid #f56c6c;
      }

      .question-header {
        margin-bottom: 16px;

        .question-number {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #303133;

          .question-score {
            margin-left: auto;
            font-size: 14px;
            color: #909399;
          }
        }
      }

      .question-content {
        .question-text {
          font-size: 16px;
          color: #303133;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .options-list {
          .option-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border: 1px solid #e4e7ed;
            border-radius: 6px;
            margin-bottom: 8px;
            background: #fafafa;

            &.option-correct {
              background: #f0f9ff;
              border-color: #67c23a;
            }

            &.option-wrong {
              background: #fef2f2;
              border-color: #f56c6c;
            }

            .option-label {
              font-weight: 600;
              margin-right: 8px;
            }

            .option-text {
              flex: 1;
            }

            .correct-icon {
              color: #67c23a;
              margin-left: 8px;
            }

            .wrong-icon {
              color: #f56c6c;
              margin-left: 8px;
            }
          }
        }

        .judge-answer, .fill-answer {
          .answer-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .answer-label {
              font-weight: 500;
              color: #606266;
              min-width: 80px;
            }

            .correct-icon {
              color: #67c23a;
            }

            .wrong-icon {
              color: #f56c6c;
            }
          }
        }

        .essay-answer {
          .user-essay, .reference-answer {
            background: #f8f9fa;
            border: 1px solid #e4e7ed;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            min-height: 80px;
            line-height: 1.6;
          }
        }
      }
    }
  }
}
</style>