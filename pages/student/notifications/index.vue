<template>
  <div class="notifications-page">
    <!-- 顶部导航栏 -->
    <div class="header-bar">
      <div class="header-left">
        <h2 class="page-title">通知/作业中心</h2>
      </div>
      
      <div class="header-center">
        <el-dropdown trigger="click" @command="handleFilterCommand">
          <el-button>
            {{ currentFilter }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all">全部</el-dropdown-item>
              <el-dropdown-item command="unread">未读</el-dropdown-item>
              <el-dropdown-item command="read">已读</el-dropdown-item>
              <el-dropdown-item command="mention">@我的</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <el-button @click="clearAllBadges">清除红点</el-button>
        
        <el-button :icon="Setting" circle @click="openSettings" />
      </div>
      
      <div class="header-right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索通知或作业..."
          :prefix-icon="Search"
          class="search-input"
          clearable
        />
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="content-wrapper">
      <!-- 左侧边栏 -->
      <aside class="left-sidebar">
        <div class="selection-counter">
          已选 {{ selectedItems.length }}
        </div>
        
        <nav class="folder-nav">
          <div
            class="folder-item active"
          >
            <el-icon><Folder /></el-icon>
            <span class="folder-name">我收到的</span>
            <el-badge
              v-if="unreadCount > 0"
              :value="unreadCount"
              class="folder-badge"
            />
          </div>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content-area">
        <!-- 批量操作栏 -->
        <div v-if="selectedItems.length > 0" class="batch-actions">
          <el-button :icon="Delete" @click="batchDelete">删除</el-button>
          <el-button :icon="Check" @click="batchMarkAsRead">标记为已读</el-button>
        </div>

        <!-- 通知列表 -->
        <div class="notification-list">
          <div
            v-for="item in filteredNotifications"
            :key="item.id"
            class="notification-item"
            :class="{ unread: !item.isRead }"
            @click="openNotificationDetail(item)"
          >
            <el-checkbox
              v-model="item.selected"
              @change="handleItemSelect(item)"
              @click.stop
            />
            
            <el-tag :type="getTypeTagColor(item.type)" size="small" class="type-tag">
              {{ item.type }}
            </el-tag>
            
            <div class="item-content">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-meta">{{ item.meta }}</p>
            </div>
            
            <div class="item-time">{{ item.time }}</div>
          </div>
          
          <el-empty v-if="filteredNotifications.length === 0" description="暂无通知" />
        </div>
      </main>
    </div>

    <!-- 通知详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentNotification?.title"
      width="600px"
    >
      <div v-if="currentNotification" class="notification-detail">
        <div class="detail-row">
          <span class="detail-label">类型:</span>
          <el-tag :type="getTypeTagColor(currentNotification.type)" size="small">
            {{ currentNotification.type }}
          </el-tag>
        </div>
        <div class="detail-row">
          <span class="detail-label">发件人:</span>
          <span>{{ currentNotification.sender }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">时间:</span>
          <span>{{ currentNotification.time }}</span>
        </div>
        <div v-if="currentNotification.readStats" class="detail-row">
          <span class="detail-label">已读情况:</span>
          <span>{{ currentNotification.readStats }}</span>
        </div>
        <div class="detail-content">
          <p>{{ currentNotification.content }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="markAsRead(currentNotification)">标记为已读</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ArrowDown, Setting, Search, Folder, Delete, Check
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({
  layout: false,
  title: '通知/作业中心'
})

// 状态管理
const searchQuery = ref('')
const currentFilter = ref('全部')
const selectedItems = computed(() => notifications.value.filter(item => item.selected))

// 对话框状态
const detailDialogVisible = ref(false)
const currentNotification = ref(null)

// 通知数据
const notifications = ref([
  {
    id: 1,
    type: '通知',
    title: '作业: (计算机视觉1249) 实验报告4',
    meta: '发件人: 学习通知',
    time: '10-31(星期五) 15:55',
    sender: '学习通知',
    content: '请在11月10日前完成计算机视觉课程的实验报告4，内容包括图像分割和目标检测实验。',
    isRead: false,
    selected: false
  },
  {
    id: 2,
    type: '通知',
    title: '关于 (嵌入式系统) 2025暑期统考考试与结果通知',
    meta: '发件人: 终端 已读: 82/91',
    time: '10-30(星期四) 09:20',
    sender: '终端',
    content: '嵌入式系统课程将于11月15日进行统考，请各位同学做好准备。',
    readStats: '82/91',
    isRead: true,
    selected: false
  },
  {
    id: 3,
    type: '作业',
    title: '数据结构课程设计',
    meta: '发件人: 王教授',
    time: '10-29(星期三) 14:30',
    sender: '王教授',
    content: '请完成数据结构课程设计，实现一个完整的图书管理系统。',
    isRead: false,
    selected: false
  },
  {
    id: 4,
    type: '通知',
    title: '期中考试安排通知',
    meta: '发件人: 教务处',
    time: '10-28(星期二) 10:15',
    sender: '教务处',
    content: '本学期期中考试将于11月20日-25日进行，请查看具体安排。',
    isRead: false,
    selected: false
  },
  {
    id: 5,
    type: '通知',
    title: '@你 在讨论组中被提及',
    meta: '发件人: 项目小组',
    time: '10-27(星期一) 16:45',
    sender: '项目小组',
    content: '你在软件工程项目讨论组中被提及，请查看相关讨论。',
    isRead: false,
    selected: false,
    isMention: true
  }
])

// 未读数量
const unreadCount = computed(() => {
  return notifications.value.filter(item => !item.isRead).length
})

// 计算属性：过滤后的通知列表
const filteredNotifications = computed(() => {
  let result = [...notifications.value]
  
  // 应用过滤器
  if (currentFilter.value === '未读') {
    result = result.filter(item => !item.isRead)
  } else if (currentFilter.value === '已读') {
    result = result.filter(item => item.isRead)
  } else if (currentFilter.value === '@我的') {
    result = result.filter(item => item.isMention)
  }
  
  // 应用搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.meta.toLowerCase().includes(query)
    )
  }
  
  return result
})

// 方法
const handleFilterCommand = (command) => {
  const filterMap = {
    all: '全部',
    unread: '未读',
    read: '已读',
    mention: '@我的'
  }
  currentFilter.value = filterMap[command]
}

const clearAllBadges = () => {
  notifications.value.forEach(item => {
    item.isRead = true
  })
  ElMessage.success('已清除所有红点')
}

const openSettings = () => {
  ElMessage.info('设置功能开发中...')
}

const handleItemSelect = (item) => {
  // 选中状态已通过 v-model 自动更新
}

const batchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedItems.value.length} 项吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const selectedIds = selectedItems.value.map(item => item.id)
    notifications.value = notifications.value.filter(item => !selectedIds.includes(item.id))
    ElMessage.success('删除成功')
  })
}

const batchMarkAsRead = () => {
  selectedItems.value.forEach(item => {
    item.isRead = true
    item.selected = false
  })
  ElMessage.success('已标记为已读')
}

const openNotificationDetail = (item) => {
  currentNotification.value = item
  detailDialogVisible.value = true
  if (!item.isRead) {
    item.isRead = true
  }
}

const markAsRead = (item) => {
  if (item) {
    item.isRead = true
    ElMessage.success('已标记为已读')
  }
}

const getTypeTagColor = (type) => {
  const colorMap = {
    '通知': 'primary',
    '作业': 'success',
    '公告': 'warning',
    '系统': 'info'
  }
  return colorMap[type] || 'info'
}
</script>

<style lang="scss" scoped>
.notifications-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 顶部导航栏
.header-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  
  .header-left {
    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .header-center {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .header-right {
    .search-input {
      width: 280px;
    }
  }
}

// 主体区域
.content-wrapper {
  flex: 1;
  display: flex;
  gap: 20px;
  overflow: hidden;
}

// 左侧边栏
.left-sidebar {
  width: 220px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  
  .selection-counter {
    padding: 12px;
    background: #f5f7fa;
    border-radius: 6px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #606266;
    margin-bottom: 20px;
  }
  
  .folder-nav {
    flex: 1;
    overflow-y: auto;
  }
  
  .folder-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 8px;
    position: relative;
    
    &:hover {
      background: #f5f7fa;
    }
    
    &.active {
      background: #409eff;
      color: white;
      
      .folder-name {
        color: white;
      }
    }
    
    .folder-name {
      flex: 1;
      font-size: 14px;
      color: #303133;
    }
    
    .folder-badge {
      :deep(.el-badge__content) {
        background: #f56c6c;
      }
    }
  }
}

// 主内容区
.main-content-area {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .batch-actions {
    padding: 16px 20px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    gap: 12px;
    background: #f5f7fa;
  }
  
  .notification-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .notification-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #f5f7fa;
      border-color: #409eff;
      transform: translateX(4px);
    }
    
    &.unread {
      background: #ecf5ff;
      border-color: #b3d8ff;
      
      .item-title {
        font-weight: 600;
      }
    }
    
    .type-tag {
      flex-shrink: 0;
    }
    
    .item-content {
      flex: 1;
      min-width: 0;
      
      .item-title {
        font-size: 15px;
        color: #303133;
        margin: 0 0 6px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .item-meta {
        font-size: 13px;
        color: #909399;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .item-time {
      flex-shrink: 0;
      font-size: 12px;
      color: #909399;
      min-width: 140px;
      text-align: right;
    }
  }
}

// 通知详情
.notification-detail {
  .detail-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-of-type {
      border-bottom: none;
    }
    
    .detail-label {
      min-width: 80px;
      font-weight: 600;
      color: #606266;
    }
  }
  
  .detail-content {
    margin-top: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 6px;
    line-height: 1.6;
    color: #303133;
  }
}

// 响应式
@media (max-width: 1200px) {
  .header-bar {
    flex-wrap: wrap;
    
    .header-center {
      order: 3;
      width: 100%;
      margin-top: 12px;
    }
  }
  
  .content-wrapper {
    flex-direction: column;
  }
  
  .left-sidebar {
    width: 100%;
    
    .folder-nav {
      display: flex;
      gap: 8px;
      overflow-x: auto;
    }
    
    .folder-item {
      flex-shrink: 0;
      margin-bottom: 0;
    }
  }
}
</style>
