<template>
  <div
    class="completed-item-card"
    :class="[`completed-item-card--${item.type}`, { 'completed-item-card--clickable': clickable }]"
    @click="handleClick"
  >
    <!-- 头部信息 -->
    <div class="completed-item-header">
      <div class="item-info">
        <h4 class="item-title">{{ item.title }}</h4>
        <div class="item-badges">
          <!-- 类型标签 -->
          <el-tag :type="getTypeTagType(item.type)" size="small">
            {{ getTypeLabel(item.type) }}
          </el-tag>

          <!-- 章节/章节信息（如果有） -->
          <el-tag v-if="item.chapterTitle" type="info" size="small">
            {{ item.chapterTitle }}
          </el-tag>

          <!-- 章节编号（如果有） -->
          <el-tag v-if="item.sectionNumber" type="primary" size="small">
            {{ item.sectionNumber }}
          </el-tag>
        </div>
      </div>

      <!-- 状态/分数信息 -->
      <div class="item-status">
        <!-- 考试分数 -->
        <div v-if="item.type === 'exam' && item.score !== undefined" class="score-info">
          <el-tag
            :type="item.passed ? 'success' : 'danger'"
            class="score-tag"
          >
            {{ item.score }}/{{ item.totalScore }}分
          </el-tag>
          <span class="pass-status">
            {{ item.passed ? '通过' : '未通过' }}
          </span>
        </div>

        <!-- 作业状态 -->
        <el-tag v-else-if="item.type === 'homework'" type="success" size="small">
          已完成
        </el-tag>
      </div>
    </div>

    <!-- 元信息 -->
    <div class="item-meta">
      <div class="meta-left">
        <!-- 提交时间 -->
        <span class="meta-item">
          <el-icon><Clock /></el-icon>
          {{ getSubmitTime(item.submitTime || item.completeTime) }}
        </span>

        <!-- 题目数量 -->
        <span v-if="item.questionCount" class="meta-item">
          <el-icon><Document /></el-icon>
          {{ item.questionCount }}题
        </span>

        <!-- 考试时长（如果是考试） -->
        <span v-if="item.type === 'exam' && item.duration" class="meta-item">
          <el-icon><Timer /></el-icon>
          考试时长: {{ item.duration }}
        </span>
      </div>

      <!-- 操作按钮 -->
      <div class="item-actions">
        <el-button
          v-if="item.type === 'exam'"
          size="small"
          type="primary"
          @click.stop="viewDetail(item)"
        >
          查看详情
        </el-button>
        <el-button
          v-else-if="item.type === 'homework'"
          size="small"
          type="primary"
          @click.stop="viewDetail(item)"
        >
          查看作业
        </el-button>
      </div>
    </div>

    <!-- 描述信息 -->
    <div v-if="item.description" class="item-description">
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { Clock, Document, Timer } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  // 项目数据
  item: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.title && value.type
    }
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['click', 'view-detail'])

// 方法
const handleClick = () => {
  if (props.clickable) {
    emit('click', props.item)
  }
}

const viewDetail = (item) => {
  emit('view-detail', item)
}

const getTypeLabel = (type) => {
  const labels = {
    exam: '考试',
    homework: '作业',
    chapter_homework: '章节作业'
  }
  return labels[type] || '未知'
}

const getTypeTagType = (type) => {
  const types = {
    exam: 'warning',
    homework: 'success',
    chapter_homework: 'info'
  }
  return types[type] || 'info'
}

const getSubmitTime = (time) => {
  if (!time) return ''

  // 如果时间格式是完整的时间戳，返回格式化的时间
  if (time.includes(':') && time.includes('-')) {
    return time
  }

  // 否则返回原始时间
  return time
}
</script>

<style lang="scss" scoped>
.completed-item-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
  }

  &--clickable {
    cursor: pointer;
  }

  &--exam {
    border-left: 4px solid #e6a23c;

    &:hover {
      border-left-color: #409eff;
    }
  }

  &--homework {
    border-left: 4px solid #67c23a;

    &:hover {
      border-left-color: #409eff;
    }
  }

  &--chapter_homework {
    border-left: 4px solid #909399;

    &:hover {
      border-left-color: #409eff;
    }
  }

  // 头部区域
  .completed-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    .item-info {
      flex: 1;

      .item-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }

      .item-badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .el-tag {
          font-size: 11px;
        }
      }
    }

    .item-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      margin-left: 16px;

      .score-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;

        .score-tag {
          font-weight: 600;
        }

        .pass-status {
          font-size: 12px;
          color: #606266;
        }
      }
    }
  }

  // 元信息区域
  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .meta-left {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #606266;

        .el-icon {
          font-size: 14px;
        }
      }
    }

    .item-actions {
      display: flex;
      gap: 8px;
    }
  }

  // 描述区域
  .item-description {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    p {
      font-size: 14px;
      color: #606266;
      line-height: 1.5;
      margin: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .completed-item-card {
    padding: 16px;

    .completed-item-header {
      flex-direction: column;
      gap: 12px;

      .item-status {
        margin-left: 0;
        align-items: flex-start;
      }
    }

    .item-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .meta-left {
        width: 100%;
      }

      .item-actions {
        width: 100%;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>