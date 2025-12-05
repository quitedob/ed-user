<template>
  <div class="login_body">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/image/common_login.png" alt="" />
      </div>
      <div class="login_content">
        <img v-if="isPwdLogin && websiteInfo?.wxPcLoginEnable === '1'" src="https://asset.roncoos.com/static/qr.png" class="login_ico" @click="switchLogin" alt="" />
        <img v-if="!isPwdLogin && websiteInfo?.wxPcLoginEnable === '1'" src="https://asset.roncoos.com/static/pc.png" class="login_ico" @click="switchLogin" alt="" />
        <div v-if="isPwdLogin" class="login_pc">
          <div class="login_form">
            <div class="login_title">账号登录</div>
            <el-form v-loading="loading" :model="loginForm" @keyup.enter="handleLogin()">
              <div class="demo-notice">
                <el-alert
                  title="演示模式"
                  description="点击下方按钮即可直接登录体验系统"
                  type="info"
                  :closable="false"
                  show-icon
                />
              </div>
              <el-form-item class="form-group" prop="mobile">
                <el-input v-model="loginForm.mobile" placeholder="手机号（可选）" />
              </el-form-item>
              <el-form-item class="form-group" prop="password">
                <el-input v-model="mobilePwd" placeholder="密码（可选）" type="password" show-password />
              </el-form-item>
              <el-form-item class="form-group" prop="verCode">
                <el-input v-model="loginForm.verCode" class="var-input" placeholder="验证码（可选）" />
                <img class="var-img" :src="verImg" @click="getCaptcha" />
              </el-form-item>
              <div class="login-info">
                <el-checkbox v-model="loginForm.isAgreement" size="default"> 登录即同意<span class="blue_text" @click="loginForm.visible = true">《隐私政策》</span> </el-checkbox>
                <nuxt-link :to="{ name: 'reset' }">
                  <div class="login-info-reset">忘记密码？</div>
                </nuxt-link>
              </div>
              <el-button class="login-button" type="primary" size="large" @click="handleLogin">
                🚀 演示登录
              </el-button>
              <el-button class="login-button" type="success" size="large" @click="handleTeacherLogin">
                👨‍🏫 教师登录--可参考如果不行就删除
              </el-button>
            </el-form>
            <div class="login_other">
              <nuxt-link :to="{ name: 'register' }"> 没有账号，我要注册</nuxt-link>
            </div>
          </div>
        </div>
        <div v-if="!isPwdLogin" class="login_app">
          <iframe v-if="!binding" :src="wxLoginUrl" class="login_iframe" />
          <div v-if="binding" class="login_form">
            <div class="login_title">账号绑定</div>
            <el-form v-loading="loading" :model="bindingForm" @keyup.enter="handleBinding()">
              <el-form-item class="form-group" prop="mobile">
                <el-input v-model="bindingForm.mobile" placeholder="手机号" autofocus />
              </el-form-item>
              <el-form-item prop="code">
                <el-input v-model="bindingForm.code" placeholder="验证码">
                  <template #suffix>
                    <el-button link type="primary" @click="getCode"> 获取验证码</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <div style="color: #999; margin-bottom: 74px">若手机号没注册，则会自动注册</div>
              <el-button class="login-button" type="primary" size="large" @click="handleBinding()"> 绑定登录 </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { loginApi } from '~/api/login.js'
  import { encrypt, getBrowserInfo, getOsInfo } from '~/utils/base'
  import { indexApi } from '~/api'
  import { login } from '~/utils/login'

  const router = useRouter()
  const route = useRoute()
  const loading = ref(false)
  const binding = ref(false)

  // 是否为密码登录
  const isPwdLogin = ref(true)
  // 密码
  const mobilePwd = ref('')

  // 登录信息
  const loginForm = reactive({
    verCode: '',
    isAgreement: true
  })
  // 绑定信息
  const bindingForm = reactive({
    isAgreement: true
  })

  const wxLoginUrl = ref('')

  // 使用静态数据替代API调用，避免加载延迟
  const websiteInfo = ref({
    websiteName: 'AI编程学习平台',
    websiteDesc: '专业的AI编程在线学习平台',
    rsaLoginPublicKey: 'mock_public_key',
    wxPcLoginEnable: '1',
    websiteDomain: 'https://localhost:3000/'
  })

  useHead({
    title: '用户登录',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '芝麻编程,在线教育系统,开源教育系统' },
      // [修复 1] content 属性改为一个返回响应式值的函数
      { 
        hid: 'description', 
        name: 'description', 
        content: () => {
          return websiteInfo.value && websiteInfo.value.websiteDesc
            ? websiteInfo.value.websiteDesc
            : '芝麻编程 - 专业的AI编程在线学习平台'
        }
      }
    ]
  })

  onMounted(async () => {
    if (route.query.code) {
      // 微信登录
      isPwdLogin.value = false
      // 根据授权码获取用户信息
      try {
        // 开发环境模拟微信扫码登录
        if (process.dev) {
          ElMessage.success('模拟微信扫码登录成功')
          navigateTo('/student/course')
          return
        }
        const res = await loginApi.wxCode({
          code: route.query.code,
          loginAuthType: 1,
          clientType: 1,
          os: getOsInfo(),
          browser: getBrowserInfo().name
        })
        if (res.bindingStatus) {
          // 已经绑定直接登录
          login(res.token)
        } else {
          // 进行绑定
          binding.value = true
          bindingForm.unionId = res.userInfo.unionId
          bindingForm.openId = res.userInfo.openid
        }
      } catch (e) {
        isPwdLogin.value = true
        // 重新扫码
        switchLogin()
      }
    }

    if (isPwdLogin.value) {
      // 密码登录，获取验证码
      await getCaptcha()
    }
  })

  // 切换登录方式
  const switchLogin = () => {
    isPwdLogin.value = !isPwdLogin.value
    if (!isPwdLogin.value) {
      const redirectUrl = websiteInfo.value.websiteDomain + 'login'
      // 开发环境跳过微信登录
      if (process.dev) {
        ElMessage.success('模拟登录成功')
        navigateTo('/student/course')
      } else {
        loginApi.wxLogin({ loginAuthType: 1, redirectUrl: redirectUrl }).then((res) => {
        wxLoginUrl.value = res
      })
    }

    if (isPwdLogin.value) {
      // 密码登录，获取验证码
      getCaptcha()
    }
   }
  // **[修复 3]** 删除了这里多余的 '}'
  }

  // 获取图形验证码
  const verImg = ref()

  async function getCaptcha() {
    try {
      // 开发环境模拟验证码
      if (process.dev) {
        // **[修复 2]** 将 captchaImg.value 修正为 verImg.value
        verImg.value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        return
      }
      const res = await loginApi.getCodeImg()
      loginForm.verToken = res.verToken
      verImg.value = res.img
    } catch (error) {
      console.error(error)
    }
  }

  // 获取手机验证码
  async function getCode() {
    if (!bindingForm.mobile) {
      ElMessage.error('请输入手机号')
      return
    }
    if (!/^1[3456789]\d{9}$/.test(bindingForm.mobile)) {
      ElMessage.error('请输入正确的手机号')
      return
    }
    loading.value = true
    try {
      const res = await loginApi.getMobileCode({ mobile: bindingForm.mobile })
      ElMessage.success(res)
    } finally {
      loading.value = false
    }
  }

  async function handleBinding() {
    if (!bindingForm.mobile) {
      ElMessage.error('请输入手机号')
      return
    }
    if (!/^1[3456789]\d{9}$/.test(bindingForm.mobile)) {
      ElMessage.error('请输入正确的手机号')
      return
    }
    loading.value = true
    try {
      // 绑定
      bindingForm.os = getOsInfo()
      bindingForm.browser = getBrowserInfo().name
      const res = await loginApi.wxBinding(bindingForm)
      login(res.token)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  function handleLogin() {
    console.log('=== handleLogin 函数被调用 ===')

    // 直接登录成功（演示模式）
    loading.value = true

    try {
      // 设置模拟token
      const mockToken = 'student_demo_token_' + Date.now()
      console.log('生成的 token:', mockToken)

      // 显示Element Plus消息提示
      ElMessage.success('学生登录成功！正在跳转...')

      // 清除可能存在的旧数据
      if (process.client) {
        localStorage.removeItem('redirectAfterLogin')
        localStorage.setItem('userType', 'student')
        console.log('已清除旧的重定向数据')
      }

      // 执行登录逻辑
      console.log('准备调用 login 函数...')
      login(mockToken)
      console.log('login 函数调用完成')

    } catch (error) {
      console.error('登录错误:', error)
      ElMessage.error('登录失败，请重试')
      loading.value = false
    }
  }

  function handleTeacherLogin() {
    console.log('=== handleTeacherLogin 函数被调用 ===')

    // 教师登录成功（演示模式）
    loading.value = true

    try {
      // 设置教师模拟token
      const teacherToken = 'teacher_demo_token_' + Date.now()
      console.log('生成的教师 token:', teacherToken)

      // 显示Element Plus消息提示
      ElMessage.success('教师登录成功！正在跳转...')

      // 清除可能存在的旧数据
      if (process.client) {
        localStorage.removeItem('redirectAfterLogin')
        localStorage.setItem('userType', 'teacher')
        console.log('已设置用户类型为教师')
      }

      // 执行登录逻辑
      console.log('准备调用 login 函数...')
      login(teacherToken)
      console.log('login 函数调用完成')

    } catch (error) {
      console.error('教师登录错误:', error)
      ElMessage.error('教师登录失败，请重试')
      loading.value = false
    }
  }

  </script>
<style lang="scss" scoped>
  .login_body {
    background-color: #2256f7;
    height: calc(100vh - 130px);

    .login_box {
      width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .login_logo {
      float: left;
      width: 40%;
      margin-right: 10%;
    }

    .login_content {
      float: right;
      width: 400px;
      min-height: 550px;
      background-color: #fff;
      border-radius: 10px;
      overflow: visible;

      .login_pc {
        padding: 20px 40px 30px;
      }

      .login_app {
        height: 100%;
        padding: 20px 40px 30px;

        .login_iframe {
          border: none;
          width: 100%;
          height: 100%;
        }
      }
    }

    .login_ico {
      float: right;
    }

    .login_title {
      color: #2256f6;
      font-size: 24px;
      margin: 20px auto;
      text-align: center;
    }

    .demo-notice {
      margin-bottom: 20px;
    }

    .login-info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .login-info-reset {
        color: #2256f6;
      }
    }

    .login-button {
      margin-top: 40px;
      margin-bottom: 15px;
    }

  
    .login_other {
      color: #2256f6;
      font-size: 14px;
      overflow: hidden;
      text-align: center;
      margin-bottom: 20px;
    }
  }

  .var-input {
    width: 220px;
  }

  .var-img {
    margin-left: 20px;
    width: 80px;
  }

  .el-input {
    height: 40px;
    line-height: 40px;
  }

  .el-button {
    width: 100%;
    margin: 20px 0;
  }
</style>