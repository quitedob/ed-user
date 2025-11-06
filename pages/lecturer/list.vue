<template>
  <div class="main course-list">
    <!-- 讲师列表 -->
    <lecturer-list v-loading="page.loading" :list="page.list" />

    <!-- 分页功能 -->
    <div v-if="page.totalCount >= 1" class="pagination clearfix">
      <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    </div>
  </div>
</template>
<script setup>
  import { websiteInfo, mockLecturerList, mockApiCall } from '~/utils/mockData'

  // 模拟讲师列表数据
  const mockLecturerListApi = async () => {
    return await mockApiCall({
      content: mockLecturerList,
      totalElements: mockLecturerList.length,
      totalPages: 1,
      size: 10,
      number: 0
    })
  }

  // 分页查询 - 使用模拟数据
  const page = ref({
    list: mockLecturerList,
    loading: false,
    totalCount: mockLecturerList.length,
    pageCurrent: 1,
    pageSize: 10
  })

  const handlePage = () => {
    // 模拟分页处理
  }
  useHead({
    title: '讲师列表',
    meta: [
      { hid: 'keywords', name: 'keywords', content: 'AI编程、在线教育、编程讲师、AIGC作品' },
      { hid: 'description', name: 'description', content: websiteInfo.websiteDesc }
    ]
  })
</script>
<style lang="scss" scoped>
  .course-list {
    padding: 10px 0;
  }
</style>
