<template>
  <div class="homepage-content">
    <!-- 学习概览区域 -->
    <div class="study-overview">
      <div class="section-header">
        <span class="col_block" />
        <h2>我的学习概览</h2>
      </div>
      <div class="overview-cards">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-number">{{ userInfo.completedLessons }}/{{ userInfo.totalLessons }}</div>
            <div class="stat-label">已完成课程</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-info">
            <div class="stat-number">{{ Math.floor(userInfo.totalStudyTime / 60) }}h</div>
            <div class="stat-label">总学习时长</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎨</div>
          <div class="stat-info">
            <div class="stat-number">{{ userInfo.learningStats.totalWorks }}</div>
            <div class="stat-label">作品数量</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <div class="stat-number">{{ userInfo.learningStats.streak }}</div>
            <div class="stat-label">连续学习天数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的课程区域 -->
    <div class="my-courses">
      <div class="section-header">
        <span class="col_block" />
        <h2>我的课程</h2>
        <nuxt-link to="/student/course" class="more-link">查看全部 ></nuxt-link>
      </div>
      <div class="course-grid">
        <div v-for="course in authCourses" :key="course.courseResp?.id" class="course-card">
          <div class="course-cover">
            <img :src="course.cover || '/images/default-course.jpg'" :alt="course.courseResp?.courseName" />
            <div class="course-progress">
              <div class="progress-bar" :style="{ width: course.courseProgress + '%' }"></div>
            </div>
          </div>
          <div class="course-info">
            <h3>{{ course.courseResp?.courseName }}</h3>
            <div class="course-meta">
              <span class="progress-text">进度: {{ course.courseProgress }}%</span>
            </div>
            <el-button type="primary" size="small" @click="goToCourse(course.courseResp?.id)">
              继续学习
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近作品展示 -->
    <div class="recent-works">
      <div class="section-header">
        <span class="col_block" />
        <h2>最新作品展示</h2>
        <nuxt-link to="/works" class="more-link">查看更多 ></nuxt-link>
      </div>
      <div class="works-grid">
        <div v-for="work in recentWorks" :key="work.id" class="work-card">
          <div class="work-type-icon">{{ getWorkTypeIcon(work.type) }}</div>
          <div class="work-info">
            <h4>{{ work.title }}</h4>
            <p class="work-desc">{{ work.description }}</p>
            <div class="work-meta">
              <span class="author">{{ work.studentName }}</span>
              <span class="time">{{ formatTime(work.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useCourseApi } from '~/composables/useMockApi'
import coursesData from '~/data/courses.json'

const courseApi = useCourseApi()
const router = useRouter()

// 用户信息
const userInfo = ref({
  completedLessons: 5,
  totalLessons: 12,
  totalStudyTime: 8640,
  learningStats: {
    totalWorks: 8,
    streak: 7
  }
})

// 已授权课程
const authCourses = ref([])

// 最近作品
const recentWorks = ref([
  {
    id: 1,
    type: 'image',
    title: 'AI编程思维导图',
    description: '整理AI编程知识点',
    studentName: '张小明',
    createdAt: '2024-01-15T11:45:00Z'
  },
  {
    id: 2,
    type: 'video',
    title: '机器学习项目演示',
    description: '展示第一个ML项目',
    studentName: '李小红',
    createdAt: '2024-01-16T14:20:00Z'
  }
])

// 获取数据
onMounted(async () => {
  try {
    console.log('Zone/Course: 开始加载课程数据')
    const { getAuthCourses } = useCourseApi()
    const response = await getAuthCourses()
    console.log('Zone/Course: API响应:', response)

    // composables返回的是mockResponse的data属性，所以直接使用list
    authCourses.value = response || []
    console.log('Zone/Course: 课程列表:', authCourses.value)

    // 确保authCourses.value是数组
    if (!Array.isArray(authCourses.value)) {
      console.warn('Zone/Course: authCourses不是数组，转换为空数组')
      authCourses.value = []
    }

    // 为每个课程添加封面图片
    authCourses.value = authCourses.value.map(course => {
      const courseDetail = coursesData.courses.find(c => c.id === course.courseResp?.id)
      console.log('Zone/Course: 查找课程详情:', course.courseResp?.id, courseDetail)
      return {
        ...course,
        cover: courseDetail?.cover || '/images/default-course.jpg'
      }
    })
    console.log('Zone/Course: 处理后的课程列表:', authCourses.value)
  } catch (error) {
    console.error('获取课程数据失败:', error)
  }
})

// 跳转到课程详情
const goToCourse = (courseId) => {
  console.log('Zone/Course: 跳转到课程详情页, courseId:', courseId)
  router.push(`/course/${courseId}`)
}

// 获取作品类型图标
const getWorkTypeIcon = (type) => {
  const icons = {
    article: '📝',
    image: '🖼️',
    video: '🎬',
    music: '🎵',
    webpage: '🌐'
  }
  return icons[type] || '📄'
}

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>
<style lang="scss" scoped>
.homepage-content {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .col_block {
    display: inline-block;
    width: 4px;
    height: 24px;
    background: #409eff;
    margin-right: 12px;
    border-radius: 2px;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }

  .more-link {
    margin-left: auto;
    color: #909399;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      color: #409eff;
      text-decoration: none;
    }
  }
}

// 学习概览区域
.study-overview {
  background: #f6f8fb;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;

  .overview-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 32px;
      margin-right: 16px;
    }

    .stat-info {
      flex: 1;

      .stat-number {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        line-height: 1;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 8px;
      }
    }
  }
}

// 我的课程区域
.my-courses {
  margin-bottom: 30px;

  .course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .course-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .course-cover {
      position: relative;
      height: 160px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .course-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(0, 0, 0, 0.2);

        .progress-bar {
          height: 100%;
          background: #67c23a;
          transition: width 0.3s ease;
        }
      }
    }

    .course-info {
      padding: 20px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
        line-height: 1.4;
      }

      .course-meta {
        margin-bottom: 16px;

        .progress-text {
          font-size: 14px;
          color: #67c23a;
          font-weight: 500;
        }
      }
    }
  }
}

// 最近作品展示
.recent-works {
  .works-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .work-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: flex-start;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .work-type-icon {
      font-size: 32px;
      margin-right: 16px;
      flex-shrink: 0;
    }

    .work-info {
      flex: 1;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }

      .work-desc {
        font-size: 14px;
        color: #606266;
        margin: 0 0 12px 0;
        line-height: 1.5;
      }

      .work-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #909399;

        .author {
          font-weight: 500;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .homepage-content {
    width: 100%;
    padding: 16px;
  }

  .overview-cards {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr !important;
  }

  .course-grid,
  .works-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
