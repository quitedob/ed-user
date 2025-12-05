<template>
  <div class="course-students">
    <div class="page-header">
      <h2>学员管理</h2>
      <div class="header-actions">
        <el-input v-model="searchQuery" placeholder="搜索学员" style="width: 200px" clearable>
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </div>
    </div>

    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ pagination.total }}</div>
        <div class="stat-label">总学员数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ activeCount }}</div>
        <div class="stat-label">正常学员</div>
      </el-card>
    </div>

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
        <el-table-column label="学生状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.studentStatus)" size="small">
              {{ getStatusText(row.studentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openStatusDrawer(row)">
              编辑状态
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 学生状态编辑抽屉 -->
    <el-drawer
      v-model="statusDrawerVisible"
      title="编辑学生状态"
      direction="rtl"
      size="400px"
    >
      <div class="status-drawer-content" v-if="currentStudent">
        <div class="student-basic-info">
          <div class="info-header">
            <el-avatar :size="60" :src="currentStudent.avatar" />
            <div class="info-text">
              <h3>{{ currentStudent.name }}</h3>
              <p>{{ currentStudent.studentId }}</p>
            </div>
          </div>
        </div>

        <div class="status-form">
          <el-form :model="statusForm" label-width="100px">
            <el-form-item label="学生状态">
              <div class="custom-radio-group">
                <div
                  v-for="option in statusOptions"
                  :key="option.value"
                  class="status-radio"
                  :class="{ 'is-checked': statusForm.studentStatus === option.value }"
                  @click="statusForm.studentStatus = option.value"
                >
                  <div class="radio-indicator">
                    <div class="radio-inner" v-if="statusForm.studentStatus === option.value"></div>
                  </div>
                  <div class="status-option">
                    <span class="status-label">{{ option.label }}</span>
                    <span class="status-desc">{{ option.desc }}</span>
                  </div>
                </div>
              </div>
            </el-form-item>

            </el-form>
        </div>

        <div class="drawer-actions">
          <el-button @click="statusDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="saveStudentStatus">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const courseId = computed(() => route.params.id)
const searchQuery = ref('')

// JSON格式的学员数据（模拟60个学员用于分页测试）
const generateStudents = (count) => {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
  const statusOptions = ['normal', 'suspended', 'dropped', 'leave']
  const students = []
  for (let i = 1; i <= count; i++) {
    students.push({
      id: `s${String(i).padStart(3, '0')}`,
      name: names[(i - 1) % names.length] + (Math.floor((i - 1) / 10) > 0 ? Math.floor((i - 1) / 10) : ''),
      studentId: `2021${String(i).padStart(3, '0')}`,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      phone: `138****${String(1000 + i).slice(-4)}`,
      studentStatus: statusOptions[Math.floor(Math.random() * statusOptions.length)]
    })
  }
  return students
}

const studentsData = {
  course_t001: generateStudents(45),
  course_t002: generateStudents(38),
  course_t003: generateStudents(60)
}

const allStudents = ref([])

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

// 抽屉相关状态
const statusDrawerVisible = ref(false)
const currentStudent = ref(null)
const statusForm = ref({
  studentStatus: 'normal'
})

const statusOptions = [
  { value: 'normal', label: '正常', desc: '正常学习状态' },
  { value: 'suspended', label: '停课', desc: '暂时停止上课' },
  { value: 'dropped', label: '退费', desc: '已退费离开' },
  { value: 'leave', label: '休学', desc: '申请休学中' }
]

const filteredStudents = computed(() => {
  if (!searchQuery.value) return allStudents.value
  return allStudents.value.filter(s =>
    s.name.includes(searchQuery.value) || s.studentId.includes(searchQuery.value)
  )
})

const paginatedStudents = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredStudents.value.slice(start, end)
})

const activeCount = computed(() => allStudents.value.filter(s => s.studentStatus === 'normal').length)

const handlePageChange = (page) => { pagination.value.currentPage = page }

// 状态相关方法
const getStatusText = (status) => {
  const statusMap = {
    normal: '正常',
    suspended: '停课',
    dropped: '退费',
    leave: '休学'
  }
  return statusMap[status] || '未知'
}

const getStatusTagType = (status) => {
  const typeMap = {
    normal: 'success',
    suspended: 'warning',
    dropped: 'danger',
    leave: 'info'
  }
  return typeMap[status] || 'info'
}

const openStatusDrawer = (student) => {
  currentStudent.value = student
  statusForm.value = {
    studentStatus: student.studentStatus || 'normal'
  }
  statusDrawerVisible.value = true
}

const saveStudentStatus = () => {
  if (currentStudent.value) {
    currentStudent.value.studentStatus = statusForm.value.studentStatus
    ElMessage.success(`已更新 ${currentStudent.value.name} 的状态为：${getStatusText(statusForm.value.studentStatus)}`)
    statusDrawerVisible.value = false
  }
}

const loadStudents = () => {
  allStudents.value = studentsData[courseId.value] || studentsData.course_t001
  pagination.value.total = allStudents.value.length
}

onMounted(() => loadStudents())
</script>

<style lang="scss" scoped>
.course-students {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    h2 { font-size: 20px; font-weight: 600; color: #303133; margin: 0; }
  }

  .stats-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
    .stat-card {
      text-align: center;
      padding: 16px 32px;
      .stat-number { font-size: 28px; font-weight: 700; color: #303133; }
      .stat-label { font-size: 14px; color: #909399; }
    }
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
  
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;
      margin-top: 20px;
    }
  }
}

.status-drawer-content {
  padding: 0 24px 24px 24px;

  .student-basic-info {
    margin-bottom: 32px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;

    .info-header {
      display: flex;
      align-items: center;
      gap: 20px;

      .info-text {
        h3 {
          margin: 0 0 6px 0;
          font-size: 20px;
          font-weight: 600;
          color: white;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  .status-form {
    margin-bottom: 32px;

    .custom-radio-group {
      display: flex;
      flex-direction: column;
      gap: 0;

      .status-radio {
        display: flex;
        align-items: flex-start;
        width: 100%;
        margin-bottom: 16px;
        padding: 20px 16px;
        border: 2px solid #e4e7ed;
        border-radius: 12px;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          border-color: #667eea;
          background: #f8f6ff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        &:last-child {
          margin-bottom: 0;
        }

        &.is-checked {
          border-color: #667eea;
          background: linear-gradient(135deg, #f8f6ff 0%, #f0ebff 100%);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);

          .radio-indicator {
            border-color: #667eea;

            .radio-inner {
              background: #667eea;
            }
          }
        }

        .radio-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border: 2px solid #dcdfe6;
          border-radius: 50%;
          margin-right: 12px;
          margin-top: 2px;
          flex-shrink: 0;
          transition: all 0.3s ease;

          .radio-inner {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #667eea;
          }
        }

        .status-option {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;

          .status-label {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
          }

          .status-desc {
            font-size: 13px;
            color: #909399;
            line-height: 20px;
          }
        }
      }
    }
  }

  .drawer-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid #ebeef5;

    .el-button {
      padding: 12px 32px;
      font-size: 15px;
      font-weight: 500;
      border-radius: 8px;

      &.el-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;

        &:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
      }

      &:not(.el-button--primary) {
        border-color: #dcdfe6;
        color: #606266;

        &:hover {
          border-color: #667eea;
          color: #667eea;
          background: #f8f6ff;
        }
      }
    }
  }
}
</style>
