<!-- 富文本编辑器组件 -->
<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <el-button-group size="small">
        <el-button @click="formatText('bold')" title="粗体">
          <el-icon><Weight /></el-icon>
        </el-button>
        <el-button @click="formatText('italic')" title="斜体">
                    <el-icon><i style="font-style: italic; font-weight: bold;">I</i></el-icon>
        </el-button>
        <el-button @click="formatText('underline')" title="下划线">
          <el-icon><Underline /></el-icon>
        </el-button>
        <el-button @click="formatText('strike')" title="删除线">
          <el-icon><Delete /></el-icon>
        </el-button>
      </el-button-group>

      <el-button-group size="small">
        <el-button @click="formatBlock('h1')" title="标题1">H1</el-button>
        <el-button @click="formatBlock('h2')" title="标题2">H2</el-button>
        <el-button @click="formatBlock('h3')" title="标题3">H3</el-button>
        <el-button @click="formatBlock('blockquote')" title="引用">
          <el-icon><Quote /></el-icon>
        </el-button>
      </el-button-group>

      <el-button-group size="small">
        <el-button @click="formatList('ordered')" title="有序列表">
          <el-icon><List /></el-icon>
        </el-button>
        <el-button @click="formatList('bullet')" title="无序列表">
          <el-icon><Menu /></el-icon>
        </el-button>
      </el-button-group>

      <el-button-group size="small">
        <el-button @click="insertLink" title="插入链接">
          <el-icon><Link /></el-icon>
        </el-button>
        <el-button @click="insertImage" title="插入图片">
          <el-icon><Picture /></el-icon>
        </el-button>
        <el-button @click="insertCode" title="插入代码">
          <el-icon><Files /></el-icon>
        </el-button>
        <el-button @click="insertTable" title="插入表格">
          <el-icon><Grid /></el-icon>
        </el-button>
      </el-button-group>

      <el-button-group size="small">
        <el-button @click="undo" title="撤销">
          <el-icon><RefreshLeft /></el-icon>
        </el-button>
        <el-button @click="redo" title="重做">
          <el-icon><RefreshRight /></el-icon>
        </el-button>
      </el-button-group>
    </div>

    <div class="editor-content" ref="editorRef" @input="handleInput"></div>

    <!-- 插入链接对话框 -->
    <el-dialog v-model="linkDialogVisible" title="插入链接" width="400px">
      <el-form :model="linkForm" label-width="80px">
        <el-form-item label="链接文本">
          <el-input v-model="linkForm.text" placeholder="请输入链接文本" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="linkForm.url" placeholder="请输入链接地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="linkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmLink">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入图片对话框 -->
    <el-dialog v-model="imageDialogVisible" title="插入图片" width="400px">
      <el-form :model="imageForm" label-width="80px">
        <el-form-item label="图片地址">
          <el-input v-model="imageForm.src" placeholder="请输入图片地址" />
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input v-model="imageForm.alt" placeholder="请输入图片描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="imageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入代码对话框 -->
    <el-dialog v-model="codeDialogVisible" title="插入代码" width="500px">
      <el-form :model="codeForm" label-width="80px">
        <el-form-item label="编程语言">
          <el-select v-model="codeForm.language" placeholder="选择编程语言">
            <el-option label="JavaScript" value="javascript" />
            <el-option label="Python" value="python" />
            <el-option label="Java" value="java" />
            <el-option label="C++" value="cpp" />
            <el-option label="HTML" value="html" />
            <el-option label="CSS" value="css" />
            <el-option label="SQL" value="sql" />
            <el-option label="其他" value="text" />
          </el-select>
        </el-form-item>
        <el-form-item label="代码内容">
          <el-input
            v-model="codeForm.code"
            type="textarea"
            :rows="8"
            placeholder="请输入代码内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="codeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCode">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入表格对话框 -->
    <el-dialog v-model="tableDialogVisible" title="插入表格" width="300px">
      <el-form :model="tableForm" label-width="100px">
        <el-form-item label="行数">
          <el-input-number v-model="tableForm.rows" :min="1" :max="20" />
        </el-form-item>
        <el-form-item label="列数">
          <el-input-number v-model="tableForm.cols" :min="1" :max="20" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tableDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmTable">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  EditPen as Weight,
  Minus as Underline,
  Delete,
  ChatLineRound as Quote,
  List,
  Menu,
  Link,
  Picture,
  Files,
  Grid,
  RefreshLeft,
  RefreshRight
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const editorRef = ref(null)
const linkDialogVisible = ref(false)
const imageDialogVisible = ref(false)
const codeDialogVisible = ref(false)
const tableDialogVisible = ref(false)

const linkForm = ref({
  text: '',
  url: ''
})

const imageForm = ref({
  src: '',
  alt: ''
})

const codeForm = ref({
  language: 'javascript',
  code: ''
})

const tableForm = ref({
  rows: 3,
  cols: 3
})

// 编辑器实例
let editor = null

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  if (editor) {
    editor.destroy()
  }
})

const initEditor = () => {
  if (!editorRef.value) return

  // 简单的富文本编辑器实现
  editorRef.value.contentEditable = !props.readonly
  editorRef.value.innerHTML = props.modelValue || ''
  editorRef.value.style.minHeight = '200px'
  editorRef.value.style.padding = '12px'
  editorRef.value.style.border = '1px solid #dcdfe6'
  editorRef.value.style.borderRadius = '4px'
  editorRef.value.style.fontSize = '14px'
  editorRef.value.style.lineHeight = '1.6'
  editorRef.value.style.outline = 'none'

  if (props.placeholder && !props.modelValue) {
    editorRef.value.innerHTML = `<div style="color: #c0c4cc;">${props.placeholder}</div>`
  }
}

const handleInput = () => {
  if (!editorRef.value) return

  const html = editorRef.value.innerHTML
  emit('update:modelValue', html)
  emit('change', html)
}

const formatText = (command) => {
  document.execCommand(command, false, null)
  handleInput()
}

const formatBlock = (tagName) => {
  document.execCommand('formatBlock', false, tagName)
  handleInput()
}

const formatList = (type) => {
  document.execCommand(type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList', false, null)
  handleInput()
}

const insertLink = () => {
  const selection = window.getSelection()
  const selectedText = selection.toString()

  linkForm.value.text = selectedText || ''
  linkForm.value.url = ''
  linkDialogVisible.value = true
}

const confirmLink = () => {
  if (!linkForm.value.url) {
    ElMessage.warning('请输入链接地址')
    return
  }

  const linkHtml = `<a href="${linkForm.value.url}" target="_blank">${linkForm.value.text || linkForm.value.url}</a>`
  document.execCommand('insertHTML', false, linkHtml)

  linkDialogVisible.value = false
  handleInput()
}

const insertImage = () => {
  imageForm.value.src = ''
  imageForm.value.alt = ''
  imageDialogVisible.value = true
}

const confirmImage = () => {
  if (!imageForm.value.src) {
    ElMessage.warning('请输入图片地址')
    return
  }

  const imgHtml = `<img src="${imageForm.value.src}" alt="${imageForm.value.alt || ''}" style="max-width: 100%; height: auto;" />`
  document.execCommand('insertHTML', false, imgHtml)

  imageDialogVisible.value = false
  handleInput()
}

const insertCode = () => {
  codeForm.value.language = 'javascript'
  codeForm.value.code = ''
  codeDialogVisible.value = true
}

const confirmCode = () => {
  if (!codeForm.value.code) {
    ElMessage.warning('请输入代码内容')
    return
  }

  const codeHtml = `<pre><code class="language-${codeForm.value.language}">${codeForm.value.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
  document.execCommand('insertHTML', false, codeHtml)

  codeDialogVisible.value = false
  handleInput()
}

const insertTable = () => {
  tableForm.value.rows = 3
  tableForm.value.cols = 3
  tableDialogVisible.value = true
}

const confirmTable = () => {
  let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">'

  for (let i = 0; i < tableForm.value.rows; i++) {
    tableHtml += '<tr>'
    for (let j = 0; j < tableForm.value.cols; j++) {
      const cellType = i === 0 ? 'th' : 'td'
      const style = 'border: 1px solid #ddd; padding: 8px; text-align: left;'
      tableHtml += `<${cellType} style="${style}">&nbsp;</${cellType}>`
    }
    tableHtml += '</tr>'
  }

  tableHtml += '</table>'

  document.execCommand('insertHTML', false, tableHtml)

  tableDialogVisible.value = false
  handleInput()
}

const undo = () => {
  document.execCommand('undo', false, null)
  handleInput()
}

const redo = () => {
  document.execCommand('redo', false, null)
  handleInput()
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.innerHTML !== newValue) {
    editorRef.value.innerHTML = newValue || ''
  }
})

watch(() => props.readonly, (newValue) => {
  if (editorRef.value) {
    editorRef.value.contentEditable = !newValue
  }
})
</script>

<style lang="scss" scoped>
.rich-text-editor {
  .editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    border: 1px solid #dcdfe6;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    background: #f5f7fa;

    .el-button-group {
      margin-right: 4px;
    }
  }

  .editor-content {
    min-height: 200px;
    padding: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 0 0 4px 4px;
    font-size: 14px;
    line-height: 1.6;
    outline: none;

    &:focus {
      border-color: #409eff;
    }

    // 富文本内容样式
    :deep(h1) { font-size: 28px; color: #303133; margin: 20px 0 16px 0; }
    :deep(h2) { font-size: 24px; color: #303133; margin: 18px 0 14px 0; }
    :deep(h3) { font-size: 20px; color: #303133; margin: 16px 0 12px 0; }
    :deep(p) { margin: 12px 0; text-align: justify; }
    :deep(ul), :deep(ol) { margin: 12px 0; padding-left: 24px; }
    :deep(li) { margin: 6px 0; }
    :deep(blockquote) {
      background: #eef5fe;
      border-left: 4px solid #409eff;
      padding: 12px 16px;
      margin: 16px 0;
      font-style: italic;
    }
    :deep(code) {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
    }
    :deep(pre) {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
    }
    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 16px 0;
    }
    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background: #f5f5f5;
        font-weight: bold;
      }
    }
    :deep(a) {
      color: #409eff;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

:deep(.el-dialog) {
  .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
