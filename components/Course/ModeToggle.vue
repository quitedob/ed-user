<template>
  <div class="mode-toggle">
    <div class="toggle-container">
      <div class="toggle-label">
        <el-icon class="mode-icon"><Switch /></el-icon>
        <span>模式选择：</span>
      </div>

      <!-- 切换按钮组 -->
      <el-radio-group v-model="currentMode" @change="onModeChange" class="mode-group">
        <el-radio-button
          v-if="hasLearningMode"
          value="learn"
          :disabled="!isLearningModeAvailable"
        >
          <el-icon><VideoPlay /></el-icon>
          学习模式
        </el-radio-button>
        <el-radio-button
          v-if="hasExerciseMode"
          value="exercise"
          :disabled="!isExerciseModeAvailable"
        >
          <el-icon><EditPen /></el-icon>
          练习模式
        </el-radio-button>
      </el-radio-group>

      <!-- 模式状态指示器 -->
      <div class="mode-status" :class="`mode-${currentMode}`">
        <el-icon class="status-icon">
          <VideoPlay v-if="currentMode === 'learn'" />
          <EditPen v-else-if="currentMode === 'exercise'" />
        </el-icon>
        <span class="status-text">{{ getModeStatusText() }}</span>
      </div>
    </div>

    <!-- 模式说明信息 -->
    <div v-if="showModeInfo" class="mode-info">
      <div class="info-header">
        <el-icon><InfoFilled /></el-icon>
        <span>{{ getModeInfoTitle() }}</span>
      </div>
      <div class="info-content">
        {{ getModeInfoContent() }}
      </div>

      <!-- 练习进度信息 -->
      <div v-if="currentMode === 'exercise' && exerciseProgress" class="exercise-progress-info">
        <div class="progress-item">
          <span>完成状态：</span>
          <el-tag :type="getProgressType(exerciseProgress.submitted)" size="small">
            {{ exerciseProgress.submitted ? '已提交' : '未完成' }}
          </el-tag>
        </div>
        <div v-if="exerciseProgress.submitted" class="progress-item">
          <span>得分：</span>
          <span class="score-text">{{ exerciseProgress.score }}/{{ exerciseProgress.maxScore }}分</span>
        </div>
        <div class="progress-item">
          <span>完成度：</span>
          <el-progress
            :percentage="exerciseProgress.percentage"
            :show-text="false"
            :stroke-width="6"
            class="mini-progress"
          />
          <span class="percentage-text">{{ exerciseProgress.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- 模式切换提示 -->
    <div v-if="showSwitchHint" class="switch-hint">
      <el-icon><ArrowRight /></el-icon>
      <span>{{ getSwitchHintText() }}</span>
    </div>
  </div>
</template>

<script setup>
import {
  Switch,
  VideoPlay,
  EditPen,
  InfoFilled,
  ArrowRight
} from '@element-plus/icons-vue'

const props = defineProps({
  // 当前模式
  modelValue: {
    type: String,
    default: 'learn'
  },
  // 可用模式
  availableModes: {
    type: Array,
    default: () => ['learn', 'exercise']
  },
  // 练习进度信息
  exerciseProgress: {
    type: Object,
    default: null
  },
  // 章节信息
  sectionInfo: {
    type: Object,
    default: () => ({})
  },
  // 是否显示模式信息
  showModeInfo: {
    type: Boolean,
    default: true
  },
  // 是否显示切换提示
  showSwitchHint: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'mode-change'])

const currentMode = ref(props.modelValue)

// 计算属性
const hasLearningMode = computed(() => props.availableModes.includes('learn'))
const hasExerciseMode = computed(() => props.availableModes.includes('exercise'))

const isLearningModeAvailable = computed(() => {
  // 学习模式通常总是可用的
  return true
})

const isExerciseModeAvailable = computed(() => {
  // 检查是否有练习配置
  return props.sectionInfo.sectionExercise?.enabled
})

// 方法
const onModeChange = (newMode) => {
  emit('update:modelValue', newMode)
  emit('mode-change', newMode)
}

const getModeStatusText = () => {
  if (currentMode.value === 'learn') {
    return '正在学习课程内容'
  } else if (currentMode.value === 'exercise') {
    return '正在完成练习题'
  }
  return '未知模式'
}

const getModeInfoTitle = () => {
  if (currentMode.value === 'learn') {
    return '学习模式'
  } else if (currentMode.value === 'exercise') {
    return '练习模式'
  }
  return '模式信息'
}

const getModeInfoContent = () => {
  if (currentMode.value === 'learn') {
    return '在此模式下，您可以观看视频、查看课件和课程材料，专注于学习和理解课程内容。'
  } else if (currentMode.value === 'exercise') {
    return '在此模式下，您可以完成与本节内容相关的练习题，检验学习效果并获得即时反馈。'
  }
  return ''
}

const getProgressType = (submitted) => {
  return submitted ? 'success' : 'info'
}

const getSwitchHintText = () => {
  if (currentMode.value === 'learn' && hasExerciseMode.value) {
    return '完成学习后，可以切换到练习模式巩固知识'
  } else if (currentMode.value === 'exercise' && hasLearningMode.value) {
    return '需要复习时，可以切换回学习模式重新查看内容'
  }
  return ''
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  currentMode.value = newValue
})

watch(() => props.availableModes, () => {
  // 如果当前模式不在可用模式中，切换到第一个可用模式
  if (!props.availableModes.includes(currentMode.value)) {
    const firstAvailable = props.availableModes[0]
    if (firstAvailable) {
      onModeChange(firstAvailable)
    }
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.mode-toggle {
  margin-bottom: 24px;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;

  .toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #606266;
    font-weight: 500;
    white-space: nowrap;

    .mode-icon {
      color: #409eff;
    }
  }

  .mode-group {
    flex: 1;

    :deep(.el-radio-button__inner) {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;

      .el-icon {
        margin-right: 0;
      }
    }
  }

  .mode-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;

    &.mode-learn {
      background: #ecf5ff;
      color: #409eff;

      .status-icon {
        color: #409eff;
      }
    }

    &.mode-exercise {
      background: #f0f9ff;
      color: #67c23a;

      .status-icon {
        color: #67c23a;
      }
    }

    .status-text {
      font-weight: 500;
    }
  }
}

.mode-info {
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;

  .info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #409eff;
    font-weight: 600;
  }

  .info-content {
    color: #606266;
    line-height: 1.6;
    font-size: 14px;
  }

  .exercise-progress-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f2f5;

    .progress-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      span:first-child {
        color: #606266;
        font-size: 14px;
        min-width: 70px;
      }

      .score-text {
        color: #e6a23c;
        font-weight: 600;
      }

      .mini-progress {
        flex: 1;
        max-width: 100px;
      }

      .percentage-text {
        color: #409eff;
        font-weight: 600;
        font-size: 14px;
        min-width: 40px;
      }
    }
  }
}

.switch-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 6px;
  color: #409eff;
  font-size: 13px;

  .el-icon {
    font-size: 14px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .toggle-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    .toggle-label {
      justify-content: center;
    }

    .mode-group {
      :deep(.el-radio-button__inner) {
        padding: 12px 16px;
        font-size: 14px;
      }
    }

    .mode-status {
      justify-content: center;
    }
  }

  .mode-info {
    .exercise-progress-info {
      .progress-item {
        flex-wrap: wrap;

        span:first-child {
          min-width: auto;
        }
      }
    }
  }

  .switch-hint {
    justify-content: center;
    text-align: center;
  }
}

// 动画效果
.mode-toggle {
  .toggle-container {
    transition: all 0.3s ease;

    &:hover {
      border-color: #c6e2ff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
    }
  }

  .mode-status {
    transition: all 0.3s ease;
  }

  .mode-info {
    animation: slideDown 0.3s ease;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>