<template>
  <div class="class-attendance">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft" text size="large">返回</el-button>
      <div class="header-info">
        <h1>考勤管理</h1>
        <p>{{ classInfo.name }}</p>
      </div>
      <el-button type="primary" @click="startAttendance">
        <el-icon><Plus /></el-icon> 发起签到
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-number">{{ attendanceRecords.length }}</div>
        <div class="stat-label">签到次数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-number">{{ avgAttendanceRate }}%</div>
        <div class="stat-label">平均出勤率</div>
      </el-card>
    </div>

    <!-- 签到记录列表 -->
    <el-card class="records-card">
      <template #header>
        <div class="card-header">
          <h3>签到记录</h3>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
        </div>
      </template>

      <el-table :data="attendanceRecords" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'qrcode' ? 'primary' : 'success'" size="small">
              {{ row.type === 'qrcode' ? '扫码签到' : '手动签到' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="签到情况" width="180">
          <template #default="{ row }">
            <span class="attendance-stat">
              <span class="present">{{ row.presentCount }}</span> /
              <span class="total">{{ row.totalCount }}</span>
              <span class="rate">({{ Math.round(row.presentCount / row.totalCount * 100) }}%)</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="缺勤学生">
          <template #default="{ row }">
            <span v-if="row.absentStudents.length === 0" class="all-present">全勤</span>
            <span v-else class="absent-list">{{ row.absentStudents.join('、') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 发起签到对话框 -->
    <el-dialog v-model="attendanceDialogVisible" title="发起签到" width="500px">
      <el-form :model="attendanceForm" label-width="100px">
        <el-form-item label="签到方式">
          <el-radio-group v-model="attendanceForm.type">
            <el-radio label="qrcode">扫码签到</el-radio>
            <el-radio label="manual">手动签到</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效时间" v-if="attendanceForm.type === 'qrcode'">
          <el-select v-model="attendanceForm.duration">
            <el-option label="5分钟" :value="5" />
            <el-option label="10分钟" :value="10" />
            <el-option label="15分钟" :value="15" />
            <el-option label="30分钟" :value="30" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="attendanceForm.remark" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="attendanceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAttendance">确定</el-button>
      </template>
    </el-dialog>

    <!-- 签到二维码对话框 -->
    <el-dialog v-model="qrcodeDialogVisible" title="扫码签到" width="400px" center>
      <div class="qrcode-content">
        <div class="qrcode-placeholder">
          <el-icon :size="120" color="#409eff"><Connection /></el-icon>
        </div>
        <div class="qrcode-info">
          <p>请学生扫描二维码签到</p>
          <p class="countdown">剩余时间：{{ countdown }}秒</p>
        </div>
        <div class="attendance-progress">
          <span>已签到：{{ signedCount }}/{{ totalStudents }}</span>
          <el-progress :percentage="Math.round(signedCount / totalStudents * 100)" />
        </div>
      </div>
      <template #footer>
        <el-button @click="endAttendance">结束签到</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Connection } from '@element-plus/icons-vue'

definePageMeta({ layout: 'teacher', title: '考勤管理' })

const route = useRoute()
const router = useRouter()
const classId = computed(() => route.params.id)

// JSON格式的班级数据
const classData = {
  class_t001: { name: '计算机2101班', studentCount: 28 },
  class_t002: { name: '软件工程2201班', studentCount: 35 },
  class_t003: { name: '数据科学2201班', studentCount: 65 }
}

// JSON格式的考勤记录数据
const attendanceData = {
  class_t001: [
    { id: 1, date: '2024-12-20', time: '08:30', type: 'qrcode', presentCount: 26, totalCount: 28, absentStudents: ['王五', '赵六'] },
    { id: 2, date: '2024-12-18', time: '08:30', type: 'qrcode', presentCount: 28, totalCount: 28, absentStudents: [] },
    { id: 3, date: '2024-12-16', time: '08:30', type: 'manual', presentCount: 25, totalCount: 28, absentStudents: ['张三', '李四', '王五'] },
    { id: 4, date: '2024-12-13', time: '08:30', type: 'qrcode', presentCount: 27, totalCount: 28, absentStudents: ['钱七'] }
  ],
  class_t002: [
    { id: 5, date: '2024-12-20', time: '09:00', type: 'qrcode', presentCount: 33, totalCount: 35, absentStudents: ['陈一', '林二'] },
    { id: 6, date: '2024-12-18', time: '09:00', type: 'qrcode', presentCount: 35, totalCount: 35, absentStudents: [] },
    { id: 7, date: '2024-12-15', time: '09:00', type: 'manual', presentCount: 32, totalCount: 35, absentStudents: ['张三', '李四', '王五'] }
  ],
  class_t003: [
    { id: 8, date: '2024-12-20', time: '10:00', type: 'qrcode', presentCount: 60, totalCount: 65, absentStudents: ['学员A', '学员B', '学员C', '学员D', '学员E'] },
    { id: 9, date: '2024-12-18', time: '10:00', type: 'qrcode', presentCount: 63, totalCount: 65, absentStudents: ['学员F', '学员G'] },
    { id: 10, date: '2024-12-16', time: '10:00', type: 'manual', presentCount: 58, totalCount: 65, absentStudents: ['学员H', '学员I', '学员J', '学员K', '学员L', '学员M', '学员N'] }
  ]
}

const classInfo = ref({ name: '计算机2101班' })
const dateRange = ref([])
const attendanceDialogVisible = ref(false)
const qrcodeDialogVisible = ref(false)
const countdown = ref(300)
const signedCount = ref(0)
const totalStudents = ref(28)
const attendanceRecords = ref([])

const attendanceForm = ref({
  type: 'qrcode',
  duration: 10,
  remark: ''
})

const loadData = () => {
  const data = classData[classId.value] || classData.class_t001
  classInfo.value = data
  totalStudents.value = data.studentCount
  attendanceRecords.value = attendanceData[classId.value] || attendanceData.class_t001
}

onMounted(() => loadData())

const avgAttendanceRate = computed(() => {
  if (attendanceRecords.value.length === 0) return 0
  const total = attendanceRecords.value.reduce((sum, r) => sum + r.presentCount / r.totalCount, 0)
  return Math.round(total / attendanceRecords.value.length * 100)
})

const goBack = () => router.push(`/teacher/class/${classId.value}`)
const startAttendance = () => { attendanceDialogVisible.value = true }
const viewDetail = (record) => ElMessage.info(`查看签到详情：${record.date}`)

const confirmAttendance = () => {
  attendanceDialogVisible.value = false
  if (attendanceForm.value.type === 'qrcode') {
    countdown.value = attendanceForm.value.duration * 60
    signedCount.value = 0
    qrcodeDialogVisible.value = true
    // 模拟签到
    const timer = setInterval(() => {
      if (signedCount.value < totalStudents.value && Math.random() > 0.7) {
        signedCount.value++
      }
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        endAttendance()
      }
    }, 1000)
  } else {
    ElMessage.success('已开启手动签到')
  }
}

const endAttendance = () => {
  qrcodeDialogVisible.value = false
  ElMessage.success(`签到结束，共${signedCount.value}人签到`)
  // 添加记录
  attendanceRecords.value.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString().slice(0, 5),
    type: attendanceForm.value.type,
    presentCount: signedCount.value,
    totalCount: totalStudents.value,
    absentStudents: signedCount.value < totalStudents.value ? ['未签到学生'] : []
  })
}
</script>

<style lang="scss" scoped>
.class-attendance {
  padding: 32px;
  min-height: calc(100vh - 64px);
  background: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    .header-info { flex: 1; }
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
      .stat-number { font-size: 32px; font-weight: 700; color: #303133; }
      .stat-label { font-size: 14px; color: #909399; }
    }
  }

  .records-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 { margin: 0; font-size: 16px; font-weight: 600; }
    }

    .attendance-stat {
      .present { color: #67c23a; font-weight: 600; }
      .total { color: #303133; }
      .rate { color: #909399; margin-left: 8px; }
    }

    .all-present { color: #67c23a; font-weight: 500; }
    .absent-list { color: #f56c6c; }
  }
}

.qrcode-content {
  text-align: center;

  .qrcode-placeholder {
    width: 200px;
    height: 200px;
    margin: 0 auto 20px;
    background: #f5f7fa;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qrcode-info {
    margin-bottom: 20px;
    p { margin: 8px 0; color: #606266; }
    .countdown { font-size: 24px; font-weight: 700; color: #409eff; }
  }

  .attendance-progress {
    text-align: left;
    span { display: block; margin-bottom: 8px; color: #606266; }
  }
}
</style>
