<template>
  <div class="main search">
    <div class="search-info">
      <el-input v-model="kw" class="search-input" placeholder="请输入课程名称" @keyup.enter="handleSearch">
        <template #suffix>
          <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
        </template>
      </el-input>
    </div>

    <el-tabs v-model="activeName" @tab-change="handleSearch">
      <el-tab-pane label="课程" name="course"></el-tab-pane>
      <el-tab-pane label="讲师" name="lecturer"></el-tab-pane>
    </el-tabs>

    <div class="search-result">搜索结果：{{ page.totalCount }} 个</div>
    <div v-if="activeName === 'course'">
      <course-list :list="page.list" />
      <div v-if="page.totalCount >= 1" class="pagination clearfix">
        <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </div>

    <div v-if="activeName === 'lecturer'">
      <lecturer-list :list="page.list" />
      <div v-if="page.totalCount >= 1" class="pagination clearfix">
        <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useCourseApi } from '~/composables/useMockApi'
  import useTable from '~/utils/table.js'
  import { lecturerApi } from '~/api/lecturer'

  useHead({
    title: '课程搜索',
    meta: [{ hid: 'keywords', name: 'keywords', content: '芝麻编程、在线教育系统、开源教育系统' }]
  })

  const activeName = ref('course')
  const route = useRoute()
  const router = useRouter()
  const kw = ref(route.query.kw)
  const { getAuthCourses } = useCourseApi()

  // 模拟搜索功能
  const mockSearchCourses = async (params) => {
    const allCourses = await getAuthCourses()
    const keyword = params.courseName || ''
    return {
      data: {
        list: allCourses.filter(course =>
          course.title.toLowerCase().includes(keyword.toLowerCase())
        ),
        totalCount: allCourses.length,
        pageCurrent: 1,
        pageSize: 10
      }
    }
  }

  // 模拟搜索讲师
  const mockSearchLecturers = async (params) => {
    const keyword = params.lecturerName || ''
    const lecturers = [
      {
        id: 1,
        lecturerName: '张教授',
        lecturerPosition: 'AI专家',
        lecturerHead: '/images/lecturer-1.jpg',
        introduce: '拥有10年AI开发经验，专注于机器学习和深度学习领域。',
        courseCount: 5,
        studentCount: 10000
      },
      {
        id: 2,
        lecturerName: '李老师',
        lecturerPosition: '全栈工程师',
        lecturerHead: '/images/lecturer-2.jpg',
        introduce: '8年全栈开发经验，精通前端和后端技术栈。',
        courseCount: 8,
        studentCount: 15000
      }
    ]

    return {
      data: {
        list: lecturers.filter(lecturer =>
          lecturer.lecturerName.toLowerCase().includes(keyword.toLowerCase()) ||
          lecturer.introduce.toLowerCase().includes(keyword.toLowerCase())
        ),
        totalCount: lecturers.length,
        pageCurrent: 1,
        pageSize: 10
      }
    }
  }

  const apis = { page: mockSearchCourses }
  const paras = { courseName: kw.value || '' }

  function handleSearch() {
    if (kw.value === '') {
      return
    }
    if (activeName.value === 'course') {
      apis.page = mockSearchCourses
      router.push({ path: '/search', query: { kw: kw.value } })
      delete query.lecturerName
      query.courseName = kw.value
      handleQuery()
    } else if (activeName.value === 'lecturer') {
      apis.page = mockSearchLecturers
      router.push({ path: '/search', query: { kw: kw.value } })
      delete paras.courseName
      delete query.courseName
      query.lecturerName = kw.value
      handleQuery()
    }
  }

  // 分页查询
  const { page, handlePage, query, handleQuery } = useTable(apis, paras)
</script>
<style lang="scss" scoped>
  .search {
    padding: 10px 0;
    min-height: calc(100vh - 150px);
  }

  .search-info {
    width: 500px;
    margin: 0 auto;
    .search-input {
      margin: 10px auto;
      height: 45px;
    }
  }
</style>
