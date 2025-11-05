<template>
  <div class="chapter-section-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <el-button @click="goBack" :icon="ArrowLeft" text>返回课程</el-button>
      <h1 class="page-title">{{ currentSection?.title || '章节学习' }}</h1>
      <div class="nav-actions">
        <el-button type="primary" @click="goToPractice" :icon="EditPen">
          前往练习
        </el-button>
      </div>
    </div>

    <div class="page-layout">
      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- 学习进度状态 -->
        <div class="section-status-bar" v-if="currentSection?.completed">
          <el-alert
            title="任务点已完成"
            type="success"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 视频播放区域 -->
        <div class="video-section" v-if="hasVideo">
          <div class="video-container">
            <div class="video-player">
              <!-- 这里集成实际的视频播放器 -->
              <div class="video-placeholder">
                <el-icon size="64px" color="#409eff"><VideoPlay /></el-icon>
                <p>视频播放器</p>
                <p class="video-info">{{ videoInfo.title }} - {{ videoInfo.duration }}</p>
              </div>
            </div>
            <div class="video-controls">
              <el-progress :percentage="videoProgress" :show-text="false" />
              <div class="control-buttons">
                <el-button size="small" @click="togglePlay">
                  <el-icon><VideoPlay /></el-icon>
                  {{ isPlaying ? '暂停' : '播放' }}
                </el-button>
                <span class="time-display">{{ currentTime }} / {{ totalTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 课件内容区域 -->
        <div class="courseware-section">
          <el-tabs v-model="activeContentTab" class="content-tabs">
            <!-- 图文课件 -->
            <el-tab-pane label="课件内容" name="courseware">
              <div class="courseware-content">
                <div class="rich-content">
                  <h3>C++ 简单程序设计</h3>
                  <p>本节课我们将学习 C++ 的基础语法和程序结构。</p>

                  <h4>1. Hello World 程序</h4>
                  <pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    cout &lt;&lt; "Hello, World!" &lt;&lt; endl;
    return 0;
}</code></pre>

                  <h4>2. 程序结构说明</h4>
                  <ul>
                    <li><code>#include</code> - 预处理指令，引入头文件</li>
                    <li><code>main()</code> - 程序入口函数</li>
                    <li><code>cout</code> - 标准输出流</li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>

            <!-- PDF 课件 -->
            <el-tab-pane label="PDF 讲义" name="pdf" v-if="hasPDF">
              <div class="pdf-viewer">
                <div class="pdf-toolbar">
                  <el-button-group>
                    <el-button size="small" @click="prevPage">上一页</el-button>
                    <el-button size="small" disabled>{{ pdfCurrentPage }} / {{ pdfTotalPages }}</el-button>
                    <el-button size="small" @click="nextPage">下一页</el-button>
                  </el-button-group>
                </div>
                <div class="pdf-content">
                  <p class="pdf-placeholder">PDF 预览区域</p>
                </div>
              </div>
            </el-tab-pane>

            <!-- 练习题目 -->
            <el-tab-pane label="配套练习" name="practice">
              <div class="practice-section">
                <el-empty description="暂无配套练习题" v-if="!hasPractice">
                  <el-button type="primary" @click="goToPractice">
                    前往题库练习
                  </el-button>
                </el-empty>

                <div v-else class="practice-list">
                  <div class="practice-item" v-for="item in practiceItems" :key="item.id">
                    <div class="practice-header">
                      <h4>{{ item.title }}</h4>
                      <el-tag :type="item.completed ? 'success' : 'info'">
                        {{ item.completed ? '已完成' : '未完成' }}
                      </el-tag>
                    </div>
                    <p class="practice-desc">{{ item.description }}</p>
                    <el-button type="primary" size="small" @click="goToProblem(item.id)">
                      开始练习
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 底部操作栏 -->
        <div class="bottom-actions">
          <el-button @click="openNoteEditor" :icon="EditPen">
            写笔记
          </el-button>
          <el-button type="success" @click="markCompleted" v-if="!currentSection?.completed">
            <el-icon><Check /></el-icon>
            标记完成
          </el-button>
          <el-button type="primary" @click="goToPractice">
            前往练习
          </el-button>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="right-sidebar">
        <!-- Tab 导航 -->
        <div class="sidebar-tabs">
          <div
            class="tab-item"
            :class="{ active: activeTab === 'outline' }"
            @click="activeTab = 'outline'"
          >
            目录
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 'comments' }"
            @click="activeTab = 'comments'"
          >
            评论
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 'notes' }"
            @click="activeTab = 'notes'"
          >
            笔记
          </div>
        </div>

        <!-- Tab 内容 -->
        <div class="tab-content">
          <!-- 目录 -->
          <div v-if="activeTab === 'outline'" class="outline-content">
            <div class="course-outline">
              <div
                v-for="chapter in courseOutline"
                :key="chapter.id"
                class="outline-chapter"
              >
                <div class="chapter-title" @click="toggleChapter(chapter.id)">
                  <el-icon class="expand-icon" :class="{ expanded: chapter.expanded }">
                    <ArrowRight />
                  </el-icon>
                  <span>{{ chapter.number }} {{ chapter.title }}</span>
                </div>
                <div v-if="chapter.expanded" class="chapter-sections">
                  <div
                    v-for="section in chapter.sections"
                    :key="section.id"
                    class="section-item"
                    :class="{
                      active: isCurrentSection(chapter.id, section.id),
                      completed: section.completed
                    }"
                    @click="goToSection(chapter.id, section.id)"
                  >
                    <el-icon v-if="section.completed" color="#409eff" class="section-status">
                      <Check />
                    </el-icon>
                    <span class="section-number">{{ section.number }}</span>
                    <span class="section-title">{{ section.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论 -->
          <div v-if="activeTab === 'comments'" class="comments-content">
            <div class="comment-form">
              <el-input
                v-model="newComment"
                type="textarea"
                :rows="3"
                placeholder="写下你的想法..."
              />
              <el-button type="primary" size="small" @click="addComment" class="submit-btn">
                发表评论
              </el-button>
            </div>

            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <el-avatar :size="32" :src="comment.avatar" />
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="username">{{ comment.username }}</span>
                    <span class="time">{{ comment.time }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 笔记 -->
          <div v-if="activeTab === 'notes'" class="notes-content">
            <div class="notes-list">
              <div v-for="note in notes" :key="note.id" class="note-item">
                <div class="note-header">
                  <span class="note-time">{{ note.time }}</span>
                  <el-button size="small" text @click="editNote(note)">编辑</el-button>
                </div>
                <p class="note-content">{{ note.content }}</p>
              </div>
            </div>

            <div v-if="notes.length === 0" class="empty-notes">
              <el-empty description="还没有笔记，点击下方按钮开始记录吧！" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 笔记编辑器弹窗 -->
    <el-dialog v-model="noteDialogVisible" title="写笔记" width="600px">
      <el-input
        v-model="noteContent"
        type="textarea"
        :rows="8"
        placeholder="记录你的学习心得..."
      />
      <template #footer>
        <el-button @click="noteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNote">保存笔记</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Check,
  EditPen,
  VideoPlay
} from '@element-plus/icons-vue'

definePageMeta({
  layout: false,
  title: '章节学习'
})

const route = useRoute()
const router = useRouter()

// 响应式数据
const activeTab = ref('outline')
const activeContentTab = ref('courseware')
const noteDialogVisible = ref(false)
const noteContent = ref('')
const newComment = ref('')

// 视频相关
const hasVideo = ref(true)
const isPlaying = ref(false)
const videoProgress = ref(35)
const currentTime = ref('05:30')
const totalTime = ref('15:45')
const videoInfo = ref({
  title: 'C++ 基础语法讲解',
  duration: '15:45'
})

// PDF相关
const hasPDF = ref(true)
const pdfCurrentPage = ref(1)
const pdfTotalPages = ref(10)

// 练习相关
const hasPractice = ref(true)
const practiceItems = ref([
  {
    id: 1,
    title: 'Hello World 练习',
    description: '编写你的第一个 C++ 程序',
    completed: false
  },
  {
    id: 2,
    title: '变量声明练习',
    description: '练习声明和使用不同类型的变量',
    completed: false
  }
])

// 当前章节信息
const currentSection = ref({
  id: parseInt(route.params.sectionId),
  title: 'C++简单程序设计',
  completed: false
})

// 课程大纲数据
const courseOutline = ref([
  {
    id: 1,
    number: '1',
    title: '第一章',
    expanded: true,
    sections: [
      { id: 1, number: '1.1', title: 'C++简单程序设计', completed: true },
      { id: 2, number: '1.2', title: '变量和数据类型', completed: true }
    ]
  },
  {
    id: 2,
    number: '2',
    title: '第二章',
    expanded: false,
    sections: [
      { id: 3, number: '2.1', title: '函数的定义和调用', completed: true },
      { id: 4, number: '2.2', title: '函数的参数传递', completed: false }
    ]
  }
])

// 评论数据
const comments = ref([
  {
    id: 1,
    username: '张同学',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    content: '这个章节讲得很清楚，特别是关于指针的部分。',
    time: '2小时前'
  }
])

// 笔记数据
const notes = ref([
  {
    id: 1,
    content: 'C++是一种静态类型的编程语言，支持面向对象编程...',
    time: '2024-01-15 14:30'
  }
])

// 方法
const goBack = () => {
  router.push(`/course/${route.params.id}`)
}

const toggleChapter = (chapterId) => {
  const chapter = courseOutline.value.find(c => c.id === chapterId)
  if (chapter) {
    chapter.expanded = !chapter.expanded
  }
}

const isCurrentSection = (chapterId, sectionId) => {
  return parseInt(route.params.chapterId) === chapterId &&
         parseInt(route.params.sectionId) === sectionId
}

const goToSection = (chapterId, sectionId) => {
  // 重定向到新的学生门户学习页面
  router.push(`/student/course/${route.params.id}/section/${sectionId}`)
}

const goToPractice = () => {
  ElMessage.info('跳转到 OJ 练习平台...')
  // router.push('/student/oj')
}

const goToProblem = (problemId) => {
  ElMessage.info(`跳转到题目 ${problemId}`)
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  ElMessage.info(isPlaying.value ? '开始播放' : '暂停播放')
}

const prevPage = () => {
  if (pdfCurrentPage.value > 1) {
    pdfCurrentPage.value--
  }
}

const nextPage = () => {
  if (pdfCurrentPage.value < pdfTotalPages.value) {
    pdfCurrentPage.value++
  }
}

const openNoteEditor = () => {
  noteDialogVisible.value = true
  noteContent.value = ''
}

const saveNote = () => {
  if (noteContent.value.trim()) {
    notes.value.unshift({
      id: Date.now(),
      content: noteContent.value,
      time: new Date().toLocaleString()
    })
    noteDialogVisible.value = false
    noteContent.value = ''
    ElMessage.success('笔记保存成功')
  }
}

const editNote = (note) => {
  noteContent.value = note.content
  noteDialogVisible.value = true
}

const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.unshift({
      id: Date.now(),
      username: '我',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      content: newComment.value,
      time: '刚刚'
    })
    newComment.value = ''
    ElMessage.success('评论发表成功')
  }
}

const markCompleted = () => {
  currentSection.value.completed = true
  ElMessage.success('已标记为完成')
}

// 生命周期
onMounted(() => {
  console.log('📚 章节详情页加载:', {
    courseId: route.params.id,
    chapterId: route.params.chapterId,
    sectionId: route.params.sectionId,
    fullPath: route.fullPath
  })
})
</script>

<style lang="scss" scoped>
.chapter-section-page {
  min-height: 100vh;
  background: #f5f7fa;
  margin: 0;
  padding: 0;
}

// 顶部导航
.top-nav {
  background: white;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .page-title {
    flex: 1;
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 24px;
  }

  .nav-actions {
    display: flex;
    gap: 12px;
  }
}

// 页面布局
.page-layout {
  display: flex;
  height: calc(100vh - 72px);
}

// 主内容区域
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 24px;

  .section-status-bar {
    margin-bottom: 20px;
  }

  // 视频区域
  .video-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .video-container {
      .video-player {
        background: #000;
        border-radius: 8px;
        aspect-ratio: 16/9;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;

        .video-placeholder {
          text-align: center;
          color: white;

          p {
            margin: 12px 0 0 0;
            opacity: 0.8;

            &.video-info {
              font-size: 14px;
              opacity: 0.6;
            }
          }
        }
      }

      .video-controls {
        .control-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 12px;

          .time-display {
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }

  // 课件区域
  .courseware-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .courseware-content {
      .rich-content {
        line-height: 1.8;
        color: #303133;

        h3 {
          font-size: 24px;
          margin: 0 0 16px 0;
        }

        h4 {
          font-size: 18px;
          margin: 24px 0 12px 0;
          color: #409eff;
        }

        p {
          margin: 12px 0;
        }

        pre {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;

          code {
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.5;
          }
        }

        ul {
          padding-left: 24px;

          li {
            margin: 8px 0;

            code {
              background: #f5f5f5;
              padding: 2px 6px;
              border-radius: 4px;
              color: #e6a23c;
              font-family: 'Monaco', 'Consolas', monospace;
            }
          }
        }
      }
    }

    .pdf-viewer {
      .pdf-toolbar {
        margin-bottom: 16px;
        text-align: center;
      }

      .pdf-content {
        background: #f8f9fa;
        border-radius: 8px;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;

        .pdf-placeholder {
          color: #909399;
          font-size: 16px;
        }
      }
    }

    .practice-section {
      .practice-list {
        .practice-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;

          .practice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            h4 {
              margin: 0;
              font-size: 16px;
              color: #303133;
            }
          }

          .practice-desc {
            color: #606266;
            margin: 0 0 16px 0;
            font-size: 14px;
          }
        }
      }
    }
  }

  // 底部操作栏
  .bottom-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 20px 0;
  }
}

// 右侧边栏
.right-sidebar {
  width: 320px;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  .sidebar-tabs {
    display: flex;
    border-bottom: 1px solid #e4e7ed;

    .tab-item {
      flex: 1;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      color: #606266;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
      }

      &.active {
        color: #409eff;
        border-bottom-color: #409eff;
        font-weight: 600;
      }
    }
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
}

// 目录内容
.outline-content {
  .course-outline {
    .outline-chapter {
      margin-bottom: 16px;

      .chapter-title {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
        cursor: pointer;
        font-weight: 600;
        color: #303133;

        .expand-icon {
          transition: transform 0.3s;
          color: #909399;

          &.expanded {
            transform: rotate(90deg);
          }
        }
      }

      .chapter-sections {
        margin-left: 20px;

        .section-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 6px;
          transition: background-color 0.2s;
          margin-bottom: 4px;

          &:hover {
            background: #f5f7fa;
          }

          &.active {
            background: #ecf5ff;
            color: #409eff;
          }

          .section-number {
            font-size: 12px;
            color: #909399;
            min-width: 30px;
          }

          .section-title {
            font-size: 13px;
            flex: 1;
          }
        }
      }
    }
  }
}

// 评论内容
.comments-content {
  .comment-form {
    margin-bottom: 20px;

    .submit-btn {
      margin-top: 8px;
      float: right;
    }
  }

  .comments-list {
    .comment-item {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f0f2f5;

      .comment-content {
        flex: 1;

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .username {
            font-weight: 600;
            color: #303133;
            font-size: 14px;
          }

          .time {
            font-size: 12px;
            color: #909399;
          }
        }

        .comment-text {
          font-size: 14px;
          color: #606266;
          line-height: 1.6;
          margin: 0;
        }
      }
    }
  }
}

// 笔记内容
.notes-content {
  .notes-list {
    .note-item {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .note-time {
          font-size: 12px;
          color: #909399;
        }
      }

      .note-content {
        font-size: 14px;
        color: #303133;
        line-height: 1.6;
        margin: 0;
      }
    }
  }

  .empty-notes {
    text-align: center;
    padding: 40px 0;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .right-sidebar {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
  }

  .right-sidebar {
    width: 100%;
    height: 300px;
  }

  .main-content {
    padding: 16px;
  }

  .top-nav {
    flex-wrap: wrap;
    gap: 12px;

    .page-title {
      width: 100%;
      margin: 0;
    }
  }
}
</style>