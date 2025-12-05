<template>
  <div class="practice-page">
    <div class="page-header">
      <h2>题库练习</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索题目..."
          style="width: 300px"
          :prefix-icon="Search"
          clearable
        />
        <el-select v-model="selectedDifficulty" placeholder="难度" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="简单" value="easy" />
          <el-option label="中等" value="medium" />
          <el-option label="困难" value="hard" />
        </el-select>
        <el-select v-model="selectedCategory" placeholder="分类" style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="算法" value="algorithm" />
          <el-option label="数据结构" value="datastructure" />
          <el-option label="数学" value="math" />
          <el-option label="字符串" value="string" />
        </el-select>
      </div>
    </div>

    <div class="content-container">
      <div class="problem-list">
        <div
          v-for="problem in filteredProblems"
          :key="problem.id"
          class="problem-card"
          @click="handleProblemClick(problem.id)"
        >
          <div class="problem-header">
            <h3 class="problem-title">{{ problem.title }}</h3>
            <el-tag
              :type="getDifficultyType(problem.difficulty)"
              size="small"
            >
              {{ getDifficultyLabel(problem.difficulty) }}
            </el-tag>
          </div>
          <div class="problem-meta">
            <el-tag size="small" type="info">{{ getCategoryLabel(problem.category) }}</el-tag>
            <span class="acceptance-rate">
              通过率: {{ (problem.acceptanceRate * 100).toFixed(1) }}%
            </span>
            <span class="submissions">
              提交数: {{ problem.submissions }}
            </span>
          </div>
          <div class="problem-description">
            {{ problem.description }}
          </div>
          <div class="problem-tags">
            <el-tag
              v-for="tag in problem.tags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalProblems"
          layout="prev, pager, next, total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false,
  title: '题库练习'
})

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedDifficulty = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟题目数据
const problems = ref([
  {
    id: 1001,
    title: "两数之和",
    description: "给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。",
    difficulty: "easy",
    category: "algorithm",
    tags: ["数组", "哈希表"],
    acceptanceRate: 0.48,
    submissions: 2543200
  },
  {
    id: 1002,
    title: "二叉树的中序遍历",
    description: "给定一个二叉树的根节点 root ，返回它的中序遍历。",
    difficulty: "easy",
    category: "datastructure",
    tags: ["树", "深度优先搜索"],
    acceptanceRate: 0.71,
    submissions: 1234500
  },
  {
    id: 1003,
    title: "最长回文子串",
    description: "给你一个字符串 s，找到 s 中最长的回文子串。",
    difficulty: "medium",
    category: "string",
    tags: ["字符串", "动态规划"],
    acceptanceRate: 0.32,
    submissions: 1876500
  },
  {
    id: 1004,
    title: "合并K个升序链表",
    description: "给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。",
    difficulty: "hard",
    category: "datastructure",
    tags: ["链表", "堆", "分治"],
    acceptanceRate: 0.38,
    submissions: 987600
  },
  {
    id: 1005,
    title: "接雨水",
    description: "给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能够接多少雨水。",
    difficulty: "hard",
    category: "algorithm",
    tags: ["栈", "数组", "双指针"],
    acceptanceRate: 0.43,
    submissions: 1543200
  },
  {
    id: 1006,
    title: "有效的括号",
    description: "给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。",
    difficulty: "easy",
    category: "stack",
    tags: ["栈", "字符串"],
    acceptanceRate: 0.65,
    submissions: 2876500
  }
])

// 计算属性
const filteredProblems = computed(() => {
  let filtered = problems.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(problem =>
      problem.title.toLowerCase().includes(query) ||
      problem.description.toLowerCase().includes(query) ||
      problem.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (selectedDifficulty.value) {
    filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty.value)
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(problem => problem.category === selectedCategory.value)
  }

  return filtered
})

const totalProblems = computed(() => filteredProblems.value.length)

// 方法
const getDifficultyType = (difficulty) => {
  const types = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return types[difficulty] || 'info'
}

const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return labels[difficulty] || '未知'
}

const getCategoryLabel = (category) => {
  const labels = {
    algorithm: '算法',
    datastructure: '数据结构',
    math: '数学',
    string: '字符串',
    stack: '栈'
  }
  return labels[category] || '其他'
}

const handleProblemClick = (problemId) => {
  router.push(`/student/practice/${problemId}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  // 可以在这里加载初始数据
})
</script>

<style lang="scss" scoped>
.practice-page {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

.content-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.problem-list {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.problem-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
    transform: translateY(-2px);
  }
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;

  .problem-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    line-height: 1.4;
  }
}

.problem-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;

  .acceptance-rate,
  .submissions {
    font-size: 13px;
  }
}

.problem-description {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 14px;
}

.problem-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .tag-item {
    font-size: 12px;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;

    .header-actions {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .problem-meta {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>