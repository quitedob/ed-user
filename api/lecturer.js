// 讲师 API - 使用模拟数据
export const lecturerApi = {
  // 讲师列表(搜索)
  lecturerList: async (params = {}) => {
    // 开发环境使用模拟数据
    if (process.dev) {
      await new Promise(resolve => setTimeout(resolve, 300)) // 模拟延迟
      return {
        success: true,
        data: {
          list: [
            {
              id: 1,
              lecturerName: '张教授',
              lecturerPosition: 'AI专家',
              lecturerHead: '/images/lecturer-1.jpg',
              introduce: '拥有10年AI开发经验，专注于机器学习和深度学习领域。',
              courseCount: 5,
              studentCount: 10000
            },
            {
              id: 2,
              lecturerName: '李老师',
              lecturerPosition: '全栈工程师',
              lecturerHead: '/images/lecturer-2.jpg',
              introduce: '8年全栈开发经验，精通前端和后端技术栈。',
              courseCount: 8,
              studentCount: 15000
            }
          ],
          totalCount: 2
        }
      }
    }
    // 这里可以添加生产环境的真实 API 调用
    throw new Error('Lecturer API not implemented for production')
  },

  // 讲师详情
  lecturerDetail: async (params = {}) => {
    // 开发环境使用模拟数据
    if (process.dev) {
      await new Promise(resolve => setTimeout(resolve, 300)) // 模拟延迟
      const lecturers = [
        {
          id: 1,
          lecturerName: '张教授',
          lecturerPosition: 'AI专家',
          lecturerHead: '/images/lecturer-1.jpg',
          introduce: '拥有10年AI开发经验，专注于机器学习和深度学习领域。',
          courseCount: 5,
          studentCount: 10000
        },
        {
          id: 2,
          lecturerName: '李老师',
          lecturerPosition: '全栈工程师',
          lecturerHead: '/images/lecturer-2.jpg',
          introduce: '8年全栈开发经验，精通前端和后端技术栈。',
          courseCount: 8,
          studentCount: 15000
        }
      ]

      const lecturer = lecturers.find(l => l.id == params.id)
      return {
        success: true,
        data: lecturer || lecturers[0]
      }
    }
    // 这里可以添加生产环境的真实 API 调用
    throw new Error('Lecturer detail API not implemented for production')
  }
}
