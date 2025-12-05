/**
 * 认证中间件
 * 用于需要登录才能访问的页面
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 在开发环境中跳过认证，直接允许访问
  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境：跳过认证检查')
    return
  }

  // 生产环境进行真实认证
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