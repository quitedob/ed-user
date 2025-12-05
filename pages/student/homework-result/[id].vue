<template>
  <div class="homework-result-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <h1 class="page-title">作业结果详情</h1>
    </div>

    <!-- 作业基本信息 -->
    <div class="homework-info-card">
      <div class="homework-header">
        <div class="homework-title-section">
          <h2 class="homework-title">{{ homeworkInfo.title }}</h2>
          <div class="homework-meta">
            <el-tag :type="homeworkInfo.type === 'chapter_homework' ? 'info' : 'success'" size="large">
              {{ getTypeLabel(homeworkInfo.type) }}
            </el-tag>
            <span v-if="homeworkInfo.chapterTitle" class="chapter-info">
              {{ homeworkInfo.chapterTitle }}
            </span>
            <span v-if="homeworkInfo.sectionNumber" class="section-number">
              {{ homeworkInfo.sectionNumber }}
            </span>
          </div>
        </div>
        <div class="score-section">
          <div class="submit-time">
            提交时间：{{ homeworkInfo.submitTime }}
          </div>
          <div class="time-spent" v-if="homeworkInfo.timeSpent">
            用时：{{ homeworkInfo.timeSpent }}
          </div>
        </div>
      </div>

      <div class="homework-description">
        <p>{{ homeworkInfo.description }}</p>
      </div>
    </div>

    <!-- 作业统计信息 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon correct">
          <el-icon><Check /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ homeworkStats.correctCount }}</div>
          <div class="stat-label">正确题目</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon wrong">
          <el-icon><Close /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ homeworkStats.wrongCount }}</div>
          <div class="stat-label">错误题目</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon partial">
          <el-icon><Minus /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ homeworkStats.partialCount }}</div>
          <div class="stat-label">部分正确</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon time">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ homeworkInfo.timeSpent || '--' }}</div>
          <div class="stat-label">用时</div>
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
                  全部题目 ({{ homeworkInfo.questions.length }})
                </el-button>
                <el-button
                  :type="questionFilter === 'correct' ? 'success' : 'default'"
                  @click="questionFilter = 'correct'"
                >
                  正确 ({{ homeworkStats.correctCount }})
                </el-button>
                <el-button
                  :type="questionFilter === 'wrong' ? 'danger' : 'default'"
                  @click="questionFilter = 'wrong'"
                >
                  错误 ({{ homeworkStats.wrongCount }})
                </el-button>
                <el-button
                  :type="questionFilter === 'partial' ? 'warning' : 'default'"
                  @click="questionFilter = 'partial'"
                >
                  部分正确 ({{ homeworkStats.partialCount }})
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
            :class="getQuestionClass(question)"
          >
            <div class="question-header">
              <div class="question-number">
                题目 {{ index + 1 }}
                <el-tag
                  :type="getScoreTagType(question)"
                  size="small"
                >
                  {{ getScoreLabel(question) }}
                </el-tag>
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
              :show-score="false"
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
  ArrowLeft, Check, Close, Clock, Minus
} from '@element-plus/icons-vue'
import QuestionViewer from '~/components/Question/QuestionViewer.vue'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const homeworkId = computed(() => route.params.id)
const questionFilter = ref('all')

const homeworkInfo = ref({
  title: '',
  description: '',
  type: 'homework',
  chapterTitle: '',
  sectionNumber: '',
  score: 0,
  totalScore: 0,
  submitTime: '',
  timeSpent: '',
  questions: []
})

const homeworkStats = computed(() => {
  const correct = homeworkInfo.value.questions.filter(q => q.status === 'correct').length
  const wrong = homeworkInfo.value.questions.filter(q => q.status === 'wrong').length
  const partial = homeworkInfo.value.questions.filter(q => q.status === 'partial').length
  return {
    correctCount: correct,
    wrongCount: wrong,
    partialCount: partial
  }
})

const scorePercentage = computed(() => {
  return homeworkInfo.value.totalScore > 0
    ? Math.round((homeworkInfo.value.score / homeworkInfo.value.totalScore) * 100)
    : 0
})

const filteredQuestions = computed(() => {
  switch (questionFilter.value) {
    case 'correct':
      return homeworkInfo.value.questions.filter(q => q.status === 'correct')
    case 'wrong':
      return homeworkInfo.value.questions.filter(q => q.status === 'wrong')
    case 'partial':
      return homeworkInfo.value.questions.filter(q => q.status === 'partial')
    default:
      return homeworkInfo.value.questions
  }
})

const goBack = () => {
  router.push('/student/class/class_003/homeworks')
}

const getTypeLabel = (type) => {
  const labels = {
    homework: '普通作业',
    chapter_homework: '章节作业'
  }
  return labels[type] || '作业'
}

const getLanguageLabel = (language) => {
  const labels = {
    cpp: 'C++',
    java: 'Java',
    python: 'Python',
    javascript: 'JavaScript'
  }
  return labels[language] || language
}

const getQuestionClass = (question) => {
  switch (question.status) {
    case 'correct':
      return 'question-correct'
    case 'wrong':
      return 'question-wrong'
    case 'partial':
      return 'question-partial'
    default:
      return ''
  }
}

const getScoreTagType = (question) => {
  switch (question.status) {
    case 'correct':
      return 'success'
    case 'wrong':
      return 'danger'
    case 'partial':
      return 'warning'
    default:
      return 'info'
  }
}

const getScoreLabel = (question) => {
  switch (question.status) {
    case 'correct':
      return '正确'
    case 'wrong':
      return '错误'
    case 'partial':
      return '部分正确'
    default:
      return '未作答'
  }
}


const loadHomeworkResult = async () => {
  // 模拟作业结果数据
  const mockData = {
    // 普通作业
    1: {
      title: 'Java基础语法练习',
      description: 'Java编程语言基础语法知识点的练习和测试。',
      type: 'homework',
      score: 0,
      totalScore: 0,
      submitTime: '2024-09-15 14:30',
      timeSpent: '40分钟',
      questions: [
        {
          id: 'q1',
          type: 'single',
          questionText: 'Java中，以下哪个是基本数据类型？',
          score: 0,
          options: [
            { id: 'a', value: 'A', text: 'String' },
            { id: 'b', value: 'B', text: 'int' },
            { id: 'c', value: 'C', text: 'Array' },
            { id: 'd', value: 'D', text: 'Object' }
          ],
          correctAnswer: 'B',
          userAnswer: 'B',
          userScore: 0,
          status: 'correct'
        },
        {
          id: 'q2',
          type: 'multiple',
          questionText: '以下哪些是Java的关键字？（多选）',
          score: 0,
          options: [
            { id: 'a', value: 'A', text: 'public' },
            { id: 'b', value: 'B', text: 'static' },
            { id: 'c', value: 'C', text: 'main' },
            { id: 'd', value: 'D', text: 'class' },
            { id: 'e', value: 'E', text: 'method' }
          ],
          correctAnswers: ['A', 'B', 'D'],
          userAnswer: ['A', 'B', 'C', 'D'], // 错选C
          userScore: 0,
          status: 'partial'
        },
        {
          id: 'q3',
          type: 'fill',
          questionText: 'Java程序的入口方法是______，数组的长度属性是______。',
          score: 0,
          correctAnswers: ['public static void main(String[] args)', 'length'],
          userAnswer: ['public static void main(String[] args)', 'length'],
          userScore: 0,
          status: 'correct'
        },
        {
          id: 'q4',
          type: 'judge',
          questionText: 'Java中，一个类可以有多个main方法。',
          score: 0,
          correctAnswer: 'false',
          userAnswer: 'false',
          userScore: 0,
          status: 'correct'
        },
        {
          id: 'q5',
          type: 'essay',
          questionText: '请简述Java面向对象的三大特性及其作用。',
          score: 0,
          referenceAnswer: 'Java面向对象的三大特性是：1）封装：将数据和方法包装在类中，隐藏实现细节；2）继承：允许一个类继承另一个类的属性和方法；3）多态：允许不同类的对象对同一消息作出不同的响应。',
          userAnswer: 'Java面向对象的三大特性包括封装、继承和多态。封装可以保护数据安全，继承可以实现代码复用，多态可以提高程序的灵活性和可扩展性。',
          userScore: 0,
          status: 'correct'
        }
      ]
    },
    2: {
      title: '数据结构与算法',
      description: '基本数据结构和算法的理解与应用。',
      type: 'homework',
      score: 0,
      totalScore: 0,
      submitTime: '2024-09-20 16:45',
      timeSpent: '55分钟',
      questions: [
        {
          id: 'q1',
          type: 'oj',
          title: '二分查找',
          description: '在一个有序数组中查找指定元素，使用二分查找算法实现。',
          input: '第一行包含两个整数n和target，分别表示数组长度和目标值。第二行包含n个整数，表示有序数组。',
          output: '输出目标值在数组中的索引，如果不存在则输出-1。',
          examples: '输入：\n5 3\n1 2 3 4 5\n输出：\n2',
          timeLimit: 1000,
          memoryLimit: 128,
          score: 0,
          userAnswer: {
            code: 'int binarySearch(int[] nums, int target) {\n    int left = 0, right = nums.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) {\n            return mid;\n        }\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return -1;\n}',
            language: 'java'
          },
          userScore: 0,
          status: 'partial',
          testDetails: '通过90%测试用例，边界条件处理有误'
        },
        {
          id: 'q2',
          type: 'single',
          questionText: '以下哪个数据结构是非线性的？',
          score: 0,
          options: [
            { id: 'a', value: 'A', text: '数组' },
            { id: 'b', value: 'B', text: '链表' },
            { id: 'c', value: 'C', text: '栈' },
            { id: 'd', value: 'D', text: '树' }
          ],
          correctAnswer: 'D',
          userAnswer: 'C',
          userScore: 0,
          status: 'wrong'
        },
        {
          id: 'q3',
          type: 'fill',
          questionText: '快速排序的平均时间复杂度是______，最坏情况时间复杂度是______。',
          score: 0,
          correctAnswers: ['O(n log n)', 'O(n²)'],
          userAnswer: ['O(n log n)', 'O(n log n)'],
          userScore: 0,
          status: 'partial'
        },
        {
          id: 'q4',
          type: 'essay',
          questionText: '比较冒泡排序和快速排序的优缺点。',
          score: 0,
          referenceAnswer: '冒泡排序：优点是简单易懂，稳定排序；缺点是效率低，时间复杂度O(n²)。快速排序：优点是平均效率高，O(n log n)；缺点是不稳定，最坏情况O(n²)，需要额外空间。',
          userAnswer: '冒泡排序实现简单但效率低，适合小规模数据。快速排序效率高但实现复杂，适合大规模数据。',
          userScore: 0,
          status: 'partial'
        }
      ]
    },
    3: {
      title: 'Web前端开发基础',
      description: 'HTML、CSS、JavaScript基础知识的综合测试。',
      type: 'homework',
      score: 0,
      totalScore: 0,
      submitTime: '2024-09-25 10:20',
      timeSpent: '35分钟',
      questions: [
        {
          id: 'q1',
          type: 'multiple',
          questionText: '以下哪些是HTML5新增的语义化标签？（多选）',
          score: 0,
          options: [
            { id: 'a', value: 'A', text: '<header>' },
            { id: 'b', value: 'B', text: '<nav>' },
            { id: 'c', value: 'C', text: '<div>' },
            { id: 'd', value: 'D', text: '<section>' },
            { id: 'e', value: 'E', text: '<span>' }
          ],
          correctAnswers: ['A', 'B', 'D'],
          userAnswer: ['A', 'B', 'D'],
          userScore: 0,
          status: 'correct'
        },
        {
          id: 'q2',
          type: 'judge',
          questionText: 'CSS中，z-index属性只对定位元素（position不是static）生效。',
          score: 0,
          correctAnswer: 'true',
          userAnswer: 'true',
          userScore: 0,
          status: 'correct'
        },
        {
          id: 'q3',
          type: 'fill',
          questionText: 'JavaScript中，声明变量的关键字有var、______和______。',
          score: 0,
          correctAnswers: ['let', 'const'],
          userAnswer: ['let', 'const'],
          userScore: 0,
          status: 'correct'
        },
        {
          id: 'q4',
          type: 'single',
          questionText: '以下哪个不是JavaScript的数据类型？',
          score: 0,
          options: [
            { id: 'a', value: 'A', text: 'Number' },
            { id: 'b', value: 'B', text: 'String' },
            { id: 'c', value: 'C', text: 'Float' },
            { id: 'd', value: 'D', text: 'Boolean' }
          ],
          correctAnswer: 'C',
          userAnswer: 'C',
          userScore: 0,
          status: 'correct'
        },
        {
          id: 'q5',
          type: 'oj',
          title: '数组去重',
          description: '编写一个函数，去除数组中的重复元素。',
          input: '第一行包含一个整数n，表示数组长度。第二行包含n个整数，表示数组元素。',
          output: '输出去重后的数组，元素间用空格分隔。',
          examples: '输入：\n6\n1 2 2 3 4 4 5\n输出：\n1 2 3 4 5',
          timeLimit: 1000,
          memoryLimit: 128,
          score: 0,
          userAnswer: {
            code: 'function removeDuplicates(arr) {\n    return [...new Set(arr)];\n}',
            language: 'javascript'
          },
          userScore: 0,
          status: 'correct',
          testDetails: '所有测试用例通过'
        }
      ]
    },
    4: {
      title: '第四章习题课',
      description: '软件工程第四章基础练习，包括系统设计相关题目。',
      type: 'homework',
      score: 92,
      totalScore: 100,
      submitTime: '2024-10-23 15:40',
      timeSpent: '45分钟',
      questions: [
        {
          id: 'q1',
          type: 'oj',
          title: '数组求和',
          description: '给定一个整数数组，计算数组中所有元素的和。',
          input: '第一行包含一个整数n，表示数组长度。第二行包含n个整数，表示数组元素。',
          output: '输出一个整数，表示数组元素的和。',
          examples: '输入：\n5\n1 2 3 4 5\n输出：\n15',
          timeLimit: 1000,
          memoryLimit: 128,
          score: 25,
          userAnswer: {
            code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int sum = 0;\n    for(int i = 0; i < n; i++) {\n        int x;\n        cin >> x;\n        sum += x;\n    }\n    cout << sum << endl;\n    return 0;\n}',
            language: 'cpp'
          },
          userScore: 25,
          status: 'correct',
          testDetails: '所有测试用例通过'
        },
        {
          id: 'q2',
          type: 'single',
          questionText: '在软件设计中，高内聚低耦合是指什么？',
          score: 15,
          options: [
            { id: 'a', value: 'A', text: '模块内部功能相关性强，模块间依赖性低' },
            { id: 'b', value: 'B', text: '模块内部功能相关性低，模块间依赖性高' },
            { id: 'c', value: 'C', text: '模块大小要小，模块数量要多' },
            { id: 'd', value: 'D', text: '模块复杂度要高，模块简单度要低' }
          ],
          correctAnswer: 'A',
          userAnswer: 'A',
          userScore: 15,
          status: 'correct'
        },
        {
          id: 'q3',
          type: 'multiple',
          questionText: '以下哪些是软件开发过程中的重要活动？（多选）',
          score: 20,
          options: [
            { id: 'a', value: 'A', text: '需求分析' },
            { id: 'b', value: 'B', text: '系统设计' },
            { id: 'c', value: 'C', text: '编码实现' },
            { id: 'd', value: 'D', text: '测试验证' },
            { id: 'e', value: 'E', text: '文档编写' }
          ],
          correctAnswers: ['A', 'B', 'C', 'D', 'E'],
          userAnswer: ['A', 'B', 'C', 'D'], // 漏选E
          userScore: 16,
          status: 'partial'
        },
        {
          id: 'q4',
          type: 'judge',
          questionText: '敏捷开发方法强调文档的完整性。',
          score: 10,
          correctAnswer: 'false',
          userAnswer: 'true',
          userScore: 0,
          status: 'wrong'
        },
        {
          id: 'q5',
          type: 'fill',
          questionText: '软件质量属性包括可靠性、______、______、可维护性等。',
          score: 15,
          correctAnswers: ['可用性', '效率性'],
          userAnswer: ['可用性', '安全性'],
          userScore: 7,
          status: 'partial'
        },
        {
          id: 'q6',
          type: 'essay',
          questionText: '请结合实际项目经验，谈谈你对软件工程中"测试驱动开发(TDD)"的理解。',
          score: 25,
          referenceAnswer: '测试驱动开发(TDD)是一种软件开发方法，要求在编写功能代码之前先编写测试代码。TDD的核心是红-绿-重构循环，有助于提高代码质量、设计更好的API、减少bug数量。',
          userAnswer: 'TDD是一种先写测试再写代码的开发方法。通过红绿重构的循环，可以确保代码质量，提高测试覆盖率，促进更好的设计。在实际项目中，TDD帮助我们发现了很多潜在问题，提高了代码的可维护性。',
          userScore: 22,
          status: 'correct'
        }
      ]
    },
    5: {
      title: 'Web开发项目',
      description: '完成一个小型Web应用的开发，包含前端和后端功能。',
      type: 'homework',
      score: 85,
      totalScore: 100,
      submitTime: '2024-11-15 20:30',
      timeSpent: '60分钟',
      questions: [
        {
          id: 'q1',
          type: 'essay',
          questionText: '请描述你开发的Web应用的主要功能和技术栈。',
          score: 50,
          userAnswer: '我开发了一个任务管理系统，使用Vue.js作为前端框架，Node.js + Express作为后端，MongoDB作为数据库。主要功能包括用户注册登录、任务创建和管理、进度跟踪等。',
          userScore: 42,
          status: 'correct'
        },
        {
          id: 'q2',
          type: 'single',
          questionText: '你在项目中遇到的最大技术挑战是什么？',
          score: 20,
          options: [
            { id: 'a', value: 'A', text: '前端路由配置' },
            { id: 'b', value: 'B', text: '数据库连接' },
            { id: 'c', value: 'C', text: 'API设计' },
            { id: 'd', value: 'D', text: '状态管理' }
          ],
          correctAnswer: 'C',
          userAnswer: 'C',
          userScore: 20,
          status: 'correct'
        },
        {
          id: 'q3',
          type: 'fill',
          questionText: '项目采用了______架构模式，主要使用______进行数据持久化。',
          score: 15,
          correctAnswers: ['MVC', 'MongoDB'],
          userAnswer: ['MVC', 'MongoDB'],
          userScore: 15,
          status: 'correct'
        }
      ]
    },
    6: {
      title: '数据库设计作业',
      description: '设计一个学生管理系统的数据库结构，包含ER图和SQL脚本。',
      type: 'homework',
      score: 78,
      totalScore: 100,
      submitTime: '2024-11-20 16:15',
      timeSpent: '45分钟',
      questions: [
        {
          id: 'q1',
          type: 'essay',
          questionText: '请描述学生管理系统的主要实体及其关系。',
          score: 40,
          userAnswer: '主要实体包括学生、课程、教师、班级、成绩等。学生和课程是多对多关系，通过选课表连接。教师和班级是一对多关系。学生和班级是多对多关系。',
          userScore: 35,
          status: 'correct'
        },
        {
          id: 'q2',
          type: 'fill',
          questionText: '数据库设计了______个主要表，采用______范式设计。',
          score: 15,
          correctAnswers: ['8', '第三'],
          userAnswer: ['7', '第三'],
          userScore: 12,
          status: 'partial'
        }
      ]
    },
    // 章节作业
    7: {
      title: '第一章作业：软件工程概述',
      description: '软件工程基础概念和基本原理的理解与掌握。',
      type: 'chapter_homework',
      chapterTitle: '第一章 软件工程概述',
      sectionNumber: '1.1',
      score: 88,
      totalScore: 100,
      submitTime: '2024-11-08 09:15',
      timeSpent: '30分钟',
      questions: [
        {
          id: 'q1',
          type: 'fill',
          questionText: '软件工程的三要素是方法、工具和______。',
          score: 10,
          correctAnswers: ['过程', '流程'],
          userAnswer: ['过程'],
          userScore: 10,
          status: 'correct'
        },
        {
          id: 'q2',
          type: 'single',
          questionText: '软件工程的主要目标是什么？',
          score: 15,
          options: [
            { id: 'a', value: 'A', text: '提高开发效率' },
            { id: 'b', value: 'B', text: '保证软件质量' },
            { id: 'c', value: 'C', text: '降低成本' },
            { id: 'd', value: 'D', text: '以上都是' }
          ],
          correctAnswer: 'D',
          userAnswer: 'D',
          userScore: 15,
          status: 'correct'
        },
        {
          id: 'q3',
          type: 'essay',
          questionText: '请简述软件工程与传统软件开发的主要区别。',
          score: 25,
          referenceAnswer: '软件工程强调系统化、规范化、可度量的方法，而传统软件开发往往依赖个人经验和技巧。软件工程包括需求分析、设计、编码、测试、维护等完整流程。',
          userAnswer: '软件工程更加规范和系统化，它有完整的方法论和工具支持，能够更好地保证软件质量和项目成功率。',
          userScore: 20,
          status: 'correct'
        }
      ]
    },
    8: {
      title: '第二章作业：需求分析基础',
      description: '需求获取、分析和管理的基本方法练习。',
      type: 'chapter_homework',
      chapterTitle: '第二章 需求分析',
      sectionNumber: '2.3',
      score: 75,
      totalScore: 100,
      submitTime: '2024-11-12 14:20',
      timeSpent: '35分钟',
      questions: [
        {
          id: 'q1',
          type: 'multiple',
          questionText: '需求分析包括哪些活动？（多选）',
          score: 20,
          options: [
            { id: 'a', value: 'A', text: '需求获取' },
            { id: 'b', value: 'B', text: '需求分析' },
            { id: 'c', value: 'C', text: '需求规格说明' },
            { id: 'd', value: 'D', text: '需求验证' }
          ],
          correctAnswers: ['A', 'B', 'C', 'D'],
          userAnswer: ['A', 'B', 'C'], // 漏选D
          userScore: 15,
          status: 'partial'
        },
        {
          id: 'q2',
          type: 'judge',
          questionText: '需求规格说明书应该包含非功能性需求。',
          score: 10,
          correctAnswer: 'true',
          userAnswer: 'true',
          userScore: 10,
          status: 'correct'
        }
      ]
    }
  }

  homeworkInfo.value = mockData[homeworkId.value] || {
    title: '作业结果',
    description: '',
    type: 'homework',
    score: 0,
    totalScore: 100,
    submitTime: '',
    timeSpent: '',
    questions: []
  }
}

onMounted(() => {
  loadHomeworkResult()
})
</script>

<style lang="scss" scoped>
.homework-result-page {
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

.homework-info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .homework-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 16px;

    .homework-title-section {
      flex: 1;

      .homework-title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
      }

      .homework-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;

        .chapter-info, .section-number {
          font-size: 14px;
          color: #606266;
          padding: 4px 8px;
          background: #f0f0f0;
          border-radius: 4px;
        }
      }
    }

    .score-section {
      text-align: right;

      .submit-time {
        font-size: 16px;
        color: #606266;
        margin-bottom: 8px;
      }

      .time-spent {
        font-size: 16px;
        color: #409eff;
        font-weight: 600;
      }
    }
  }

  .homework-description {
    border-top: 1px solid #f0f0f0;
    padding-top: 16px;

    p {
      font-size: 16px;
      color: #606266;
      line-height: 1.6;
      margin: 0;
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

      &.correct {
        background: linear-gradient(135deg, #67c23a, #85ce61);
      }

      &.wrong {
        background: linear-gradient(135deg, #f56c6c, #f78989);
      }

      &.partial {
        background: linear-gradient(135deg, #e6a23c, #ebb563);
      }

      &.time {
        background: linear-gradient(135deg, #409eff, #66b1ff);
      }
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

      &.question-correct {
        border-left: 4px solid #67c23a;
      }

      &.question-wrong {
        border-left: 4px solid #f56c6c;
      }

      &.question-partial {
        border-left: 4px solid #e6a23c;
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
    }
  }
}
</style>