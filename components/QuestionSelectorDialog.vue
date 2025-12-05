<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="从题库选择题目"
    :width="isFullscreen ? '100%' : '85%'"
    :fullscreen="isFullscreen"
    destroy-on-close
    :close-on-click-modal="false"
    class="question-selector-dialog"
  >
    <div class="question-selector">
      <div class="filter-area">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索题目内容、ID或标签..." clearable @input="handleSearch">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="selectedType" placeholder="题型筛选" clearable @change="handleSearch">
              <el-option label="全部题型" value="" />
              <el-option label="单选题" value="single" />
              <el-option label="多选题" value="multiple" />
              <el-option label="填空题" value="fill" />
              <el-option label="判断题" value="judge" />
              <el-option label="OJ编程题" value="programming" />
              <el-option label="Scratch题" value="scratch" />
              <el-option label="简答题" value="essay" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="selectedDifficulty" placeholder="难度筛选" clearable @change="handleSearch">
              <el-option label="全部难度" value="" />
              <el-option label="简单" value="easy" />
              <el-option label="中等" value="medium" />
              <el-option label="困难" value="hard" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <div class="selected-count">
              <el-tag type="info">已选择 {{ localSelectedQuestions.length }} 道题目</el-tag>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="16" style="margin-top: 16px;">
          <el-col :span="20">
            <el-input v-model="batchQuestionIds" type="textarea" :rows="2" placeholder="批量输入题目ID，用分号(;)分隔：q_001;q_002;q_003" clearable />
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleBatchAddQuestions" :disabled="!batchQuestionIds.trim()" style="width: 100%; height: 100%;">
              批量添加并确认
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="question-list">
        <el-table ref="questionTable" :data="filteredQuestions" @selection-change="handleSelectionChange" max-height="500" stripe row-key="id">
          <el-table-column type="selection" width="55" :reserve-selection="true" />
          <el-table-column label="ID" prop="id" width="120" />
          <el-table-column label="题型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.type)" size="small">{{ getTypeLabel(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="题目内容" min-width="300" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="question-content">{{ row.questionText }}</div>
            </template>
          </el-table-column>
          <el-table-column label="难度" width="100">
            <template #default="{ row }">
              <el-tag :type="getDifficultyTagType(row.difficulty)" size="small">{{ getDifficultyLabel(row.difficulty) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="默认分数" width="100">
            <template #default="{ row }">
              <el-tag type="info" size="small">{{ row.score || getDefaultScore(row.difficulty) }}分</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="标签" width="200">
            <template #default="{ row }">
              <div class="tag-container">
                <el-tag v-for="tag in (row.tags || [])" :key="tag" size="small" effect="light" style="margin: 2px;">{{ tag }}</el-tag>
                <span v-if="!row.tags || row.tags.length === 0" class="no-tags">暂无标签</span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="totalQuestions"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <template #header>
      <div class="dialog-header">
        <span>从题库选择题目</span>
        <div class="header-actions">
          <el-button type="text" @click="toggleFullscreen">{{ isFullscreen ? '退出全屏' : '全屏' }}</el-button>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :disabled="localSelectedQuestions.length === 0" @click="handleConfirm">
          确认选择 ({{ localSelectedQuestions.length }})
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  visible: Boolean,
  selectedQuestions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible', 'confirm'])

const isFullscreen = ref(false)
const searchKeyword = ref('')
const selectedType = ref('')
const selectedDifficulty = ref('')
const batchQuestionIds = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const localSelectedQuestions = ref([])
const questionTable = ref()

const allQuestions = ref([
  { id: 'q_001', type: 'single', questionText: 'Python中用于定义函数的关键字是？', difficulty: 'easy', tags: ['Python', '基础'], score: 5 },
  { id: 'q_002', type: 'single', questionText: '以下哪个不是Python的内置数据类型？', difficulty: 'easy', tags: ['Python', '数据类型'], score: 5 },
  { id: 'q_003', type: 'multiple', questionText: '以下哪些是Python的循环语句？', difficulty: 'medium', tags: ['Python', '循环'], score: 10 },
  { id: 'q_004', type: 'fill', questionText: 'Python中使用____关键字导入模块', difficulty: 'easy', tags: ['Python', '模块'], score: 5 },
  { id: 'q_005', type: 'essay', questionText: '简述Python中列表和元组的区别', difficulty: 'medium', tags: ['Python', '数据结构'], score: 15 },
  { id: 'q_006', type: 'programming', questionText: '编写一个函数，计算斐波那契数列的第n项', difficulty: 'hard', tags: ['算法', '递归'], score: 25 },
  { id: 'q_007', type: 'judge', questionText: 'Python是一种编译型语言', difficulty: 'easy', tags: ['Python', '基础'], score: 5 },
  { id: 'q_008', type: 'scratch', questionText: '使用Scratch创建一个简单的动画', difficulty: 'medium', tags: ['Scratch', '动画'], score: 10 }
])

const filteredQuestions = computed(() => {
  let result = allQuestions.value
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(q => q.id.toLowerCase().includes(keyword) || q.questionText.toLowerCase().includes(keyword) || (q.tags && q.tags.some(tag => tag.toLowerCase().includes(keyword))))
  }
  if (selectedType.value) result = result.filter(q => q.type === selectedType.value)
  if (selectedDifficulty.value) result = result.filter(q => q.difficulty === selectedDifficulty.value)
  return result.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const totalQuestions = computed(() => {
  let result = allQuestions.value
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(q => q.id.toLowerCase().includes(keyword) || q.questionText.toLowerCase().includes(keyword) || (q.tags && q.tags.some(tag => tag.toLowerCase().includes(keyword))))
  }
  if (selectedType.value) result = result.filter(q => q.type === selectedType.value)
  if (selectedDifficulty.value) result = result.filter(q => q.difficulty === selectedDifficulty.value)
  return result.length
})

const toggleFullscreen = () => { isFullscreen.value = !isFullscreen.value }
const handleSearch = () => { currentPage.value = 1 }
const handleSelectionChange = (selection) => { localSelectedQuestions.value = selection }
const handleBatchAddQuestions = () => {
  const ids = batchQuestionIds.value.split(';').map(id => id.trim()).filter(id => id)
  const questions = allQuestions.value.filter(q => ids.includes(q.id))
  if (questions.length > 0) {
    emit('confirm', questions)
    handleClose()
    ElMessage.success(`成功添加 ${questions.length} 道题目`)
  } else {
    ElMessage.warning('未找到匹配的题目')
  }
}
const handleSizeChange = () => { currentPage.value = 1 }
const handleCurrentChange = () => {}
const handleClose = () => { emit('update:visible', false) }
const handleConfirm = () => { emit('confirm', localSelectedQuestions.value); handleClose() }

const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程', judge: '判断', scratch: 'Scratch' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger', judge: '', scratch: 'success' }[type] || '')
const getDifficultyLabel = (d) => ({ easy: '简单', medium: '中等', hard: '困难' }[d] || d)
const getDifficultyTagType = (d) => ({ easy: 'success', medium: 'warning', hard: 'danger' }[d] || '')
const getDefaultScore = (d) => ({ easy: 5, medium: 10, hard: 20 }[d] || 5)

watch(() => props.visible, (val) => {
  if (val) {
    localSelectedQuestions.value = [...props.selectedQuestions]
    nextTick(() => {
      if (questionTable.value) {
        questionTable.value.clearSelection()
        props.selectedQuestions.forEach(q => {
          const row = allQuestions.value.find(item => item.id === q.id)
          if (row) questionTable.value.toggleRowSelection(row, true)
        })
      }
    })
  }
})
</script>

<style scoped>
.question-selector { padding: 0; }
.filter-area { margin-bottom: 20px; }
.selected-count { display: flex; align-items: center; height: 100%; }
.question-list { margin-top: 20px; }
.question-content { line-height: 1.5; }
.tag-container { display: flex; flex-wrap: wrap; gap: 4px; }
.no-tags { font-size: 12px; color: #909399; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }
.dialog-header { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.header-actions { display: flex; gap: 8px; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 12px; }
</style>
