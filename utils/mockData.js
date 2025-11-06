// Mock Data Utility - 统一的模拟数据工具

// 模拟网站信息
export const websiteInfo = {
  websiteName: 'AI编程学习平台',
  websiteDesc: '专业的AI编程在线学习平台，提供高质量的课程内容',
  rsaLoginPublicKey: 'mock_public_key',
  wxPcLoginEnable: '1',
  websiteDomain: 'https://localhost:3000/'
}

// 模拟讲师数据
export const mockLecturerList = [
  {
    id: 1,
    lecturerName: '张老师',
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

// 模拟讲师详情
export const getMockLecturerDetail = (id) => {
  return mockLecturerList.find(lecturer => lecturer.id == id) || mockLecturerList[0]
}

// 模拟用户数据
export const mockUserInfo = {
  id: 1001,
  username: 'student001',
  nickname: '小明同学',
  avatar: '/images/user-avatar.jpg',
  email: 'student001@example.com',
  phone: '138****0001',
  level: '初级学员',
  joinDate: '2024-01-01T00:00:00Z',
  studyDays: 28,
  totalStudyTime: 8640,
  completedLessons: 5,
  totalLessons: 12
}

// 通用API调用包装器，添加延迟模拟
export const mockApiCall = (data, delay = 100) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay)
  })
}