import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, removeToken } from '@/utils/cookie.js'
import { setStorage } from '@/utils/storage.js'
import mockApi from '@/api/mock.js'

// create an axios instance
const request = axios.create({
  baseURL: process.client ? '' : import.meta.env.VITE_BASE_URL, // HTTPS下无需代理，开发环境使用模拟数据
  timeout: 10000 // request timeout (10 seconds)
})

// request interceptor
request.interceptors.request.use(
  (config) => {
    // 在开发环境中，直接返回模拟数据，不发送真实请求
    if (process.env.NODE_ENV === 'development') {
      console.log('开发环境：拦截请求并返回模拟数据', config.url)
      // 返回一个特殊的标记，让响应拦截器知道这是mock请求
      return Promise.reject({ isMockRequest: true, config })
    }

    // 生产环境正常处理
    if (config.url.indexOf('/auth') === -1) {
      return config
    }
    // 需要token的请求
    const token = getToken()
    if (token) {
      config.headers['token'] = token
      return config
    }

    // 登录拦截
    ElMessageBox.confirm('请先登录', '提示', {
      confirmButtonText: '立即登录',
      showCancelButton: false,
      type: 'warning'
    }).then(() => {
      window.location.href = '/login'
    })
    setStorage('history', window.location.href, 5)
    return Promise.reject(config)
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  (response) => {
    const res = response.data
    //console.log('res', res)
    if (res.code && res.code === 200) {
      // 返回数据
      return Promise.resolve(res.data)
    }

    if (res.code === 301) {
      // token过期
      removeToken()
      return Promise.reject(response)
    }

    if (res.code === 302 || res.code === 303 || res.code === 304 || res.code === 305) {
      // 302token异常，303登录异常，304异地登录，305菜单过期
      ElMessageBox.confirm('异地登录', '确定登出', {
        confirmButtonText: '重新登录',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        removeToken()
        location.reload()
      })
      return Promise.reject(response)
    }

    // 其他异常
    console.error(response)
    ElMessage.error({ message: res.msg, duration: 5 * 1000 })
    return Promise.reject(response)
  },
  (error) => {
    // 处理开发环境的mock请求
    if (error.isMockRequest) {
      console.log('处理mock请求:', error.config.url)
      return handleMockRequest(error.config)
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      ElMessage.error({ message: '请求超时，请检查网络连接', duration: 3000 })
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      ElMessage.error({ message: '网络错误，请检查网络连接', duration: 3000 })
    } else if (error.response && error.response.status === 500 && error.response.data.msg) {
      ElMessage.error({ message: error.response.data.msg, duration: 5 * 1000 })
    } else {
      console.error(error)
    }
    return Promise.reject(error)
  }
)

// 处理开发环境mock请求的函数
async function handleMockRequest(config) {
  try {
    let mockData = null

    // 根据请求路径路由到相应的mock API
    if (config.url.includes('/student') || config.url.includes('/course')) {
      if (config.url.includes('/courses') || config.url.includes('/authCourses')) {
        mockData = await mockApi.course.getAuthCourses()
      } else if (config.url.includes('/course/') && config.method === 'get') {
        // 获取课程详情
        const courseId = config.url.split('/course/')[1]?.split('/')[0]
        if (courseId && !isNaN(courseId)) {
          mockData = await mockApi.course.getCourseDetail(parseInt(courseId))
        }
      } else if (config.url.includes('/user') || config.url.includes('/profile')) {
        mockData = await mockApi.user.getUserInfo()
      } else if (config.url.includes('/login') && config.method === 'post') {
        // 登录请求
        mockData = { success: true, message: '登录成功', data: { token: 'mock_token_' + Date.now() } }
      } else {
        // 默认课程数据
        mockData = await mockApi.course.getAuthCourses()
      }
    } else if (config.url.includes('/user') || config.url.includes('/profile')) {
      mockData = await mockApi.user.getUserInfo()
    } else if (config.url.includes('/login')) {
      mockData = { success: true, message: '登录成功', data: { token: 'mock_token_' + Date.now() } }
    } else {
      // 默认返回成功响应
      mockData = { success: true, message: 'Mock data', data: {} }
    }

    // 模拟API响应格式
    return Promise.resolve({
      data: {
        code: 200,
        msg: 'success',
        data: mockData.data || mockData
      }
    })
  } catch (mockError) {
    console.error('Mock request error:', mockError)
    return Promise.reject(mockError)
  }
}

/**
 * post请求
 */
export const postRequest = (url, data = {}) => {
  return request({ url: url, data: data ? data : {}, method: 'post' })
}

/**
 * get请求
 */
export const getRequest = (url) => {
  return request({ url: url, method: 'get' })
}

/**
 * put请求
 */
export const putRequest = (url, data = {}) => {
  return request({ url: url, data: data ? data : {}, method: 'put' })
}

/**
 * delete请求
 */
export const deleteRequest = (url) => {
  return request({ url: url, method: 'delete' })
}

export const upload = (url, file, fileName, cb, cancelFun) => {
  const formData = new FormData()
  formData.append(fileName, file)
  const config = {
    onUploadProgress: (progressEvent) => {
      const percent = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2))
      // 计算上传进度
      if (cb) {
        cb(percent)
      }
    }
  }
  if (cancelFun) {
    config.cancelToken = new axios.CancelToken(function excutor(c) {
      cancelFun.cancel = c
    })
  }

  return request.post(url, formData, config)
}
