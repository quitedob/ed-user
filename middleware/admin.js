/**
 * 管理员权限中间件
 * 用于需要管理员权限才能访问的页面
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 检查用户是否已登录
  const token = useCookie('token')
  const userRole = useCookie('userRole')
  
  if (!token.value) {
    // 未登录，重定向到登录页
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  // 检查是否为管理员
  if (userRole.value !== 'admin') {
    // 非管理员，重定向到403页面
    return navigateTo('/403')
  }
  
  // 是管理员，允许访问
})