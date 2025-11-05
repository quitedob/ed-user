/**
 * 游客中间件
 * 用于仅游客访问的页面（如登录、注册页）
 * 已登录用户访问这些页面时会被重定向
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 检查用户是否已登录
  const token = useCookie('token')
  
  if (token.value) {
    // 已登录，重定向到首页或用户中心
    return navigateTo('/')
  }
  
  // 未登录，允许访问
})