// Course Hub Composable - 课程主页聚合数据API
export const useCourseHub = () => {
  /**
   * 获取课程主页聚合数据
   * 这是一个聚合API，一次性返回课程主页所需的所有数据
   * 避免多次请求造成的性能问题
   */
  const fetchCourseHubData = async (courseId) => {
    // TODO: 替换为真实的API调用
    // const { data } = await $fetch(`/api/student/course/${courseId}/hub`)
    
    // 模拟数据
    return {
      id: courseId,
      title: '软件工程导论',
      school: '芝麻编程',
      teacher: '李教授',
      duration: '16周',
      startDate: '2024-08-31',
      endDate: '2025-06-31',
      cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
      description: '本课程系统介绍软件工程的基本概念、原理和方法',
      progress: {
        overall: 92,
        completedChapters: 46,
        totalChapters: 50,
        studyTime: '48小时',
        lastStudyTime: '2小时前',
        lastSectionId: 123,
        estimatedTime: '52小时'
      },
      homework: {
        completedCount: 3,
        pendingCount: 2,
        totalCount: 5,
        nextDeadline: '2024-12-01T23:59:59Z',
        lastScore: 85
      },
      exam: {
        completedCount: 1,
        pendingCount: 1,
        totalCount: 2,
        nextSchedule: '2024-12-15T10:00:00Z',
        lastScore: 92
      },
      ai: {
        totalQuestions: 15,
        unreadCount: 2,
        lastInteraction: '2小时前'
      }
    }
  }

  /**
   * 获取最近学习活动
   */
  const fetchRecentActivities = async (courseId) => {
    // TODO: 替换为真实的API调用
    // const { data } = await $fetch(`/api/student/course/${courseId}/activities`)
    
    return [
      {
        id: 1,
        type: 'video',
        title: '完成了学习 "2.3 需求规格说明"',
        time: '2小时前'
      },
      {
        id: 2,
        type: 'homework',
        title: '提交了作业 "需求分析练习题"',
        time: '1天前'
      },
      {
        id: 3,
        type: 'ai',
        title: '向AI助教提问关于需求验证的问题',
        time: '2天前'
      },
      {
        id: 4,
        type: 'video',
        title: '完成了学习 "2.2 需求分析"',
        time: '3天前'
      }
    ]
  }

  /**
   * 获取学习成就
   */
  const fetchAchievements = async (courseId) => {
    // TODO: 替换为真实的API调用
    // const { data } = await $fetch(`/api/student/course/${courseId}/achievements`)
    
    return [
      {
        id: 1,
        name: '初学者',
        description: '完成第一节课程',
        icon: 'Star',
        unlocked: true
      },
      {
        id: 2,
        name: '坚持学习',
        description: '连续学习7天',
        icon: 'Timer',
        unlocked: true
      },
      {
        id: 3,
        name: '知识掌握者',
        description: '完成一个章节所有内容',
        icon: 'Reading',
        unlocked: true
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
        unlocked: true
      },
      {
        id: 6,
        name: '学习达人',
        description: '学习时长超过100小时',
        icon: 'Document',
        unlocked: false
      }
    ]
  }

  return {
    fetchCourseHubData,
    fetchRecentActivities,
    fetchAchievements
  }
}
