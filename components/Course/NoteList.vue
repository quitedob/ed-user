<template>
  <div class="note-list">
    <div class="note-input">
      <el-input
        v-model="newNote"
        type="textarea"
        :rows="4"
        placeholder="记录学习笔记..."
        maxlength="1000"
        show-word-limit
      />
      <div class="input-actions">
        <el-button
          type="primary"
          size="small"
          @click="saveNote"
          :loading="saving"
          :disabled="!newNote.trim()"
        >
          保存笔记
        </el-button>
      </div>
    </div>

    <div class="notes">
      <div v-if="notes.length === 0" class="empty-state">
        <el-icon :size="48" color="#c0c4cc"><Document /></el-icon>
        <p>还没有笔记，快来记录你的学习心得吧！</p>
      </div>

      <div v-for="note in notes" :key="note.id" class="note-item">
        <div class="note-header">
          <div class="note-time">
            <el-icon><Clock /></el-icon>
            <span>{{ formatTime(note.createTime) }}</span>
          </div>
          <div class="note-actions">
            <el-button
              text
              size="small"
              @click="editNote(note)"
              :icon="Edit"
            >
              编辑
            </el-button>
            <el-button
              text
              size="small"
              type="danger"
              @click="deleteNote(note.id)"
              :icon="Delete"
            >
              删除
            </el-button>
          </div>
        </div>
        <div class="note-content">{{ note.content }}</div>
        <div v-if="note.videoTime" class="note-meta">
          <el-tag size="small" type="info">
            <el-icon><VideoPlay /></el-icon>
            {{ formatVideoTime(note.videoTime) }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 编辑笔记对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑笔记"
      width="500px"
    >
      <el-input
        v-model="editingNote.content"
        type="textarea"
        :rows="6"
        placeholder="编辑笔记内容..."
        maxlength="1000"
        show-word-limit
      />
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateNote" :loading="updating">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Document, Clock, Edit, Delete, VideoPlay } from '@element-plus/icons-vue'

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

const newNote = ref('')
const saving = ref(false)
const updating = ref(false)
const editDialogVisible = ref(false)
const editingNote = ref({ id: null, content: '' })

// 模拟笔记数据
const notes = ref([
  {
    id: 1,
    content: '软件工程的核心是管理复杂性。通过分解、抽象、模块化等方法，将复杂的系统分解为可管理的部分。',
    createTime: '2024-11-01 14:30:00',
    videoTime: 320
  },
  {
    id: 2,
    content: '软件生命周期模型包括：瀑布模型、增量模型、螺旋模型、敏捷开发等。每种模型都有其适用场景。',
    createTime: '2024-11-01 15:45:00',
    videoTime: 580
  }
])

const saveNote = async () => {
  if (!newNote.value.trim()) return

  saving.value = true
  try {
    // TODO: 调用API保存笔记
    // await saveNoteApi(props.courseId, props.sectionId, newNote.value)

    // 模拟添加笔记
    notes.value.unshift({
      id: Date.now(),
      content: newNote.value,
      createTime: new Date().toISOString(),
      videoTime: null
    })

    newNote.value = ''
    ElMessage.success('笔记保存成功')
  } catch (error) {
    ElMessage.error('笔记保存失败')
  } finally {
    saving.value = false
  }
}

const editNote = (note) => {
  editingNote.value = { ...note }
  editDialogVisible.value = true
}

const updateNote = async () => {
  if (!editingNote.value.content.trim()) return

  updating.value = true
  try {
    // TODO: 调用API更新笔记
    // await updateNoteApi(editingNote.value.id, editingNote.value.content)

    // 模拟更新笔记
    const index = notes.value.findIndex(n => n.id === editingNote.value.id)
    if (index !== -1) {
      notes.value[index].content = editingNote.value.content
    }

    editDialogVisible.value = false
    ElMessage.success('笔记更新成功')
  } catch (error) {
    ElMessage.error('笔记更新失败')
  } finally {
    updating.value = false
  }
}

const deleteNote = (noteId) => {
  ElMessageBox.confirm('确定要删除这条笔记吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API删除笔记
      // await deleteNoteApi(noteId)

      // 模拟删除笔记
      const index = notes.value.findIndex(n => n.id === noteId)
      if (index !== -1) {
        notes.value.splice(index, 1)
      }

      ElMessage.success('笔记删除成功')
    } catch (error) {
      ElMessage.error('笔记删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const formatTime = (timeStr) => {
  const time = new Date(timeStr)
  return time.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
}

const formatVideoTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.note-list {
  .note-input {
    margin-bottom: 20px;

    .el-textarea {
      margin-bottom: 12px;
    }

    .input-actions {
      display: flex;
      justify-content: flex-end;
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

  .notes {
    .note-item {
      padding: 16px;
      margin-bottom: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 3px solid #409eff;
      transition: all 0.2s;

      &:hover {
        background: #f5f7fa;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .note-time {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #909399;

          .el-icon {
            font-size: 14px;
          }
        }

        .note-actions {
          display: flex;
          gap: 8px;

          .el-button {
            padding: 0;
            height: auto;
          }
        }
      }

      .note-content {
        font-size: 14px;
        line-height: 1.6;
        color: #303133;
        margin-bottom: 8px;
        word-break: break-word;
        white-space: pre-wrap;
      }

      .note-meta {
        .el-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;

          .el-icon {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
