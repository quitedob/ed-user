<template>
  <div class="problems-page">
    <div class="page-header">
      <h1>OJ编程练习</h1>
      <p class="page-desc">在线编程题目练习平台，支持多种编程语言自动评测</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索题目..."
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="difficultyFilter" placeholder="难度" @change="loadProblems">
            <el-option label="全部难度" value="" />
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="tagFilter" placeholder="标签" @change="loadProblems">
            <el-option label="全部标签" value="" />
            <el-option label="数组" value="array" />
            <el-option label="字符串" value="string" />
            <el-option label="链表" value="linked-list" />
            <el-option label="树" value="tree" />
            <el-option label="动态规划" value="dp" />
            <el-option label="贪心算法" value="greedy" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="statusFilter" placeholder="状态" @change="loadProblems">
            <el-option label="全部" value="" />
            <el-option label="未完成" value="not-solved" />
            <el-option label="已解决" value="solved" />
            <el-option label="尝试过" value="attempted" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <div class="action-buttons">
            <el-button type="primary" @click="randomProblem">
              <el-icon><RefreshRight /></el-icon>
              随机一题
            </el-button>
            <AiAssistant />
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 题目列表 -->
    <div class="problems-list">
      <el-card
        v-for="problem in problems"
        :key="problem.id"
        class="problem-card"
        @click="goToProblem(problem)"
      >
        <div class="problem-header">
          <div class="problem-title">
            <span class="problem-id">{{ problem.id }}.</span>
            <span class="problem-name">{{ problem.title }}</span>
            <el-tag
              :type="getDifficultyType(problem.difficulty)"
              size="small"
              class="difficulty-tag"
            >
              {{ getDifficultyText(problem.difficulty) }}
            </el-tag>
          </div>
          <div class="problem-stats">
            <span class="stat-item">
              <el-icon><User /></el-icon>
              {{ problem.solveCount }}
            </span>
            <span class="stat-item">
              <el-icon><Check /></el-icon>
              {{ Math.round(problem.solveCount / problem.submitCount * 100) || 0 }}%
            </span>
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              {{ problem.likeCount }}
            </span>
          </div>
        </div>

        <div class="problem-content">
          <p class="problem-desc">{{ problem.description }}</p>
          <div class="problem-tags">
            <el-tag
              v-for="tag in problem.tags"
              :key="tag"
              size="small"
              class="tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div class="problem-footer">
          <div class="problem-status">
            <el-tag
              v-if="problem.userStatus === 'solved'"
              type="success"
              size="small"
            >
              <el-icon><Check /></el-icon>
              已解决
            </el-tag>
            <el-tag
              v-else-if="problem.userStatus === 'attempted'"
              type="warning"
              size="small"
            >
              <el-icon><Clock /></el-icon>
              尝试过
            </el-tag>
            <el-tag
              v-else
              type="info"
              size="small"
            >
              未开始
            </el-tag>
          </div>
          <div class="problem-actions">
            <el-button size="small" type="primary" @click.stop="goToProblem(problem)">
              开始练习
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import {
  Search,
  RefreshRight,
  User,
  Check,
  Star,
  Clock
} from '@element-plus/icons-vue'

definePageMeta({
  title: 'OJ编程练习'
})

// 导入AI助教组件
const AiAssistant = () => import('~/components/Common/AiAssistant.vue')

// 响应式数据
const problems = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchKeyword = ref('')
const difficultyFilter = ref('')
const tagFilter = ref('')
const statusFilter = ref('')

// 模拟题目数据
const mockProblems = [
  {
    id: 1,
    title: '两数之和',
    description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。',
    difficulty: 'easy',
    tags: ['数组', '哈希表'],
    solveCount: 1250,
    submitCount: 1800,
    likeCount: 98,
    userStatus: 'solved'
  },
  {
    id: 2,
    title: '最长公共前缀',
    description: '编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。',
    difficulty: 'easy',
    tags: ['字符串'],
    solveCount: 980,
    submitCount: 1200,
    likeCount: 76,
    userStatus: 'solved'
  },
  {
    id: 3,
    title: '有效的括号',
    description: '给定一个只包括 \'(\', \')\', \'{\', \'}\', \'[\', \']\' 的字符串 s ，判断字符串是否有效。',
    difficulty: 'easy',
    tags: ['栈', '字符串'],
    solveCount: 1450,
    submitCount: 2100,
    likeCount: 112,
    userStatus: 'attempted'
  },
  {
    id: 4,
    title: '合并两个有序链表',
    description: '将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。',
    difficulty: 'easy',
    tags: ['链表', '递归'],
    solveCount: 890,
    submitCount: 1300,
    likeCount: 65,
    userStatus: 'not-solved'
  },
  {
    id: 5,
    title: '最长回文子串',
    description: '给你一个字符串 s，找到 s 中最长的回文子串。',
    difficulty: 'medium',
    tags: ['字符串', '动态规划'],
    solveCount: 650,
    submitCount: 1200,
    likeCount: 89,
    userStatus: 'not-solved'
  },
  {
    id: 6,
    title: 'N皇后问题',
    description: 'n 皇后问题研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。',
    difficulty: 'hard',
    tags: ['回溯算法', '数组'],
    solveCount: 320,
    submitCount: 800,
    likeCount: 45,
    userStatus: 'not-solved'
  }
]

// 方法
const loadProblems = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    let filteredProblems = mockProblems

    // 搜索过滤
    if (searchKeyword.value) {
      filteredProblems = filteredProblems.filter(problem =>
        problem.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }

    // 难度过滤
    if (difficultyFilter.value) {
      filteredProblems = filteredProblems.filter(problem => problem.difficulty === difficultyFilter.value)
    }

    // 标签过滤
    if (tagFilter.value) {
      filteredProblems = filteredProblems.filter(problem =>
        problem.tags.includes(tagFilter.value === 'array' ? '数组' :
                            tagFilter.value === 'string' ? '字符串' :
                            tagFilter.value === 'linked-list' ? '链表' :
                            tagFilter.value === 'tree' ? '树' :
                            tagFilter.value === 'dp' ? '动态规划' :
                            tagFilter.value === 'greedy' ? '贪心算法' : tagFilter.value)
      )
    }

    // 状态过滤
    if (statusFilter.value) {
      filteredProblems = filteredProblems.filter(problem => problem.userStatus === statusFilter.value)
    }

    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    problems.value = filteredProblems.slice(start, end)
    total.value = filteredProblems.length

    loading.value = false
  }, 300)
}

const handleSearch = () => {
  currentPage.value = 1
  loadProblems()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadProblems()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadProblems()
}

const goToProblem = (problem) => {
  navigateTo(`/problems/${problem.id}`)
}

const randomProblem = () => {
  const randomIndex = Math.floor(Math.random() * mockProblems.length)
  const randomProblem = mockProblems[randomIndex]
  goToProblem(randomProblem)
}

const getDifficultyType = (difficulty) => {
  const typeMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return typeMap[difficulty] || 'info'
}

const getDifficultyText = (difficulty) => {
  const textMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return textMap[difficulty] || difficulty
}

// 生命周期
onMounted(() => {
  loadProblems()
})
</script>

<style lang="scss" scoped>
.problems-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  .page-header {
    text-align: center;
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    .page-desc {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .filters-section {
    margin-bottom: 24px;

    .action-buttons {
      display: flex;
      gap: 12px;
    }
  }

  .problems-list {
    display: grid;
    gap: 16px;
    margin-bottom: 24px;

    .problem-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .problem-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;

        .problem-title {
          display: flex;
          align-items: center;
          gap: 8px;

          .problem-id {
            font-weight: bold;
            color: #409EFF;
          }

          .problem-name {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
          }

          .difficulty-tag {
            margin-left: 8px;
          }
        }

        .problem-stats {
          display: flex;
          gap: 16px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            color: #909399;

            .el-icon {
              font-size: 16px;
            }
          }
        }
      }

      .problem-content {
        margin-bottom: 16px;

        .problem-desc {
          color: #606266;
          line-height: 1.6;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .problem-tags {
          .tag {
            margin-right: 8px;
            margin-bottom: 4px;
          }
        }
      }

      .problem-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .pagination {
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .problems-page {
    padding: 16px;

    .filters-section .el-col {
      margin-bottom: 12px;
    }

    .problems-list .problem-card {
      .problem-header {
        flex-direction: column;
        gap: 12px;

        .problem-stats {
          justify-content: flex-start;
        }
      }

      .problem-footer {
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }
    }
  }
}
</style>
