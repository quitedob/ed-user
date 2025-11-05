<template>
  <div class="debug-page">
    <h1>🔍 Student 页面调试信息</h1>
    
    <div class="debug-section">
      <h2>当前路由信息</h2>
      <div class="info-box">
        <p><strong>路径:</strong> {{ route.path }}</p>
        <p><strong>名称:</strong> {{ route.name }}</p>
        <p><strong>完整路径:</strong> {{ route.fullPath }}</p>
      </div>
    </div>

    <div class="debug-section">
      <h2>布局信息</h2>
      <div class="info-box">
        <p><strong>当前布局:</strong> student</p>
        <p><strong>是否显示头部:</strong> {{ hasHeader ? '✅ 是' : '❌ 否' }}</p>
        <p><strong>是否显示侧边栏:</strong> {{ hasSidebar ? '✅ 是' : '❌ 否' }}</p>
      </div>
    </div>

    <div class="debug-section">
      <h2>页面内容</h2>
      <div class="info-box success">
        <p>✅ 如果你能看到这个页面，说明：</p>
        <ul>
          <li>路由配置正常</li>
          <li>页面文件正确加载</li>
          <li>布局文件正确应用</li>
        </ul>
      </div>
    </div>

    <div class="debug-section">
      <h2>快速导航测试</h2>
      <div class="nav-buttons">
        <el-button type="primary" @click="goTo('/student/course')">
          跳转到课程页面
        </el-button>
        <el-button type="success" @click="goTo('/student/homework')">
          跳转到作业页面
        </el-button>
        <el-button type="warning" @click="goTo('/student/calendar')">
          跳转到日历页面
        </el-button>
        <el-button type="info" @click="goTo('/student')">
          跳转到学生首页
        </el-button>
      </div>
    </div>

    <div class="debug-section">
      <h2>检查清单</h2>
      <div class="checklist">
        <div class="check-item">
          <span class="icon">{{ hasHeader ? '✅' : '❌' }}</span>
          <span>顶部导航栏（芝麻编程标题）</span>
        </div>
        <div class="check-item">
          <span class="icon">{{ hasSidebar ? '✅' : '❌' }}</span>
          <span>左侧导航栏（课程、OJ、作业等）</span>
        </div>
        <div class="check-item">
          <span class="icon">✅</span>
          <span>主内容区域（当前页面）</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'student',
  title: '调试页面'
})

const route = useRoute()
const router = useRouter()

const hasHeader = ref(false)
const hasSidebar = ref(false)

onMounted(() => {
  // 检查是否有头部和侧边栏
  if (process.client) {
    setTimeout(() => {
      hasHeader.value = !!document.querySelector('.global-header')
      hasSidebar.value = !!document.querySelector('.sidebar')
    }, 100)
  }
})

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.debug-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #409eff;
  margin-bottom: 30px;
  text-align: center;
}

.debug-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.debug-section h2 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 15px;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.info-box {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.info-box.success {
  border-left-color: #67c23a;
  background: #f0f9ff;
}

.info-box p {
  margin: 8px 0;
  font-size: 14px;
}

.info-box ul {
  margin: 10px 0;
  padding-left: 20px;
}

.info-box li {
  margin: 5px 0;
}

.nav-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.check-item .icon {
  font-size: 20px;
  min-width: 30px;
}
</style>