<template>
  <div class="progress-tracker">
    <div class="progress-header">
      <h3>学习进度</h3>
      <div class="overall-progress">
        <span class="progress-text">{{ overallProgress }}% 完成</span>
        <el-progress
          :percentage="overallProgress"
          :show-text="false"
          :stroke-width="8"
          color="#67c23a"
        />
      </div>
    </div>

    <div class="progress-details">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-number">{{ completedLessons }}</div>
            <div class="stat-label">已完成课时</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-number">{{ formatTime(totalStudyTime) }}</div>
            <div class="stat-label">学习时长</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-number">{{ streakDays }}</div>
            <div class="stat-label">连续学习天数</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-number">{{ averageScore }}</div>
            <div class="stat-label">平均分数</div>
          </div>
        </div>
      </div>

      <!-- 课时进度列表 -->
      <div class="lesson-progress">
        <h4>课时进度详情</h4>
        <div class="lesson-list">
          <div
            v-for="lesson in lessons"
            :key="lesson.id"
            class="lesson-item"
            :class="getLessonStatusClass(lesson)"
          >
            <div class="lesson-icon">
              <el-icon v-if="lesson.status === 'completed'" color="#67c23a">
                <Check />
              </el-icon>
              <el-icon v-else-if="lesson.status === 'in-progress'" color="#409eff">
                <Loading />
              </el-icon>
              <el-icon v-else color="#909399">
                <Clock />
              </el-icon>
            </div>
            <div class="lesson-info">
              <div class="lesson-title">{{ lesson.title }}</div>
              <div class="lesson-meta">
                <span class="lesson-duration">时长: {{ formatTime(lesson.duration) }}</span>
                <span class="lesson-progress-text">进度: {{ lesson.progress }}%</span>
              </div>
            </div>
            <div class="lesson-actions">
              <el-button
                v-if="lesson.status === 'not-started'"
                size="small"
                type="primary"
                @click="startLesson(lesson)"
              >
                开始学习
              </el-button>
              <el-button
                v-else-if="lesson.status === 'in-progress'"
                size="small"
                type="primary"
                @click="continueLesson(lesson)"
              >
                继续学习
              </el-button>
              <el-button
                v-else
                size="small"
                type="success"
                @click="reviewLesson(lesson)"
              >
                复习
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习建议 -->
      <div class="study-suggestions" v-if="suggestions.length > 0">
        <h4>学习建议</h4>
        <div class="suggestion-list">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="suggestion-item"
          >
            <div class="suggestion-icon">{{ suggestion.icon }}</div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-desc">{{ suggestion.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就徽章 -->
    <div class="achievements" v-if="achievements.length > 0">
      <h4>获得成就</h4>
      <div class="achievement-grid">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="achievement-item"
          :title="achievement.description"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-name">{{ achievement.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  courseId: {
    type: Number,
    required: true
  },
  lessons: {
    type: Array,
    default: () => []
  },
  userProgress: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['start-lesson', 'continue-lesson', 'review-lesson'])

// 计算属性
const overallProgress = computed(() => {
  if (props.lessons.length === 0) return 0
  const totalProgress = props.lessons.reduce((sum, lesson) => sum + lesson.progress, 0)
  return Math.round(totalProgress / props.lessons.length)
})

const completedLessons = computed(() => {
  return props.lessons.filter(lesson => lesson.progress >= 100).length
})

const totalStudyTime = computed(() => {
  return props.lessons.reduce((sum, lesson) => sum + (lesson.watchTime || 0), 0)
})

const streakDays = ref(7) // 模拟连续学习天数
const averageScore = ref(85) // 模拟平均分数

// 学习建议
const suggestions = computed(() => {
  const suggestions = []

  if (overallProgress.value < 30) {
    suggestions.push({
      id: 1,
      icon: '🚀',
      title: '加油开始',
      description: '你刚开始学习，建议每天坚持学习30分钟'
    })
  } else if (overallProgress.value < 70) {
    suggestions.push({
      id: 2,
      icon: '💡',
      title: '保持节奏',
      description: '你的进度不错，继续保持学习节奏'
    })
  } else {
    suggestions.push({
      id: 3,
      icon: '🎉',
      title: '即将完成',
      description: '你快要完成课程了，加油冲刺！'
    })
  }

  // 根据学习时长提供建议
  if (totalStudyTime.value < 3600) {
    suggestions.push({
      id: 4,
      icon: '⏰',
      title: '增加学习时间',
      description: '建议每天至少学习1小时以获得更好的效果'
    })
  }

  return suggestions
})

// 成就徽章
const achievements = computed(() => {
  const achievements = []

  if (completedLessons.value >= 1) {
    achievements.push({
      id: 1,
      icon: '🎯',
      name: '初学者',
      description: '完成第一个课时'
    })
  }

  if (completedLesstons.value >= 5) {
    achievements.push({
      id: 2,
      icon: '🌟',
      name: '勤奋学者',
      description: '完成5个课时'
    })
  }

  if (streakDays.value >= 7) {
    achievements.push({
      id: 3,
      icon: '🔥',
      name: '坚持者',
      description: '连续学习7天'
    })
  }

  if (overallProgress.value >= 100) {
    achievements.push({
      id: 4,
      icon: '🏆',
      name: '课程大师',
      description: '完成全部课程'
    })
  }

  return achievements
})

// 方法
const getLessonStatusClass = (lesson) => {
  if (lesson.progress >= 100) return 'completed'
  if (lesson.progress > 0) return 'in-progress'
  return 'not-started'
}

const formatTime = (seconds) => {
  if (!seconds) return '0分钟'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

const startLesson = (lesson) => {
  emit('start-lesson', lesson)
}

const continueLesson = (lesson) => {
  emit('continue-lesson', lesson)
}

const reviewLesson = (lesson) => {
  emit('review-lesson', lesson)
}
</script>

<style lang="scss" scoped>
.progress-tracker {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }

  .overall-progress {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;

    .progress-text {
      font-size: 16px;
      font-weight: 600;
      color: #67c23a;
    }

    .el-progress {
      width: 200px;
    }
  }
}

.progress-details {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #f6f8fb;
    border-radius: 12px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 32px;
    }

    .stat-info {
      .stat-number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        line-height: 1;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}

.lesson-progress {
  margin-bottom: 32px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
  }

  .lesson-list {
    .lesson-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f6f8fb;
      }

      &.completed {
        background-color: #f0f9ff;
        border-left: 4px solid #67c23a;
      }

      &.in-progress {
        background-color: #ecf5ff;
        border-left: 4px solid #409eff;
      }

      .lesson-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .lesson-info {
        flex: 1;

        .lesson-title {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 4px;
        }

        .lesson-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #909399;
        }
      }

      .lesson-actions {
        flex-shrink: 0;
      }
    }
  }
}

.study-suggestions {
  margin-bottom: 32px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
  }

  .suggestion-list {
    .suggestion-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #fffbf0;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 4px solid #e6a23c;

      .suggestion-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .suggestion-content {
        .suggestion-title {
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }

        .suggestion-desc {
          font-size: 12px;
          color: #606266;
          line-height: 1.5;
        }
      }
    }
  }
}

.achievements {
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
  }

  .achievement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px;

    .achievement-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 8px;
      background: #f0f9ff;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
      }

      .achievement-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .achievement-name {
        font-size: 12px;
        font-weight: 500;
        color: #303133;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .progress-tracker {
    padding: 16px;
  }

  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    .overall-progress {
      align-items: flex-start;

      .el-progress {
        width: 100%;
      }
    }
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .stat-item {
      padding: 16px;

      .stat-icon {
        font-size: 24px;
      }

      .stat-info .stat-number {
        font-size: 20px;
      }
    }
  }

  .lesson-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .lesson-actions {
      width: 100%;

      .el-button {
        width: 100%;
      }
    }
  }

  .achievement-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>