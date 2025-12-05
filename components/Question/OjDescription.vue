<template>
  <div class="oj-description">
    <!-- 题目标题卡片 -->
    <div class="title-card">
      <div class="title-icon">
        <el-icon><Document /></el-icon>
      </div>
      <h2 class="oj-title">{{ question.title }}</h2>
    </div>

    <!-- 元数据徽章 -->
    <div class="meta-badges">
      <div class="badge time">
        <el-icon><Clock /></el-icon>
        <span class="badge-label">时间限制</span>
        <span class="badge-value">{{ question.timeLimit }}ms</span>
      </div>
      <div class="badge memory">
        <el-icon><Cpu /></el-icon>
        <span class="badge-label">内存限制</span>
        <span class="badge-value">{{ question.memoryLimit }}MB</span>
      </div>
      <div v-if="question.difficulty !== undefined" class="badge difficulty" :class="`level-${question.difficulty}`">
        <el-icon><TrendCharts /></el-icon>
        <span class="badge-label">难度</span>
        <span class="badge-value">{{ getDifficultyText(question.difficulty) }}</span>
      </div>
    </div>

    <!-- 标签 -->
    <div v-if="question.tags?.length" class="tags-section">
      <el-tag v-for="tag in question.tags" :key="tag.id" :color="tag.color" effect="dark" round>
        {{ tag.name }}
      </el-tag>
    </div>

    <!-- 题目描述 -->
    <div class="content-section">
      <div class="section-header">
        <div class="section-icon"><el-icon><Reading /></el-icon></div>
        <h3>题目描述</h3>
      </div>
      <div class="section-body" v-html="question.description"></div>
    </div>

    <!-- 输入格式 -->
    <div class="content-section">
      <div class="section-header">
        <div class="section-icon input"><el-icon><Download /></el-icon></div>
        <h3>输入格式</h3>
      </div>
      <div class="section-body" v-html="question.input"></div>
    </div>

    <!-- 输出格式 -->
    <div class="content-section">
      <div class="section-header">
        <div class="section-icon output"><el-icon><Upload /></el-icon></div>
        <h3>输出格式</h3>
      </div>
      <div class="section-body" v-html="question.output"></div>
    </div>

    <!-- 示例 -->
    <div v-if="question.examples" class="content-section examples">
      <div class="section-header">
        <div class="section-icon example"><el-icon><List /></el-icon></div>
        <h3>示例</h3>
      </div>
      <div class="examples-list">
        <div v-for="(example, idx) in parseExamples(question.examples)" :key="idx" class="example-card">
          <div class="example-header">
            <span class="example-num">示例 {{ idx + 1 }}</span>
            <el-button size="small" text @click="copyExample(example)">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <div class="example-content">
            <div class="io-panel input-panel">
              <div class="panel-label"><el-icon><Download /></el-icon> 输入</div>
              <pre class="panel-code">{{ example.input }}</pre>
            </div>
            <div class="io-panel output-panel">
              <div class="panel-label"><el-icon><Upload /></el-icon> 输出</div>
              <pre class="panel-code">{{ example.output }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示 -->
    <div v-if="question.hint" class="content-section hint">
      <div class="section-header">
        <div class="section-icon hint"><el-icon><InfoFilled /></el-icon></div>
        <h3>提示</h3>
      </div>
      <div class="hint-body" v-html="question.hint"></div>
    </div>
  </div>
</template>

<script setup>
import { Clock, Cpu, TrendCharts, Reading, Download, Upload, List, CopyDocument, InfoFilled, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineProps({
  question: { type: Object, required: true }
})

const getDifficultyText = (d) => ({ 0: '入门', 1: '简单', 2: '中等', 3: '困难', 4: '地狱' }[d] || '未知')

const parseExamples = (text) => {
  if (!text) return []
  const parts = text.split(/Input:|输入:|Output:|输出:/i).filter(p => p.trim())
  const examples = []
  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) examples.push({ input: parts[i].trim(), output: parts[i + 1].trim() })
  }
  return examples
}

const copyExample = (example) => {
  navigator.clipboard.writeText(example.input)
  ElMessage.success('已复制输入内容')
}
</script>

<style lang="scss" scoped>
.oj-description {
  .title-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    margin-bottom: 20px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);

    .title-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-icon { font-size: 24px; color: white; }
    }

    .oj-title {
      font-size: 22px;
      font-weight: 700;
      color: white;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  .meta-badges {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;

    .badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;

      &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); }

      .el-icon { font-size: 18px; }
      .badge-label { font-size: 12px; color: #909399; }
      .badge-value { font-size: 14px; font-weight: 600; }

      &.time {
        border-left: 4px solid #409eff;
        .el-icon, .badge-value { color: #409eff; }
      }
      &.memory {
        border-left: 4px solid #67c23a;
        .el-icon, .badge-value { color: #67c23a; }
      }
      &.difficulty {
        &.level-0, &.level-1 { border-left: 4px solid #67c23a; .el-icon, .badge-value { color: #67c23a; } }
        &.level-2 { border-left: 4px solid #e6a23c; .el-icon, .badge-value { color: #e6a23c; } }
        &.level-3, &.level-4 { border-left: 4px solid #f56c6c; .el-icon, .badge-value { color: #f56c6c; } }
      }
    }
  }

  .tags-section {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    .el-tag { font-weight: 500; }
  }

  .content-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;

    &:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f2f5;

      .section-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #409eff, #66b1ff);
        .el-icon { font-size: 18px; color: white; }

        &.input { background: linear-gradient(135deg, #67c23a, #85ce61); }
        &.output { background: linear-gradient(135deg, #e6a23c, #f0b659); }
        &.example { background: linear-gradient(135deg, #909399, #a6a9ad); }
        &.hint { background: linear-gradient(135deg, #f56c6c, #f89898); }
      }

      h3 { font-size: 16px; font-weight: 600; color: #303133; margin: 0; }
    }

    .section-body {
      font-size: 14px;
      line-height: 1.9;
      color: #606266;
    }

    &.hint .hint-body {
      padding: 16px;
      background: linear-gradient(135deg, #fff9e6, #fff3cd);
      border-radius: 10px;
      border-left: 4px solid #e6a23c;
      font-size: 14px;
      line-height: 1.8;
      color: #856404;
    }
  }

  .examples-list {
    .example-card {
      background: #f8f9fa;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 12px;

      &:last-child { margin-bottom: 0; }

      .example-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #ebeef5;

        .example-num { font-size: 14px; font-weight: 600; color: #409eff; }
      }

      .example-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: #e4e7ed;

        @media (max-width: 600px) { grid-template-columns: 1fr; }

        .io-panel {
          background: white;
          padding: 12px 16px;

          .panel-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            color: #909399;
            margin-bottom: 8px;
            text-transform: uppercase;
            .el-icon { font-size: 14px; }
          }

          .panel-code {
            margin: 0;
            padding: 12px;
            background: #1e1e1e;
            border-radius: 8px;
            font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #d4d4d4;
            white-space: pre-wrap;
            word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
