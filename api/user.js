import { getRequest, postRequest, putRequest } from '@/utils/request'

// 模拟数据
const mockUserData = {
  id: 1001,
  username: "student001",
  nickname: "小明同学",
  userHead: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  email: "student001@example.com",
  phone: "138****0001",
  level: "初级学员",
  joinDate: "2024-01-01T00:00:00Z",
  studyDays: 28,
  totalStudyTime: 8640,
  completedLessons: 5,
  totalLessons: 12
}

export const userApi = {
  // 我的课程
  userCoursePage: (params = {}) => {
    return postRequest('/course/auth/user/course/page', params)
  },

  // 我的订单
  orderPage: (params = {}) => {
    return postRequest('/user/auth/order/info/page', params)
  },

  // 继续支付
  continuePay: (params = {}) => {
    return postRequest('/user/auth/order/pay/continue', params)
  },

  // 取消支付
  cancelOrder: (params = {}) => {
    return putRequest('/user/auth/order/pay/cancel', params)
  },

  // 用户信息修改
  usersUpdate: (params = {}) => {
    return postRequest('/user/auth/users/edit', params)
  },

  // 用户信息 - 使用模拟数据
  getUserInfo: () => {
    // 返回模拟数据，模拟异步请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserData)
      }, 100) // 模拟100ms的延迟
    })
  },

  // 用户绑定微信
  userBinding: (params = {}) => {
    return postRequest('/user/auth/users/binding', params)
  },

  // 用户解绑微信
  userUnbind: () => {
    return getRequest('/user/auth/users/unbind')
  },

  // 课程收藏列出
  userCourseCollectPage: (params = {}) => {
    return postRequest('/course/auth/user/course/collect/page', params)
  }
}
