<template>
  <div class="class-practice">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">编程练习</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索练习..."
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="difficultyFilter" placeholder="难度" style="width: 120px" clearable>
          <el-option label="全部" value="" />
          <el-option label="简单" value="easy" />
          <el-option label="中等" value="medium" />
          <el-option label="困难" value="hard" />
        </el-select>
        <el-select v-model="statusFilter" placeholder="状态" style="width: 120px" clearable>
          <el-option label="全部" value="" />
          <el-option label="未开始" value="not_started" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </div>
    </div>

    <!-- 练习统计 -->
    <div class="practice-stats">
      <div class="stat-item">
        <span class="stat-number">{{ practiceStats.total }}</span>
        <span class="stat-label">总练习题</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ practiceStats.completed }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ practiceStats.inProgress }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ practiceStats.successRate }}%</span>
        <span class="stat-label">通过率</span>
      </div>
    </div>

    <!-- 推荐练习 -->
    <div class="recommended-section" v-if="recommendedProblems.length > 0">
      <h3 class="section-title">推荐练习</h3>
      <div class="recommended-grid">
        <el-card
          v-for="problem in recommendedProblems"
          :key="problem.id"
          class="recommended-card"
          shadow="hover"
          @click="openPractice(problem)"
        >
          <div class="problem-difficulty" :class="problem.difficulty">
            {{ getDifficultyLabel(problem.difficulty) }}
          </div>
          <div class="problem-title">{{ problem.title }}</div>
          <div class="problem-tags">
            <el-tag
              v-for="tag in problem.tags"
              :key="tag"
              size="small"
              type="info"
              class="problem-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="problem-stats">
            <span class="accept-rate">{{ problem.acceptanceRate }}%通过</span>
            <span class="submissions">{{ problem.submissionCount }}次提交</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 练习列表 -->
    <div class="practice-list">
      <div class="list-header">
        <h3 class="section-title">全部练习</h3>
        <div class="view-toggle">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="list">列表</el-radio-button>
            <el-radio-button label="grid">网格</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="list-view">
        <el-card
          v-for="problem in filteredProblems"
          :key="problem.id"
          class="problem-item"
          shadow="hover"
          @click="openPractice(problem)"
        >
          <div class="problem-row">
            <div class="problem-left">
              <div class="problem-status">
                <el-icon
                  :class="getProblemStatusIcon(problem.status)"
                  :color="getProblemStatusColor(problem.status)"
                >
                  <component :is="getProblemStatusIcon(problem.status)" />
                </el-icon>
              </div>
              <div class="problem-info">
                <div class="problem-title-row">
                  <h4 class="problem-title">{{ problem.title }}</h4>
                  <el-tag
                    :type="getDifficultyType(problem.difficulty)"
                    size="small"
                  >
                    {{ getDifficultyLabel(problem.difficulty) }}
                  </el-tag>
                </div>
                <div class="problem-course">{{ problem.courseTitle }}</div>
                <div class="problem-description">{{ problem.description }}</div>
              </div>
            </div>
            <div class="problem-right">
              <div class="problem-stats">
                <div class="stat-item">
                  <span class="stat-label">通过率</span>
                  <span class="stat-value">{{ problem.acceptanceRate }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">提交次数</span>
                  <span class="stat-value">{{ problem.submissionCount }}</span>
                </div>
              </div>
              <div class="problem-action">
                <el-button
                  :type="getPracticeButtonType(problem.status)"
                  size="small"
                  @click.stop="handlePracticeAction(problem)"
                >
                  {{ getPracticeActionText(problem.status) }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 网格视图 -->
      <div v-else class="grid-view">
        <div class="problem-grid">
          <el-card
            v-for="problem in filteredProblems"
            :key="problem.id"
            class="problem-card"
            shadow="hover"
            @click="openPractice(problem)"
          >
            <div class="problem-header">
              <div class="problem-status">
                <el-icon
                  :class="getProblemStatusIcon(problem.status)"
                  :color="getProblemStatusColor(problem.status)"
                >
                  <component :is="getProblemStatusIcon(problem.status)" />
                </el-icon>
              </div>
              <el-tag
                :type="getDifficultyType(problem.difficulty)"
                size="small"
              >
                {{ getDifficultyLabel(problem.difficulty) }}
              </el-tag>
            </div>
            <div class="problem-content">
              <h4 class="problem-title">{{ problem.title }}</h4>
              <div class="problem-course">{{ problem.courseTitle }}</div>
              <div class="problem-tags">
                <el-tag
                  v-for="tag in problem.tags.slice(0, 2)"
                  :key="tag"
                  size="small"
                  type="info"
                  class="problem-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="problem-footer">
              <div class="problem-stats">
                <span>{{ problem.acceptanceRate }}%通过</span>
                <span>{{ problem.submissionCount }}提交</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProblems.length === 0" class="empty-state">
      <el-empty description="暂无练习题" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search, Clock, Trophy, Check, Circle, Document, Monitor
} from '@element-plus/icons-vue'

// 页面元数据
definePageMeta({
  layout: false // 使用student布局
})

const route = useRoute()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const difficultyFilter = ref('')
const statusFilter = ref('')
const viewMode = ref('list')
const problems = ref([])
const recommendedProblems = ref([])

const practiceStats = ref({
  total: 0,
  completed: 0,
  inProgress: 0,
  successRate: 0
})

// 计算属性
const filteredProblems = computed(() => {
  let filtered = problems.value

  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered.filter(problem =>
      problem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      problem.courseTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 难度过滤
  if (difficultyFilter.value) {
    filtered = filtered.filter(problem => problem.difficulty === difficultyFilter.value)
  }

  // 状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter(problem => problem.status === statusFilter.value)
  }

  return filtered
})

// 方法
const loadProblems = async () => {
  // 模拟练习题数据
  const mockProblems = [
    {
      id: 'prob_001',
      title: '两数之和',
      courseTitle: 'Python程序设计基础',
      description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
      difficulty: 'easy',
      status: 'completed',
      tags: ['数组', '哈希表', '算法'],
      acceptanceRate: 52.3,
      submissionCount: 1250,
      lastSubmittedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 'prob_002',
      title: '实现链表反转',
      courseTitle: '数据结构与算法',
      description: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
      difficulty: 'medium',
      status: 'in_progress',
      tags: ['链表', '指针', '算法'],
      acceptanceRate: 68.7,
      submissionCount: 890,
      lastSubmittedAt: '2024-01-22T10:15:00Z'
    },
    {
      id: 'prob_003',
      title: '二叉树的层序遍历',
      courseTitle: '数据结构与算法',
      description: '给你二叉树的根节点 root ，返回其节点值的层序遍历。（即逐层地，从左到右访问所有节点）。',
      difficulty: 'medium',
      status: 'not_started',
      tags: ['二叉树', '广度优先搜索', '队列'],
      acceptanceRate: 61.4,
      submissionCount: 2340,
      lastSubmittedAt: null
    },
    {
      id: 'prob_004',
      title: '实现Promise',
      courseTitle: 'Web前端开发',
      description: '手写实现Promise的核心功能，包括then、catch、all、race等方法。',
      difficulty: 'hard',
      status: 'not_started',
      tags: ['JavaScript', '异步编程', '前端'],
      acceptanceRate: 42.8,
      submissionCount: 567,
      lastSubmittedAt: null
    },
    {
      id: 'prob_005',
      title: 'LRU缓存机制',
      courseTitle: '操作系统',
      description: '请你设计并实现一个满足 LRU (最近最少使用) 缓存约束的数据结构。',
      difficulty: 'medium',
      status: 'completed',
      tags: ['设计', '哈希表', '双向链表'],
      acceptanceRate: 53.2,
      submissionCount: 432,
      lastSubmittedAt: '2024-01-18T14:45:00Z'
    },
    {
      id: 'prob_006',
      title: '股票买卖最佳时机',
      courseTitle: 'Python程序设计基础',
      description: '给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。',
      difficulty: 'easy',
      status: 'completed',
      tags: ['数组', '动态规划', '贪心'],
      acceptanceRate: 58.9,
      submissionCount: 1876,
      lastSubmittedAt: '2024-01-16T09:20:00Z'
    }
  ]

  problems.value = mockProblems
  recommendedProblems.value = mockProblems.filter(p => p.status === 'not_started' && p.difficulty === 'easy').slice(0, 3)
  updatePracticeStats()
}

const updatePracticeStats = () => {
  const stats = problems.value.reduce((acc, problem) => {
    acc.total++
    if (problem.status === 'completed') acc.completed++
    if (problem.status === 'in_progress') acc.inProgress++
    return acc
  }, { total: 0, completed: 0, inProgress: 0 })

  practiceStats.value = {
    total: stats.total,
    completed: stats.completed,
    inProgress: stats.inProgress,
    successRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  }
}

const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return labels[difficulty] || '未知'
}

const getDifficultyType = (difficulty) => {
  const types = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return types[difficulty] || 'info'
}

const getProblemStatusIcon = (status) => {
  const icons = {
    not_started: Circle,
    in_progress: Clock,
    completed: Check
  }
  return icons[status] || Circle
}

const getProblemStatusColor = (status) => {
  const colors = {
    not_started: '#909399',
    in_progress: '#E6A23C',
    completed: '#67C23A'
  }
  return colors[status] || '#909399'
}

const getPracticeButtonType = (status) => {
  const types = {
    not_started: 'primary',
    in_progress: 'success',
    completed: 'info'
  }
  return types[status] || 'default'
}

const getPracticeActionText = (status) => {
  const actions = {
    not_started: '开始练习',
    in_progress: '继续练习',
    completed: '查看代码'
  }
  return actions[status] || '查看详情'
}

const openPractice = (problem) => {
  // 跳转到练习详情页面
  router.push(`/student/class/${route.params.id}/practice/${problem.id}`)
}

const handlePracticeAction = (problem) => {
  switch (problem.status) {
    case 'not_started':
      // 开始练习
      router.push(`/student/class/${route.params.id}/practice/${problem.id}/solve`)
      break
    case 'in_progress':
      // 继续练习
      router.push(`/student/class/${route.params.id}/practice/${problem.id}/solve`)
      break
    case 'completed':
      // 查看代码和题解
      router.push(`/student/class/${route.params.id}/practice/${problem.id}/solution`)
      break
    default:
      openPractice(problem)
  }
}

// 生命周期
onMounted(() => {
  loadProblems()
})
</script>

<style lang="scss" scoped>
.class-practice {
  // 页面头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  // 练习统计
  .practice-stats {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .stat-item {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 28px;
        font-weight: 700;
        color: #409eff;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  // 推荐练习
  .recommended-section {
    margin-bottom: 32px;

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 16px 0;
    }

    .recommended-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;

      .recommended-card {
        cursor: pointer;
        transition: all 0.3s;
        position: relative;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .problem-difficulty {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;

          &.easy {
            background: #f0f9ff;
            color: #0284c7;
          }

          &.medium {
            background: #fff7ed;
            color: #ea580c;
          }

          &.hard {
            background: #fef2f2;
            color: #dc2626;
          }
        }

        .problem-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 8px 0;
          line-height: 1.3;
        }

        .problem-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          flex-wrap: wrap;

          .problem-tag {
            font-size: 11px;
          }
        }

        .problem-stats {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  // 练习列表
  .practice-list {
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }
    }

    // 列表视图
    .list-view {
      .problem-item {
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .problem-row {
          display: flex;
          align-items: center;
          gap: 16px;

          .problem-left {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            flex: 1;

            .problem-status {
              margin-top: 4px;

              .el-icon {
                font-size: 16px;
              }
            }

            .problem-info {
              flex: 1;

              .problem-title-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;

                .problem-title {
                  font-size: 16px;
                  font-weight: 600;
                  color: #303133;
                  margin: 0;
                  line-height: 1.3;
                }
              }

              .problem-course {
                font-size: 14px;
                color: #606266;
                margin-bottom: 4px;
              }

              .problem-description {
                font-size: 13px;
                color: #909399;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
            }
          }

          .problem-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
            flex-shrink: 0;

            .problem-stats {
              display: flex;
              gap: 20px;

              .stat-item {
                text-align: right;

                .stat-label {
                  display: block;
                  font-size: 12px;
                  color: #909399;
                  margin-bottom: 2px;
                }

                .stat-value {
                  font-size: 14px;
                  font-weight: 600;
                  color: #303133;
                }
              }
            }
          }
        }
      }
    }

    // 网格视图
    .grid-view {
      .problem-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;

        .problem-card {
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }

          .problem-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .problem-status {
              .el-icon {
                font-size: 16px;
              }
            }
          }

          .problem-content {
            margin-bottom: 16px;

            .problem-title {
              font-size: 16px;
              font-weight: 600;
              color: #303133;
              margin: 0 0 4px 0;
              line-height: 1.3;
            }

            .problem-course {
              font-size: 13px;
              color: #606266;
              margin-bottom: 8px;
            }

            .problem-tags {
              display: flex;
              gap: 6px;
              flex-wrap: wrap;

              .problem-tag {
                font-size: 11px;
              }
            }
          }

          .problem-footer {
            .problem-stats {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }

  // 空状态
  .empty-state {
    margin-top: 60px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .class-practice {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .header-actions {
        flex-direction: column;
        gap: 12px;

        .el-input,
        .el-select {
          width: 100% !important;
        }
      }
    }

    .practice-stats {
      flex-direction: column;
      gap: 16px;

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;

        .stat-number {
          margin-bottom: 0;
        }
      }
    }

    .practice-list {
      .list-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      .list-view .problem-item .problem-row {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;

        .problem-right {
          align-items: stretch;
          flex-direction: row;
          justify-content: space-between;
        }
      }

      .grid-view .problem-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>