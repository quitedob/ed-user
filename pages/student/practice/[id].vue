<template>
  <div class="practice-detail-page">
    <!-- 顶部导航栏 -->
    <div class="practice-header">
      <div class="header-left">
        <el-button @click="goBack" text>
          <el-icon><ArrowLeft /></el-icon>
          返回题库
        </el-button>
        <h1 class="practice-title">{{ problemData.title }}</h1>
      </div>
      <div class="header-right">
        <div class="practice-meta">
          <span>题目ID: {{ problemId }}</span>
          <span v-if="problemData.timeLimit">时间限制: {{ problemData.timeLimit }}</span>
          <span v-if="problemData.memoryLimit">内存限制: {{ problemData.memoryLimit }}MB</span>
        </div>
        <div class="difficulty-badge" :class="getDifficultyClass(problemData.difficulty)">
          {{ getDifficultyLabel(problemData.difficulty) }}
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="practice-body">
      <!-- 左侧：题目描述 -->
      <div class="practice-description-panel">
        <div class="panel-content">
          <!-- 题目描述内容 -->
          <div class="practice-description">
            <!-- 题目标题 -->
            <h2 class="practice-title">{{ problemData.title }}</h2>

            <!-- 元数据行 -->
            <div class="practice-meta-row">
              <span class="meta-badge time">
                <el-icon><Clock /></el-icon>
                时间限制：{{ problemData.timeLimit }}
              </span>
              <span class="meta-badge memory">
                <el-icon><Cpu /></el-icon>
                内存限制：{{ problemData.memoryLimit }}
              </span>
              <span class="meta-badge difficulty" :class="`level-${getDifficultyLevel(problemData.difficulty)}`">
                难度：{{ getDifficultyLabel(problemData.difficulty) }}
              </span>
              <span class="meta-badge acceptance">
                <el-icon><TrendCharts /></el-icon>
                通过率：{{ (problemData.acceptanceRate * 100).toFixed(1) }}%
              </span>
            </div>

            <!-- 标签 -->
            <div v-if="problemData.tags && problemData.tags.length > 0" class="practice-tags-row">
              <el-tag
                v-for="tag in problemData.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>

            <!-- 题目描述 -->
            <div class="practice-section">
              <h3 class="section-title">题目描述</h3>
              <div class="section-content">{{ problemData.description }}</div>
            </div>

            <!-- 输入格式 -->
            <div class="practice-section">
              <h3 class="section-title">输入格式</h3>
              <div class="section-content">{{ problemData.inputFormat }}</div>
            </div>

            <!-- 输出格式 -->
            <div class="practice-section">
              <h3 class="section-title">输出格式</h3>
              <div class="section-content">{{ problemData.outputFormat }}</div>
            </div>

            <!-- 示例 -->
            <div class="practice-section">
              <h3 class="section-title">示例</h3>
              <div class="section-content">
                <div class="example-box">
                  <div class="example-title">示例</div>
                  <div class="example-group">
                    <div class="example-item">
                      <div class="example-label">输入</div>
                      <pre class="example-code">{{ problemData.sampleInput }}</pre>
                    </div>
                    <div class="example-item">
                      <div class="example-label">输出</div>
                      <pre class="example-code">{{ problemData.sampleOutput }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 提示 -->
            <div v-if="problemData.hint" class="practice-section">
              <h3 class="section-title">提示</h3>
              <div class="section-content hint-content">{{ problemData.hint }}</div>
            </div>

            <!-- 解题思路 -->
            <div class="practice-section">
              <h3 class="section-title">解题思路</h3>
              <div class="section-content">
                <div class="solution-approach">
                  <h4>方法思路</h4>
                  <p>{{ problemData.solution.approach }}</p>
                </div>
                <div class="solution-complexity">
                  <h4>复杂度分析</h4>
                  <p>{{ problemData.solution.complexity }}</p>
                </div>
                <div class="solution-code">
                  <h4>参考代码</h4>
                  <pre class="reference-code">{{ problemData.solution.code }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：代码编辑器 -->
      <div class="code-editor-panel">
        <div class="editor-header">
          <span class="editor-title">代码编辑器</span>
          <el-select v-model="selectedLanguage" placeholder="选择语言" size="small" style="width: 150px">
            <el-option label="C++" value="cpp" />
            <el-option label="Java" value="java" />
            <el-option label="Python" value="python" />
            <el-option label="JavaScript" value="javascript" />
          </el-select>
        </div>
        <div class="editor-main">
          <el-input
            v-model="userCode"
            type="textarea"
            :rows="25"
            placeholder="请在此处编写代码..."
            class="code-textarea"
          />
        </div>
        <div class="editor-footer">
          <div class="footer-left">
            <el-button @click="resetCode">重置代码</el-button>
            <el-button @click="loadTemplate">加载模板</el-button>
          </div>
          <div class="footer-right">
            <el-button @click="runCode" :loading="isRunning">
              <el-icon><VideoCamera /></el-icon>
              运行代码
            </el-button>
            <el-button type="success" @click="submitCode" :loading="isSubmitting">
              <el-icon><Upload /></el-icon>
              提交代码
            </el-button>
          </div>
        </div>

        <!-- 运行结果 -->
        <div v-if="runResult" class="run-result-panel">
          <div class="result-header">
            <h4>运行结果</h4>
            <el-button type="text" size="small" @click="runResult = null">关闭</el-button>
          </div>
          <div class="result-content">
            <div :class="['result-status', runResult.status]">
              {{ getResultStatusText(runResult.status) }}
            </div>
            <pre class="result-output">{{ runResult.output }}</pre>
          </div>
        </div>

        <!-- 提交结果 -->
        <div v-if="submitResult" class="submit-result-panel">
          <div class="result-header">
            <h4>提交结果</h4>
            <el-button type="text" size="small" @click="submitResult = null">关闭</el-button>
          </div>
          <div class="result-content">
            <div :class="['result-status', submitResult.status]">
              {{ getResultStatusText(submitResult.status) }}
            </div>
            <div class="result-score">
              得分: {{ submitResult.score }}/{{ problemData.maxScore || 100 }}
            </div>

            <!-- 测试用例结果 -->
            <div v-if="submitResult.testCases" class="test-cases">
              <h5>测试用例</h5>
              <div class="test-case-list">
                <div
                  v-for="(testCase, idx) in submitResult.testCases"
                  :key="idx"
                  class="test-case-item"
                  :class="{ passed: testCase.passed, failed: !testCase.passed }"
                >
                  <div class="test-case-header">
                    <span class="test-case-label">测试用例 {{ idx + 1 }}</span>
                    <el-icon v-if="testCase.passed" class="status-icon passed"><Check /></el-icon>
                    <el-icon v-else class="status-icon failed"><Close /></el-icon>
                  </div>
                  <div class="test-case-io">
                    <div class="io-block">
                      <div class="io-label">输入：</div>
                      <pre class="io-content">{{ testCase.input }}</pre>
                    </div>
                    <div class="io-block">
                      <div class="io-label">期望输出：</div>
                      <pre class="io-content">{{ testCase.output }}</pre>
                    </div>
                    <div v-if="testCase.userOutput" class="io-block">
                      <div class="io-label">你的输出：</div>
                      <pre class="io-content">{{ testCase.userOutput }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Clock, Cpu, TrendCharts, VideoCamera, Upload,
  Check, Close
} from '@element-plus/icons-vue'

// 页面元数据配置
definePageMeta({
  title: '题目详情',
  layout: false
})

// 路由相关
const route = useRoute()
const router = useRouter()

// Mock data - direct inline data
const mockPracticeData = {
  total: 156,
  categories: [
    { id: "algorithm", name: "算法", count: 45 },
    { id: "datastructure", name: "数据结构", count: 38 },
    { id: "math", name: "数学", count: 22 },
    { id: "string", name: "字符串", count: 18 },
    { id: "stack", name: "栈", count: 15 },
    { id: "queue", name: "队列", count: 10 },
    { id: "tree", name: "树", count: 8 }
  ],
  problems: [
    {
      id: 1001,
      title: "两数之和",
      description: "给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。",
      difficulty: "easy",
      category: "algorithm",
      tags: ["数组", "哈希表"],
      acceptanceRate: 0.48,
      submissions: 2543200,
      timeLimit: "1s",
      memoryLimit: "256MB",
      inputFormat: "第一行包含数组长度 n，第二行包含 n 个整数，第三行包含目标值 target。",
      outputFormat: "输出两个索引，用空格分隔。",
      sampleInput: "4\n2 7 11 15\n9",
      sampleOutput: "0 1",
      hint: "可以使用哈希表来优化查找过程。",
      solution: {
        approach: "使用哈希表存储每个元素及其索引，遍历数组时查找target-nums[i]是否存在。",
        complexity: "时间复杂度: O(n)，空间复杂度: O(n)",
        code: "def twoSum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i"
      }
    },
    {
      id: 1002,
      title: "二叉树的中序遍历",
      description: "给定一个二叉树的根节点 root ，返回它的中序遍历。",
      difficulty: "easy",
      category: "tree",
      tags: ["树", "深度优先搜索", "递归"],
      acceptanceRate: 0.71,
      submissions: 1234500,
      timeLimit: "1s",
      memoryLimit: "256MB",
      inputFormat: "第一行包含节点数 n，后续 n 行描述二叉树结构。",
      outputFormat: "输出中序遍历结果，用空格分隔。",
      sampleInput: "3\n1 2 3\n2 # #\n3 # #",
      sampleOutput: "2 1 3",
      hint: "中序遍历顺序：左子树 -> 根节点 -> 右子树",
      solution: {
        approach: "使用递归进行中序遍历，先访问左子树，然后访问根节点，最后访问右子树。",
        complexity: "时间复杂度: O(n)，空间复杂度: O(h)，h为树的高度",
        code: "def inorderTraversal(root):\n    result = []\n    def inorder(node):\n        if node:\n            inorder(node.left)\n            result.append(node.val)\n            inorder(node.right)\n    inorder(root)\n    return result"
      }
    },
    {
      id: 1003,
      title: "最长回文子串",
      description: "给你一个字符串 s，找到 s 中最长的回文子串。",
      difficulty: "medium",
      category: "string",
      tags: ["字符串", "动态规划"],
      acceptanceRate: 0.32,
      submissions: 1876500,
      timeLimit: "2s",
      memoryLimit: "512MB",
      inputFormat: "输入一行字符串 s。",
      outputFormat: "输出最长的回文子串。",
      sampleInput: "babad",
      sampleOutput: "bab",
      hint: "可以使用中心扩展法或动态规划来解决。",
      solution: {
        approach: "使用中心扩展法，以每个字符为中心向两边扩展。",
        complexity: "时间复杂度: O(n²)，空间复杂度: O(1)",
        code: "def longestPalindrome(s):\n    start, end = 0, 0\n    for i in range(len(s)):\n        len1 = expandAroundCenter(s, i, i)\n        len2 = expandAroundCenter(s, i, i + 1)\n        max_len = max(len1, len2)\n        if max_len > end - start:\n            start = i - (max_len - 1) // 2\n            end = i + max_len // 2\n    return s[start:end + 1]"
      }
    }
  ]
}

// 题目ID
const problemId = computed(() => {
  const id = route.params.id
  return id || '1001'
})

// 响应式数据
const problemData = ref({})
const selectedLanguage = ref('python')
const userCode = ref('')
const isRunning = ref(false)
const isSubmitting = ref(false)
const runResult = ref(null)
const submitResult = ref(null)

// 获取难度等级
const getDifficultyLevel = (difficulty) => {
  const levels = {
    easy: 1,
    medium: 2,
    hard: 3
  }
  return levels[difficulty] || 1
}

// 获取难度类名
const getDifficultyClass = (difficulty) => {
  const classes = {
    easy: 'difficulty-easy',
    medium: 'difficulty-medium',
    hard: 'difficulty-hard'
  }
  return classes[difficulty] || 'difficulty-easy'
}

// 获取难度标签
const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return labels[difficulty] || '未知'
}

// 获取结果状态文本
const getResultStatusText = (status) => {
  const statusMap = {
    success: '运行成功',
    error: '运行错误',
    timeout: '运行超时',
    Accepted: '通过',
    WA: '答案错误',
    TLE: '超时',
    MLE: '内存超限',
    RE: '运行错误',
    CE: '编译错误'
  }
  return statusMap[status] || '未知状态'
}

// 加载题目数据
const loadProblemData = () => {
  try {
    const problem = mockPracticeData.problems.find(p => p.id === parseInt(problemId.value))
    if (problem) {
      problemData.value = problem
      // 加载代码模板
      userCode.value = getCodeTemplate(selectedLanguage.value)
    } else {
      ElMessage.error('题目不存在')
      router.push('/student/practice')
    }
  } catch (error) {
    console.error('Failed to load problem data:', error)
    ElMessage.error('加载题目数据失败')
  }
}

// 获取代码模板
const getCodeTemplate = (language) => {
  const templates = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    // 在这里输入你的C++代码
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        // 在这里输入你的Java代码
    }
}`,
    python: `# 在这里输入你的Python代码
def solution():
    pass

if __name__ == "__main__":
    solution()`,
    javascript: `// 在这里输入你的JavaScript代码
function solution() {
    // 你的代码
}

solution();`
  }
  return templates[language] || ''
}

// 监听语言变化
watch(selectedLanguage, () => {
  userCode.value = getCodeTemplate(selectedLanguage.value)
})

// 重置代码
const resetCode = () => {
  ElMessageBox.confirm('确定要重置代码吗？', '提示', {
    type: 'warning'
  }).then(() => {
    userCode.value = getCodeTemplate(selectedLanguage.value)
    ElMessage.success('代码已重置')
  }).catch(() => {
    // 用户取消
  })
}

// 加载模板
const loadTemplate = () => {
  userCode.value = getCodeTemplate(selectedLanguage.value)
  ElMessage.success('模板已加载')
}

// 运行代码
const runCode = async () => {
  if (!userCode.value.trim()) {
    ElMessage.warning('请先输入代码')
    return
  }

  isRunning.value = true

  // 模拟运行代码
  setTimeout(() => {
    const results = [
      {
        status: 'success',
        output: '运行成功！\n输入:\n4\n2 7 11 15\n输出:\n0 1\n\n执行时间: 12ms\n内存使用: 1024KB'
      },
      {
        status: 'error',
        output: '编译错误：\n第5行：语法错误，缺少分号\n请检查代码语法'
      }
    ]

    runResult.value = results[Math.floor(Math.random() * results.length)]
    isRunning.value = false
  }, 2000)
}

// 提交代码
const submitCode = async () => {
  if (!userCode.value.trim()) {
    ElMessage.warning('请先输入代码')
    return
  }

  ElMessageBox.confirm('确定要提交代码吗？', '提示', {
    type: 'warning'
  }).then(() => {
    isSubmitting.value = true

    // 模拟提交评测
    setTimeout(() => {
      const passedCount = Math.floor(Math.random() * 10) + 1
      const totalCases = 10
      const score = Math.floor((passedCount / totalCases) * 100)

      const results = ['Accepted', 'WA', 'TLE', 'MLE', 'RE']
      const testCases = []

      for (let i = 0; i < totalCases; i++) {
        testCases.push({
          input: `测试输入 ${i + 1}`,
          output: `测试输出 ${i + 1}`,
          userOutput: i < passedCount ? `测试输出 ${i + 1}` : `错误输出`,
          passed: i < passedCount
        })
      }

      submitResult.value = {
        status: passedCount === totalCases ? 'Accepted' : results[Math.floor(Math.random() * results.length) + 1],
        score: score,
        testCases: testCases
      }

      isSubmitting.value = false
      ElMessage.success('代码提交成功！')
    }, 3000)
  }).catch(() => {
    // 用户取消提交
  })
}

// 返回
const goBack = () => {
  router.push('/student/practice')
}

// 生命周期
onMounted(() => {
  loadProblemData()
})
</script>

<style lang="scss" scoped>
.practice-detail-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background: #f5f7fa;
  overflow: hidden;
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .practice-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .practice-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #606266;
    }

    .difficulty-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 600;
      color: white;

      &.difficulty-easy {
        background: #67c23a;
      }

      &.difficulty-medium {
        background: #e6a23c;
      }

      &.difficulty-hard {
        background: #f56c6c;
      }
    }
  }
}

.practice-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

// 左侧题目描述面板
.practice-description-panel {
  width: 480px;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);

  .panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #409eff 0%, #5cadff 100%);
      border-radius: 4px;

      &:hover {
        background: linear-gradient(180deg, #3a8ee6 0%, #4c9de6 100%);
      }
    }
  }
}

// 题目描述样式
.practice-description {
  .practice-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 20px 0;
    line-height: 1.3;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: shimmer 3s infinite;
    }
  }

  .practice-meta-row {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;

    .meta-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: white;
      border-radius: 20px;
      font-size: 13px;
      color: #606266;
      border: 2px solid #e4e7ed;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &.time {
        border-color: #409eff;
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      }

      &.memory {
        border-color: #67c23a;
        background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
      }

      &.acceptance {
        border-color: #e6a23c;
        background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
      }
    }
  }

  .practice-tags-row {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .practice-section {
    margin-bottom: 28px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e8e8e8;
    transition: all 0.3s;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #409eff 0%, #67c23a 100%);
      border-radius: 12px 0 0 12px;
    }

    &:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
      transform: translateX(2px);
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #409eff;
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid #e8f4ff;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '▶';
        font-size: 12px;
        color: #409eff;
      }
    }

    .section-content {
      font-size: 14px;
      line-height: 1.9;
      color: #606266;
      padding: 16px 18px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 10px;
      border: 2px solid #e8ecf0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.8);

      &.hint-content {
        background: linear-gradient(135deg, #fffbea 0%, #fff8dc 100%);
        border: 2px solid #fadb14;
        border-left: 5px solid #faad14;
      }
    }

    .example-box {
      margin-bottom: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 10px;
      border: 2px solid #dee2e6;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .example-title {
        font-size: 14px;
        font-weight: 700;
        color: #409eff;
        margin-bottom: 12px;
        padding: 8px 12px;
        background: white;
        border-radius: 6px;
        display: inline-block;
        box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
      }

      .example-group {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .example-item {
          .example-label {
            font-size: 12px;
            font-weight: 700;
            color: #909399;
            margin-bottom: 6px;
          }

          .example-code {
            padding: 14px 16px;
            background: #1e1e1e;
            border: 2px solid #333;
            border-radius: 8px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #d4d4d4;
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }

    .solution-approach,
    .solution-complexity,
    .solution-code {
      margin-bottom: 20px;

      h4 {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
      }

      p {
        color: #606266;
        line-height: 1.6;
        margin: 0 0 8px 0;
      }
    }

    .reference-code {
      padding: 16px;
      background: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #303133;
      margin: 8px 0 0 0;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

// 右侧代码编辑器面板
.code-editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  overflow: hidden;

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #2d2d2d;
    border-bottom: 1px solid #3e3e3e;

    .editor-title {
      font-size: 14px;
      font-weight: 600;
      color: #d4d4d4;
    }
  }

  .editor-main {
    flex: 1;
    display: flex;

    :deep(.el-textarea) {
      height: 100%;
      display: flex;
    }

    :deep(.el-textarea__inner) {
      height: 100% !important;
      border: none;
      border-radius: 0;
      background: #1e1e1e;
      color: #d4d4d4;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      resize: none;
    }
  }

  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #2d2d2d;
    border-top: 1px solid #3e3e3e;

    .footer-left,
    .footer-right {
      display: flex;
      gap: 8px;
    }
  }

  .run-result-panel,
  .submit-result-panel {
    background: white;
    border-top: 1px solid #e4e7ed;
    max-height: 300px;
    overflow-y: auto;

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;

      h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .result-content {
      padding: 16px;

      .result-status {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 12px;

        &.success {
          background: #67c23a;
          color: white;
        }

        &.error,
        &.timeout {
          background: #f56c6c;
          color: white;
        }

        &.Accepted {
          background: #67c23a;
          color: white;
        }

        &.WA,
        &.TLE,
        &.MLE,
        &.RE,
        &.CE {
          background: #f56c6c;
          color: white;
        }
      }

      .result-score {
        font-size: 16px;
        font-weight: 600;
        color: #409eff;
        margin-bottom: 16px;
      }

      .result-output {
        background: #f5f7fa;
        padding: 12px;
        border-radius: 6px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
        color: #303133;
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }

  .test-cases {
    h5 {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin: 16px 0 12px 0;
    }

    .test-case-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .test-case-item {
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #e4e7ed;

        &.passed {
          border-color: #67c23a;
          background: #f0f9ff;
        }

        &.failed {
          border-color: #f56c6c;
          background: #fef0f0;
        }

        .test-case-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .test-case-label {
            font-size: 13px;
            font-weight: 600;
            color: #303133;
          }

          .status-icon {
            font-size: 16px;

            &.passed {
              color: #67c23a;
            }

            &.failed {
              color: #f56c6c;
            }
          }
        }

        .test-case-io {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .io-block {
            .io-label {
              font-size: 12px;
              color: #909399;
              margin-bottom: 4px;
            }

            .io-content {
              padding: 8px;
              background: white;
              border: 1px solid #e4e7ed;
              border-radius: 4px;
              font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              color: #303133;
              margin: 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          }
        }
      }
    }
  }
}

@keyframes shimmer {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .practice-description-panel {
    width: 400px;
  }
}

@media (max-width: 768px) {
  .practice-body {
    flex-direction: column;
  }

  .practice-description-panel {
    width: 100%;
    height: 40vh;
  }
}
</style>