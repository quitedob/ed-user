import { getRequest, postRequest } from '@/utils/request'

// 模拟课程数据
const mockCourseData = {
  id: 1,
  courseName: 'AI编程入门课程',
  courseLogo: '/images/course-1.jpg',
  coursePrice: 199,
  rulingPrice: 299,
  countBuy: 1234,
  countStudy: 5678,
  allowStudy: 1,
  isFree: 0,
  courseCollect: false,
  introduce: '这是一门专注于AI编程的入门课程，涵盖机器学习、深度学习等核心概念。通过本课程的学习，你将掌握AI编程的基本技能，为未来的AI开发打下坚实的基础。',
  rating: 4.8,
  reviewCount: 156,
  lecturerResp: {
    id: 1,
    lecturerName: '张老师',
    lecturerPosition: 'AI专家',
    lecturerHead: '/images/lecturer-1.jpg',
    introduce: '拥有10年AI开发经验，专注于机器学习和深度学习领域。'
  },
  chapterRespList: [
    {
      id: 1,
      chapterName: '第一章：AI基础概念',
      sort: 1,
      periodRespList: [
        {
          id: 11,
          periodName: '1.1 什么是人工智能',
          sort: 1,
          studyTime: 1800,
          resourceResp: { resourceType: 1 },
          periodProgress: 100
        },
        {
          id: 12,
          periodName: '1.2 机器学习简介',
          sort: 2,
          studyTime: 2400,
          resourceResp: { resourceType: 1 },
          periodProgress: 85
        }
      ]
    },
    {
      id: 2,
      chapterName: '第二章：Python基础',
      sort: 2,
      periodRespList: [
        {
          id: 21,
          periodName: '2.1 Python环境搭建',
          sort: 1,
          studyTime: 1200,
          resourceResp: { resourceType: 1 },
          periodProgress: 0
        }
      ]
    }
  ]
}

export const courseApi = {
  categoryList: () => {
    // 模拟分类数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            categoryName: 'AI编程',
            list: [
              { id: 11, categoryName: '机器学习' },
              { id: 12, categoryName: '深度学习' }
            ]
          }
        ])
      }, 200)
    })
  },

  // 课程列表(搜索)
  courseList: (params = {}) => {
    // 模拟课程列表
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          content: [mockCourseData],
          totalElements: 1,
          totalPages: 1
        })
      }, 300)
    })
  },

  // 课程详情
  courseDetail: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCourseData)
      }, 200)
    })
  },

  // 课程评论列出
  courseCommentPage: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          content: [
            {
              id: 1,
              content: '课程内容很丰富，讲师讲解清晰',
              rating: 5,
              createTime: '2024-01-15'
            }
          ],
          totalElements: 1
        })
      }, 200)
    })
  },

  // 课程详情(登录后) - 使用模拟数据
  userCourseDetail: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCourseData)
      }, 200)
    })
  },

  // 获取播放sign - 使用模拟数据
  studySign: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          periodId: params.periodId,
          studyId: Date.now(),
          resourceId: 'mock_resource_' + params.periodId,
          resourceType: 1,
          vodPlatform: 1,
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        })
      }, 300)
    })
  },

  // 同步学习进度
  studyProgress: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('OK')
      }, 100)
    })
  },

  // 创建订单
  createOrder: (params = {}) => {
    return postRequest('/user/auth/order/pay/create', params)
  },

  // 订单信息
  orderInfoView: (orderNo) => {
    return getRequest('/user/auth/order/info/view?orderNo=' + orderNo)
  },

  // 课程评论添加
  courseCommentAdd: (params = {}) => {
    return postRequest('/course/auth/user/course/comment/add', params)
  },

  // 课程收藏添加
  courseCollectAdd: (params = {}) => {
    return postRequest('/course/auth/user/course/collect/add', params)
  }
}
