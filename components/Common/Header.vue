<template>
  <el-header>
    <div class="top">
      <div class="top-nav">
        <div class="logo-container">
          <span class="logo-text">芝麻编程</span>
          <img src="~/assets/image/logo.png" alt="Logo" class="logo-image" />
        </div>
      </div>
      <div class="top-user">
        <div v-if="loginStatus">
          <common-user />
        </div>
        <div v-else>
          <nuxt-link :to="{ name: 'login' }"> 登录</nuxt-link>
          <nuxt-link :to="{ name: 'register' }"> 注册</nuxt-link>
        </div>
      </div>
    </div>
  </el-header>
</template>
<script setup>
  import { indexApi } from '~/api/index.js'
  import { getStorage, setStorage } from '~/utils/storage.js'
  // 假设 isExternalUrl 和 getToken 是从你的 utils 文件导入的
  // import { isExternalUrl } from '~/utils/validate.js' 
  // import { getToken } from '~/utils/auth.js'

  // 网站信息
  const info = ref({})
  // 导航信息
  const nav = ref([])
  // 登录状态
  const loginStatus = ref(false)

  // 搜索
  const pathUrl = useRoute().path
  const search = ref('')
  const activeUrl = ref(useRoute().path)

  // 模拟 isExternalUrl 函数 (如果它不是全局的)
  const isExternalUrl = (path) => {
    if (typeof path !== 'string') {
      return false
    }
    return /^(https?:|mailto:|tel:)/.test(path)
  }

  // 模拟 getToken 函数 (你需要从你的 auth.js 或类似文件中正确导入它)
  const getToken = () => {
    return getStorage('userToken'); // 使用正确的 token key
  }

  onMounted(() => {
    // 站点信息
    info.value = getStorage('WebsiteInfo')
    if (!info.value) {
      // 开发环境使用模拟数据
      if (process.dev) {
        const mockInfo = {
          websiteName: "AI编程学习平台",
          websiteDesc: "专业的AI编程在线学习平台",
          websiteLogo: "/image/logo.png" // 修复：使用正确的 logo 路径
        }
        setStorage('WebsiteInfo', mockInfo, 60)
        info.value = mockInfo
      } else {
        indexApi.websiteInfo().then((res) => {
          setStorage('WebsiteInfo', res, 60)
          info.value = res
        })
      }
    }

    // 导航信息
    nav.value = getStorage('WebsiteNav')
    if (!nav.value) {
      // 开发环境使用模拟数据
      if (process.dev) {
        // [!_FIXED_!] 
        // 修复：使用 navTitle, navUrl, 和 target 匹配模板
        const mockNav = [
          { id: 1, navTitle: "我的课程", navUrl: "/course/list", target: '_self' },
          { id: 2, navTitle: "作品展示", navUrl: "/works", target: '_self' },
          { id: 3, navTitle: "学习中心", navUrl: "/student/course", target: '_self' }
        ]
        setStorage('WebsiteNav', mockNav, 60)
        nav.value = mockNav
      } else {
        indexApi.websiteNav().then((res) => {
          setStorage('WebsiteNav', res, 60)
          nav.value = res
        })
      }
    }

    const token = getToken()
    if (token) {
      loginStatus.value = true
    }
  })

  // 搜索
  function handleSearch() {
    useRouter().push({ name: 'search', query: { kw: search.value } })
  }
</script>
<style lang="scss" scoped>
  /* [!_FIXED_!] 
     清除了所有非标准空格，Sass 现在可以正确解析了 
  */
  .el-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 999;
    height: 70px;
    display: flex;
    justify-content: center;
    border: 1px solid #ebeef5;
  }

  .active {
    color: #46c37b;
  }

  .top {
    width: 1200px;
    min-width: 1200px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top-nav {
      display: flex;
      align-items: center;

      .logo-container {
        display: flex;
        align-items: center;
        gap: 8px;

        .logo-text {
          font-size: 20px;
          font-weight: 600;
          color: #303133;
        }

        .logo-image {
          height: 32px;
          width: auto;
          object-fit: contain;
        }
      }
    }

    .top-user {
      img {
        border-radius: 50%;
      }

      a {
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
</style>