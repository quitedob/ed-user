// 课程主页数据聚合API
// 这个文件模拟了后端的课程主页聚合数据接口

export const courseHubApi = {
  /**
   * 获取课程主页聚合数据
   * @param {number} courseId - 课程ID
   * @returns {Promise<Object>} 课程主页数据
   */
  async getCourseHubData(courseId) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟课程数据
    const courseData = {
      1: {
        // 基础课程信息
        id: 1,
        title: '软件工程导论',
        school: '芝麻编程',
        teacher: '李教授',
        duration: '48课时',
        startDate: '2024-08-31',
        endDate: '2025-06-31',
        cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
        description: '本课程介绍软件工程的基本概念、原理和方法，包括软件开发过程、需求分析、系统设计、编码实现、测试维护等内容。',

        // 学习进度
        progress: {
          overall: 92,
          completedChapters: 46,
          totalChapters: 50,
          lastSectionId: 5,
          studyTime: '36小时25分钟',
          lastStudyTime: '2小时前',
          estimatedTime: '还需2小时'
        },

        // 作业统计
        homework: {
          nextDeadline: '2024-12-01T23:59:59Z',
          lastScore: 85,
          completedCount: 3,
          totalCount: 5,
          pendingCount: 2,
          nextHomework: {
            id: 4,
            title: '需求分析练习题',
            deadline: '2024-12-01 23:59',
            status: 'pending'
          }
        },

        // 考试统计
        exam: {
          nextSchedule: '2024-12-15T10:00:00Z',
          lastScore: 92,
          completedCount: 1,
          totalCount: 2,
          pendingCount: 1,
          nextExam: {
            id: 2,
            title: '期中考试',
            schedule: '2024-12-15 10:00',
            status: 'upcoming'
          }
        },

        // AI助教统计
        ai: {
          unreadCount: 2,
          totalQuestions: 15,
          lastInteraction: '2小时前'
        }
      },

      2: {
        // 编译原理课程数据
        id: 2,
        title: '编译原理',
        school: '芝麻编程',
        teacher: '王教授',
        duration: '40课时',
        startDate: '2024-09-01',
        endDate: '2025-01-15',
        cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
        description: '编译原理是计算机科学与技术专业的核心课程，主要介绍编译器的设计和实现原理。',

        progress: {
          overall: 30,
          completedChapters: 12,
          totalChapters: 40,
          lastSectionId: 8,
          studyTime: '18小时15分钟',
          lastStudyTime: '1天前',
          estimatedTime: '还需42小时'
        },

        homework: {
          nextDeadline: '2024-11-25T23:59:59Z',
          lastScore: 78,
          completedCount: 1,
          totalCount: 4,
          pendingCount: 3,
          nextHomework: {
            id: 5,
            title: '词法分析器实现',
            deadline: '2024-11-25 23:59',
            status: 'pending'
          }
        },

        exam: {
          nextSchedule: '2025-01-20T14:00:00Z',
          lastScore: null,
          completedCount: 0,
          totalCount: 1,
          pendingCount: 1,
          nextExam: {
            id: 3,
            title: '期末考试',
            schedule: '2025-01-20 14:00',
            status: 'upcoming'
          }
        },

        ai: {
          unreadCount: 0,
          totalQuestions: 8,
          lastInteraction: '3天前'
        }
      }
    }

    const data = courseData[courseId]
    if (!data) {
      throw new Error(`课程 ${courseId} 不存在`)
    }

    return {
      success: true,
      data,
      message: '获取课程主页数据成功'
    }
  },

  /**
   * 获取最近学习活动
   * @param {number} courseId - 课程ID
   * @returns {Promise<Object>} 最近活动数据
   */
  async getRecentActivities(courseId) {
    await new Promise(resolve => setTimeout(resolve, 200))

    const activities = {
      1: [
        {
          id: 1,
          type: 'video',
          title: '完成了学习 "2.3 需求规格说明"',
          time: '2小时前',
          timestamp: Date.now() - 2 * 60 * 60 * 1000
        },
        {
          id: 2,
          type: 'homework',
          title: '提交了作业 "需求分析练习题"',
          time: '1天前',
          timestamp: Date.now() - 24 * 60 * 60 * 1000
        },
        {
          id: 3,
          type: 'ai',
          title: '向AI助教提问关于需求验证的问题',
          time: '2天前',
          timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
        },
        {
          id: 4,
          type: 'video',
          title: '完成了学习 "2.2 需求分析"',
          time: '3天前',
          timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
        }
      ],

      2: [
        {
          id: 5,
          type: 'video',
          title: '完成了学习 "1.4 语法分析概述"',
          time: '1天前',
          timestamp: Date.now() - 24 * 60 * 60 * 1000
        },
        {
          id: 6,
          type: 'homework',
          title: '提交了作业 "正则表达式练习"',
          time: '3天前',
          timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
        }
      ]
    }

    return {
      success: true,
      data: activities[courseId] || [],
      message: '获取最近活动成功'
    }
  },

  /**
   * 获取学习成就
   * @param {number} courseId - 课程ID
   * @returns {Promise<Object>} 学习成就数据
   */
  async getAchievements(courseId) {
    await new Promise(resolve => setTimeout(resolve, 150))

    const achievements = [
      {
        id: 1,
        name: '初学者',
        description: '完成第一节课程',
        icon: 'Star',
        unlocked: true,
        unlockedAt: Date.now() - 30 * 24 * 60 * 60 * 1000
      },
      {
        id: 2,
        name: '坚持学习',
        description: '连续学习7天',
        icon: 'Timer',
        unlocked: true,
        unlockedAt: Date.now() - 7 * 24 * 60 * 60 * 1000
      },
      {
        id: 3,
        name: '知识掌握者',
        description: '完成一个章节所有内容',
        icon: 'Reading',
        unlocked: true,
        unlockedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
      },
      {
        id: 4,
        name: '全勤学生',
        description: '完成所有作业',
        icon: 'Trophy',
        unlocked: false
      },
      {
        id: 5,
        name: '学霸',
        description: '考试获得90分以上',
        icon: 'Aim',
        unlocked: true,
        unlockedAt: Date.now() - 15 * 24 * 60 * 60 * 1000
      },
      {
        id: 6,
        name: '学习达人',
        description: '学习时长超过100小时',
        icon: 'Document',
        unlocked: false
      }
    ]

    return {
      success: true,
      data: achievements,
      message: '获取学习成就成功'
    }
  }
}

// 实际的API调用函数，可以在composables中使用
export const useCourseHub = () => {
  const loading = ref(false)
  const error = ref(null)

  const fetchCourseHubData = async (courseId) => {
    loading.value = true
    error.value = null

    try {
      const response = await courseHubApi.getCourseHubData(courseId)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRecentActivities = async (courseId) => {
    loading.value = true
    error.value = null

    try {
      const response = await courseHubApi.getRecentActivities(courseId)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAchievements = async (courseId) => {
    loading.value = true
    error.value = null

    try {
      const response = await courseHubApi.getAchievements(courseId)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchCourseHubData,
    fetchRecentActivities,
    fetchAchievements
  }
}