<template>
  <div class="student-portal">
    <header class="global-header">
      <div class="header-left">
        <div class="logo-container">
          <span class="logo-text">芝麻编程</span>
          <img src="~/assets/image/logo.png" alt="Logo" class="logo-image" />
        </div>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleUserCommand">
          <div class="user-info">
            <el-avatar :size="32" :src="userAvatar" />
            <span class="username">{{ userName }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="portal-body">
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-user">
          <el-avatar :size="80" :src="userAvatar" />
          <div v-if="!sidebarCollapsed" class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">学生</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div
            v-for="item in navItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: activeNav === item.key }"
            @click="handleNavClick(item.key)"
          >
            <el-icon :size="20"><component :is="item.icon" /></el-icon>
            <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
          </div>
        </nav>

        <div class="sidebar-toggle" @click="toggleSidebar">
          <el-icon><ArrowLeft v-if="!sidebarCollapsed" /><ArrowRight v-else /></el-icon>
        </div>
      </aside>

      <main class="main-content">
        <!-- 课程二级导航 -->
        <div v-if="isCoursePage" class="course-secondary-nav">
          <div class="course-nav-container">
            <div class="course-nav-title">
              <el-button @click="goBackToCourseHub" :icon="ArrowLeft" text>
                返回课程主页
              </el-button>
              <span class="course-name">{{ currentCourseTitle }}</span>
            </div>
            <div class="course-nav-menu">
              <div
                v-for="item in courseNavItems"
                :key="item.key"
                class="course-nav-item"
                :class="{ active: activeCourseTab === item.key }"
                @click="navigateToCoursePage(item.key)"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-content">
          <slot />
        </div>
      </main>
    </div>

    <div class="floating-help" :class="{ expanded: helpExpanded }">
      <div class="help-main" @click="toggleHelp">
        <el-icon :size="24"><QuestionFilled /></el-icon>
      </div>
      <transition name="fan">
        <div v-if="helpExpanded" class="help-actions">
          <el-button circle class="help-btn help-btn-first" @click="handleHelpAction('announce')">
            <el-icon><Bell /></el-icon>
          </el-button>
          <el-button circle class="help-btn" @click="handleHelpAction('help')">
            <el-icon><Document /></el-icon>
          </el-button>
          <el-button circle class="help-btn" @click="handleHelpAction('service')">
            <el-icon><Service /></el-icon>
          </el-button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {
  Reading, Tools, Document, ChatDotRound, Calendar,
  ArrowDown, ArrowLeft, ArrowRight, Service,
  Plus, Setting, QuestionFilled, Bell
} from '@element-plus/icons-vue'

// 导入 Vue 相关的 hooks
import { ref, computed, watch, nextTick } from 'vue'
// 导入 Vue Router 相关的 hooks
import { useRouter, useRoute } from 'vue-router'
// 导入 Element Plus 的组件
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 用户信息
const userName = ref('张利亚')
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 侧边栏状态
const sidebarCollapsed = ref(false)
const activeNav = ref('courses')

// 导航项（移除AI助手）
const navItems = [
  { key: 'courses', label: '课程', icon: Reading },
  { key: 'practice', label: '题库练习', icon: Tools },
  { key: 'class', label: '班级', icon: Document }
]

// 帮助组件
const helpExpanded = ref(false)

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleNavClick = (key) => {
  activeNav.value = key
  
  // 根据导航项跳转到对应页面
  const routeMap = {
    courses: '/student/course',
    practice: '/student/practice',
    class: '/student/class',
    ai: '/student/ai'
  }
  
  if (routeMap[key]) {
    router.push(routeMap[key])
  }
  
  // 切换导航时滚动到顶部
  if (process.client) {
    // 延迟执行，确保DOM已渲染
    nextTick(() => {
      const mainContent = document.querySelector('.main-content')
      if (mainContent) {
        mainContent.scrollTop = 0
      }
    })
  }
}

// 课程导航相关
const isCoursePage = computed(() => {
  return route.path.startsWith('/student/course/') &&
         route.params.id &&
         route.path.split('/').length > 4
})

const currentCourseId = computed(() => {
  return isCoursePage.value && route.params.id ? parseInt(route.params.id) : null
})

const currentCourseTitle = ref('')

const activeCourseTab = computed(() => {
  const pathSegments = route.path.split('/')
  const lastSegment = pathSegments[pathSegments.length - 1]

  if (lastSegment === 'section' || !isNaN(parseInt(lastSegment))) {
    return 'section'
  }

  return lastSegment || 'hub'
})

// 课程导航项（移除AI助教）
const courseNavItems = [
  { key: 'hub', label: '主页', icon: Reading },
  { key: 'chapters', label: '章节', icon: Document },
  { key: 'homework', label: '作业', icon: Tools },
  { key: 'exam', label: '考试', icon: Calendar }
]

const goBackToCourseHub = () => {
  if (currentCourseId.value) {
    router.push(`/student/course/${currentCourseId.value}`)
  }
}

const navigateToCoursePage = (pageKey) => {
  if (!currentCourseId.value || isNaN(currentCourseId.value)) {
    console.warn('无效的课程ID:', currentCourseId.value)
    return
  }

  const routeMap = {
    hub: `/student/course/${currentCourseId.value}`,
    chapters: `/student/course/${currentCourseId.value}/chapters`,
    homework: `/student/course/${currentCourseId.value}/homework`,
    exam: `/student/course/${currentCourseId.value}/exam`
  }

  if (routeMap[pageKey]) {
    router.push(routeMap[pageKey])
  }
}

// 监听路由变化，更新导航状态
watch(() => route.path, (newPath) => {
  if (newPath === '/student' || newPath === '/student/') {
    activeNav.value = 'class'
  } else if (newPath.includes('/student/course')) {
    activeNav.value = 'courses'
  } else if (newPath.includes('/student/practice')) {
    activeNav.value = 'practice'
  } else if (newPath.includes('/student/class')) {
    activeNav.value = 'class'
  }
}, { immediate: true })

// 监听课程页面变化，更新课程标题
watch(() => currentCourseId.value, async (newId) => {
  if (newId && isCoursePage.value) {
    // 这里可以通过API获取课程信息
    // const courseInfo = await getCourseInfo(newId)
    // currentCourseTitle.value = courseInfo.title

    // 临时模拟数据
    const courseTitles = {
      1: '软件工程导论',
      2: '编译原理'
    }
    currentCourseTitle.value = courseTitles[newId] || '课程详情'
  }
}, { immediate: true })

const handleUserCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      router.push('/login')
    })
  } else if (command === 'profile') {
    router.push('/account/user')
  } else if (command === 'settings') {
    ElMessage.info('设置功能开发中...')
  }
}

const toggleHelp = () => {
  helpExpanded.value = !helpExpanded.value
}

const handleHelpAction = (action) => {
  const actions = {
    announce: '发布公告',
    help: '使用帮助',
    service: '在线客服'
  }
  ElMessage.info(`点击了：${actions[action]}`)
}
</script>

<style lang="scss">
.student-portal {
  min-height: 100vh;
  background: #f5f7fa;
}

// 全局页头
.global-header {
  height: 64px;
  background: linear-gradient(135deg, #3A4D8F 0%, #2C3E7A 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,50 Q300,100 600,50 T1200,50 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.05)"/></svg>') no-repeat;
    background-size: cover;
    opacity: 0.3;
  }

  .header-left {
    position: relative;
    z-index: 1;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 8px;

    .logo-text {
      color: white;
      font-size: 20px;
      font-weight: 600;
    }

    .logo-image {
      height: 32px;
      width: auto;
      object-fit: contain;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 20px;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .username {
      color: white;
      font-size: 14px;
    }

    .el-icon {
      color: white;
    }
  }
}

// 主体布局
.portal-body {
  display: flex;
  height: calc(100vh - 64px);
}

// 左侧导航栏
.sidebar {
  width: 240px;
  background: #3A4D8F;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: relative;

  &.collapsed {
    width: 80px;

    .sidebar-user {
      padding: 20px 10px;
    }

    .nav-text {
      display: none;
    }

    .nav-item {
      justify-content: center;
    }
  }

  .sidebar-user {
    padding: 30px 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .user-details {
    margin-top: 12px;
  }

  .user-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .user-role {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }

  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background: rgba(0, 123, 255, 0.3);
      border-left: 3px solid #007BFF;
    }

    .nav-text {
      font-size: 14px;
    }
  }

  .sidebar-toggle {
    padding: 16px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

// 主内容区域
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;

  .course-secondary-nav {
    background: white;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;

    .course-nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;

      .course-nav-title {
        display: flex;
        align-items: center;
        gap: 12px;

        .course-name {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }

      .course-nav-menu {
        display: flex;
        gap: 8px;

        .course-nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #606266;
          font-size: 14px;
          font-weight: 500;

          &:hover {
            background: #f5f7fa;
            color: #409eff;
          }

          &.active {
            background: #ecf5ff;
            color: #409eff;
            font-weight: 600;
          }

          .el-icon {
            font-size: 16px;
          }
        }
      }
    }
  }

  .page-content {
    flex: 1;
    padding: 24px;
  }
}

/* V-- (开始) 已替换为 Rinka 提供的优化样式 --V
   文件: src/components/StudentPortal.vue
   修改内容：调整浮动帮助组件对齐与动画的定位（修复“歪”现象）
*/
/* ---------- 浮动帮助容器：固定宽度作对齐参考点 ---------- */
.floating-help {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;

  /* 固定宽高作为对齐参考，避免子元素的绝对定位以右边缘为基准时出现偏移 */
  width: 56px; /* 与 .help-main 的宽度一致，方便居中对齐 */
  height: 56px;

  /* 新增图层合成 & 动画基点 */
  transform-origin: center bottom;
  -webkit-transform-origin: center bottom;
  will-change: transform, opacity;
}
/* ---------- 主按钮（圆形） ---------- */
.floating-help .help-main {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f56c6c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  /* 强制使用独立合成层，避免子元素动画影响父元素渲染 */
  transform: translateZ(0);
  backface-visibility: hidden;
}
/* ---------- 帮助动作组：相对于.floating-help居中（修复右对齐导致“歪”） ---------- */
.floating-help .help-actions {
  position: absolute;
  /* 将右边偏移设为 4px，视觉上更居中对齐主按钮 */
  right: 4px;

  /* 垂直位置：保持原先设置 */
  bottom: 70px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  /* 保证按钮水平居中与动画原点一致 */
  align-items: center;
  transform-origin: center bottom;
  will-change: transform, opacity;
}
/* ---------- 单个帮助按钮：固定尺寸并设置动画原点（防止放大时“偏移”） ---------- */
.floating-help .help-btn {
  width: 48px !important;
  height: 48px !important;
  background: #409eff;
  border: none;
  color: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  transition: transform 0.18s ease, background 0.18s;
  transform-origin: center center; /* 放大/缩小时以中心为原点，避免“歪” */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}
/* 悬停放大效果：以中心为基点，视觉上不会偏移 */
.floating-help .help-btn:hover {
  transform: scale(1.05);
}
/* 保证图标在按钮内真正居中（覆盖 Element Plus 的内置样式） */
.floating-help .help-btn :deep(.el-icon) {
  margin: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 专门针对第一个按钮（公告）的定位修正 */
.floating-help .help-btn-first {
  transform: translateX(6px); /* 向右微调8px纠正歪斜 */
}
/* ---------- 动画过渡：稍微缩短位移动画并减少位移量，避免进入时看起来“歪” ---------- */
.fan-enter-active,
.fan-leave-active {
  transition: all 0.22s cubic-bezier(.2,.9,.2,1);
}
.fan-enter-from,
.fan-leave-to {
  opacity: 0;
  transform: translateY(8px); /* 从更小的偏移入场，视觉更稳定 */
}
/* 小屏幕时同样保持定位参考宽度（可根据需要调整） */
@media (max-width: 768px) {
  .floating-help {
    right: 20px;
    bottom: 20px;
  }

  .floating-help .help-actions {
    right: 4px;
    bottom: 70px;
  }
}
/* A-- (结束) 优化样式替换 --A
*/


// 响应式设计
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: 100;
    transform: translateX(-100%);

    &:not(.collapsed) {
      transform: translateX(0);
    }
  }

  .main-content {
    width: 100%;

    .course-secondary-nav {
      .course-nav-container {
        padding: 12px 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        .course-nav-title {
          width: 100%;

          .course-name {
            font-size: 14px;
          }
        }

        .course-nav-menu {
          width: 100%;
          overflow-x: auto;
          padding-bottom: 4px;

          .course-nav-item {
            flex-shrink: 0;
            padding: 6px 12px;
            font-size: 13px;

            .el-icon {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}

// 平板设备响应式设计
@media (max-width: 1024px) {
  .main-content {
    .course-secondary-nav {
      .course-nav-container {
        padding: 14px 20px;

        .course-nav-menu {
          .course-nav-item {
            padding: 7px 14px;
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>