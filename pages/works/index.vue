<template>
  <div class="works-page">
    <div class="page-header">
      <h1>AIGC作品展示</h1>
      <p class="page-desc">展示同学们用AI创作的精彩作品</p>
    </div>

    <!-- 课程选择 -->
    <div class="course-selector">
      <el-select v-model="selectedLessonId" placeholder="选择课程" @change="loadWorks">
        <el-option
          v-for="lesson in availableLessons"
          :key="lesson.id"
          :label="lesson.title"
          :value="lesson.id"
        />
      </el-select>
    </div>

    <!-- 作品墙展示 -->
    <div class="works-wall" v-if="selectedLessonId && works.length > 0">
      <div class="student-works" v-for="studentWork in works" :key="studentWork.id">
        <div class="student-header">
          <div class="student-info">
            <el-avatar :src="studentWork.avatar" :size="48">
              {{ studentWork.studentName[0] }}
            </el-avatar>
            <div class="student-details">
              <h3>{{ studentWork.studentName }}</h3>
              <p class="lesson-title">{{ studentWork.lessonTitle }}</p>
            </div>
          </div>
        </div>

        <div class="works-grid">
          <div
            v-for="work in studentWork.works"
            :key="work.id"
            class="work-item"
            :class="`work-${work.type}`"
            @click="viewWork(work)"
          >
            <!-- 图片作品 -->
            <div v-if="work.type === 'image'" class="image-work">
              <div class="work-preview">
                <img :src="work.imageUrl" :alt="work.title" />
                <div class="work-overlay">
                  <el-icon class="view-icon"><ZoomIn /></el-icon>
                </div>
              </div>
              <div class="work-info">
                <h4>{{ work.title }}</h4>
                <p>{{ work.description }}</p>
              </div>
            </div>

            <!-- 视频作品 -->
            <div v-else-if="work.type === 'video'" class="video-work">
              <div class="work-preview">
                <div class="video-thumbnail">
                  <img :src="work.thumbnail" :alt="work.title" />
                  <div class="play-button">
                    <el-icon><VideoPlay /></el-icon>
                  </div>
                </div>
                <div class="video-duration">{{ formatDuration(work.duration) }}</div>
              </div>
              <div class="work-info">
                <h4>{{ work.title }}</h4>
                <p>{{ work.description }}</p>
              </div>
            </div>

            <!-- 文章作品 -->
            <div v-else-if="work.type === 'article'" class="article-work">
              <div class="work-preview">
                <div class="article-icon">📝</div>
                <div class="article-thumbnail">
                  <img :src="work.thumbnail" :alt="work.title" />
                </div>
              </div>
              <div class="work-info">
                <h4>{{ work.title }}</h4>
                <p>{{ work.description }}</p>
              </div>
            </div>

            <!-- 音乐作品 -->
            <div v-else-if="work.type === 'music'" class="music-work">
              <div class="work-preview">
                <div class="music-cover">
                  <img :src="work.cover" :alt="work.title" />
                  <div class="music-controls">
                    <el-icon><VideoPlay /></el-icon>
                  </div>
                </div>
                <div class="music-duration">{{ formatDuration(work.duration) }}</div>
              </div>
              <div class="work-info">
                <h4>{{ work.title }}</h4>
                <p>{{ work.description }}</p>
              </div>
            </div>

            <!-- 网页作品 -->
            <div v-else-if="work.type === 'webpage'" class="webpage-work">
              <div class="work-preview">
                <div class="webpage-thumbnail">
                  <img :src="work.thumbnail" :alt="work.title" />
                  <div class="webpage-overlay">
                    <el-icon><Link /></el-icon>
                  </div>
                </div>
              </div>
              <div class="work-info">
                <h4>{{ work.title }}</h4>
                <p>{{ work.description }}</p>
              </div>
            </div>

            <!-- 作品操作 -->
            <div class="work-actions">
              <el-button size="small" type="primary" @click.stop="viewWork(work)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="selectedLessonId && works.length === 0" class="empty-state">
      <el-empty description="该课程还没有同学提交作品" />
    </div>

    <!-- 未选择课程 -->
    <div v-else class="no-course-selected">
      <el-empty description="请选择要查看的课程" />
    </div>

    <!-- 作品详情弹窗 -->
    <el-dialog
      v-model="workDetailVisible"
      :title="selectedWork?.title"
      width="80%"
      destroy-on-close
    >
      <div v-if="selectedWork" class="work-detail">
        <!-- 图片详情 -->
        <div v-if="selectedWork.type === 'image'" class="image-detail">
          <img :src="selectedWork.imageUrl" :alt="selectedWork.title" />
          <div class="work-meta">
            <p><strong>说明：</strong>{{ selectedWork.description }}</p>
            <p><strong>创建时间：</strong>{{ formatDateTime(selectedWork.createdAt) }}</p>
          </div>
        </div>

        <!-- 视频详情 -->
        <div v-else-if="selectedWork.type === 'video'" class="video-detail">
          <div class="video-player">
            <div class="video-placeholder">
              <el-icon size="48px"><VideoPlay /></el-icon>
              <p>视频播放器 (模拟)</p>
            </div>
          </div>
          <div class="work-meta">
            <p><strong>说明：</strong>{{ selectedWork.description }}</p>
            <p><strong>时长：</strong>{{ formatDuration(selectedWork.duration) }}</p>
            <p><strong>创建时间：</strong>{{ formatDateTime(selectedWork.createdAt) }}</p>
          </div>
        </div>

        <!-- 文章详情 -->
        <div v-else-if="selectedWork.type === 'article'" class="article-detail">
          <div class="article-content">
            <h3>{{ selectedWork.title }}</h3>
            <p>{{ selectedWork.description }}</p>
          </div>
          <div class="work-meta">
            <p><strong>创建时间：</strong>{{ formatDateTime(selectedWork.createdAt) }}</p>
            <el-button type="primary">下载PDF</el-button>
          </div>
        </div>

        <!-- 音乐详情 -->
        <div v-else-if="selectedWork.type === 'music'" class="music-detail">
          <div class="music-player">
            <div class="music-cover-large">
              <img :src="selectedWork.cover" :alt="selectedWork.title" />
            </div>
            <div class="music-info">
              <h3>{{ selectedWork.title }}</h3>
              <p>{{ selectedWork.description }}</p>
              <div class="audio-controls">
                <el-button type="primary">
                  <el-icon><VideoPlay /></el-icon>
                  播放
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 网页详情 -->
        <div v-else-if="selectedWork.type === 'webpage'" class="webpage-detail">
          <div class="webpage-preview">
            <iframe :src="selectedWork.webUrl" frameborder="0" width="100%" height="500"></iframe>
          </div>
          <div class="work-meta">
            <p><strong>说明：</strong>{{ selectedWork.description }}</p>
            <el-button type="primary" @click="openWebpage(selectedWork.webUrl)">
              在新窗口打开
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { useWorkApi } from '~/composables/useMockApi'
import coursesData from '~/data/courses.json'

definePageMeta({
  title: 'AIGC作品展示',
  description: '查看同学们的AI创作作品'
})

const workApi = useWorkApi()

// 响应式数据
const selectedLessonId = ref(null)
const works = ref([])
const loading = ref(false)
const workDetailVisible = ref(false)
const selectedWork = ref(null)

// 计算属性
const availableLessons = computed(() => {
  const lessons = []
  coursesData.courses.forEach(course => {
    course.lessons.forEach(lesson => {
      lessons.push({
        id: lesson.id,
        title: `${course.title} - ${lesson.title}`
      })
    })
  })
  return lessons
})

// 方法
const loadWorks = async () => {
  if (!selectedLessonId.value) return

  loading.value = true
  try {
    works.value = await workApi.getLessonWorks(selectedLessonId.value)
  } catch (error) {
    console.error('获取作品数据失败:', error)
    ElMessage.error('获取作品数据失败')
  } finally {
    loading.value = false
  }
}

const viewWork = (work) => {
  selectedWork.value = work
  workDetailVisible.value = true
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

const openWebpage = (url) => {
  window.open(url, '_blank')
}

// 生命周期
onMounted(() => {
  // 默认选择第一个课程
  if (availableLessons.value.length > 0) {
    selectedLessonId.value = availableLessons.value[0].id
    loadWorks()
  }
})
</script>

<style lang="scss" scoped>
.works-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 12px 0;
  }

  .page-desc {
    font-size: 16px;
    color: #606266;
    margin: 0;
  }
}

.course-selector {
  text-align: center;
  margin-bottom: 32px;

  .el-select {
    width: 300px;
  }
}

.works-wall {
  .student-works {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .student-header {
      margin-bottom: 24px;

      .student-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .student-details {
          h3 {
            font-size: 18px;
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
      }
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
  }
}

.work-item {
  background: #f6f8fb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    .work-overlay {
      opacity: 1;
    }
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

    .work-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;

      .view-icon {
        color: white;
        font-size: 32px;
      }
    }
  }

  .work-info {
    padding: 16px;

    h4 {
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
  }

  .work-actions {
    padding: 0 16px 16px;
  }
}

// 特定作品类型样式
.video-work {
  .video-thumbnail {
    position: relative;
    height: 100%;

    .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }

  .video-duration {
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

.article-work {
  .work-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;

    .article-icon {
      position: absolute;
      font-size: 48px;
      opacity: 0.3;
    }

    .article-thumbnail {
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
  }
}

.music-work {
  .music-cover {
    position: relative;
    height: 100%;

    .music-controls {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }

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

.webpage-work {
  .webpage-thumbnail {
    position: relative;
    height: 100%;

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
      color: white;
      font-size: 24px;
    }
  }
}

.empty-state,
.no-course-selected {
  background: white;
  border-radius: 12px;
  padding: 80px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

// 作品详情弹窗样式
.work-detail {
  .image-detail img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .video-detail .video-player {
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 16/9;
    margin-bottom: 16px;

    .video-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }

  .music-detail .music-player {
    display: flex;
    gap: 24px;
    align-items: center;
    margin-bottom: 16px;

    .music-cover-large {
      width: 200px;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .music-info {
      flex: 1;

      h3 {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
      }

      p {
        color: #606266;
        margin: 0 0 20px 0;
        line-height: 1.6;
      }
    }
  }

  .webpage-detail .webpage-preview {
    margin-bottom: 16px;
  }

  .work-meta {
    p {
      color: #606266;
      margin: 0 0 8px 0;
      line-height: 1.6;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .works-page {
    padding: 16px;
  }

  .works-wall .student-works .works-grid {
    grid-template-columns: 1fr;
  }

  .music-detail .music-player {
    flex-direction: column;
    text-align: center;
  }
}
</style>