import { setToken, removeToken } from '~/utils/cookie'

export const login = (token, router = null) => {
  console.log('=== login 函数被调用 ===')
  console.log('接收到的 token:', token)
  
  // 设置token到cookie（SSR和客户端都需要）
  const cookieResult = setToken(token)
  console.log('Cookie 设置结果:', cookieResult)

  // 设置用户角色为普通用户（演示模式）
  if (process.client) {
    console.log('在客户端环境中')
    
    localStorage.setItem('userToken', token)
    localStorage.setItem('userRole', 'student')
    console.log('LocalStorage 已设置')

    // 检查是否有重定向页面
    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')
    console.log('重定向页面:', redirectAfterLogin)

    let targetUrl = '/student/course'
    
    if (redirectAfterLogin) {
      localStorage.removeItem('redirectAfterLogin')
      targetUrl = redirectAfterLogin
    }
    
    console.log('准备跳转到:', targetUrl)
    
    // 立即跳转，不使用 setTimeout
    console.log('执行跳转...')
    window.location.href = targetUrl
    console.log('跳转命令已执行')
  } else {
    console.log('不在客户端环境中')
  }
}

export const logout = () => {
  // 清除token
  removeToken()

  // 清除本地存储的用户信息
  if (process.client) {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userRole')
  }
}
