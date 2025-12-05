<template>
  <div class="class-students">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>学员管理</h1>
        <p>{{ classInfo.name }}</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ students.length }}</div>
        <div class="stat-label">总学员数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ activeCount }}</div>
        <div class="stat-label">活跃学员</div>
      </el-card>
    </div>

    <!-- 搜索和操作 -->
    <div class="toolbar">
      <el-input v-model="searchQuery" placeholder="搜索学员姓名或学号" style="width: 300px" clearable>
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleAddStudent">
        <el-icon><Plus /></el-icon> 添加学员
      </el-button>
    </div>

    <!-- 学员列表 -->
    <el-card class="students-table-card">
      <el-table :data="paginatedStudents" style="width: 100%" stripe>
        <el-table-column label="学员信息" min-width="200">
          <template #default="{ row }">
            <div class="student-info">
              <el-avatar :size="40" :src="row.avatar" />
              <div class="info-text">
                <div class="name">{{ row.name }}</div>
                <div class="student-id">{{ row.studentId }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="140" />
        <el-table-column label="学习进度" width="180">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="作业完成" width="120">
          <template #default="{ row }">
            <span>{{ row.homeworkCompleted }}/{{ row.homeworkTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平均分" width="100">
          <template #default="{ row }">
            <span :class="getScoreClass(row.avgScore)">{{ row.avgScore }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '活跃' : '不活跃' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button link type="danger" size="small" @click="removeStudent(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="filteredStudents.length"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ArrowLeft, Search, Plus } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '学员管理' })

const route = useRoute()
const router = useRouter()
const classId = computed(() => route.params.id)

const searchQuery = ref('')
const classInfo = ref({ name: '计算机2101班' })

// JSON格式的学员数据生成函数
const generateStudentsData = (count) => {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二', '陈一', '林二', '黄三', '刘四', '杨五']
  const students = []
  for (let i = 1; i <= count; i++) {
    students.push({
      id: `s${String(i).padStart(3, '0')}`,
      name: names[(i - 1) % names.length] + (Math.floor((i - 1) / 15) > 0 ? String.fromCharCode(65 + Math.floor((i - 1) / 15)) : ''),
      studentId: `2021${String(i).padStart(3, '0')}`,
      phone: `138****${String(1000 + i).slice(-4)}`,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      progress: Math.floor(Math.random() * 60) + 40,
      homeworkCompleted: Math.floor(Math.random() * 5) + 5,
      homeworkTotal: 10,
      avgScore: Math.floor(Math.random() * 40) + 60,
      status: Math.random() > 0.15 ? 'active' : 'inactive'
    })
  }
  return students
}

// JSON格式的班级学员数据
const studentsDataByClass = {
  class_t001: generateStudentsData(28),
  class_t002: generateStudentsData(35),
  class_t003: generateStudentsData(65)  // 超过50个用于测试分页
}

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

const allStudents = ref([])

const filteredStudents = computed(() => {
  if (!searchQuery.value) return allStudents.value
  return allStudents.value.filter(s => s.name.includes(searchQuery.value) || s.studentId.includes(searchQuery.value))
})

const paginatedStudents = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredStudents.value.slice(start, end)
})

const activeCount = computed(() => allStudents.value.filter(s => s.status === 'active').length)

const handlePageChange = (page) => {
  pagination.value.currentPage = page
}

const loadStudents = () => {
  allStudents.value = studentsDataByClass[classId.value] || studentsDataByClass.class_t001
  pagination.value.total = allStudents.value.length
  // 更新班级信息中的学员数
  classInfo.value.name = classData[classId.value]?.name || '计算机2101班'
}

// JSON格式的班级数据
const classData = {
  class_t001: { name: '计算机2101班' },
  class_t002: { name: '软件工程2201班' },
  class_t003: { name: '数据科学2201班' }
}

onMounted(() => loadStudents())

const getScoreClass = (score) => score >= 80 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low'

const goBack = () => router.push(`/teacher/class/${classId.value}`)
const handleAddStudent = () => ElMessage.info('添加学员功能开发中...')
const viewDetail = (student) => ElMessage.info(`查看学员详情：${student.name}`)
const removeStudent = (student) => {
  ElMessageBox.confirm(`确定要移除学员 ${student.name} 吗？`, '提示', { type: 'warning' })
    .then(() => {
      allStudents.value = allStudents.value.filter(s => s.id !== student.id)
      pagination.value.total = allStudents.value.length
      ElMessage.success('移除成功')
    }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.class-students {
  padding: 32px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    h1 { font-size: 24px; font-weight: 600; color: #303133; margin: 0 0 4px 0; }
    p { font-size: 14px; color: #909399; margin: 0; }
  }

  .stats-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    .stat-card {
      text-align: center;
      padding: 16px 32px;

      .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #303133;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .students-table-card {
    .student-info {
      display: flex;
      align-items: center;
      gap: 12px;
      .info-text {
        .name { font-weight: 500; color: #303133; }
        .student-id { font-size: 12px; color: #909399; }
      }
    }
    .score-high { color: #67c23a; font-weight: 600; }
    .score-medium { color: #e6a23c; font-weight: 600; }
    .score-low { color: #f56c6c; font-weight: 600; }

    .pagination-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;
      margin-top: 20px;
    }
  }
}
</style>
