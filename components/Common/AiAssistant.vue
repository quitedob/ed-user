<!-- AI助教组件 -->
<template>
  <div class="ai-assistant">
    <!-- 悬浮按钮 -->
    <div
      v-if="!isExpanded"
      class="ai-float-button"
      @click="toggleAssistant"
    >
      <el-icon size="24" color="white">
        <ChatDotRound />
      </el-icon>
      <div v-if="hasUnreadMessage" class="unread-indicator"></div>
    </div>

    <!-- AI助教面板 -->
    <div v-if="isExpanded" class="ai-panel">
      <div class="ai-header">
        <div class="ai-title">
          <el-icon><ChatDotRound /></el-icon>
          <span>AI助教</span>
        </div>
        <div class="ai-actions">
          <el-button size="small" @click="clearChat">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button size="small" @click="toggleAssistant">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="ai-chat-area" ref="chatArea">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message-item', message.role]"
        >
          <div class="message-avatar">
            <el-avatar
              :size="32"
              :src="message.role === 'assistant' ? '/images/ai-assistant.png' : userAvatar"
            >
              {{ message.role === 'assistant' ? 'AI' : '我' }}
            </el-avatar>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <div v-if="isTyping" class="message-item assistant typing">
          <div class="message-avatar">
            <el-avatar size="32" src="/images/ai-assistant.png">AI</el-avatar>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-input-area">
        <div class="quick-questions">
          <el-tag
            v-for="question in quickQuestions"
            :key="question"
            size="small"
            @click="sendQuickQuestion(question)"
            class="quick-tag"
          >
            {{ question }}
          </el-tag>
        </div>

        <div class="input-controls">
          <el-input
            v-model="currentMessage"
            placeholder="向AI助教提问..."
            :disabled="isTyping"
            @keyup.enter="sendMessage"
          >
            <template #suffix>
              <el-button
                :loading="isTyping"
                @click="sendMessage"
                :disabled="!currentMessage.trim()"
              >
                <el-icon><ChatDotRound /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>

        <div class="ai-features">
          <el-button size="small" @click="showHint" :disabled="!canShowHint">
            <el-icon><QuestionFilled /></el-icon>
            获取提示
          </el-button>
          <el-button size="small" @click="showSolution" :disabled="!canShowSolution">
            <el-icon><View /></el-icon>
            查看答案
          </el-button>
          <el-button size="small" @click="explainConcept">
            <el-icon><QuestionFilled /></el-icon>
            概念解释
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChatDotRound,
  Close,
  Delete,
  View,
  QuestionFilled
} from '@element-plus/icons-vue'

const props = defineProps({
  context: {
    type: String,
    default: 'general' // general, problem, course
  },
  problemId: {
    type: Number,
    default: null
  },
  courseId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['hint-requested', 'solution-requested', 'concept-explained'])

// 响应式数据
const isExpanded = ref(false)
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const hasUnreadMessage = ref(false)
const chatArea = ref(null)

// 用户信息
const userAvatar = ref('/images/avatar-user.jpg')

// 快捷问题
const quickQuestions = ref([
  '这道题的思路是什么？',
  '我卡在哪里了？',
  '能给个提示吗？',
  '这个算法怎么理解？',
  '时间复杂度是多少？'
])

// 方法
const toggleAssistant = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    hasUnreadMessage.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: currentMessage.value,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageText = currentMessage.value
  currentMessage.value = ''

  nextTick(() => {
    scrollToBottom()
  })

  // 发送消息到AI
  await sendToAI(messageText)
}

const sendQuickQuestion = (question) => {
  currentMessage.value = question
  sendMessage()
}

const sendToAI = async (message) => {
  isTyping.value = true

  try {
    // 模拟AI回复
    const aiResponse = await mockAIResponse(message)

    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    }

    messages.value.push(aiMessage)

    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    console.error('AI回复失败:', error)
    ElMessage.error('AI助教暂时无法回复，请稍后再试')
  } finally {
    isTyping.value = false
  }
}

const mockAIResponse = async (userMessage) => {
  // 模拟AI思考时间
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

  const responses = {
    hint: [
      "💡 **提示**: 试着考虑使用双指针技巧，从数组的两端开始遍历。",
      "💡 **提示**: 这道题可以使用动态规划，定义状态 dp[i] 表示...",
      "💡 **提示**: 考虑使用哈希表来存储已遍历的元素及其索引。",
      "💡 **提示**: 这是一个经典的贪心问题，优先选择局部最优解。"
    ],
    solution: [
      "🔍 **解题思路**: 这道题的核心是找到数组中和为目标值的两个数。可以遍历数组，用哈希表记录每个数字的索引，当找到 target - current 对应的数字时，即为答案。",
      "🔍 **解题思路**: 这是一个链表合并问题，可以使用递归或迭代的方式。创建一个虚拟头节点，然后依次比较两个链表的节点值。",
      "🔍 **解题思路**: 对于回文子串问题，可以使用动态规划。定义 dp[i][j] 表示 s[i..j] 是否为回文串。"
    ],
    concept: [
      "📚 **概念解释**: 动态规划是一种通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。它适用于有重叠子问题和最优子结构的问题。",
      "📚 **概念解释**: 时间复杂度用来衡量算法运行时间随输入规模增长的关系。常见的有 O(1), O(log n), O(n), O(n log n), O(n²) 等。",
      "📚 **概念解释**: 空间复杂度是指算法在运行过程中临时占用存储空间大小的度量。"
    ]
  }

  let responseType = 'hint'
  if (userMessage.includes('答案') || userMessage.includes('解法')) {
    responseType = 'solution'
  } else if (userMessage.includes('概念') || userMessage.includes('解释')) {
    responseType = 'concept'
  }

  const randomResponse = responses[responseType][Math.floor(Math.random() * responses[responseType].length)]

  return randomResponse
}

const showHint = () => {
  if (!canShowHint.value) return

  const hintMessage = "💡 **提示**: 试着从问题的基本情况开始分析，找出规律或使用常见的算法模式。"
  sendSystemMessage(hintMessage)
  emit('hint-requested')
}

const showSolution = () => {
  if (!canShowSolution.value) return

  ElMessageBox.confirm(
    '查看答案将消耗一次答题机会，确定要查看吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const solutionMessage = "🔍 **答案解析**: 这道题的解法是...\n\n```javascript\nfunction solution(nums, target) {\n  // 具体实现代码\n}\n```"
    sendSystemMessage(solutionMessage)
    emit('solution-requested')
  })
}

const explainConcept = () => {
  const conceptMessage = "📚 **概念解释**: 根据你当前学习的上下文，我来解释相关概念...\n\n" +
    "**核心概念**: [概念名称]\n" +
    "**定义**: [详细定义]\n" +
    "**应用场景**: [实际应用]\n" +
    "**示例**: [代码或实际例子]"

  sendSystemMessage(conceptMessage)
  emit('concept-explained')
}

const sendSystemMessage = (content) => {
  const systemMessage = {
    id: Date.now(),
    role: 'assistant',
    content: content,
    timestamp: new Date()
  }

  messages.value.push(systemMessage)

  nextTick(() => {
    scrollToBottom()
  })
}

const clearChat = () => {
  ElMessageBox.confirm('确定要清空聊天记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    messages.value = []
  })
}

const scrollToBottom = () => {
  if (chatArea.value) {
    chatArea.value.scrollTop = chatArea.value.scrollHeight
  }
}

const formatMessage = (content) => {
  // 简单的markdown格式化
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 计算属性
const canShowHint = computed(() => {
  // 根据上下文判断是否可以显示提示
  return props.context === 'problem'
})

const canShowSolution = computed(() => {
  // 根据提交次数等条件判断是否可以查看答案
  return props.context === 'problem' && messages.value.length > 2
})

// 初始化欢迎消息
const initWelcomeMessage = () => {
  const welcomeMessage = {
    id: 1,
    role: 'assistant',
    content: `👋 欢迎使用AI助教！

我是你的编程学习助手，可以帮你：
• 💡 获取解题提示
• 🔍 分析代码思路  
• 📚 解释编程概念
• 🎯 提供学习建议

有什么问题都可以问我哦！`,
    timestamp: new Date()
  }

  messages.value.push(welcomeMessage)
}

// 生命周期
onMounted(() => {
  initWelcomeMessage()
})
</script>

<style lang="scss" scoped>
.ai-assistant {
  .ai-float-button {
    position: fixed;
    bottom: 80px;
    right: 24px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #409EFF, #66B1FF);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);
    z-index: 1000;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(64, 158, 255, 0.4);
    }

    .unread-indicator {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 12px;
      height: 12px;
      background: #F56C6C;
      border-radius: 50%;
      border: 2px solid white;
    }
  }

  .ai-panel {
    position: fixed;
    bottom: 80px;
    right: 24px;
    width: 380px;
    height: 600px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .ai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #EBEEF5;
      background: #F8F9FA;

      .ai-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #303133;

        .el-icon {
          color: #409EFF;
        }
      }

      .ai-actions {
        display: flex;
        gap: 8px;
      }
    }

    .ai-chat-area {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #FAFBFC;

      .message-item {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        &.user {
          flex-direction: row-reverse;

          .message-content {
            align-items: flex-end;
          }
        }

        &.assistant {
          .message-avatar {
            align-self: flex-start;
          }
        }

        &.typing {
          .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background: #F0F2F5;
            border-radius: 16px 16px 16px 4px;

            span {
              width: 6px;
              height: 6px;
              background: #B0B3B8;
              border-radius: 50%;
              animation: typing 1.4s infinite;

              &:nth-child(2) {
                animation-delay: 0.2s;
              }

              &:nth-child(3) {
                animation-delay: 0.4s;
              }
            }
          }
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
          display: flex;
          flex-direction: column;

          .message-text {
            padding: 12px 16px;
            background: white;
            border-radius: 16px;
            line-height: 1.5;
            word-wrap: break-word;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

            .user & {
              background: #409EFF;
              color: white;
              border-radius: 16px 16px 4px 16px;
            }

            .assistant & {
              border-radius: 16px 16px 16px 4px;
            }
          }

          .message-time {
            font-size: 12px;
            color: #909399;
            margin-top: 4px;
            padding: 0 4px;
          }
        }
      }
    }

    .ai-input-area {
      border-top: 1px solid #EBEEF5;
      background: white;

      .quick-questions {
        padding: 12px 16px 8px;
        border-bottom: 1px solid #F0F2F5;

        .quick-tag {
          margin-right: 8px;
          margin-bottom: 4px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
          }
        }
      }

      .input-controls {
        padding: 16px;

        .el-input {
          :deep(.el-input__wrapper) {
            border-radius: 20px;
          }
        }
      }

      .ai-features {
        padding: 0 16px 16px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .ai-assistant {
    .ai-float-button {
      bottom: 16px;
      right: 16px;
    }

    .ai-panel {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      border-radius: 0;
      z-index: 1001;
    }
  }
}
</style>
