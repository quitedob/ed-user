<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <el-header class="admin-header">
      <div class="header-left">
        <div class="logo">
          <h3>HOJ Admin</h3>
        </div>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="currentUser?.avatar">
              {{ currentUser?.nickname?.[0] || 'A' }}
            </el-avatar>
            <span class="username">{{ currentUser?.nickname || '管理员' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="admin-container">
      <!-- 侧边栏菜单 -->
      <el-aside width="200px" class="admin-sidebar">
        <el-menu
          :default-active="$route.path"
          class="admin-menu"
          :unique-opened="true"
          router
        >
          <el-menu-item index="/admin">
            <el-icon><HomeFilled /></el-icon>
            <span>概览</span>
          </el-menu-item>

          <el-sub-menu index="course-manage">
            <template #title>
              <el-icon><VideoPlay /></el-icon>
              <span>课程管理</span>
            </template>
            <el-menu-item index="/admin/courses">课程列表</el-menu-item>
            <el-menu-item index="/admin/courses/create">创建课程</el-menu-item>
            <el-menu-item index="/admin/videos">视频库管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="user-manage">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/students">学生管理</el-menu-item>
            <el-menu-item index="/admin/classes">班级管理</el-menu-item>
            <el-menu-item index="/admin/permissions">权限管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="problem-manage">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>题目管理</span>
            </template>
            <el-menu-item index="/admin/problems">题目列表</el-menu-item>
            <el-menu-item index="/admin/problems/create">创建题目</el-menu-item>
            <el-menu-item index="/admin/contests">竞赛管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="assessment-manage">
            <template #title>
              <el-icon><DataAnalysis /></el-icon>
              <span>测评管理</span>
            </template>
            <el-menu-item index="/admin/assessments">测评题目</el-menu-item>
            <el-menu-item index="/admin/analysis">成绩分析</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="works-manage">
            <template #title>
              <el-icon><Picture /></el-icon>
              <span>作品管理</span>
            </template>
            <el-menu-item index="/admin/works">作品审核</el-menu-item>
            <el-menu-item index="/admin/categories">分类管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="report-manage">
            <template #title>
              <el-icon><TrendCharts /></el-icon>
              <span>数据统计</span>
            </template>
            <el-menu-item index="/admin/reports/learning">学习报告</el-menu-item>
            <el-menu-item index="/admin/reports/usage">使用统计</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="admin-main">
        <div class="page-header">
          <h2>{{ pageTitle }}</h2>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="page-content">
          <slot />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {
  HomeFilled,
  VideoPlay,
  User,
  Document,
  DataAnalysis,
  Picture,
  TrendCharts,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 当前用户信息
const currentUser = ref({
  id: 1,
  nickname: '系统管理员',
  avatar: '/images/avatar-admin.jpg',
  role: 'admin'
})

// 页面标题
const pageTitle = computed(() => {
  const routeName = route.meta?.title || route.name || '管理后台'
  return routeName
})

// 面包屑导航
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p)
  const breadcrumbs = [{ title: '首页', path: '/admin' }]

  if (pathArray.length > 1) {
    let currentPath = ''
    pathArray.slice(1).forEach((segment, index) => {
      currentPath += `/${segment}`
      const title = getBreadcrumbTitle(segment, index)
      breadcrumbs.push({
        title,
        path: currentPath
      })
    })
  }

  return breadcrumbs
})

const getBreadcrumbTitle = (segment, index) => {
  const titleMap = {
    'courses': '课程管理',
    'videos': '视频库',
    'students': '学生管理',
    'classes': '班级管理',
    'problems': '题目管理',
    'contests': '竞赛管理',
    'assessments': '测评管理',
    'works': '作品管理',
    'reports': '数据统计'
  }

  return titleMap[segment] || segment
}

// 用户操作
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/admin/profile')
      break
    case 'logout':
      logout()
      break
  }
}

const logout = () => {
  if (process.client) {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userRole')
  }
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: #001529;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .header-left {
      .logo {
        h3 {
          margin: 0;
          color: white;
        }
      }
    }

    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .username {
          margin-left: 8px;
          font-size: 14px;
        }
      }
    }
  }

  .admin-container {
    flex: 1;
    height: calc(100vh - 60px);

    .admin-sidebar {
      background: #f5f5f5;
      border-right: 1px solid #e6e6e6;

      .admin-menu {
        border-right: none;
        height: 100%;
      }
    }

    .admin-main {
      padding: 20px;
      background: #f0f2f5;

      .page-header {
        margin-bottom: 20px;

        h2 {
          margin: 0 0 10px 0;
          color: #333;
        }
      }

      .page-content {
        background: white;
        border-radius: 8px;
        padding: 20px;
        min-height: calc(100vh - 160px);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .admin-layout {
    .admin-header {
      padding: 0 10px;

      .header-right .user-info .username {
        display: none;
      }
    }

    .admin-container {
      .admin-sidebar {
        width: 60px !important;
      }

      .admin-main {
        padding: 10px;
      }
    }
  }
}
</style>
