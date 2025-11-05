// Cookie解析函数
function parseCookies(cookieHeader) {
  const cookies = {}
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      cookies[name] = decodeURIComponent(value || '')
    })
  }
  return cookies
}

export default defineNuxtRouteMiddleware((to) => {
  // 获取用户登录状态（优先检查cookie，在客户端也检查localStorage）
  let userToken = null
  let userRole = null

  if (process.client) {
    // 客户端：优先检查localStorage，fallback到cookie
    userToken = localStorage.getItem('userToken')
    userRole = localStorage.getItem('userRole')
    if (!userToken) {
      // 如果localStorage没有，检查cookie
      userToken = useCookie('EDU_OS_TOKEN').value
    }
  } else {
    // SSR：检查cookie
    const headers = useRequestHeaders(['cookie'])
    const cookies = parseCookies(headers.cookie)
    userToken = cookies['EDU_OS_TOKEN']
  }

  const isLoggedIn = !!userToken
  const isAdmin = userRole === 'admin'

  console.log('Middleware check:', {
    path: to.path,
    userToken: !!userToken,
    isLoggedIn,
    isAdmin,
    isClient: process.client
  })

  // 首页重定向到登录页（仅当未登录时）
  if ((to.path === '/' || to.path === '/index') && !isLoggedIn) {
    console.log('重定向到登录页，因为未登录')
    return navigateTo('/login')
  } else if (to.path === '/' || to.path === '/index') {
    console.log('已登录用户访问首页，允许访问')
  }

  // 需要登录的页面
  const authRequired = [
    '/course',
    '/courses',
    '/account',
    '/works',
    '/lecturer',
    '/problems',
    '/assessment',
    '/reports'
  ]

  // 检查是否需要登录
  const needsAuth = authRequired.some(path => to.path.startsWith(path))

  if (needsAuth && !isLoggedIn) {
    // 保存当前页面，登录后跳转回来
    if (process.client) {
      localStorage.setItem('redirectAfterLogin', to.fullPath)
    }
    return navigateTo('/login')
  }

  // 管理员页面权限检查
  const adminPages = ['/admin']
  const needsAdmin = adminPages.some(path => to.path.startsWith(path))

  if (needsAdmin && !isAdmin) {
    return navigateTo('/403')
  }
})
