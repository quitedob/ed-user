<template>
  <div class="oj-question">
    <!-- 代码编辑器模式 -->
    <div v-if="!completed" class="editor-mode">
      <!-- 编辑器头部 -->
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <div class="toolbar-icon">
            <el-icon><Edit /></el-icon>
          </div>
          <span class="toolbar-title">代码编辑器</span>
        </div>
        <div class="toolbar-right">
          <el-select v-model="selectedLanguage" placeholder="选择语言" size="default" class="lang-select">
            <el-option v-for="lang in languages" :key="lang.value" :label="lang.label" :value="lang.value">
              <div class="lang-option">
                <span class="lang-icon">{{ lang.icon }}</span>
                <span>{{ lang.label }}</span>
              </div>
            </el-option>
          </el-select>
          <el-button text @click="resetCode">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </div>
      </div>

      <!-- 代码编辑区 -->
      <div class="editor-container">
        <div class="line-numbers">
          <div v-for="n in lineCount" :key="n" class="line-num">{{ n }}</div>
        </div>
        <el-input
          v-model="codeContent"
          type="textarea"
          :rows="20"
          placeholder="// 在此处编写你的代码..."
          class="code-editor"
          @input="updateCode"
        />
      </div>

      <!-- 编辑器底部 -->
      <div class="editor-footer">
        <div class="footer-info">
          <span class="char-count">{{ codeContent.length }} 字符</span>
          <span class="line-info">{{ lineCount }} 行</span>
        </div>
        <div class="footer-actions">
          <el-button size="large" @click="$emit('run')">
            <el-icon><VideoPlay /></el-icon>
            运行测试
          </el-button>
          <el-button type="success" size="large" @click="$emit('submit-code')">
            <el-icon><Upload /></el-icon>
            提交代码
          </el-button>
        </div>
      </div>
    </div>

    <!-- 结果展示模式 -->
    <div v-else class="result-mode">
      <!-- 结果头部 -->
      <div class="result-banner" :class="resultStatus">
        <div class="banner-icon">
          <el-icon v-if="resultStatus === 'accepted'"><CircleCheck /></el-icon>
          <el-icon v-else><CircleClose /></el-icon>
        </div>
        <div class="banner-content">
          <div class="banner-title">{{ getResultText(question.result) }}</div>
          <div class="banner-subtitle">
            得分：<span class="score">{{ question.earnedScore || 0 }}</span> / {{ question.score }} 分
          </div>
        </div>
        <div class="banner-badge">
          <span v-if="resultStatus === 'accepted'">🎉</span>
          <span v-else>💪</span>
        </div>
      </div>

      <!-- 测试用例结果 -->
      <div v-if="question.testCases?.length" class="test-results">
        <div class="results-header">
          <h4><el-icon><List /></el-icon> 测试用例结果</h4>
          <div class="results-summary">
            <span class="passed">{{ passedCount }} 通过</span>
            <span class="divider">/</span>
            <span class="total">{{ sampleCount }} 个样例</span>
          </div>
        </div>

        <div class="test-cards">
          <div
            v-for="(tc, idx) in question.testCases.filter(t => t.sample)"
            :key="tc.id"
            class="test-card"
            :class="{ passed: tc.passed, failed: !tc.passed }"
          >
            <div class="card-header">
              <div class="card-status">
                <el-icon v-if="tc.passed" class="icon-passed"><CircleCheck /></el-icon>
                <el-icon v-else class="icon-failed"><CircleClose /></el-icon>
                <span>测试用例 {{ idx + 1 }}</span>
              </div>
              <el-tag :type="tc.passed ? 'success' : 'danger'" size="small" effect="dark">
                {{ tc.passed ? '通过' : '未通过' }}
              </el-tag>
            </div>

            <div class="card-body">
              <div class="io-section">
                <div class="io-label"><el-icon><Download /></el-icon> 输入</div>
                <pre class="io-code">{{ tc.input }}</pre>
              </div>
              <div class="io-section">
                <div class="io-label"><el-icon><Upload /></el-icon> 期望输出</div>
                <pre class="io-code expected">{{ tc.output }}</pre>
              </div>
              <div v-if="tc.userOutput" class="io-section">
                <div class="io-label"><el-icon><User /></el-icon> 你的输出</div>
                <pre class="io-code user" :class="{ wrong: !tc.passed }">{{ tc.userOutput }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交的代码 -->
      <div v-if="question.userAnswer" class="submitted-section">
        <div class="section-header">
          <h4><el-icon><Document /></el-icon> 提交的代码</h4>
          <el-button text size="small" @click="copyCode">
            <el-icon><CopyDocument /></el-icon>
            复制代码
          </el-button>
        </div>
        <div class="code-block">
          <div class="code-header">
            <span class="lang-badge">{{ getLanguageLabel(question.language) }}</span>
          </div>
          <pre class="code-content">{{ question.userAnswer }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Edit, RefreshRight, VideoPlay, Upload, Download, User, Document,
  CircleCheck, CircleClose, List, CopyDocument
} from '@element-plus/icons-vue'

const props = defineProps({
  question: { type: Object, required: true },
  completed: { type: Boolean, default: false }
})

defineEmits(['run', 'submit-code'])

const languages = [
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'c', label: 'C', icon: '🔧' },
  { value: 'go', label: 'Go', icon: '🐹' }
]

const selectedLanguage = ref(props.question.language || 'cpp')
const codeContent = ref(props.question.userAnswer || '')

const lineCount = computed(() => Math.max(codeContent.value.split('\n').length, 20))

const resultStatus = computed(() => {
  const r = props.question.result
  if (!r) return 'pending'
  if (r === 'Accepted' || r === 'AC') return 'accepted'
  return 'rejected'
})

const sampleCount = computed(() => props.question.testCases?.filter(t => t.sample).length || 0)
const passedCount = computed(() => props.question.testCases?.filter(t => t.sample && t.passed).length || 0)

watch(selectedLanguage, (val) => { props.question.language = val })

const updateCode = () => { props.question.userAnswer = codeContent.value }
const resetCode = () => { codeContent.value = ''; props.question.userAnswer = '' }

const getResultText = (result) => ({
  'Accepted': '🎉 恭喜通过！', 'AC': '🎉 恭喜通过！',
  'Wrong Answer': '答案错误', 'WA': '答案错误',
  'Time Limit Exceeded': '运行超时', 'TLE': '运行超时',
  'Memory Limit Exceeded': '内存超限', 'MLE': '内存超限',
  'Runtime Error': '运行时错误', 'RE': '运行时错误',
  'Compile Error': '编译错误', 'CE': '编译错误'
}[result] || result || '未提交')

const getLanguageLabel = (val) => languages.find(l => l.value === val)?.label || val

const copyCode = () => {
  navigator.clipboard.writeText(props.question.userAnswer)
  ElMessage.success('代码已复制')
}
</script>

<style lang="scss" scoped>
.oj-question {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 编辑器模式
.editor-mode {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;

  .editor-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: linear-gradient(135deg, #2d2d2d, #3a3a3a);
    border-bottom: 1px solid #404040;

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .toolbar-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #409eff, #66b1ff);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon { font-size: 18px; color: white; }
      }

      .toolbar-title { font-size: 16px; font-weight: 600; color: #e0e0e0; }
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;

      .lang-select {
        width: 140px;
        :deep(.el-input__wrapper) {
          background: #404040;
          border: 1px solid #505050;
          box-shadow: none;
        }
        :deep(.el-input__inner) { color: #e0e0e0; }
      }

      .el-button { color: #909399; &:hover { color: #409eff; } }
    }
  }

  .editor-container {
    flex: 1;
    display: flex;
    overflow: hidden;

    .line-numbers {
      width: 50px;
      background: #252526;
      padding: 16px 0;
      text-align: right;
      user-select: none;
      overflow: hidden;

      .line-num {
        height: 24px;
        line-height: 24px;
        padding-right: 12px;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 13px;
        color: #606060;
      }
    }

    .code-editor {
      flex: 1;
      :deep(.el-textarea__inner) {
        height: 100% !important;
        border: none;
        border-radius: 0;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 14px;
        line-height: 24px;
        padding: 16px;
        resize: none;

        &::placeholder { color: #606060; }
      }
    }
  }

  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #252526;
    border-top: 1px solid #404040;

    .footer-info {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #808080;
    }

    .footer-actions {
      display: flex;
      gap: 12px;
    }
  }
}

// 结果模式
.result-mode {
  padding: 24px;
  background: #f5f7fa;
  overflow-y: auto;

  .result-banner {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;

    &.accepted {
      background: linear-gradient(135deg, #67c23a, #85ce61);
      .banner-icon .el-icon { color: white; }
    }

    &.rejected {
      background: linear-gradient(135deg, #f56c6c, #f89898);
      .banner-icon .el-icon { color: white; }
    }

    &.pending {
      background: linear-gradient(135deg, #909399, #b4b4b4);
    }

    .banner-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-icon { font-size: 32px; }
    }

    .banner-content {
      flex: 1;
      .banner-title { font-size: 24px; font-weight: 700; color: white; margin-bottom: 4px; }
      .banner-subtitle { font-size: 16px; color: rgba(255, 255, 255, 0.9); .score { font-weight: 700; } }
    }

    .banner-badge { font-size: 48px; }
  }

  .test-results {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin: 0;
        .el-icon { color: #409eff; }
      }

      .results-summary {
        font-size: 14px;
        .passed { color: #67c23a; font-weight: 600; }
        .divider { color: #dcdfe6; margin: 0 8px; }
        .total { color: #909399; }
      }
    }

    .test-cards {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .test-card {
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #e4e7ed;
        transition: all 0.3s;

        &.passed { border-color: #67c23a; }
        &.failed { border-color: #f56c6c; }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8f9fa;

          .card-status {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #303133;

            .icon-passed { color: #67c23a; font-size: 20px; }
            .icon-failed { color: #f56c6c; font-size: 20px; }
          }
        }

        .card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;

          .io-section {
            .io-label {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              font-weight: 600;
              color: #909399;
              margin-bottom: 8px;
              text-transform: uppercase;
            }

            .io-code {
              margin: 0;
              padding: 12px;
              background: #f5f7fa;
              border-radius: 8px;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 13px;
              line-height: 1.6;
              color: #303133;
              white-space: pre-wrap;
              word-break: break-all;
              border: 1px solid #e4e7ed;

              &.expected { background: #f0f9eb; border-color: #c2e7b0; }
              &.user { background: #ecf5ff; border-color: #b3d8ff; }
              &.wrong { background: #fef0f0; border-color: #fbc4c4; color: #f56c6c; }
            }
          }
        }
      }
    }
  }

  .submitted-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin: 0;
        .el-icon { color: #409eff; }
      }
    }

    .code-block {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e4e7ed;

      .code-header {
        padding: 10px 16px;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;

        .lang-badge {
          padding: 4px 12px;
          background: #409eff;
          color: white;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
      }

      .code-content {
        margin: 0;
        padding: 16px;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 13px;
        line-height: 1.6;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  .lang-icon { font-size: 16px; }
}
</style>
