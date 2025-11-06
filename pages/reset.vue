<template>
  <div class="login_body">
    <div class="login_box">
      <div class="login_content">
        <div class="login_title">
          <div class="login_title_name">重置密码</div>
          <div>
            <nuxt-link to="/login"> 返回账号登录 </nuxt-link>
          </div>
        </div>
        <div class="login_form">
          <el-form v-loading="loading" :model="loginForm" @keyup.enter="onSubmit">
            <el-form-item prop="mobile">
              <el-input v-model="loginForm.mobile" placeholder="手机号" autofocus />
            </el-form-item>
            <el-form-item prop="verificationCode">
              <el-input v-model="loginForm.verificationCode" placeholder="验证码">
                <template #suffix>
                  <el-button link @click="getCode"> 获取验证码 </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="loginPwd">
              <el-input v-model="mobilePwd" type="password" show-password placeholder="密码由6-20位大写和小写字母和数字组成" />
            </el-form-item>
            <el-form-item prop="repeatPwd">
              <el-input v-model="mobilePwdRepeat" type="password" show-password placeholder="确认密码" />
            </el-form-item>
            <el-button class="login-button" type="primary" size="large" @click="onSubmit"> 重 置 </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { loginApi } from '~/api/login.js'
  import { indexApi } from '~/api'

  const router = useRouter()
  const loading = ref(false)

  // 信息
  const loginForm = reactive({})

  // 密码
  const mobilePwd = ref('')
  const mobilePwdRepeat = ref('')

  // 使用静态数据替代API调用，避免加载延迟
  const websiteInfo = ref({
    websiteName: 'AI编程学习平台',
    websiteDesc: '专业的AI编程在线学习平台',
    rsaLoginPublicKey: 'mock_public_key'
  })

  // 计算页面描述
  const pageDescription = computed(() => {
    return websiteInfo.value && websiteInfo.value.websiteDesc
      ? websiteInfo.value.websiteDesc
      : '芝麻编程 - 专业的AI编程在线学习平台'
  })

  useHead({
    title: '密码重置',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '芝麻编程、在线教育系统、开源教育系统' },
      { hid: 'description', name: 'description', content: pageDescription }
    ]
  })

  // 获取验证码
  async function getCode() {
    if (!loginForm.mobile) {
      ElMessage.error('请输入手机号')
      return
    }
    if (!/^1[3456789]\d{9}$/.test(loginForm.mobile)) {
      ElMessage.error('请输入正确的手机号')
      return
    }
    loading.value = true
    try {
      // 开发环境模拟获取验证码
      if (process.dev) {
        ElMessage.success('验证码已发送')
        return
      }
      const res = await loginApi.getMobileCode({ mobile: loginForm.mobile })
      ElMessage.success(res)
    } finally {
      loading.value = false
    }
  }

  async function onSubmit() {
    if (!loginForm.mobile) {
      ElMessage.error('请输入手机号')
      return
    }
    if (!/^1[3456789]\d{9}$/.test(loginForm.mobile)) {
      ElMessage.error('请输入正确的手机号')
      return
    }
    if (!mobilePwd.value) {
      ElMessage.error('请输入密码')
      return
    }

    if (mobilePwd.value !== mobilePwdRepeat.value) {
      ElMessage.error('两次密码输入不一致')
      return
    }
    loading.value = true
    try {
      // 开发环境模拟密码重置
      if (process.dev) {
        ElMessage.success('密码重置成功')
        await navigateTo('/login')
        return
      }
      // 密码加密
      loginForm.mobilePwdEncrypt = encrypt(mobilePwd.value, websiteInfo.value.rsaLoginPublicKey)
      const res = await loginApi.updatePassword(loginForm)
      ElMessage.success(res)
      await router.replace({ path: '/login' })
    } catch (error) {
      console.error(error)
    } finally {
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
      width: 50%;
    }
    .login_content {
      float: right;
      width: 350px;
      background-color: #fff;
      padding: 0 40px;
      border-radius: 10px;

      .login_title {
        margin: 30px 0;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        .login_title_name {
          font-weight: bold;
        }
        a {
          color: #2256f7;
        }
      }
      .login-button {
        width: 100%;
        margin: 10px 0 30px;
      }
    }
  }

  .el-input {
    height: 40px;
    line-height: 40px;
  }
</style>
