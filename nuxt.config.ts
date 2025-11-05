// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
import mkcert from 'vite-plugin-mkcert'

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
  nitro: {
    devProxy: {
      '/gateway': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    },
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
  devServer: {
    https: false, // 暂时禁用HTTPS以解决503错误
    host: 'localhost',
    port: 3000
  },
  vite: {
    plugins: [
      mkcert() // 添加mkcert插件用于自动生成SSL证书
    ],
    server: {
      https: false, // 暂时禁用HTTPS以解决503错误
      cors: true,
      strictPort: false,
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
