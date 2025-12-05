<template>
  <div class="questions-demo-page">
    <div class="page-header">
      <h1>答题组件演示</h1>
      <p>展示6种题型的统一答题组件功能</p>
    </div>

    <div class="demo-container">
      <!-- 答题模式 -->
      <div class="demo-section">
        <h2>答题模式</h2>

        <div class="question-wrapper">
          <QuestionViewer
            :question="currentQuestion"
            :question-number="1"
            @answer-change="handleAnswerChange"
            @language-change="handleLanguageChange"
          />
        </div>

        <div class="question-selector">
          <el-select v-model="selectedQuestionType" @change="switchQuestion" placeholder="选择题型">
            <el-option
              v-for="type in questionTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 查看结果模式 -->
      <div class="demo-section">
        <h2>查看结果模式</h2>

        <div class="result-examples">
          <div class="result-example">
            <h3>正确答案示例</h3>
            <QuestionViewer
              :question="correctExample"
              :question-number="1"
              :readonly="true"
              :show-status="true"
              :show-result="true"
            />
          </div>

          <div class="result-example">
            <h3>错误答案示例</h3>
            <QuestionViewer
              :question="wrongExample"
              :question-number="2"
              :readonly="true"
              :show-status="true"
              :show-result="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuestionViewer from '~/components/Question/QuestionViewer.vue'

// 题目类型选项
const questionTypes = [
  { value: 'single', label: '单选题' },
  { value: 'multiple', label: '多选题' },
  { value: 'judge', label: '判断题' },
  { value: 'fill', label: '填空题' },
  { value: 'essay', label: '简答题' },
  { value: 'oj', label: '编程题' }
]

const selectedQuestionType = ref('single')
const currentQuestion = ref({})

// 各种题型的示例数据
const questionData = {
  single: {
    type: 'single',
    questionText: '以下哪个是JavaScript的基本数据类型？',
    score: 5,
    options: [
      { id: 'a', value: 'A', text: 'Number' },
      { id: 'b', value: 'B', text: 'String' },
      { id: 'c', value: 'C', text: 'Boolean' },
      { id: 'd', value: 'D', text: '以上都是' }
    ],
    correctAnswer: 'D'
  },
  multiple: {
    type: 'multiple',
    questionText: '以下哪些是前端开发的技术栈？（多选）',
    score: 10,
    options: [
      { id: 'a', value: 'A', text: 'HTML' },
      { id: 'b', value: 'B', text: 'CSS' },
      { id: 'c', value: 'C', text: 'JavaScript' },
      { id: 'd', value: 'D', text: 'Python' }
    ],
    correctAnswers: ['A', 'B', 'C']
  },
  judge: {
    type: 'judge',
    questionText: 'Vue.js是一个渐进式JavaScript框架。',
    score: 5,
    correctAnswer: 'true'
  },
  fill: {
    type: 'fill',
    questionText: 'Vue的响应式系统基于______ API，组件可以通过______方法来定义。',
    score: 10,
    correctAnswers: ['Proxy', 'setup']
  },
  essay: {
    type: 'essay',
    questionText: '请简述Vue 3相比Vue 2的主要改进和优势。',
    score: 15,
    minLength: 50,
    referenceAnswer: 'Vue 3的主要改进包括：1. Composition API；2. 更好的性能；3. 更小的包体积；4. 更好的TypeScript支持等。'
  },
  oj: {
    type: 'oj',
    title: '两数之和',
    description: '给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。',
    input: '第一行包含数组长度n，第二行包含n个整数，第三行包含目标值target。',
    output: '输出两个数的索引，以空格分隔。',
    examples: '输入：\n4\n2 7 11 15\n9\n输出：\n0 1',
    timeLimit: 1000,
    memoryLimit: 128,
    score: 20
  }
}

// 结果示例数据
const correctExample = ref({
  type: 'single',
  questionText: 'HTML5中新增的语义化标签是？',
  score: 5,
  options: [
    { id: 'a', value: 'A', text: '<div>' },
    { id: 'b', value: 'B', text: '<header>' },
    { id: 'c', value: 'C', text: '<span>' },
    { id: 'd', value: 'D', text: '<table>' }
  ],
  correctAnswer: 'B',
  userAnswer: 'B',
  status: 'correct'
})

const wrongExample = ref({
  type: 'single',
  questionText: 'CSS中用于设置元素透明度的属性是？',
  score: 5,
  options: [
    { id: 'a', value: 'A', text: 'transparency' },
    { id: 'b', value: 'B', text: 'opacity' },
    { id: 'c', value: 'C', text: 'visible' },
    { id: 'd', value: 'D', text: 'display' }
  ],
  correctAnswer: 'B',
  userAnswer: 'A',
  status: 'wrong'
})

// 方法
const switchQuestion = () => {
  currentQuestion.value = questionData[selectedQuestionType.value]
}

const handleAnswerChange = (answer) => {
  console.log('答案变化:', answer)
}

const handleLanguageChange = (language) => {
  console.log('语言切换:', language)
}

// 初始化
switchQuestion()
</script>

<style lang="scss" scoped>
.questions-demo-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;

  .page-header {
    text-align: center;
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      color: #303133;
      margin-bottom: 8px;
    }

    p {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .demo-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 20px;
      color: #303133;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e4e7ed;
    }

    .question-wrapper {
      margin-bottom: 20px;
    }

    .question-selector {
      display: flex;
      justify-content: center;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;

      .el-select {
        width: 200px;
      }
    }

    .result-examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 24px;

      .result-example {
        h3 {
          font-size: 16px;
          color: #409eff;
          margin-bottom: 16px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .questions-demo-page {
    padding: 16px;

    .demo-section {
      padding: 16px;

      .result-examples {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>