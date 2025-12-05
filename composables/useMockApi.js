// Mock API Composable - 使用模拟API的组合式函数
import mockApi from '../api/mock'

// 使用课程的composable
export const useCourseApi = () => {
  const getAuthCourses = async () => {
    const { data } = await mockApi.course.getAuthCourses()
    return data
  }

  const getCourseDetail = async (courseId) => {
    const { data } = await mockApi.course.getCourseDetail(courseId)
    return data
  }

  const getCourseProgress = async (courseId) => {
    const { data } = await mockApi.course.getCourseProgress(courseId)
    return data
  }

  const updateProgress = async (courseId, lessonId) => {
    const { data } = await mockApi.course.updateProgress(courseId, lessonId)
    return data
  }

  return {
    getAuthCourses,
    getCourseDetail,
    getCourseProgress,
    updateProgress
  }
}

// 使用作品的composable
export const useWorkApi = () => {
  const getLessonWorks = async (lessonId) => {
    const { data } = await mockApi.work.getLessonWorks(lessonId)
    return data
  }

  const getMyWorks = async (lessonId) => {
    const { data } = await mockApi.work.getMyWorks(lessonId)
    return data
  }

  const uploadWork = async (workData) => {
    const { data } = await mockApi.work.uploadWork(workData)
    return data
  }

  const deleteWork = async (workId) => {
    const { data } = await mockApi.work.deleteWork(workId)
    return data
  }

  return {
    getLessonWorks,
    getMyWorks,
    uploadWork,
    deleteWork
  }
}

// 使用用户的composable
export const useUserApi = () => {
  const getUserInfo = async () => {
    const { data } = await mockApi.user.getUserInfo()
    return data
  }

  const getStudyStats = async () => {
    const { data } = await mockApi.user.getStudyStats()
    return data
  }

  const updateUserInfo = async (userInfo) => {
    const { data } = await mockApi.user.updateUserInfo(userInfo)
    return data
  }

  return {
    getUserInfo,
    getStudyStats,
    updateUserInfo
  }
}

// 使用视频的composable
export const useVideoApi = () => {
  const getVideoUrl = async (videoId) => {
    const { data } = await mockApi.video.getVideoUrl(videoId)
    return data
  }

  const recordProgress = async (videoId, currentTime) => {
    const { data } = await mockApi.video.recordProgress(videoId, currentTime)
    return data
  }

  return {
    getVideoUrl,
    recordProgress
  }
}

// 使用系统的composable
export const useSystemApi = () => {
  const getWebsiteInfo = async () => {
    const { data } = await mockApi.system.getWebsiteInfo()
    return data
  }

  const getNavMenu = async () => {
    const { data } = await mockApi.system.getNavMenu()
    return data
  }

  return {
    getWebsiteInfo,
    getNavMenu
  }
}