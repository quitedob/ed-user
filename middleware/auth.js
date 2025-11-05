/**
 * 认证中间件
 * 用于需要登录才能访问的页面
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 检查用户是否已登录 - 使用与 cookie.js 相同的 key
  const token = useCookie('EDU_OS_TOKEN')
  
  console.log('Auth middleware - 检查token:', token.value)
  
  if (!token.value) {
    // 未登录，重定向到登录页
    console.log('Auth middleware - 未登录，重定向到登录页')
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  console.log('Auth middleware - 已登录，允许访问')
  // 已登录，允许访问
})