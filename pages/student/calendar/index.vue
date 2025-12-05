<template>
  <div class="calendar-page">
    <!-- 控制栏 -->
    <div class="calendar-controls">
      <div class="control-left">
        <el-select v-model="currentSemester" placeholder="选择学期" class="semester-select">
          <el-option label="2025-2026 第1学期" value="2025-1" />
          <el-option label="2024-2025 第2学期" value="2024-2" />
          <el-option label="2024-2025 第1学期" value="2024-1" />
        </el-select>
        
        <div class="week-navigator">
          <el-button :icon="ArrowLeft" @click="prevWeek" circle />
          <span class="week-text">第 {{ currentWeek }} 周</span>
          <el-button :icon="ArrowRight" @click="nextWeek" circle />
        </div>
      </div>

      <div class="control-right">
        <el-button-group class="view-toggle">
          <el-button :type="viewMode === 'day' ? 'primary' : ''" @click="viewMode = 'day'">日程</el-button>
          <el-button :type="viewMode === 'threeWeek' ? 'primary' : ''" @click="viewMode = 'threeWeek'">三周</el-button>
          <el-button :type="viewMode === 'week' ? 'primary' : ''" @click="viewMode = 'week'">周</el-button>
        </el-button-group>
        
        <el-dropdown trigger="click">
          <el-button :icon="MoreFilled" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="exportCalendar">导出日历</el-dropdown-item>
              <el-dropdown-item @click="printCalendar">打印</el-dropdown-item>
              <el-dropdown-item @click="shareCalendar">分享</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 周视图课程表 -->
    <div v-if="viewMode === 'week'" class="week-view">
      <div class="timetable-grid">
        <!-- 表头 -->
        <div class="grid-header">
          <div class="time-column-header"></div>
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="day-header"
            :class="{ 'is-today': day.isToday }"
          >
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ day.date }}</div>
          </div>
        </div>

        <!-- 时间轴和课程内容 -->
        <div class="grid-body">
          <!-- 早晨行 -->
          <div class="time-row morning-row">
            <div class="time-label">早晨</div>
            <div v-for="day in 7" :key="`morning-${day}`" class="time-cell"></div>
          </div>

          <!-- 课程时间行 -->
          <div 
            v-for="period in timePeriods" 
            :key="period.id"
            class="time-row"
          >
            <div class="time-label">
              <div class="period-number">{{ period.id }}</div>
              <div class="period-time">{{ period.time }}</div>
            </div>
            <div 
              v-for="(day, dayIndex) in 7" 
              :key="`${period.id}-${day}`"
              class="time-cell"
              @click="handleCellClick(dayIndex, period.id)"
            >
              <div 
                v-for="course in getCourseForCell(dayIndex, period.id)"
                :key="course.id"
                class="course-card"
                :class="`course-color-${course.colorIndex}`"
                :style="{ height: course.cardHeight }"
                @click.stop="showCourseDetail(course)"
              >
                <div class="course-name">{{ course.name }}</div>
                <div class="course-location">{{ course.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加课程对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="courseForm" label-width="100px">
        <el-form-item label="课程">
          <el-input v-model="courseForm.name" placeholder="输入/搜索名称" />
          <el-link type="primary" style="margin-top: 8px">共享到同周课程</el-link>
        </el-form-item>
        
        <el-form-item label="班级">
          <el-input v-model="courseForm.className" placeholder="输入/搜索名称" />
        </el-form-item>
        
        <el-form-item label="老师">
          <el-select v-model="courseForm.teacher" placeholder="选择老师" style="width: 100%">
            <el-option label="李教授" value="李教授" />
            <el-option label="王教授" value="王教授" />
            <el-option label="张老师" value="张老师" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="上课周次">
          <el-select v-model="courseForm.weeks" placeholder="选择周次" style="width: 100%">
            <el-option label="第1-16周" value="1-16" />
            <el-option label="第1-8周" value="1-8" />
            <el-option label="第9-16周" value="9-16" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="上课时间">
          <el-select v-model="courseForm.dayOfWeek" placeholder="选择星期" style="width: 100%">
            <el-option label="周一" value="1" />
            <el-option label="周二" value="2" />
            <el-option label="周三" value="3" />
            <el-option label="周四" value="4" />
            <el-option label="周五" value="5" />
            <el-option label="周六" value="6" />
            <el-option label="周日" value="7" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="开始节次">
          <el-select v-model="courseForm.startPeriod" placeholder="选择节次" style="width: 100%">
            <el-option v-for="p in 8" :key="p" :label="`第${p}节`" :value="p" />
          </el-select>
        </el-form-item>

        <el-form-item label="结束节次">
          <el-select v-model="courseForm.endPeriod" placeholder="选择节次" style="width: 100%">
            <el-option v-for="p in 8" :key="p" :label="`第${p}节`" :value="p" />
          </el-select>
        </el-form-item>

        <el-form-item label="上课地点">
          <el-input v-model="courseForm.location" placeholder="输入教室" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddCourse">确定</el-button>
      </template>
    </el-dialog>

    <!-- 课程详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedCourse?.name"
      width="500px"
    >
      <div v-if="selectedCourse" class="course-detail">
        <div class="detail-item">
          <span class="detail-label">上课时间:</span>
          <span class="detail-value">{{ selectedCourse.timeText }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">上课地点:</span>
          <span class="detail-value">{{ selectedCourse.location }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">授课教师:</span>
          <span class="detail-value">{{ selectedCourse.teacher }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">上课周次:</span>
          <span class="detail-value">{{ selectedCourse.weeks }}</span>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="editCourse">编辑</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowLeft, ArrowRight, MoreFilled } from '@element-plus/icons-vue'

definePageMeta({
  layout: false,
  title: '课程日历'
})

// 状态
const currentSemester = ref('2025-1')
const currentWeek = ref(9)
const viewMode = ref('week')
const addDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const selectedCourse = ref(null)

// 课程表单
const courseForm = ref({
  name: '',
  className: '',
  teacher: '',
  weeks: '',
  dayOfWeek: '',
  startPeriod: '',
  endPeriod: '',
  location: ''
})

// 时间段定义
const timePeriods = [
  { id: 1, time: '08:00-08:50' },
  { id: 2, time: '09:00-09:50' },
  { id: 3, time: '10:10-11:00' },
  { id: 4, time: '11:10-12:00' },
  { id: 5, time: '14:00-14:50' },
  { id: 6, time: '15:00-15:50' },
  { id: 7, time: '16:10-17:00' },
  { id: 8, time: '17:10-18:00' }
]

// 模拟课程数据
const courses = ref([
  {
    id: 1,
    name: '软件工程导论',
    location: '@教三109室',
    teacher: '李教授',
    weeks: '第1-16周',
    dayOfWeek: 0, // 周一
    startPeriod: 1,
    endPeriod: 2,
    colorIndex: 1,
    timeText: '周一 第1-2节'
  },
  {
    id: 2,
    name: '操作系统',
    location: '@教二205室',
    teacher: '王教授',
    weeks: '第1-16周',
    dayOfWeek: 0,
    startPeriod: 3,
    endPeriod: 4,
    colorIndex: 2,
    timeText: '周一 第3-4节'
  },
  {
    id: 3,
    name: '数据库系统',
    location: '@实验楼301',
    teacher: '张老师',
    weeks: '第1-16周',
    dayOfWeek: 2,
    startPeriod: 5,
    endPeriod: 6,
    colorIndex: 3,
    timeText: '周三 第5-6节'
  },
  {
    id: 4,
    name: '计算机网络',
    location: '@教一108室',
    teacher: '赵教授',
    weeks: '第1-16周',
    dayOfWeek: 3,
    startPeriod: 1,
    endPeriod: 2,
    colorIndex: 4,
    timeText: '周四 第1-2节'
  }
])

// 计算本周日期
const weekDays = computed(() => {
  const today = new Date()
  const currentDay = today.getDay() || 7 // 周日为7
  const monday = new Date(today)
  monday.setDate(today.getDate() - currentDay + 1)
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const isToday = date.toDateString() === today.toDateString()
    
    return {
      name: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      date: `${month}-${day}`,
      isToday
    }
  })
})

// 获取指定单元格的课程
const getCourseForCell = (dayIndex, periodId) => {
  return courses.value.filter(course => {
    return course.dayOfWeek === dayIndex && 
           course.startPeriod === periodId
  }).map(course => {
    const duration = course.endPeriod - course.startPeriod + 1
    // 计算高度：每个单元格80px，减去间距8px
    const height = duration * 80 - 8
    return {
      ...course,
      duration,
      cardHeight: `${height}px`
    }
  })
}

// 周导航
const prevWeek = () => {
  if (currentWeek.value > 1) {
    currentWeek.value--
  }
}

const nextWeek = () => {
  if (currentWeek.value < 20) {
    currentWeek.value++
  }
}

// 点击单元格
const handleCellClick = (dayIndex, periodId) => {
  courseForm.value = {
    name: '',
    className: '',
    teacher: '',
    weeks: '1-16',
    dayOfWeek: String(dayIndex + 1),
    startPeriod: periodId,
    endPeriod: periodId,
    location: ''
  }
  addDialogVisible.value = true
}

// 添加课程
const handleAddCourse = () => {
  const newCourse = {
    id: Date.now(),
    name: courseForm.value.name,
    location: courseForm.value.location,
    teacher: courseForm.value.teacher,
    weeks: `第${courseForm.value.weeks}周`,
    dayOfWeek: parseInt(courseForm.value.dayOfWeek) - 1,
    startPeriod: courseForm.value.startPeriod,
    endPeriod: courseForm.value.endPeriod,
    colorIndex: (courses.value.length % 4) + 1,
    timeText: `${['周一', '周二', '周三', '周四', '周五', '周六', '周日'][parseInt(courseForm.value.dayOfWeek) - 1]} 第${courseForm.value.startPeriod}-${courseForm.value.endPeriod}节`
  }
  
  courses.value.push(newCourse)
  addDialogVisible.value = false
  ElMessage.success('课程添加成功！')
}

// 显示课程详情
const showCourseDetail = (course) => {
  selectedCourse.value = course
  detailDialogVisible.value = true
}

// 编辑课程
const editCourse = () => {
  ElMessage.info('编辑功能开发中...')
}

// 导出日历
const exportCalendar = () => {
  ElMessage.info('导出功能开发中...')
}

// 打印日历
const printCalendar = () => {
  window.print()
}

// 分享日历
const shareCalendar = () => {
  ElMessage.info('分享功能开发中...')
}
</script>

<style lang="scss" scoped>
.calendar-page {
  animation: fadeIn 0.3s ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 控制栏
.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.control-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.semester-select {
  width: 200px;
}

.week-navigator {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .week-text {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    min-width: 80px;
    text-align: center;
  }
}

.control-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  margin-right: 8px;
}

// 周视图
.week-view {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: auto;
}

.timetable-grid {
  min-width: 1000px;
}

// 表头
.grid-header {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  border-bottom: 2px solid #e4e7ed;
  background: #f5f7fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.time-column-header {
  border-right: 1px solid #e4e7ed;
}

.day-header {
  padding: 16px 8px;
  text-align: center;
  border-right: 1px solid #e4e7ed;
  
  &.is-today {
    background: #ecf5ff;
    border-bottom: 3px solid #409eff;
    
    .day-name {
      color: #409eff;
      font-weight: 600;
    }
  }
  
  .day-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 4px;
  }
  
  .day-date {
    font-size: 12px;
    color: #909399;
  }
}

// 表体
.grid-body {
  .time-row {
    display: grid;
    grid-template-columns: 100px repeat(7, 1fr);
    min-height: 80px;
    border-bottom: 1px solid #e4e7ed;
    
    &.morning-row {
      min-height: 40px;
      background: #fafafa;
    }
  }
  
  .time-label {
    padding: 12px;
    text-align: center;
    border-right: 1px solid #e4e7ed;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .period-number {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }
    
    .period-time {
      font-size: 12px;
      color: #909399;
    }
  }
  
  .time-cell {
    border-right: 1px solid #e4e7ed;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
    overflow: hidden; // 防止子元素溢出
    
    &:hover {
      background: #f5f7fa;
    }
  }
}

// 课程卡片
.course-card {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(100% - 8px);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 5;
  }
  
  .course-name {
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
  }
  
  .course-location {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
  }
}

// 课程颜色
.course-color-1 {
  background: linear-gradient(135deg, #ff9a56, #ff6b6b);
}

.course-color-2 {
  background: linear-gradient(135deg, #48c774, #3ec46d);
}

.course-color-3 {
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
}

.course-color-4 {
  background: linear-gradient(135deg, #f06292, #ec407a);
}

// 课程详情
.course-detail {
  .detail-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .detail-label {
      min-width: 100px;
      font-weight: 600;
      color: #606266;
    }
    
    .detail-value {
      flex: 1;
      color: #303133;
    }
  }
}

// 响应式
@media (max-width: 1200px) {
  .calendar-controls {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .control-left,
  .control-right {
    justify-content: center;
  }
}
</style>