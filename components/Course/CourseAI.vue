<template>
  <div class="course-ai">
    <div class="ai-layout">
      <!-- 左侧配置区 -->
      <div class="ai-sidebar">
        <div class="welcome-section">
          <el-icon class="welcome-icon" :size="32" color="#409eff"><ChatDotRound /></el-icon>
          <h2>HI，欢迎使用学习辅助助手</h2>
        </div>

        <el-tabs v-model="activeTab" class="config-tabs">
          <el-tab-pane label="知识模块" name="knowledge">
            <div class="tab-content">
              <div class="tips-section">
                <p>请不要过度依赖AI助手，应该以自主学习为主，AI学习为辅</p>
                <p>学习：</p>
                <ul>
                  <li>针对某一个知识点的AI辅助学习，让AI助教给你出题</li>
                  <li>需要选择：1.知识点 2.题型 3.难度等级，然后让AI助教给你出题练习</li>
                </ul>
              </div>

              <div class="config-section">
                <h3>出题配置</h3>
                <div class="config-item">
                  <label>选择知识点模块</label>
                  <el-select v-model="selectedModule" placeholder="请选择" style="width: 100%">
                    <el-option label="第一章 软件工程概述" value="chapter1" />
                    <el-option label="第二章 需求分析" value="chapter2" />
                    <el-option label="第三章 系统设计" value="chapter3" />
                    <el-option label="第四章 编码实现" value="chapter4" />
                  </el-select>
                </div>

                <div class="config-item">
                  <label>题型方向</label>
                  <el-select v-model="selectedType" placeholder="请选择" style="width: 100%">
                    <el-option label="单选题" value="single" />
                    <el-option label="多选题" value="multiple" />
                    <el-option label="判断题" value="judge" />
                    <el-option label="简答题" value="short" />
                  </el-select>
                </div>

                <div class="config-item">
                  <label>是否随机出题</label>
                  <el-switch v-model="isRandom" />
                </div>

                <el-button type="primary" class="start-btn" @click="startPractice">
                  <el-icon><Promotion /></el-icon>
                  开始练习
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="问答记录" name="history">
            <div class="tab-content">
              <div class="history-list">
                <div v-for="item in historyList" :key="item.id" class="history-item" @click="openHistory(item)">
                  <div class="history-title">{{ item.title }}</div>
                  <div class="history-time">{{ item.time }}</div>
                </div>
                <div v-if="historyList.length === 0" class="empty-history">
                  <p>暂无问答记录</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧对话区 -->
      <div class="ai-chat-area">
        <div v-if="!chatStarted" class="empty-chat">
          <div class="empty-icon">
            <el-icon :size="80" color="#d3d3d3"><ChatDotRound /></el-icon>
          </div>
          <h3>欢迎使用学习辅助助手，帮你个性化学习!</h3>
          <p>请在左侧配置出题参数，然后开始练习</p>
          <div class="tips">
            <p>1.在左侧选择【知识点模块】，如：选择第一章</p>
            <p>2.选择【题型方向】，如：选择单选题</p>
            <p>3.点击【开始练习】，AI助教会根据你的选择出题</p>
            <p>4.在右侧【对话框】中，AI助教会给你出题，让你练习</p>
            <p>5.对于你的回答，AI助教会给你评分和解析</p>
          </div>
        </div>

        <div v-else class="chat-container">
          <div class="chat-messages" ref="messagesContainer">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['message-item', message.role]"
            >
              <div class="message-avatar">
                <el-avatar :size="36">
                  {{ message.role === 'assistant' ? 'AI' : '我' }}
                </el-avatar>
              </div>
              <div class="message-bubble">
                <div class="message-content" v-html="message.content"></div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
          </div>

          <div class="chat-input-area">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              placeholder="输入你的答案或问题..."
              @keyup.enter.ctrl="sendMessage"
            />
            <div class="input-actions">
              <span class="input-tip">Ctrl + Enter 发送</span>
              <el-button type="primary" @click="sendMessage" :loading="isLoading">
                发送
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChatDotRound,
  Promotion
} from '@element-plus/icons-vue'

const activeTab = ref('knowledge')
const selectedModule = ref('')
const selectedType = ref('')
const isRandom = ref(false)
const chatStarted = ref(false)
const inputMessage = ref('')
const isLoading = ref(false)
const messages = ref([])
const messagesContainer = ref(null)

// 问答历史记录
const historyList = ref([
  {
    id: 1,
    title: '第一章 软件工程概述 - 单选题练习',
    time: '2024-11-15 14:30'
  },
  {
    id: 2,
    title: '第二章 需求分析 - 简答题练习',
    time: '2024-11-14 10:20'
  }
])

const startPractice = () => {
  if (!selectedModule.value) {
    ElMessage.warning('请选择知识点模块')
    return
  }
  if (!selectedType.value) {
    ElMessage.warning('请选择题型方向')
    return
  }

  chatStarted.value = true
  messages.value = []

  // 添加AI欢迎消息
  const welcomeMessage = {
    id: Date.now(),
    role: 'assistant',
    content: `好的！我将为你出一道关于"${getModuleName(selectedModule.value)}"的${getTypeName(selectedType.value)}。<br><br>${generateQuestion()}`,
    time: formatTime(new Date())
  }

  messages.value.push(welcomeMessage)

  nextTick(() => {
    scrollToBottom()
  })
}

const getModuleName = (value) => {
  const map = {
    chapter1: '第一章 软件工程概述',
    chapter2: '第二章 需求分析',
    chapter3: '第三章 系统设计',
    chapter4: '第四章 编码实现'
  }
  return map[value] || value
}

const getTypeName = (value) => {
  const map = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    short: '简答题'
  }
  return map[value] || value
}

const generateQuestion = () => {
  const questions = {
    single: '为使一个软件能在不同的环境下运行，应当对软件的（）进行修改。<br>A. 适应性<br>B. 可移植性<br>C. 可靠性<br>D. 可维护性',
    multiple: '软件工程的三要素包括（）<br>A. 方法<br>B. 工具<br>C. 过程<br>D. 人员',
    judge: '软件工程只关注软件开发过程，不包括软件维护。（）',
    short: '请简述软件生命周期的主要阶段及其作用。'
  }
  return questions[selectedType.value] || '请回答这道题目。'
}

const openHistory = (item) => {
  ElMessage.info(`查看历史记录：${item.title}`)
}

const sendMessage = () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: inputMessage.value,
    time: formatTime(new Date())
  }

  messages.value.push(userMessage)
  const messageToSend = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  nextTick(() => {
    scrollToBottom()
  })

  // 模拟AI回复
  setTimeout(() => {
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: generateAIResponse(messageToSend),
      time: formatTime(new Date())
    }

    messages.value.push(aiMessage)
    isLoading.value = false

    nextTick(() => {
      scrollToBottom()
    })
  }, 1500)
}

const generateAIResponse = (userMessage) => {
  // 简单的评分和反馈
  const answer = userMessage.toUpperCase()
  
  if (selectedType.value === 'single') {
    if (answer.includes('B')) {
      return '✅ 回答正确！<br><br>解析：可移植性是指软件能够在不同环境下运行的能力。要使软件能在不同环境下运行，需要对软件的可移植性进行修改和优化。<br><br>继续加油！要继续练习吗？'
    } else {
      return '❌ 回答错误。正确答案是 B. 可移植性<br><br>解析：可移植性是指软件能够在不同环境下运行的能力。适应性是指软件适应需求变化的能力，可靠性是指软件在规定条件下正常运行的能力，可维护性是指软件易于修改和维护的程度。<br><br>建议你再复习一下相关知识点。'
    }
  } else {
    return '很好的回答！让我来评价一下：<br><br>你的答案涵盖了主要知识点，表述清晰。建议可以补充更多细节和实例。<br><br>继续保持！要继续练习吗？'
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.course-ai {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-layout {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
}

.ai-sidebar {
  width: 360px;
  background: linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%);
  border-radius: 12px;
  padding: 24px;
  flex-shrink: 0;
  overflow-y: auto;

  .welcome-section {
    text-align: center;
    margin-bottom: 24px;

    .welcome-icon {
      margin-bottom: 12px;
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .config-tabs {
    :deep(.el-tabs__header) {
      background: white;
      border-radius: 8px;
      padding: 4px;
      margin-bottom: 16px;
    }

    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }

    :deep(.el-tabs__item) {
      border-radius: 6px;
      padding: 8px 16px;
    }

    :deep(.el-tabs__item.is-active) {
      background: #409eff;
      color: white;
    }
  }

  .tab-content {
    background: white;
    border-radius: 8px;
    padding: 16px;

    .tips-section {
      font-size: 13px;
      line-height: 1.6;
      color: #606266;
      margin-bottom: 20px;

      p {
        margin: 8px 0;
      }

      ul {
        margin: 8px 0;
        padding-left: 20px;

        li {
          margin: 4px 0;
        }
      }
    }

    .config-section {
      h3 {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 16px 0;
      }

      .config-item {
        margin-bottom: 16px;

        label {
          display: block;
          font-size: 13px;
          color: #606266;
          margin-bottom: 8px;
        }
      }

      .start-btn {
        width: 100%;
        margin-top: 8px;
      }
    }

    .history-list {
      .history-item {
        padding: 12px;
        background: #f5f7fa;
        border-radius: 6px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #e4e7ed;
        }

        .history-title {
          font-size: 13px;
          color: #303133;
          margin-bottom: 4px;
        }

        .history-time {
          font-size: 12px;
          color: #909399;
        }
      }

      .empty-history {
        text-align: center;
        padding: 40px 0;
        color: #909399;
        font-size: 13px;
      }
    }
  }
}

.ai-chat-area {
  flex: 1;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .empty-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;

    .empty-icon {
      margin-bottom: 24px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    > p {
      font-size: 14px;
      color: #606266;
      margin: 0 0 24px 0;
    }

    .tips {
      text-align: left;
      background: #f5f7fa;
      border-radius: 8px;
      padding: 20px;
      max-width: 600px;

      p {
        font-size: 13px;
        color: #606266;
        line-height: 1.8;
        margin: 8px 0;
      }
    }
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;

      .message-item {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;

        &.user {
          flex-direction: row-reverse;

          .message-bubble {
            background: #409eff;
            color: white;

            .message-time {
              text-align: right;
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }

        &.assistant {
          .message-bubble {
            background: #f5f7fa;
            color: #303133;

            .message-time {
              color: #909399;
            }
          }
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .message-bubble {
          max-width: 70%;
          border-radius: 12px;
          padding: 12px 16px;

          .message-content {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 6px;

            :deep(br) {
              display: block;
              margin: 4px 0;
            }
          }

          .message-time {
            font-size: 12px;
          }
        }
      }
    }

    .chat-input-area {
      border-top: 1px solid #e4e7ed;
      padding: 16px;

      .el-textarea {
        margin-bottom: 12px;
      }

      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .input-tip {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}
</style>
