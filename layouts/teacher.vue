<template>
  <div class="teacher-portal">
    <!-- 顶部导航栏 -->
    <header class="global-header">
      <div class="header-left">
        <div class="logo-container" @click="goHome">
          <span class="logo-text">教师中心</span>
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

    <!-- 主内容区域（无侧边栏） -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const router = useRouter()

const userName = ref('张老师')
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

const goHome = () => router.push('/teacher')

const handleUserCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => router.push('/login'))
  } else if (command === 'profile') {
    ElMessage.info('个人资料功能开发中...')
  } else if (command === 'settings') {
    ElMessage.info('设置功能开发中...')
  }
}
</script>

<style lang="scss" scoped>
.teacher-portal {
  min-height: 100vh;
  background: #f5f7fa;
}

.global-header {
  height: 64px;
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-left {
    .logo-container {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

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
  }

  .header-right {
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
}

.main-content {
  min-height: calc(100vh - 64px);
}
</style>
