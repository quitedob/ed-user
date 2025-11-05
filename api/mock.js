// Mock API Service - 模拟API调用服务
import coursesData from '../data/courses.json'
import worksData from '../data/aigc-works.json'
import userData from '../data/user-info.json'

// 模拟网络延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API响应格式
const mockResponse = (data, success = true, message = 'success') => ({
  success,
  message,
  data,
  timestamp: new Date().toISOString()
})

// 课程相关API
export const courseApi = {
  // 获取用户已授权的课程列表（分页）
  getAuthCourses: async (params = {}) => {
    await delay()
    const { page = 1, pageSize = 10 } = params

    // 模拟分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const courses = userData.user.authCourses.slice(startIndex, endIndex)

    return mockResponse({
      list: courses,
      totalCount: userData.user.authCourses.length,
      pageCurrent: page,
      pageSize: pageSize
    })
  },

  // 获取课程详情
  getCourseDetail: async (courseId) => {
    await delay()
    const course = coursesData.courses.find(c => c.id === courseId)
    if (!course) {
      return mockResponse(null, false, '课程不存在')
    }
    return mockResponse(course)
  },

  // 获取课程学习进度
  getCourseProgress: async (courseId) => {
    await delay()
    const authCourse = userData.user.authCourses.find(c => c.courseId === courseId)
    return mockResponse(authCourse || { progress: 0 })
  },

  // 获取用户课程详情
  userCourseDetail: async (params) => {
    await delay()
    const course = coursesData.courses.find(c => c.id === params.courseId)
    if (!course) {
      return mockResponse(null, false, '课程不存在')
    }
    return mockResponse(course)
  },

  // 获取播放sign（学习签名）
  studySign: async (params) => {
    await delay()
    const { periodId, courseId } = params

    // 模拟学习签名数据
    return mockResponse({
      periodId: periodId,
      studyId: `study_${Date.now()}`,
      resourceId: `resource_${periodId}`,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    })
  },

  // 同步学习进度
  studyProgress: async (params) => {
    await delay()
    return mockResponse('OK')
  }
}

// AIGC作品相关API
export const workApi = {
  // 获取课程作品墙
  getLessonWorks: async (lessonId) => {
    await delay()
    const works = worksData.works.filter(w => w.lessonId === lessonId)
    return mockResponse(works)
  },

  // 获取我的作品
  getMyWorks: async (lessonId) => {
    await delay()
    const works = worksData.works.filter(w =>
      w.lessonId === lessonId && w.studentId === userData.user.id
    )
    return mockResponse(works.length > 0 ? works[0].works : [])
  },

  // 上传作品
  uploadWork: async (workData) => {
    await delay()
    const newWork = {
      id: Date.now(),
      ...workData,
      createdAt: new Date().toISOString()
    }
    return mockResponse(newWork)
  },

  // 删除作品
  deleteWork: async (workId) => {
    await delay()
    return mockResponse({ workId })
  }
}

// 用户相关API
export const userApi = {
  // 获取用户信息
  getUserInfo: async () => {
    await delay()
    return mockResponse(userData.user)
  },

  // 获取学习统计
  getStudyStats: async () => {
    await delay()
    return mockResponse(userData.user.learningStats)
  },

  // 更新用户信息
  updateUserInfo: async (userInfo) => {
    await delay()
    return mockResponse({ ...userData.user, ...userInfo })
  }
}

// 视频相关API
export const videoApi = {
  // 获取视频播放地址
  getVideoUrl: async (videoId) => {
    await delay()
    return mockResponse({
      videoId,
      url: `/videos/mock-${videoId}.mp4`,
      subtitle: `/subtitles/mock-${videoId}.vtt`
    })
  },

  // 记录观看进度
  recordProgress: async (videoId, currentTime) => {
    await delay()
    return mockResponse({ videoId, currentTime, progress: Math.floor((currentTime / 1800) * 100) })
  }
}

// 系统相关API
export const systemApi = {
  // 获取网站信息
  getWebsiteInfo: async () => {
    await delay()
    return mockResponse({
      websiteName: "AI编程学习平台",
      websiteDesc: "专业的AI编程在线学习平台，提供高质量的课程内容",
      logo: "/images/logo.png",
      version: "1.0.0"
    })
  },

  // 获取导航菜单
  getNavMenu: async () => {
    await delay()
    return mockResponse([
      { id: 1, title: "我的课程", url: "/courses", icon: "el-icon-document" },
      { id: 2, title: "作品展示", url: "/works", icon: "el-icon-picture" },
      { id: 3, title: "学习中心", url: "/study", icon: "el-icon-data-analysis" },
      { id: 4, title: "个人中心", url: "/profile", icon: "el-icon-user" }
    ])
  }
}

// 统一导出
export default {
  course: courseApi,
  work: workApi,
  user: userApi,
  video: videoApi,
  system: systemApi
}