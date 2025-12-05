<template>
  <div class="class-detail">
    <!-- 返回按钮和标题 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>{{ classInfo.name }}</h1>
        <p>{{ classInfo.semester }}</p>
      </div>
    </div>

    <!-- 班级统计 -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ classInfo.studentCount }}</div>
        <div class="stat-label">总学生数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ courses.length }}</div>
        <div class="stat-label">课程数量</div>
      </el-card>
    </div>

    <!-- 课程卡片区域 -->
    <el-card class="courses-section">
      <template #header>
        <div class="section-header">
          <h3>班级课程</h3>
        </div>
      </template>

      <div class="courses-grid">
        <el-card
          v-for="course in courses"
          :key="course.id"
          class="course-card"
          @click="goToCourse(course.id)"
        >
          <div class="course-header">
            <div class="course-icon" :class="course.iconClass">
              <el-icon :size="24"><Reading /></el-icon>
            </div>
            <div class="course-progress">{{ course.progress || 0 }}%</div>
          </div>
          <h4 class="course-title">{{ course.title }}</h4>
          <p class="course-description">{{ course.description }}</p>
          <div class="course-stats">
            <span class="course-stat">
              <el-icon><User /></el-icon>
              {{ course.studentCount || classInfo.studentCount }}人
            </span>
            <span class="course-stat">
              <el-icon><Document /></el-icon>
              {{ course.homeworkCount || 0 }}作业
            </span>
            <span class="course-stat">
              <el-icon><Calendar /></el-icon>
              {{ course.examCount || 0 }}考试
            </span>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 学员列表区域 -->
    <el-card class="students-section">
      <template #header>
        <div class="section-header">
          <h3>班级学员 ({{ pagination.total }}人)</h3>
        </div>
      </template>

      <div class="students-grid">
        <div v-for="student in paginatedStudents" :key="student.id" class="student-item">
          <el-avatar :size="48" :src="student.avatar" />
          <div class="student-info">
            <div class="student-name">{{ student.name }}</div>
            <div class="student-id">{{ student.studentId }}</div>
            <div class="student-progress" v-if="student.progress">
              学习进度: {{ student.progress }}%
            </div>
          </div>
          <el-tag :type="student.status === 'active' ? 'success' : 'warning'" size="small">
            {{ student.status === 'active' ? '活跃' : '不活跃' }}
          </el-tag>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next"
          small
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ArrowLeft, User, Reading, Document, Calendar } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '班级详情' })

const route = useRoute()
const router = useRouter()
const classId = computed(() => route.params.id)

// JSON格式的班级数据
const classData = {
  class_t001: {
    id: 'class_t001',
    name: '计算机2101班',
    studentCount: 28,
    semester: '2024-2025学年第一学期',
    createdAt: '2024-09-01T00:00:00Z'
  },
  class_t002: {
    id: 'class_t002',
    name: '软件工程2201班',
    studentCount: 35,
    semester: '2024-2025学年第一学期',
    createdAt: '2024-09-01T00:00:00Z'
  },
  class_t003: {
    id: 'class_t003',
    name: '数据科学2201班',
    studentCount: 42,
    semester: '2024-2025学年第一学期',
    createdAt: '2024-09-01T00:00:00Z'
  }
}

// JSON格式的课程数据
const coursesData = {
  class_t001: [
    {
      id: 'course_t001',
      title: 'Python编程基础',
      description: '学习Python语言基础语法、数据结构、函数编程等内容',
      progress: 75,
      studentCount: 28,
      homeworkCount: 12,
      examCount: 2,
      iconClass: 'python'
    },
    {
      id: 'course_t002',
      title: '数据结构与算法',
      description: '掌握常用数据结构和算法设计方法，提升编程能力',
      progress: 45,
      studentCount: 28,
      homeworkCount: 8,
      examCount: 1,
      iconClass: 'algorithm'
    },
    {
      id: 'course_t003',
      title: '数据库原理与应用',
      description: '学习关系型数据库设计、SQL语言和数据库管理系统',
      progress: 30,
      studentCount: 28,
      homeworkCount: 6,
      examCount: 1,
      iconClass: 'database'
    }
  ],
  class_t002: [
    {
      id: 'course_t004',
      title: 'JavaScript进阶开发',
      description: '深入学习JavaScript高级特性、ES6+语法和异步编程',
      progress: 60,
      studentCount: 35,
      homeworkCount: 10,
      examCount: 2,
      iconClass: 'javascript'
    },
    {
      id: 'course_t005',
      title: 'Vue.js前端框架',
      description: '学习Vue3框架开发，包括组件化、路由和状态管理',
      progress: 40,
      studentCount: 35,
      homeworkCount: 8,
      examCount: 1,
      iconClass: 'vue'
    }
  ],
  class_t003: [
    {
      id: 'course_t006',
      title: '机器学习基础',
      description: '介绍机器学习基本概念、常用算法和实际应用',
      progress: 55,
      studentCount: 42,
      homeworkCount: 9,
      examCount: 2,
      iconClass: 'ml'
    },
    {
      id: 'course_t007',
      title: '深度学习与神经网络',
      description: '学习深度学习原理、神经网络架构和框架应用',
      progress: 25,
      studentCount: 42,
      homeworkCount: 7,
      examCount: 1,
      iconClass: 'deeplearning'
    }
  ]
}

// JSON格式的学员数据生成函数（支持分页测试）
const generateStudentsData = (count) => {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二', '陈一', '林二', '黄三', '刘四', '杨五']
  const students = []
  for (let i = 1; i <= count; i++) {
    students.push({
      id: `s${String(i).padStart(3, '0')}`,
      name: names[(i - 1) % names.length] + (Math.floor((i - 1) / 15) > 0 ? String.fromCharCode(65 + Math.floor((i - 1) / 15)) : ''),
      studentId: `2021${String(i).padStart(3, '0')}`,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      phone: `138****${String(1000 + i).slice(-4)}`,
      progress: Math.floor(Math.random() * 60) + 40,
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

const classInfo = ref({ id: '', name: '', studentCount: 0 })
const courses = ref([])
const students = ref([])

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

// 分页后的学员列表
const paginatedStudents = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return students.value.slice(start, end)
})

const handlePageChange = (page) => {
  pagination.value.currentPage = page
}

const loadClassData = () => {
  const data = classData[classId.value] || classData.class_t001
  classInfo.value = data
  courses.value = coursesData[classId.value] || []
  students.value = studentsDataByClass[classId.value] || studentsDataByClass.class_t001
  pagination.value.total = students.value.length
}

const goBack = () => router.push('/teacher')
const goToCourse = (courseId) => router.push(`/teacher/course/${courseId}`)

onMounted(() => loadClassData())
</script>

<style lang="scss" scoped>
.class-detail {
  padding: 32px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;

    .header-info {
      flex: 1;
    }

    h1 {
      font-size: 24px;
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

  .courses-section {
    margin-bottom: 32px;

    .section-header {
      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 16px;

      .course-card {
        cursor: pointer;
        transition: all 0.3s;
        padding: 20px;
        border: 1px solid #e4e7ed;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #409eff;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .course-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;

            &.python { background: linear-gradient(135deg, #3776ab, #ffd43b); color: white; }
            &.javascript { background: linear-gradient(135deg, #f7df1e, #323330); color: #323330; }
            &.vue { background: linear-gradient(135deg, #4fc08d, #35495e); }
            &.algorithm { background: linear-gradient(135deg, #ff6b6b, #4ecdc4); }
            &.database { background: linear-gradient(135deg, #336791, #4479a1); }
            &.ml { background: linear-gradient(135deg, #ff6b35, #f7931e); }
            &.deeplearning { background: linear-gradient(135deg, #8e44ad, #3498db); }

            .el-icon {
              color: white;
            }
          }

          .course-progress {
            font-size: 14px;
            font-weight: 600;
            color: #409eff;
          }
        }

        .course-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 8px 0;
        }

        .course-description {
          font-size: 14px;
          color: #606266;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        .course-stats {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #909399;

          .course-stat {
            display: flex;
            align-items: center;
            gap: 4px;

            .el-icon {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .students-section {
    .section-header {
      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }

    .students-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 16px;

      .student-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 12px;
        border: 1px solid #e4e7ed;

        &:hover {
          background: #ecf5ff;
          border-color: #c6e2ff;
        }

        .student-info {
          flex: 1;

          .student-name {
            font-size: 15px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
          }

          .student-id {
            font-size: 13px;
            color: #909399;
            margin-bottom: 4px;
          }

          .student-progress {
            font-size: 12px;
            color: #67c23a;
          }
        }
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 16px;
      margin-top: 16px;
      border-top: 1px solid #ebeef5;
    }
  }
}
</style>
