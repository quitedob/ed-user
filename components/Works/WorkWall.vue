<template>
  <div class="work-wall">
    <div class="wall-header">
      <h3>{{ title }}</h3>
      <div class="wall-controls">
        <el-select v-model="sortBy" placeholder="排序方式" @change="sortWorks">
          <el-option label="最新上传" value="latest" />
          <el-option label="最多点赞" value="likes" />
          <el-option label="最多浏览" value="views" />
        </el-select>
        <el-button-group>
          <el-button :type="viewMode === 'grid' ? 'primary' : ''" @click="viewMode = 'grid'">
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button :type="viewMode === 'list' ? 'primary' : ''" @click="viewMode = 'list'">
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 网格视图 -->
    <div v-if="viewMode === 'grid'" class="grid-view">
      <div
        v-for="studentWork in displayWorks"
        :key="studentWork.id"
        class="student-section"
      >
        <div class="student-header">
          <el-avatar :src="studentWork.avatar" :size="40">
            {{ studentWork.studentName[0] }}
          </el-avatar>
          <div class="student-info">
            <h4>{{ studentWork.studentName }}</h4>
            <p>{{ studentWork.lessonTitle }}</p>
          </div>
        </div>

        <div class="works-container">
          <div
            v-for="work in studentWork.works"
            :key="work.id"
            class="work-card"
            @click="viewWork(work)"
          >
            <div class="work-preview" :class="`work-${work.type}`">
              <!-- 图片预览 -->
              <template v-if="work.type === 'image'">
                <img :src="work.imageUrl" :alt="work.title" />
                <div class="preview-overlay">
                  <el-icon class="preview-icon"><ZoomIn /></el-icon>
                </div>
              </template>

              <!-- 视频预览 -->
              <template v-else-if="work.type === 'video'">
                <div class="video-thumbnail">
                  <img :src="work.thumbnail" :alt="work.title" />
                  <div class="play-overlay">
                    <el-icon><VideoPlay /></el-icon>
                  </div>
                  <div class="duration-badge">{{ formatDuration(work.duration) }}</div>
                </div>
              </template>

              <!-- 文章预览 -->
              <template v-else-if="work.type === 'article'">
                <div class="article-preview">
                  <div class="article-icon">📝</div>
                  <img v-if="work.thumbnail" :src="work.thumbnail" :alt="work.title" />
                </div>
              </template>

              <!-- 音乐预览 -->
              <template v-else-if="work.type === 'music'">
                <div class="music-preview">
                  <img :src="work.cover" :alt="work.title" />
                  <div class="music-overlay">
                    <el-icon><Headphones /></el-icon>
                  </div>
                  <div class="music-duration">{{ formatDuration(work.duration) }}</div>
                </div>
              </template>

              <!-- 网页预览 -->
              <template v-else-if="work.type === 'webpage'">
                <div class="webpage-preview">
                  <img :src="work.thumbnail" :alt="work.title" />
                  <div class="webpage-overlay">
                    <el-icon><Link /></el-icon>
                  </div>
                </div>
              </template>
            </div>

            <div class="work-info">
              <h5>{{ work.title }}</h5>
              <p>{{ work.description }}</p>
              <div class="work-meta">
                <span class="work-type">{{ getWorkTypeName(work.type) }}</span>
                <span class="work-time">{{ formatTime(work.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="list-view">
      <div
        v-for="studentWork in displayWorks"
        :key="studentWork.id"
        class="student-work-item"
      >
        <div class="student-avatar">
          <el-avatar :src="studentWork.avatar" :size="48">
            {{ studentWork.studentName[0] }}
          </el-avatar>
        </div>
        <div class="work-content">
          <div class="student-details">
            <h4>{{ studentWork.studentName }}</h4>
            <p class="lesson-title">{{ studentWork.lessonTitle }}</p>
          </div>
          <div class="works-list">
            <div
              v-for="work in studentWork.works"
              :key="work.id"
              class="work-item"
              @click="viewWork(work)"
            >
              <div class="work-icon">{{ getWorkTypeIcon(work.type) }}</div>
              <div class="work-details">
                <h5>{{ work.title }}</h5>
                <p>{{ work.description }}</p>
                <div class="work-meta">
                  <span class="work-type">{{ getWorkTypeName(work.type) }}</span>
                  <span class="work-time">{{ formatTime(work.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="displayWorks.length === 0" class="empty-state">
      <el-empty :description="emptyDescription" />
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore && displayWorks.length > 0" class="load-more">
      <el-button @click="loadMore" :loading="loading">
        加载更多
      </el-button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '作品墙'
  },
  works: {
    type: Array,
    default: () => []
  },
  lessonId: {
    type: Number,
    default: null
  },
  emptyDescription: {
    type: String,
    default: '还没有同学提交作品'
  }
})

const emit = defineEmits(['view-work', 'load-more'])

// 响应式数据
const viewMode = ref('grid')
const sortBy = ref('latest')
const loading = ref(false)
const hasMore = ref(false) // 模拟是否有更多数据

// 计算属性
const displayWorks = computed(() => {
  let works = [...props.works]

  // 排序
  switch (sortBy.value) {
    case 'latest':
      works.sort((a, b) => new Date(b.works[0]?.createdAt) - new Date(a.works[0]?.createdAt))
      break
    case 'likes':
      works.sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0))
      break
    case 'views':
      works.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
      break
  }

  return works
})

// 方法
const sortWorks = () => {
  // 排序逻辑已在计算属性中处理
}

const viewWork = (work) => {
  emit('view-work', work)
}

const loadMore = () => {
  loading.value = true
  emit('load-more')

  // 模拟加载
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const getWorkTypeIcon = (type) => {
  const icons = {
    article: '📝',
    image: '🖼️',
    video: '🎬',
    music: '🎵',
    webpage: '🌐'
  }
  return icons[type] || '📄'
}

const getWorkTypeName = (type) => {
  const names = {
    article: '文章',
    image: '图片',
    video: '视频',
    music: '音乐',
    webpage: '网页'
  }
  return names[type] || '其他'
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return `${Math.floor(diff / 86400000)}天前`
  }
}
</script>

<style lang="scss" scoped>
.work-wall {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.wall-header {
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

  .wall-controls {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-select {
      width: 140px;
    }
  }
}

// 网格视图
.grid-view {
  .student-section {
    margin-bottom: 32px;

    .student-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;

      .student-info {
        h4 {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 4px 0;
        }

        p {
          font-size: 14px;
          color: #909399;
          margin: 0;
        }
      }
    }

    .works-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
  }
}

.work-card {
  background: #f6f8fb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .work-preview {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-overlay,
    .play-overlay,
    .music-overlay,
    .webpage-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;

      .preview-icon {
        color: white;
        font-size: 32px;
      }
    }

    &:hover .preview-overlay,
    &:hover .play-overlay,
    &:hover .music-overlay,
    &:hover .webpage-overlay {
      opacity: 1;
    }

    .duration-badge,
    .music-duration {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .work-image {
    .preview-overlay {
      background: rgba(0, 0, 0, 0.2);
    }
  }

  .work-video {
    .video-thumbnail {
      position: relative;
      height: 100%;

      .play-overlay {
        background: rgba(0, 0, 0, 0.5);

        .el-icon {
          color: white;
          font-size: 48px;
        }
      }
    }
  }

  .work-article {
    .article-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #f0f2f5;
      position: relative;

      .article-icon {
        position: absolute;
        font-size: 48px;
        opacity: 0.3;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        z-index: 1;
      }
    }
  }

  .work-music {
    .music-preview {
      position: relative;
      height: 100%;

      .music-overlay {
        background: rgba(0, 0, 0, 0.4);

        .el-icon {
          color: white;
          font-size: 32px;
        }
      }
    }
  }

  .work-webpage {
    .webpage-preview {
      position: relative;
      height: 100%;

      .webpage-overlay {
        background: rgba(0, 0, 0, 0.3);

        .el-icon {
          color: white;
          font-size: 32px;
        }
      }
    }
  }

  .work-info {
    padding: 16px;

    h5 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    p {
      font-size: 14px;
      color: #606266;
      margin: 0 0 12px 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .work-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #909399;

      .work-type {
        background: #ecf5ff;
        color: #409eff;
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
  }
}

// 列表视图
.list-view {
  .student-work-item {
    display: flex;
    gap: 16px;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .student-avatar {
      flex-shrink: 0;
    }

    .work-content {
      flex: 1;

      .student-details {
        margin-bottom: 16px;

        h4 {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 4px 0;
        }

        .lesson-title {
          font-size: 14px;
          color: #909399;
          margin: 0;
        }
      }

      .works-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
  }

  .work-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: #f6f8fb;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #ecf5ff;
    }

    .work-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .work-details {
      flex: 1;

      h5 {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 13px;
        color: #606266;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }

      .work-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #909399;

        .work-type {
          background: #ecf5ff;
          color: #409eff;
          padding: 1px 4px;
          border-radius: 3px;
        }
      }
    }
  }
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.load-more {
  text-align: center;
  margin-top: 32px;
}

// 响应式设计
@media (max-width: 768px) {
  .work-wall {
    padding: 16px;
  }

  .wall-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;

    .wall-controls {
      width: 100%;
      justify-content: space-between;
    }
  }

  .grid-view .student-section .works-container {
    grid-template-columns: 1fr;
  }

  .list-view .student-work-item {
    flex-direction: column;
    gap: 12px;

    .student-avatar {
      align-self: center;
    }
  }
}
</style>