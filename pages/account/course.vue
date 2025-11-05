<template>
  <NuxtLayout name="account">
    <client-only>
      <el-table v-loading="page.loading" :border="false" :data="page.list" :show-header="false">
        <el-table-column label="课程">
          <template #default="scope">
            <img v-if="scope.row.courseResp" :src="scope.row.courseResp?.courseLogo" :alt="scope.row.courseResp?.courseName" class="course-img" />
            <div v-if="scope.row.courseResp" class="course-info">
              <div class="course-info-title">{{ scope.row.courseResp?.courseName }}<span v-if="scope.row.courseResp?.isFree === 1" style="margin: 0">【免费课】</span></div>
              <div v-if="scope.row.periodName" class="course-info-title">学习至：{{ scope.row.periodName }}（{{ scope.row.periodProgress }}%）| {{ scope.row.periodTime }}</div>
              <div v-if="scope.row.courseProgress" class="course-info-title" style="width: 300px">
                <el-progress :percentage="scope.row.courseProgress" :status="scope.row.courseProgress > 99 ? 'success' : ''" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="200" align="center" label="操作">
          <template #default="scope">
            <nuxt-link v-if="scope.row.courseResp" :to="{ name: 'course-study', query: { id: scope.row.courseResp?.id, periodId: scope.row.periodId } }" link plain type="primary" @click="handleContinueStudy(scope.row)">
              <el-button plain> 继续学习 </el-button>
            </nuxt-link>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="page.totalCount >= 1" class="pagination">
        <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </client-only>
  </NuxtLayout>
</template>
<script setup>
  import useTable from '~/utils/table.js'
  import { useCourseApi } from '~/composables/useMockApi'

  const { getAuthCourses } = useCourseApi()

  const mockUserCoursePage = async (params) => {
    const courses = await getAuthCourses()
    return {
      data: {
        list: courses,
        totalCount: courses.length,
        pageCurrent: 1,
        pageSize: 10
      }
    }
  }

  const { page, handlePage } = useTable({
    page: mockUserCoursePage
  })

  // 处理继续学习按钮点击
  const handleContinueStudy = (courseData) => {
    console.log('继续学习按钮被点击:', {
      courseId: courseData.courseResp?.id,
      courseName: courseData.courseResp?.courseName,
      periodId: courseData.periodId,
      periodName: courseData.periodName
    })
  }
</script>
<style lang="scss" scoped>
  .course-img {
    float: left;
    height: 100px;
    width: 180px;
    border-radius: 6px;
  }
  .course-info {
    float: left;
    font-size: 12px;
    .course-info-title {
      margin-left: 20px;
      height: 33px;
      line-height: 33px;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
