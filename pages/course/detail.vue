<template>
  <div class="detail_content">
    <div class="detail_body">
      <div class="detail_header clearfix">
        <div class="detail_title">
          <nuxt-link :to="{ path: '/' }"> 首页 </nuxt-link>
          <span>></span>
        </div>
        <div class="detail_title">
          <nuxt-link :to="{ name: 'course-list' }"> 课程中心 </nuxt-link>
          <span>></span>
        </div>
        <div class="detail_title">
          {{ courseInfo.courseName }}
        </div>
      </div>
      <div class="clearfix">
        <div class="video_box">
          <img class="detail_view" :src="courseInfo?.courseLogo" :alt="courseInfo?.courseName" />
          <div class="view_info">
            <!-- 课程详情 -->
            <div class="view_info_course">
              {{ courseInfo.courseName }}
            </div>
            <div class="view_price">
              <div>
                价格:<span v-if="courseInfo.coursePrice === 0">免费</span>
                <span v-else>
                  ￥{{ courseInfo.coursePrice }} <b style="text-decoration-line: line-through; color: grey; font-size: 18px">￥{{ courseInfo.rulingPrice }}</b>
                </span>
              </div>
            </div>
            <div v-if="courseInfo.lecturerResp" class="view_info_item">
              <span class="text_b">讲师名称:</span>{{ courseInfo.lecturerResp.lecturerName }}（{{ courseInfo.lecturerResp.lecturerPosition }}）
            </div>
            <div class="view_info_item"><span class="text_b">购买人数:</span>{{ courseInfo.countBuy }} 人</div>
            <div class="view_info_item"><span class="text_b">学习人数:</span>{{ courseInfo.countStudy }} 人</div>
            <div class="foot_box">
              <button v-if="courseInfo.allowStudy === 1" class="buy_btn" @click="handleStudy">马上学习</button>
              <button v-else-if="courseInfo.isFree === 0" class="buy_btn" @click="handleBuy(courseInfo)">立即购买</button>
              <button v-else-if="courseInfo.isFree === 1" class="buy_btn" @click="handleLogin">登录观看</button>
              <div class="handle_info_btn">
                <div class="collect_btn">
                  <course-collect :course-id="courseInfo.id" :collect-status="courseInfo.courseCollect" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="main">
    <!-- 章节详情 -->
    <div class="course_info clearfix">
      <div class="layout_left">
        <el-tabs type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="课程介绍">
            <div class="introduce" v-html="courseInfo.introduce" />
          </el-tab-pane>
          <el-tab-pane label="课程目录">
            <course-chapter :list="courseInfo.chapterRespList" />
          </el-tab-pane>
          <el-tab-pane label="课程评价" name="review">
            <div class="course-review">
              <div class="review-stats">
                <div class="rating">
                  <el-rate v-model="courseInfo.rating" disabled show-score text-color="#ff9900" score-template="{value} 分" />
                  <span class="rating-count">({{ courseInfo.reviewCount }}人评价)</span>
                </div>
              </div>
              <div class="review-list">
                <div v-for="review in courseInfo.reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <img :src="review.avatar" :alt="review.reviewerName" class="reviewer-avatar" />
                      <div class="reviewer-details">
                        <span class="reviewer-name">{{ review.reviewerName }}</span>
                        <el-rate v-model="review.rating" disabled size="small" />
                      </div>
                    </div>
                    <span class="review-time">{{ review.createTime }}</span>
                  </div>
                  <div class="review-content">
                    {{ review.content }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="layout_right">
        <div class="teacher_info clearfix">
          <span class="head">讲师简介</span>
          <div class="teacher_msg">
            <nuxt-link target="_blank" :to="{ name: 'lecturer-detail', query: { id: courseInfo.lecturerResp.id } }">
              <div v-if="courseInfo.lecturerResp" class="teacher_msg_right">
                <img v-if="courseInfo.lecturerResp.lecturerHead" class="teacher_phone" :src="courseInfo.lecturerResp.lecturerHead" alt="" />
                <img v-else class="teacher_phone" src="~/assets/image/common_head.jpg" alt="" />
                <div class="teacher_info_content">
                  <span class="teacher_name">{{ courseInfo.lecturerResp.lecturerName }}</span>
                  <br />
                  {{ courseInfo.lecturerResp.lecturerPosition }}
                </div>
              </div>
            </nuxt-link>
            <div class="info_box" v-html="courseInfo.lecturerResp?.introduce" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <common-pay ref="commonPayRef" @refresh="handleCourse" />
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import { setStorage } from '~/utils/storage.js'
  const route = useRoute()

  // 模拟课程详情数据
  const mockCourseDetail = (courseId) => {
    return {
      id: courseId || 1,
      courseName: 'AI编程入门课程',
      courseLogo: '/images/course-1.jpg',
      coursePrice: 199,
      rulingPrice: 299,
      countBuy: 1234,
      countStudy: 5678,
      allowStudy: 1,
      isFree: 0,
      courseCollect: false,
      introduce: '这是一门专注于AI编程的入门课程，涵盖机器学习、深度学习等核心概念。',
      rating: 4.8,
      reviewCount: 156,
      reviews: [
        {
          id: 1,
          reviewerName: '李同学',
          avatar: '/images/avatar-1.jpg',
          rating: 5,
          content: '课程内容很丰富，讲师讲解清晰，强烈推荐！',
          createTime: '2024-01-15'
        },
        {
          id: 2,
          reviewerName: '王同学',
          avatar: '/images/avatar-2.jpg',
          rating: 4,
          content: '实践内容很多，对实际工作很有帮助。',
          createTime: '2024-01-12'
        },
        {
          id: 3,
          reviewerName: '赵同学',
          avatar: '/images/avatar-3.jpg',
          rating: 5,
          content: '从零基础开始学习，现在已经能够独立完成AI项目了！',
          createTime: '2024-01-10'
        }
      ],
      lecturerResp: {
        id: 1,
        lecturerName: '张老师',
        lecturerPosition: 'AI专家',
        lecturerHead: '/images/lecturer-1.jpg',
        introduce: '拥有10年AI开发经验，专注于机器学习和深度学习领域。'
      },
      chapterRespList: [
        {
          id: 1,
          chapterName: '第一章：AI基础概念',
          sort: 1,
          children: [
            {
              id: 11,
              chapterName: '1.1 什么是人工智能',
              sort: 1,
              studyTime: 1800
            }
          ]
        }
      ]
    }
  }

  const courseInfo = ref(mockCourseDetail(route.query.id))

  // 计算页面标题和描述
  const pageTitle = computed(() => {
    return courseInfo.value && courseInfo.value.courseName
      ? courseInfo.value.courseName
      : '课程详情'
  })

  const pageDescription = computed(() => {
    return courseInfo.value && courseInfo.value.lecturerResp && courseInfo.value.lecturerResp.introduce
      ? courseInfo.value.lecturerResp.introduce
      : '芝麻编程 - 专业的AI编程在线学习平台'
  })

  useHead({
    title: pageTitle,
    meta: [
      { hid: 'keywords', name: 'keywords', content: '芝麻编程、在线教育系统、开源教育系统' },
      { hid: 'description', name: 'description', content: pageDescription }
    ]
  })

  const commonPayRef = ref()

  // 购买
  function handleBuy(courseInfo) {
    if (getToken()) {
      // 购买
      commonPayRef.value.onOpen(courseInfo)
    } else {
      setStorage('history', window.location.href, 5)
      ElMessageBox.confirm('请先登录', '提示', { confirmButtonText: '立即登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
        useRouter().push('/login')
      })
    }
  }

  // 课程详情
  async function handleCourse() {
    window.location.reload()
  }

  // 学习
  function handleStudy() {
    // 检查用户是否已登录且已报名该课程
    const token = getToken()
    if (token) {
      // 用户已登录，重定向到学生门户的课程主页
      useRouter().push('/student/course/' + courseInfo.value.id)
    } else {
      // 用户未登录，提示登录
      setStorage('history', window.location.href, 5)
      ElMessageBox.confirm('请先登录后开始学习', '提示', {
        confirmButtonText: '立即登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        useRouter().push('/login')
      })
    }
  }

  // 登录
  function handleLogin() {
    setStorage('history', window.location.href, 5)
    useRouter().push('/login')
  }

  const activeName = ref('')
  function handleTabClick(tab) {
    activeName.value = tab.props.name
  }
</script>
<style lang="scss" scoped>
  .detail_content {
    background: #fff;
    color: #999;
    font-size: 14px;
    .detail_body {
      width: 1200px;
      margin: 0 auto;
      height: 373px;
    }
    .detail_header {
      .detail_title {
        float: left;
        line-height: 57px;
        margin: 0 5px;
        max-width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          margin-left: 10px;
        }
      }
    }

    .video_box {
      overflow: hidden;
      .detail_view {
        float: left;
        width: 504px;
        height: 280px;
        background-size: 100%;
        border-radius: 5px;

        &.float_win {
          position: fixed;
          right: 10px;
          bottom: 30px;
          z-index: 9999;
        }
      }
      .view_info {
        float: right;
        width: 650px;
        height: 270px;
        position: relative;

        .view_info_item {
          line-height: 30px;
          .text_b {
            margin-right: 20px;
          }
        }

        .view_price {
          background: #f5f5f5;
          color: rgb(102, 102, 102);
          padding: 15px 10px;
          margin: 10px 0;
          span {
            font-size: 20px;
            color: #d51423;
            font-weight: bold;
            margin-left: 20px;
          }
        }

        .view_info_course {
          font-size: 18px;
          margin: 5px 0;
          color: #333;
          height: 25px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .foot_box {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .buy_btn {
          display: block;
          width: 136px;
          height: 36px;
          background: #2256f6;
          color: #fff;
          border: none;
          border-radius: 6px;
          line-height: 36px;
          text-align: center;
          font-size: 14px;
          &:hover {
            text-decoration: none;
            color: #fff;
            cursor: pointer;
          }
        }
        .handle_info_btn {
          display: flex;
          align-items: center;
          color: #999;
          font-size: 14px;
        }
      }
    }
  }

  .course_info {
    margin: 20px 0;
    overflow: hidden;
    .layout_left {
      width: 920px;
      float: left;
      .introduce {
        font-size: 14px;
        line-height: 30px;
        color: #333;
        padding-left: 8px;
      }
    }

    .layout_right {
      width: 260px;
      float: right;
      img {
        width: 50px;
        border-radius: 50px;
      }
      .teacher_info {
        background-color: #fff;
        padding: 20px;
        .head {
          font-size: 18px;
        }
        .teacher_msg_right {
          float: left;
          display: flex;
          padding: 20px 0;
          align-items: center;
          .teacher_info_content {
            margin-left: 10px;
          }
          .teacher_name {
            font-size: 16px;
            font-weight: bold;
          }
        }
        .info_box {
          clear: both;
        }
      }
    }

    .course-review {
      .review-stats {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #ebeef5;

        .rating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .rating-count {
            font-size: 14px;
            color: #909399;
          }
        }
      }

      .review-list {
        .review-item {
          padding: 20px 0;
          border-bottom: 1px solid #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .review-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;

            .reviewer-info {
              display: flex;
              align-items: center;
              gap: 12px;

              .reviewer-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
              }

              .reviewer-details {
                .reviewer-name {
                  display: block;
                  font-weight: 500;
                  color: #303133;
                  margin-bottom: 4px;
                }
              }
            }

            .review-time {
              font-size: 12px;
              color: #909399;
            }
          }

          .review-content {
            color: #606266;
            line-height: 1.6;
            padding-left: 52px;
          }
        }
      }
    }
  }
</style>
