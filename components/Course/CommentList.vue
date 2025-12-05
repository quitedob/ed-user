<template>
  <div class="comment-list">
    <div class="comment-input">
      <el-input
        v-model="newComment"
        type="textarea"
        :rows="3"
        placeholder="发表你的看法..."
        maxlength="500"
        show-word-limit
      />
      <el-button
        type="primary"
        size="small"
        @click="submitComment"
        :loading="submitting"
        :disabled="!newComment.trim()"
      >
        发表评论
      </el-button>
    </div>

    <div class="comments">
      <div v-if="comments.length === 0" class="empty-state">
        <el-icon :size="48" color="#c0c4cc"><ChatDotRound /></el-icon>
        <p>暂无评论，快来发表第一条评论吧！</p>
      </div>

      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <el-avatar :size="36" :src="comment.userAvatar" />
        <div class="comment-content">
          <div class="comment-header">
            <span class="username">{{ comment.userName }}</span>
            <span class="time">{{ formatTime(comment.createTime) }}</span>
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-actions">
            <el-button text size="small" @click="likeComment(comment.id)">
              <el-icon><Star /></el-icon>
              {{ comment.likes > 0 ? comment.likes : '点赞' }}
            </el-button>
            <el-button text size="small" @click="replyComment(comment.id)">
              <el-icon><ChatDotRound /></el-icon>
              回复
            </el-button>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.replies && comment.replies.length > 0" class="replies">
            <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
              <el-avatar :size="28" :src="reply.userAvatar" />
              <div class="reply-content">
                <div class="reply-header">
                  <span class="username">{{ reply.userName }}</span>
                  <span class="time">{{ formatTime(reply.createTime) }}</span>
                </div>
                <div class="reply-text">{{ reply.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="load-more">
      <el-button text @click="loadMore" :loading="loading">
        加载更多评论
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ChatDotRound, Star } from '@element-plus/icons-vue'

const props = defineProps({
  courseId: {
    type: Number,
    required: true
  },
  sectionId: {
    type: Number,
    required: true
  }
})

const newComment = ref('')
const submitting = ref(false)
const loading = ref(false)
const hasMore = ref(false)

// 模拟评论数据
const comments = ref([
  {
    id: 1,
    userName: '张同学',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    content: '这节课讲得很清楚，老师的例子很生动！',
    createTime: '2024-11-01 14:30:00',
    likes: 5,
    replies: [
      {
        id: 11,
        userName: '李同学',
        userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: '同意，我也觉得很有帮助',
        createTime: '2024-11-01 15:00:00'
      }
    ]
  },
  {
    id: 2,
    userName: '王同学',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    content: '有个地方没太理解，能再详细讲讲吗？',
    createTime: '2024-11-01 16:20:00',
    likes: 2,
    replies: []
  }
])

const submitComment = async () => {
  if (!newComment.value.trim()) return

  submitting.value = true
  try {
    // TODO: 调用API提交评论
    // await submitCommentApi(props.courseId, props.sectionId, newComment.value)

    // 模拟添加评论
    comments.value.unshift({
      id: Date.now(),
      userName: '我',
      userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      content: newComment.value,
      createTime: new Date().toISOString(),
      likes: 0,
      replies: []
    })

    newComment.value = ''
    ElMessage.success('评论发表成功')
  } catch (error) {
    ElMessage.error('评论发表失败')
  } finally {
    submitting.value = false
  }
}

const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.likes = (comment.likes || 0) + 1
    ElMessage.success('点赞成功')
  }
}

const replyComment = (commentId) => {
  ElMessage.info('回复功能开发中...')
}

const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    hasMore.value = false
  }, 1000)
}

const formatTime = (timeStr) => {
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return time.toLocaleDateString('zh-CN')
}
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-input {
    margin-bottom: 20px;

    .el-textarea {
      margin-bottom: 12px;
    }

    .el-button {
      width: 100%;
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #909399;

    p {
      margin-top: 12px;
      font-size: 14px;
    }
  }

  .comments {
    .comment-item {
      display: flex;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid #f0f2f5;

      &:last-child {
        border-bottom: none;
      }

      .comment-content {
        flex: 1;
        min-width: 0;

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .username {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
          }

          .time {
            font-size: 12px;
            color: #909399;
          }
        }

        .comment-text {
          font-size: 14px;
          line-height: 1.6;
          color: #606266;
          margin-bottom: 8px;
          word-break: break-word;
        }

        .comment-actions {
          display: flex;
          gap: 16px;

          .el-button {
            padding: 0;
            height: auto;
            color: #909399;

            &:hover {
              color: #409eff;
            }
          }
        }

        .replies {
          margin-top: 12px;
          padding-left: 12px;
          border-left: 2px solid #f0f2f5;

          .reply-item {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            .reply-content {
              flex: 1;
              min-width: 0;

              .reply-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;

                .username {
                  font-size: 13px;
                  font-weight: 600;
                  color: #303133;
                }

                .time {
                  font-size: 11px;
                  color: #909399;
                }
              }

              .reply-text {
                font-size: 13px;
                line-height: 1.5;
                color: #606266;
                word-break: break-word;
              }
            }
          }
        }
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 16px 0;
  }
}
</style>
