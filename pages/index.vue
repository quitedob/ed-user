<template>
  <div class="main">
    <!-- Demo入口 -->
    <div class="demo-banner">
      <div class="demo-content">
        <h1>Hoj图形化作业系统</h1>
        <p class="demo-desc">基于开源OJ系统的二次开发，打造集学-练-评-讲于一体的在线编程学习平台</p>
        <div class="demo-actions">
          <el-button type="primary" size="large" @click="goToDemo">
            <el-icon><View /></el-icon>
            查看系统Demo
          </el-button>
          <el-button size="large" @click="goToLogin">
            <el-icon><User /></el-icon>
            开始学习之旅
          </el-button>
        </div>
      </div>
      <div class="demo-features">
        <div class="feature-item">
          <el-icon size="32" color="#409EFF"><VideoPlay /></el-icon>
          <span>视频教学</span>
        </div>
        <div class="feature-item">
          <el-icon size="32" color="#67C23A"><Document /></el-icon>
          <span>OJ练习</span>
        </div>
        <div class="feature-item">
          <el-icon size="32" color="#E6A23C"><ChatDotRound /></el-icon>
          <span>AI助教</span>
        </div>
        <div class="feature-item">
          <el-icon size="32" color="#F56C6C"><DataAnalysis /></el-icon>
          <span>能力测评</span>
        </div>
      </div>
    </div>

    <zone-course />
  </div>
  <common-link />
</template>
<script setup>
import {
  VideoPlay,
  Document,
  ChatDotRound,
  DataAnalysis,
  Setting,
  Edit,
  ZoomIn,
  VideoCamera,
  View,
  User
} from '@element-plus/icons-vue'

  // 使用静态数据替代API调用，避免加载延迟
  const websiteInfo = ref({
    websiteName: 'HOJ+图形化作业系统',
    websiteDesc: '基于开源OJ系统的二次开发，打造集学-练-评-讲于一体的在线编程学习平台'
  })

const goToDemo = () => {
  navigateTo('/demo')
}

const goToLogin = () => {
  navigateTo('/login')
}

  useHead({
    title: websiteInfo.value.websiteName,
    meta: [
      { hid: 'keywords', name: 'keywords', content: 'AI编程、在线教育、编程学习、AIGC作品' },
      { hid: 'description', name: 'description', content: websiteInfo.value.websiteDesc }
    ]
  })
</script>
<style lang="scss" scoped>
.demo-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
    opacity: 0.1;
  }

  .demo-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 2;
    text-align: center;

    h1 {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 24px 0;
      background: linear-gradient(45deg, #fff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .demo-desc {
      font-size: 20px;
      margin: 0 0 40px 0;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 40px;
    }

    .demo-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;

      .el-button {
        padding: 12px 32px;
        font-size: 16px;
        border-radius: 25px;

        &:first-child {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);

          &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
        }

        &:last-child {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.6);
          color: white;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .demo-features {
    max-width: 1200px;
    margin: 40px auto 0;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.15);
      }

      span {
        font-size: 14px;
        font-weight: 500;
        opacity: 0.9;
      }
    }
  }
}

.features-section,
.tech-section {
  padding: 80px 0;
  background: #fafbfc;

  .section-header {
    text-align: center;
    margin-bottom: 60px;

    h2 {
      font-size: 36px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 16px 0;
    }

    p {
      font-size: 18px;
      color: #606266;
      margin: 0;
    }
  }
}

.features-section {
  .features-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;

    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
      border: 1px solid #f0f0f0;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }

      .feature-icon {
        margin-bottom: 24px;
      }

      h3 {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 16px 0;
      }

      p {
        color: #606266;
        line-height: 1.6;
        margin: 0 0 24px 0;
      }

      ul {
        text-align: left;
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          color: #606266;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;

          &::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #67C23A;
            font-weight: bold;
          }
        }
      }
    }
  }
}

.tech-section {
  background: white;

  .tech-features {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;

    .tech-item {
      display: flex;
      gap: 16px;
      padding: 24px;
      background: #f8f9fa;
      border-radius: 12px;
      transition: all 0.3s;

      &:hover {
        background: #409EFF;
        color: white;
        transform: translateY(-2px);

        .el-icon {
          color: white;
        }
      }

      .tech-content {
        h4 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        p {
          margin: 0;
          color: inherit;
          opacity: 0.9;
          line-height: 1.5;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-banner {
    padding: 60px 0;

    .demo-content {
      padding: 0 16px;

      h1 {
        font-size: 32px;
      }

      .demo-desc {
        font-size: 16px;
      }

      .demo-actions {
        flex-direction: column;
        align-items: center;
      }
    }

    .demo-features {
      padding: 0 16px;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }

  .features-section,
  .tech-section {
    padding: 60px 0;

    .section-header {
      margin-bottom: 40px;

      h2 {
        font-size: 28px;
      }
    }
  }

  .features-section .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;

    .feature-card {
      padding: 32px 24px;
    }
  }

  .tech-section .tech-features {
    grid-template-columns: 1fr;
  }
}
</style>
