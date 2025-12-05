<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">403</div>
      <h1 class="error-title">权限不足</h1>
      <p class="error-description">抱歉，您没有访问此页面的权限。</p>
      <div class="error-actions">
        <el-button @click="goBack" type="primary">返回上一页</el-button>
        <el-button @click="goHome">回到首页</el-button>
      </div>
    </div>
    <div class="error-image">
      <div class="access-denied-icon">
        <el-icon size="120" color="#F56C6C"><Warning /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Warning } from '@element-plus/icons-vue'

const goBack = () => {
  window.history.back()
}

const goHome = () => {
  navigateTo('/')
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .error-content {
    text-align: center;
    max-width: 500px;

    .error-code {
      font-size: 120px;
      font-weight: bold;
      color: #F56C6C;
      line-height: 1;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(245, 108, 108, 0.3);
    }

    .error-title {
      font-size: 32px;
      color: #303133;
      margin: 0 0 16px 0;
      font-weight: 600;
    }

    .error-description {
      font-size: 18px;
      color: #606266;
      margin: 0 0 32px 0;
      line-height: 1.6;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .error-image {
    margin-left: 60px;

    .access-denied-icon {
      opacity: 0.8;
      filter: drop-shadow(0 4px 8px rgba(245, 108, 108, 0.2));
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .error-page {
    flex-direction: column;
    text-align: center;

    .error-content {
      margin-bottom: 40px;
    }

    .error-image {
      margin-left: 0;

      .access-denied-icon {
        .el-icon {
          width: 80px !important;
          height: 80px !important;
        }
      }
    }
  }
}
</style>
