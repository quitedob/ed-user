// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
import fs from 'fs'
import path from 'path'

export default defineNuxtConfig({
  experimental: {
    asyncContext: true
  },
  css: ['~/assets/styles/main.scss'],
  modules: ['@element-plus/nuxt', '@vueuse/nuxt'],
  runtimeConfig: {
    public: {
      useMockData: process.env.NODE_ENV === 'development' // 开发环境使用模拟数据
    }
  },
  // 禁用服务器端渲染以解决hydration mismatch问题
  ssr: false,

  nitro: {
    // 注释掉代理配置，因为应用完全使用模拟数据，没有真实后端
    // devProxy: {
    //   '/gateway': {
    //     target: 'https://localhost:8080', // 开发环境后端使用HTTPS
    //     changeOrigin: true,
    //     secure: false, // 开发环境忽略SSL证书验证
    //     headers: {
    //       'X-Forwarded-Proto': 'https' // 告诉后端这是HTTPS请求
    //     }
    //   }
    // },
    routeRules: {
      // 301永久重定向：旧的课程学习页面重定向到新的学生门户
      '/course/study': { redirect: { to: '/student/course', statusCode: 301 } }
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: false,
      headers: ['Content-Type', 'Authorization', 'X-Requested-With']
    }
  },
  vite: {
    server: {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
      },
      cors: true,
      strictPort: false,
      host: 'localhost',
      port: 3000,
      hmr: {
        port: 3001
      }
    },
    build: {
      minify: 'terser',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_console: import.meta.env.VITE_DROP_CONSOLE,
          drop_debugger: import.meta.env.VITE_DROP_DEBUGGER
        }
      }
    }
  },
  sourcemap: {
    server: import.meta.env.NODE_ENV === 'development',
    client: import.meta.env.NODE_ENV === 'development'
  },
  telemetry: true,
  compatibilityDate: '2025-08-25'
})
