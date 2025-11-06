<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>HOJ+图形化作业系统演示</h1>
      <p class="demo-subtitle">基于开源OJ系统的二次开发，打造集学-练-评-讲于一体的在线编程学习平台</p>
    </div>

    <!-- 核心功能展示 -->
    <div class="demo-sections">
      <!-- 学习平台 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon size="32" color="#409EFF"><VideoPlay /></el-icon>
          <h2>视频教学平台</h2>
        </div>
        <div class="section-content">
          <div class="feature-grid">
            <div class="feature-card" @click="navigateTo('/courses')">
              <div class="feature-icon">
                <el-icon size="24"><VideoPlay /></el-icon>
              </div>
              <h3>课程学习</h3>
              <p>完整的视频课程体系，支持进度跟踪和笔记记录</p>
            </div>
            <div class="feature-card" @click="navigateTo('/works')">
              <div class="feature-icon">
                <el-icon size="24"><Picture /></el-icon>
              </div>
              <h3>AIGC作品展示</h3>
              <p>支持多媒体作品展示，按课程组织作品墙</p>
            </div>
            <div class="feature-card" @click="navigateTo('/lecturer')">
              <div class="feature-icon">
                <el-icon size="24"><User /></el-icon>
              </div>
              <h3>讲师中心</h3>
              <p>优秀讲师团队，提供专业的技术指导</p>
            </div>
          </div>
        </div>
      </div>

      <!-- OJ练习平台 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon size="32" color="#67C23A"><Document /></el-icon>
          <h2>OJ编程练习平台</h2>
        </div>
        <div class="section-content">
          <div class="feature-grid">
            <div class="feature-card" @click="navigateTo('/problems')">
              <div class="feature-icon">
                <el-icon size="24"><Document /></el-icon>
              </div>
              <h3>题目练习</h3>
              <p>丰富的编程题目，支持多种语言自动评测</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="24"><ChatDotRound /></el-icon>
              </div>
              <h3>AI助教</h3>
              <p>智能编程助手，提供解题提示和学习建议</p>
            </div>
            <div class="feature-card" @click="navigateTo('/assessment')">
              <div class="feature-icon">
                <el-icon size="24"><DataAnalysis /></el-icon>
              </div>
              <h3>能力测评</h3>
              <p>科学的编程能力评估，制定个性化提升计划</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon size="32" color="#E6A23C"><TrendCharts /></el-icon>
          <h2>学习数据统计</h2>
        </div>
        <div class="section-content">
          <div class="feature-grid">
            <div class="feature-card" @click="navigateTo('/reports/learning')">
              <div class="feature-icon">
                <el-icon size="24"><TrendCharts /></el-icon>
              </div>
              <h3>学习报告</h3>
              <p>详细的学习进度和能力分析报告</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="24"><Trophy /></el-icon>
              </div>
              <h3>成就系统</h3>
              <p>学习成就和积分系统，激励持续学习</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="24"><Calendar /></el-icon>
              </div>
              <h3>学习计划</h3>
              <p>个性化的学习计划和进度跟踪</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 后台管理 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon size="32" color="#F56C6C"><Setting /></el-icon>
          <h2>后台管理系统</h2>
        </div>
        <div class="section-content">
          <div class="feature-grid">
            <div class="feature-card" @click="navigateTo('/admin')">
              <div class="feature-icon">
                <el-icon size="24"><HomeFilled /></el-icon>
              </div>
              <h3>管理概览</h3>
              <p>系统数据统计和运营概览</p>
            </div>
            <div class="feature-card" @click="navigateTo('/admin/courses')">
              <div class="feature-icon">
                <el-icon size="24"><VideoPlay /></el-icon>
              </div>
              <h3>课程管理</h3>
              <p>课程内容管理和发布</p>
            </div>
            <div class="feature-card" @click="navigateTo('/admin/students')">
              <div class="feature-icon">
                <el-icon size="24"><User /></el-icon>
              </div>
              <h3>学员管理</h3>
              <p>学生信息和权限管理</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统特性 -->
    <div class="system-features">
      <h2>系统特性</h2>
      <div class="features-grid">
        <div class="feature-item">
          <el-icon size="24" color="#409EFF"><Edit /></el-icon>
          <span>富文本编辑器</span>
        </div>
        <div class="feature-item">
          <el-icon size="24" color="#67C23A"><ZoomIn /></el-icon>
          <span>PDF预览器</span>
        </div>
        <div class="feature-item">
          <el-icon size="24" color="#E6A23C"><VideoCamera /></el-icon>
          <span>视频播放器</span>
        </div>
        <div class="feature-item">
          <el-icon size="24" color="#F56C6C"><ChatDotRound /></el-icon>
          <span>AI智能助教</span>
        </div>
        <div class="feature-item">
          <el-icon size="24" color="#909399"><DataAnalysis /></el-icon>
          <span>能力测评系统</span>
        </div>
        <div class="feature-item">
          <el-icon size="24" color="#52C41A"><TrendCharts /></el-icon>
          <span>学习数据分析</span>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="tech-stack">
      <h2>技术栈</h2>
      <div class="tech-tags">
        <el-tag type="success">Nuxt 3</el-tag>
        <el-tag type="info">Vue 3</el-tag>
        <el-tag type="warning">Element Plus</el-tag>
        <el-tag type="danger">SCSS</el-tag>
        <el-tag>PDF.js</el-tag>
        <el-tag>Quill.js</el-tag>
        <el-tag>HOJ OJ</el-tag>
      </div>
    </div>

    <!-- 快速开始 -->
    <div class="quick-start">
      <h2>快速开始体验</h2>
      <div class="start-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>登录系统</h3>
            <p>点击右上角登录按钮进入系统</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>浏览课程</h3>
            <p>查看丰富的AI编程课程内容</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>开始练习</h3>
            <p>在OJ平台练习编程题目</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>能力测评</h3>
            <p>完成能力测评，了解自身水平</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  VideoPlay,
  Picture,
  User,
  Document,
  ChatDotRound,
  DataAnalysis,
  TrendCharts,
  Trophy,
  Calendar,
  Setting,
  HomeFilled,
  Edit,
  ZoomIn,
  VideoCamera
} from '@element-plus/icons-vue'

const navigateTo = (path) => {
  // 这里可以添加登录检查
  window.location.href = path
}
</script>

<style lang="scss" scoped>
.demo-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  .demo-header {
    text-align: center;
    margin-bottom: 48px;

    h1 {
      font-size: 36px;
      font-weight: 700;
      color: #303133;
      margin: 0 0 16px 0;
      background: linear-gradient(135deg, #409EFF, #67C23A);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .demo-subtitle {
      font-size: 18px;
      color: #606266;
      margin: 0;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .demo-sections {
    .demo-section {
      margin-bottom: 48px;

      .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;

        h2 {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }
      }

      .section-content {
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;

          .feature-card {
            background: white;
            border: 1px solid #EBEEF5;
            border-radius: 8px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

            &:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
              border-color: #409EFF;
            }

            .feature-icon {
              margin-bottom: 16px;
              color: #409EFF;
            }

            h3 {
              font-size: 18px;
              font-weight: 600;
              color: #303133;
              margin: 0 0 8px 0;
            }

            p {
              color: #606266;
              margin: 0;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  .system-features {
    background: white;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    h2 {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 24px 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #F8F9FA;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
          background: #409EFF;
          color: white;

          .el-icon {
            color: white;
          }
        }

        span {
          font-weight: 500;
        }
      }
    }
  }

  .tech-stack {
    background: white;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 32px;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 24px 0;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;

      .el-tag {
        font-size: 14px;
        padding: 6px 12px;
      }
    }
  }

  .quick-start {
    background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
    border-radius: 12px;
    padding: 32px;
    color: white;
    text-align: center;
    box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px 0;
    }

    .start-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;

      .step {
        display: flex;
        align-items: flex-start;
        gap: 16px;

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          flex-shrink: 0;
        }

        .step-content {
          text-align: left;

          h3 {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 8px 0;
          }

          p {
            margin: 0;
            opacity: 0.9;
            line-height: 1.5;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-page {
    padding: 16px;

    .demo-header {
      h1 {
        font-size: 28px;
      }

      .demo-subtitle {
        font-size: 16px;
      }
    }

    .demo-sections .demo-section .section-content .feature-grid {
      grid-template-columns: 1fr;
    }

    .system-features .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .tech-stack .tech-tags {
      justify-content: center;
    }

    .quick-start .start-steps {
      grid-template-columns: 1fr;

      .step {
        text-align: center;

        .step-content {
          text-align: center;
        }
      }
    }
  }
}
</style>
