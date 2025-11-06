<template>
  <div class="main course-list">
    <!-- 选择分类 -->
    <course-choose v-for="(category, index) in categoryList" :key="index" :menu="category" :index="index" @change="handleChange" />

    <!-- 课程列表 -->
    <course-list v-loading="page.loading" :list="page.list" />

    <!-- 分页功能 -->
    <div v-if="page.totalCount >= 1" class="pagination clearfix">
      <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    </div>
  </div>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import useTable from '~/utils/table.js'
  import { indexApi } from '~/api'

  // 使用静态数据替代API调用
  const websiteInfo = ref({
    websiteDesc: '专业的AI编程在线学习平台，提供高质量的课程内容'
  })

  useHead({
    title: '课程列表',
    meta: [
      { hid: 'keywords', name: 'keywords', content: 'AI编程、在线教育、编程学习、AIGC作品' },
      { hid: 'description', name: 'description', content: websiteInfo.value.websiteDesc }
    ]
  })

  const router = useRouter()
  const route = useRoute()

  // 分类查询
  const categoryList = ref([])
  let selectCategory = []

  onMounted(async () => {
    // 分类列表
    await getCategoryList()
    // 初始化分类
    initCategory()
  })

  const initCategory = () => {
    if (route.query.categoryId) {
      const classifyIdObj = {}
      const key = []
      const init = (list, prefixId) => {
        list.forEach((e) => {
          if (e.id) {
            const id = prefixId ? prefixId + '_' + e.id : e.id
            key.push(id)
            classifyIdObj[e.id] = e
            if (e.list && e.list.length) {
              return init(e.list, id)
            }
          }
        })
      }
      init(categoryRes, '')
      const lists = key.filter((e) => e.indexOf(route.query.categoryId) > -1)
      if (lists && lists.length) {
        lists.sort((a, b) => {
          return a.length - b.length
        })
        const ids = lists[0].split('_')
        if (ids && ids.length) {
          categoryList.value.push({
            active: ids[0],
            list: [{ id: '', categoryName: '全部' }].concat(categoryRes)
          })
          ids.forEach((id, index) => {
            const item = classifyIdObj[id]
            if (item) {
              selectCategory.push(id)
              if (item.list.length) {
                categoryList.value.push({
                  active: ids[index + 1] || id,
                  list: [{ id: id, categoryName: '全部' }].concat(item.list)
                })
              }
            }
          })
        }
      }
      console.log(categoryList)
    } else {
      categoryList.value.push({
        active: '',
        list: [{ id: '', categoryName: '全部' }].concat(categoryRes)
      })
    }
  }

  // 分类处理
  const handleChange = (index, row) => {
    if (selectCategory[index] !== row.id) {
      selectCategory[index] = row.id
      if (row.list && row.list.length) {
        if (categoryList.value.length > index + 1) {
          categoryList.value.length = index + 1
        }
        categoryList.value.push({
          active: row.id,
          list: [{ id: row.id, categoryName: '全部' }].concat(row.list)
        })
      } else {
        categoryList.value.length = index + 1
        selectCategory.length = index + 1
      }
    }
    const queryObj = Object.assign({ ...(route.query || {}) }, { categoryId: selectCategory[index] || '' })
    if (!queryObj.categoryId) {
      delete queryObj.categoryId
    }
    router.push({ query: queryObj })
    query.categoryId = queryObj.categoryId
    handleQuery()
  }

  // 分类查询 - 使用静态数据
  let categoryRes = [
    {
      id: 1,
      categoryName: 'AI编程',
      list: [
        { id: 11, categoryName: '机器学习', list: [] },
        { id: 12, categoryName: '深度学习', list: [] },
        { id: 13, categoryName: '自然语言处理', list: [] }
      ]
    },
    {
      id: 2,
      categoryName: 'Web开发',
      list: [
        { id: 21, categoryName: '前端开发', list: [] },
        { id: 22, categoryName: '后端开发', list: [] },
        { id: 23, categoryName: '全栈开发', list: [] }
      ]
    },
    {
      id: 3,
      categoryName: '移动开发',
      list: [
        { id: 31, categoryName: 'iOS开发', list: [] },
        { id: 32, categoryName: 'Android开发', list: [] }
      ]
    }
  ]
  const getCategoryList = async () => {
    // 静态数据，无需API调用
    selectCategory = []
  }

  // 模拟课程数据
  const mockCourseList = async (params) => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 100))

    return {
      content: [
        {
          id: 1,
          courseName: 'AI编程入门课程',
          description: '从零开始学习AI编程',
          coverUrl: '/images/course-1.jpg',
          price: 199,
          studyCount: 1234,
          categoryId: params.categoryId || 1
        },
        {
          id: 2,
          courseName: 'Python高级编程',
          description: '深入学习Python高级特性',
          coverUrl: '/images/course-2.jpg',
          price: 299,
          studyCount: 567,
          categoryId: params.categoryId || 2
        }
      ],
      totalElements: 2,
      totalPages: 1,
      size: 10,
      number: 0
    }
  }

  // 分页查询
  const { page, handlePage, query, handleQuery } = useTable(
    {
      page: mockCourseList
    },
    { categoryId: route.query.categoryId || '' }
  )
</script>
<style lang="scss" scoped>
  .course-list {
    padding: 10px 0;
  }
</style>
