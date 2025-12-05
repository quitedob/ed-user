<template>
  <div class="question-demo">
    <h2>统一答题组件演示</h2>

    <!-- 示例题目数据 -->
    <div class="demo-section">
      <h3>1. 单选题</h3>
      <QuestionViewer
        :question="singleChoiceQuestion"
        :question-number="1"
        @answer-change="handleAnswerChange"
      />
    </div>

    <div class="demo-section">
      <h3>2. 多选题</h3>
      <QuestionViewer
        :question="multipleChoiceQuestion"
        :question-number="2"
        @answer-change="handleAnswerChange"
      />
    </div>

    <div class="demo-section">
      <h3>3. 判断题</h3>
      <QuestionViewer
        :question="judgeQuestion"
        :question-number="3"
        @answer-change="handleAnswerChange"
      />
    </div>

    <div class="demo-section">
      <h3>4. 填空题</h3>
      <QuestionViewer
        :question="fillQuestion"
        :question-number="4"
        @answer-change="handleAnswerChange"
      />
    </div>

    <div class="demo-section">
      <h3>5. 简答题</h3>
      <QuestionViewer
        :question="essayQuestion"
        :question-number="5"
        :answer-change="handleAnswerChange"
        :show-hints="true"
      />
    </div>

    <div class="demo-section">
      <h3>6. 编程题 (OJ)</h3>
      <QuestionViewer
        :question="ojQuestion"
        :question-number="6"
        @answer-change="handleAnswerChange"
        @language-change="handleLanguageChange"
      />
    </div>

    <!-- 查看结果模式 -->
    <div class="demo-section">
      <h3>查看结果模式示例</h3>
      <QuestionViewer
        :question="resultQuestion"
        :question-number="7"
        :readonly="true"
        :show-status="true"
        :show-result="true"
      />
    </div>

    <!-- 答案收集 -->
    <div class="answers-summary">
      <h3>答案收集</h3>
      <el-button type="primary" @click="showAnswers">显示所有答案</el-button>
      <el-button @click="clearAnswers">清空答案</el-button>

      <div v-if="answers.length > 0" class="answers-list">
        <div
          v-for="(answer, index) in answers"
          :key="index"
          class="answer-item"
        >
          <strong>题目 {{ answer.questionNumber }}:</strong>
          <span class="answer-content">{{ formatAnswer(answer) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import QuestionViewer from './QuestionViewer.vue'

// 答案收集
const answers = ref([])

// 示例题目数据
const singleChoiceQuestion = ref({
  type: 'single',
  questionText: '软件工程的核心目标是什么？',
  score: 5,
  options: [
    { id: 'a', value: 'A', text: '提高开发速度' },
    { id: 'b', value: 'B', text: '降低开发成本' },
    { id: 'c', value: 'C', text: '提高软件质量和可维护性' },
    { id: 'd', value: 'D', text: '增加代码量' }
  ],
  correctAnswer: 'C'
})

const multipleChoiceQuestion = ref({
  type: 'multiple',
  questionText: '软件生命周期包括哪些阶段？',
  score: 10,
  options: [
    { id: 'a', value: 'A', text: '需求分析' },
    { id: 'b', value: 'B', text: '系统设计' },
    { id: 'c', value: 'C', text: '编码实现' },
    { id: 'd', value: 'D', text: '测试维护' }
  ],
  correctAnswers: ['A', 'B', 'C', 'D']
})

const judgeQuestion = ref({
  type: 'judge',
  questionText: '瀑布模型是一种迭代式的软件开发模型。',
  score: 5,
  correctAnswer: 'false'
})

const fillQuestion = ref({
  type: 'fill',
  questionText: '软件工程的三要素是方法、工具和______。软件开发的______是确保项目成功的关键因素。',
  score: 10,
  correctAnswers: ['过程', '流程'],
  hints: '填空时请填写最准确的专业术语'
})

const essayQuestion = ref({
  type: 'essay',
  questionText: '请简述敏捷开发的核心原则和价值观。',
  score: 15,
  minLength: 100,
  referenceAnswer: '敏捷开发强调个体和互动高于流程和工具，可工作的软件高于详尽的文档，客户合作高于合同谈判，响应变化高于遵循计划。其核心价值观包括沟通、简洁、反馈、勇气和尊重。'
})

const ojQuestion = ref({
  type: 'oj',
  title: '数组求和',
  description: '给定一个整数数组，计算数组中所有元素的和。这是一个基础的编程题目，考察对数组和循环的理解。',
  input: '第一行包含一个整数n（1 ≤ n ≤ 100），表示数组长度。第二行包含n个整数，表示数组元素（每个元素绝对值不超过1000）。',
  output: '输出一个整数，表示数组元素的和。',
  examples: '输入：\n5\n1 2 3 4 5\n\n输出：\n15',
  timeLimit: 1000,
  memoryLimit: 128,
  score: 20
})

const resultQuestion = ref({
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
})

// 方法
const handleAnswerChange = (answer) => {
  console.log('答案变化:', answer)
}

const handleLanguageChange = (language) => {
  console.log('语言切换:', language)
}

const showAnswers = () => {
  // 这里应该从组件中收集答案
  ElMessage.info('答案收集功能需要与实际业务逻辑集成')
}

const clearAnswers = () => {
  answers.value = []
  ElMessage.success('答案已清空')
}

const formatAnswer = (answer) => {
  if (typeof answer === 'string') {
    return answer || '(空)'
  } else if (Array.isArray(answer)) {
    return answer.length > 0 ? answer.join(', ') : '(空)'
  } else if (typeof answer === 'object' && answer !== null) {
    return JSON.stringify(answer)
  }
  return '(空)'
}
</script>

<style lang="scss" scoped>
.question-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    text-align: center;
    color: #303133;
    margin-bottom: 32px;
  }

  .demo-section {
    margin-bottom: 32px;

    h3 {
      color: #409eff;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #409eff;
    }
  }

  .answers-summary {
    margin-top: 32px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;

    h3 {
      margin-bottom: 16px;
      color: #303133;
    }

    .answers-list {
      margin-top: 16px;
      padding: 16px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e4e7ed;

      .answer-item {
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .answer-content {
          margin-left: 8px;
          color: #606266;
          font-family: 'Courier New', monospace;
        }
      }
    }
  }
}
</style>