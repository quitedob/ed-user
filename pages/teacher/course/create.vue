<template>
  <div class="course-create">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ isEdit ? '编辑课程' : '创建课程' }}</h1>
      </div>
      <div class="header-actions">
        <el-button @click="saveDraft">保存草稿</el-button>
        <el-button type="primary" @click="publishCourse">{{ isEdit ? '保存' : '发布课程' }}</el-button>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 基本信息 -->
        <el-card shadow="never" class="form-card">
          <div class="card-content">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
              <el-form-item label="课程名称" prop="title">
                <el-input v-model="form.title" placeholder="请输入课程名称" maxlength="50" show-word-limit />
              </el-form-item>
              <el-form-item label="课程简介" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入课程简介" maxlength="500" show-word-limit />
              </el-form-item>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="课程分类" prop="category">
                    <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
                      <el-option label="编程语言" value="programming" />
                      <el-option label="数据结构" value="data_structure" />
                      <el-option label="算法" value="algorithm" />
                      <el-option label="前端开发" value="frontend" />
                      <el-option label="后端开发" value="backend" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="难度等级">
                    <el-select v-model="form.difficulty" placeholder="请选择难度" style="width: 100%">
                      <el-option label="入门" value="beginner" />
                      <el-option label="初级" value="elementary" />
                      <el-option label="中级" value="intermediate" />
                      <el-option label="高级" value="advanced" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="课程封面">
                <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="handleCoverChange" accept="image/*">
                  <div class="cover-upload" v-if="!form.cover">
                    <el-icon><Plus /></el-icon>
                    <span>上传封面</span>
                  </div>
                  <img v-else :src="form.cover" class="cover-preview" />
                </el-upload>
                <div class="form-tip">建议尺寸 800x450，支持 JPG、PNG 格式</div>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <!-- 课程章节 -->
        <el-card shadow="never" class="form-card chapters-card">
          <div class="card-content">
            <div class="chapters-header">
              <span class="section-title">课程章节</span>
              <el-button type="primary" size="small" @click="addChapter">
                <el-icon><Plus /></el-icon> 添加章节
              </el-button>
            </div>

            <div class="chapters-list" v-if="form.chapters.length > 0">
              <div v-for="(chapter, chapterIndex) in form.chapters" :key="chapterIndex" class="chapter-block">
                <div class="chapter-header">
                  <div class="chapter-drag"><el-icon><Rank /></el-icon></div>
                  <span class="chapter-num">第{{ chapterIndex + 1 }}章</span>
                  <el-input v-model="chapter.title" placeholder="章节标题" class="chapter-title-input" />
                  <el-button link type="primary" size="small" @click="toggleChapter(chapterIndex)">
                    <el-icon><component :is="chapter.expanded ? ArrowUp : ArrowDown" /></el-icon>
                  </el-button>
                  <el-button link type="danger" size="small" @click="removeChapter(chapterIndex)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>

                <div v-show="chapter.expanded" class="chapter-content">
                  <el-input v-model="chapter.description" placeholder="章节简介（可选）" size="small" style="margin-bottom: 12px" />
                  
                  <!-- 小节列表 -->
                  <div class="sections-list">
                    <div v-for="(section, sectionIndex) in chapter.sections" :key="sectionIndex" class="section-item">
                      <div class="section-header">
                        <div class="section-drag"><el-icon><Rank /></el-icon></div>
                        <span class="section-num">{{ chapterIndex + 1 }}.{{ sectionIndex + 1 }}</span>
                        <el-input v-model="section.title" placeholder="小节标题" size="small" class="section-title-input" />
                        <el-button link type="primary" size="small" @click="editSection(chapterIndex, sectionIndex)">
                          <el-icon><Edit /></el-icon>
                        </el-button>
                        <el-button link type="danger" size="small" @click="removeSection(chapterIndex, sectionIndex)">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                      
                      <!-- 小节内容预览 -->
                      <div class="section-preview" v-if="section.contentType">
                        <el-tag size="small" :type="section.contentType === 'practice' ? 'danger' : 'primary'">
                          {{ section.contentType === 'practice' ? '练习作业' : '普通课程' }}
                        </el-tag>
                        <span v-if="section.contentType === 'practice'" class="homework-info">
                          {{ section.selectedQuestions?.length || 0 }}道题
                        </span>
                      </div>
                    </div>
                  </div>

                  <el-button type="text" @click="addSection(chapterIndex)" class="add-section-btn">
                    <el-icon><Plus /></el-icon> 添加小节
                  </el-button>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂无章节，点击上方按钮添加" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 课程设置 -->
        <el-card shadow="never" class="form-card">
          <div class="card-content">
            <div class="section-title">课程设置</div>
            <el-form label-width="80px">
              <el-form-item label="发布状态">
                <el-switch v-model="form.isPublished" active-text="已发布" inactive-text="草稿" />
              </el-form-item>
              <el-form-item label="课程类型">
                <el-radio-group v-model="form.courseType">
                  <el-radio label="free">免费</el-radio>
                  <el-radio label="paid">付费</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="课程价格" v-if="form.courseType === 'paid'">
                <el-input-number v-model="form.price" :min="0" :precision="2" />
                <span class="form-tip">元</span>
              </el-form-item>
              <el-form-item label="学习期限">
                <el-select v-model="form.validPeriod" style="width: 100%">
                  <el-option label="永久有效" value="forever" />
                  <el-option label="1个月" value="1month" />
                  <el-option label="3个月" value="3month" />
                  <el-option label="6个月" value="6month" />
                  <el-option label="1年" value="1year" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <!-- 关联班级 -->
        <el-card shadow="never" class="form-card">
          <div class="card-content">
            <div class="section-title">关联班级</div>
            <el-checkbox-group v-model="form.linkedClasses">
              <el-checkbox v-for="cls in allClasses" :key="cls.id" :label="cls.id" style="display: block; margin-bottom: 8px">
                {{ cls.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 小节编辑对话框 -->
    <el-dialog v-model="sectionDialogVisible" :title="editingSectionTitle" width="900px" destroy-on-close>
      <div v-if="editingSection" class="section-editor">
        <el-form label-width="100px">
          <el-form-item label="小节标题">
            <el-input v-model="editingSection.title" placeholder="请输入小节标题" />
          </el-form-item>
          
          <el-form-item label="小节类型">
            <el-radio-group v-model="editingSection.contentType">
              <el-radio label="normal">普通课程</el-radio>
              <el-radio label="practice">练习作业</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 普通课程内容 -->
          <template v-if="editingSection.contentType === 'normal'">
            <el-divider content-position="left">课程内容设置</el-divider>
            
            <div class="content-toggles">
              <el-form-item label="视频学习">
                <el-switch v-model="editingSection.contentConfig.video.enabled" />
              </el-form-item>
              <el-form-item label="图片内容">
                <el-switch v-model="editingSection.contentConfig.image.enabled" />
              </el-form-item>
              <el-form-item label="PDF文档">
                <el-switch v-model="editingSection.contentConfig.pdf.enabled" />
              </el-form-item>
              <el-form-item label="文本内容">
                <el-switch v-model="editingSection.contentConfig.text.enabled" />
              </el-form-item>
            </div>

            <!-- 视频内容 -->
            <div v-if="editingSection.contentConfig.video.enabled" class="resource-item">
              <el-divider content-position="left">视频内容</el-divider>
              <el-form-item label="视频时长">
                <el-input-number v-model="editingSection.duration" :min="1" />
                <span class="form-tip">分钟</span>
              </el-form-item>
              <el-form-item label="视频文件">
                <el-upload action="#" :auto-upload="false" accept="video/*">
                  <el-button size="small"><el-icon><Upload /></el-icon> 上传视频</el-button>
                </el-upload>
              </el-form-item>
            </div>

            <!-- 图片内容 -->
            <div v-if="editingSection.contentConfig.image.enabled" class="resource-item">
              <el-divider content-position="left">图片内容</el-divider>
              <el-form-item label="图片文件">
                <el-upload action="#" :auto-upload="false" accept="image/*" list-type="picture-card">
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </el-form-item>
            </div>

            <!-- PDF内容 -->
            <div v-if="editingSection.contentConfig.pdf.enabled" class="resource-item">
              <el-divider content-position="left">PDF文档</el-divider>
              <el-form-item label="PDF文件">
                <el-upload action="#" :auto-upload="false" accept=".pdf">
                  <el-button size="small"><el-icon><Upload /></el-icon> 上传PDF</el-button>
                </el-upload>
              </el-form-item>
            </div>

            <!-- 文本内容 -->
            <div v-if="editingSection.contentConfig.text.enabled" class="resource-item">
              <el-divider content-position="left">文本内容</el-divider>
              <el-form-item label="文本内容">
                <el-input v-model="editingSection.textContent" type="textarea" :rows="8" placeholder="请输入文本学习内容" />
              </el-form-item>
            </div>
          </template>

          <!-- 练习作业内容 -->
          <template v-if="editingSection.contentType === 'practice'">
            <el-divider content-position="left">题目管理</el-divider>
            
            <div class="resource-item">
              <div class="resource-header">
                <el-icon class="resource-icon"><EditPen /></el-icon>
                <span class="resource-title">题目管理</span>
                <div class="resource-stats">
                  <el-tag type="info" size="small">共 {{ editingSection.selectedQuestions?.length || 0 }} 道题目</el-tag>
                  <el-button type="primary" size="small" @click="openQuestionSelector">
                    <el-icon><Plus /></el-icon>
                    从题库选择题目
                  </el-button>
                  <el-button size="small" @click="clearQuestions" :disabled="!editingSection.selectedQuestions?.length">
                    <el-icon><Delete /></el-icon>
                    清空题目
                  </el-button>
                </div>
              </div>
              
              <div class="resource-content">
                <div v-if="editingSection.selectedQuestions?.length > 0" class="questions-list">
                  <div v-for="(question, qIndex) in editingSection.selectedQuestions" :key="question.id" class="question-item">
                    <div class="question-header">
                      <span class="question-number">题目 {{ qIndex + 1 }}</span>
                      <div class="question-actions">
                        <el-button size="small" @click="moveQuestionUp(qIndex)" :disabled="qIndex === 0">
                          <el-icon><ArrowUp /></el-icon>
                        </el-button>
                        <el-button size="small" @click="moveQuestionDown(qIndex)" :disabled="qIndex === editingSection.selectedQuestions.length - 1">
                          <el-icon><ArrowDown /></el-icon>
                        </el-button>
                        <el-button size="small" type="danger" @click="removeQuestion(qIndex)">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </div>
                    
                    <div class="question-info">
                      <div class="question-basic-info">
                        <el-tag :type="getTypeTagType(question.type)" size="small">
                          {{ getTypeLabel(question.type) }}
                        </el-tag>
                        <el-tag :type="getDifficultyTagType(question.difficulty)" size="small" style="margin-left: 8px;">
                          {{ getDifficultyLabel(question.difficulty) }}
                        </el-tag>
                        <span class="question-id" style="margin-left: 8px;">ID: {{ question.id }}</span>
                      </div>
                      <div class="question-content">
                        {{ question.questionText }}
                      </div>
                      <div v-if="question.tags && question.tags.length > 0" class="question-tags">
                        <el-tag v-for="tag in question.tags" :key="tag" size="small" effect="light" style="margin-right: 4px;">
                          {{ tag }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-questions">
                  <el-empty description="暂无题目，请从题库中选择题目" />
                </div>
              </div>
            </div>
          </template>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="sectionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSectionEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 题库选择对话框 -->
    <QuestionSelectorDialog
      v-model:visible="questionSelectorVisible"
      :selected-questions="selectedQuestions"
      @confirm="handleQuestionConfirm"
    />
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Rank, Delete, Edit, ArrowUp, ArrowDown, Upload, EditPen } from '@element-plus/icons-vue'
import QuestionSelectorDialog from '~/components/QuestionSelectorDialog.vue'

definePageMeta({ layout: 'teacher', title: '课程管理' })

const router = useRouter()
const route = useRoute()
const formRef = ref()
const isEdit = computed(() => !!route.query.id)

const allClasses = [
  { id: 'class_t001', name: '计算机2101班' },
  { id: 'class_t002', name: '软件工程2201班' },
  { id: 'class_t003', name: '数据科学2201班' }
]

const form = ref({
  title: '',
  description: '',
  category: '',
  difficulty: 'beginner',
  cover: '',
  chapters: [],
  isPublished: false,
  courseType: 'free',
  price: 0,
  validPeriod: 'forever',
  linkedClasses: []
})

const rules = {
  title: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择课程分类', trigger: 'change' }]
}

const sectionDialogVisible = ref(false)
const questionSelectorVisible = ref(false)
const editingSection = ref(null)
const editingChapterIndex = ref(-1)
const editingSectionIndex = ref(-1)
const selectedQuestions = ref([])

const editingSectionTitle = computed(() => {
  if (editingChapterIndex.value >= 0 && editingSectionIndex.value >= 0) {
    return `编辑小节 ${editingChapterIndex.value + 1}.${editingSectionIndex.value + 1}`
  }
  return '编辑小节'
})

const goBack = () => router.back()
const handleCoverChange = (file) => { form.value.cover = URL.createObjectURL(file.raw) }

const addChapter = () => {
  form.value.chapters.push({
    title: '',
    description: '',
    expanded: true,
    sections: []
  })
}

const removeChapter = (index) => {
  form.value.chapters.splice(index, 1)
}

const toggleChapter = (index) => {
  form.value.chapters[index].expanded = !form.value.chapters[index].expanded
}

const addSection = (chapterIndex) => {
  form.value.chapters[chapterIndex].sections.push({
    title: '',
    contentType: 'normal',
    contentConfig: {
      video: { enabled: false },
      image: { enabled: false },
      pdf: { enabled: false },
      text: { enabled: false }
    },
    duration: 0,
    textContent: '',
    selectedQuestions: []
  })
}

const removeSection = (chapterIndex, sectionIndex) => {
  form.value.chapters[chapterIndex].sections.splice(sectionIndex, 1)
}

const editSection = (chapterIndex, sectionIndex) => {
  editingChapterIndex.value = chapterIndex
  editingSectionIndex.value = sectionIndex
  editingSection.value = JSON.parse(JSON.stringify(form.value.chapters[chapterIndex].sections[sectionIndex]))
  
  // 确保数据结构完整
  if (!editingSection.value.contentConfig) {
    editingSection.value.contentConfig = {
      video: { enabled: false },
      image: { enabled: false },
      pdf: { enabled: false },
      text: { enabled: false }
    }
  }
  if (!editingSection.value.selectedQuestions) {
    editingSection.value.selectedQuestions = []
  }
  
  sectionDialogVisible.value = true
}

const saveSectionEdit = () => {
  if (editingChapterIndex.value >= 0 && editingSectionIndex.value >= 0) {
    form.value.chapters[editingChapterIndex.value].sections[editingSectionIndex.value] = editingSection.value
    sectionDialogVisible.value = false
  }
}

const openQuestionSelector = () => {
  selectedQuestions.value = [...(editingSection.value.selectedQuestions || [])]
  questionSelectorVisible.value = true
}

const handleQuestionConfirm = (questions) => {
  if (editingSection.value) {
    editingSection.value.selectedQuestions = questions
  }
  questionSelectorVisible.value = false
}

const clearQuestions = () => {
  if (editingSection.value) {
    editingSection.value.selectedQuestions = []
  }
}

const moveQuestionUp = (index) => {
  if (index > 0 && editingSection.value.selectedQuestions) {
    const temp = editingSection.value.selectedQuestions[index]
    editingSection.value.selectedQuestions[index] = editingSection.value.selectedQuestions[index - 1]
    editingSection.value.selectedQuestions[index - 1] = temp
  }
}

const moveQuestionDown = (index) => {
  if (editingSection.value.selectedQuestions && index < editingSection.value.selectedQuestions.length - 1) {
    const temp = editingSection.value.selectedQuestions[index]
    editingSection.value.selectedQuestions[index] = editingSection.value.selectedQuestions[index + 1]
    editingSection.value.selectedQuestions[index + 1] = temp
  }
}

const removeQuestion = (index) => {
  if (editingSection.value && editingSection.value.selectedQuestions) {
    editingSection.value.selectedQuestions.splice(index, 1)
  }
}

const getTypeLabel = (type) => ({ single: '单选', multiple: '多选', fill: '填空', essay: '问答', programming: '编程', judge: '判断', scratch: 'Scratch' }[type] || type)
const getTypeTagType = (type) => ({ single: 'primary', multiple: 'success', fill: 'warning', essay: 'info', programming: 'danger', judge: '', scratch: 'success' }[type] || '')
const getDifficultyLabel = (d) => ({ easy: '简单', medium: '中等', hard: '困难' }[d] || d)
const getDifficultyTagType = (d) => ({ easy: 'success', medium: 'warning', hard: 'danger' }[d] || '')

const saveDraft = () => {
  form.value.isPublished = false
  ElMessage.success('草稿保存成功')
}

const publishCourse = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '课程保存成功' : '课程发布成功')
      router.back()
    }
  })
}

const loadData = () => {
  if (route.query.id) {
    form.value = {
      title: 'JavaScript进阶开发',
      description: '深入学习JavaScript高级特性和框架应用',
      category: 'frontend',
      difficulty: 'intermediate',
      cover: '/images/js-course.jpg',
      chapters: [
        {
          title: 'ES6新特性',
          description: '学习ES6的新语法和特性',
          expanded: true,
          sections: [
            {
              title: '1.1 箭头函数',
              contentType: 'normal',
              contentConfig: {
                video: { enabled: true },
                image: { enabled: false },
                pdf: { enabled: false },
                text: { enabled: true }
              },
              duration: 15,
              textContent: '箭头函数是ES6的重要特性...',
              selectedQuestions: []
            },
            {
              title: '1.2 章节练习',
              contentType: 'practice',
              contentConfig: {
                video: { enabled: false },
                image: { enabled: false },
                pdf: { enabled: false },
                text: { enabled: false }
              },
              selectedQuestions: []
            }
          ]
        }
      ],
      isPublished: true,
      courseType: 'free',
      price: 0,
      validPeriod: 'forever',
      linkedClasses: ['class_t002']
    }
  }
}

onMounted(() => loadData())
</script>

<style scoped>
.course-create {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
}

.header-info {
  flex: 1;
}

.header-info h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.form-card {
  margin-bottom: 24px;
  border: none;
}

.card-content {
  padding: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  display: block;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.cover-upload {
  width: 200px;
  height: 112px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.cover-upload:hover {
  border-color: #409eff;
}

.cover-preview {
  width: 200px;
  height: 112px;
  object-fit: cover;
  border-radius: 8px;
}

.chapters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter-block {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
  overflow: hidden;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
}

.chapter-drag {
  cursor: move;
  color: #909399;
}

.chapter-num {
  font-weight: 600;
  color: #409eff;
  min-width: 60px;
}

.chapter-title-input {
  flex: 1;
}

.chapter-content {
  padding: 16px;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.section-item {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-drag {
  cursor: move;
  color: #909399;
}

.section-num {
  font-size: 14px;
  color: #606266;
  min-width: 50px;
}

.section-title-input {
  flex: 1;
}

.section-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 32px;
  font-size: 13px;
  color: #606266;
}

.homework-info {
  color: #909399;
}

.add-section-btn {
  width: 100%;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  padding: 8px;
}

.section-editor {
  padding: 16px 0;
  max-height: 600px;
  overflow-y: auto;
}

.content-toggles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.resource-item {
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.resource-icon {
  font-size: 20px;
  color: #409eff;
}

.resource-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.resource-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resource-content {
  padding-left: 32px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.question-number {
  font-weight: 600;
  color: #606266;
}

.question-actions {
  display: flex;
  gap: 4px;
}

.question-info {
  padding: 8px 0;
}

.question-basic-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.question-id {
  font-size: 12px;
  color: #909399;
}

.question-content {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.6;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.empty-questions {
  padding: 24px;
  text-align: center;
}
</style>
