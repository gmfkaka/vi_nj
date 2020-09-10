<template>
  <div class="wrapper" v-wechat-title="'活动详情_视觉南京'" v-if="requested"  v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <div class="top">
      <p class="title">活动稿件</p>
      <img src="../../assets/images/detail/back2.png" @click="goBack" alt />
    </div>
    <img class="top-img" :src="getImgUrl(detail.index_pic_url,750,434)" alt />
    <div class="main-box">
      <p class="title">{{detail.title}}</p>
      <p class="brief">{{detail.brief}}</p>
    </div>
    <!-- 列表 -->
    <div class="list-box p15">
      <div
        class="list-item flexBox"
        :class="{'border-top':index > 0}"
        v-for="(item,index) in list"
        :key="index"
        @click="goDetail(item)"
      >
        <div class="img-box">
          <img class="fullImg" v-if="item.index_pic" :src="getImgUrl(item.index_pic,200,140)" alt />
          <img v-else class="fullImg" src="../../assets/images/nodata/list_small.png" alt="">
          <div v-if="type === 'rate'">
            <p class="status checking" v-if="!item.is_score">未评分</p>
            <p class="status published" v-if="item.is_score">已评分</p>
          </div>
          <div v-else>
            <p class="status checking" v-if="item.status === 1 || item.status === 5">审核中</p>
            <p class="status checked" v-if="item.status === 2">已审核</p>
            <p class="status ban" v-if="item.status === 4 || item.status === 22">已打回</p>
            <p class="status remain" v-if="item.status === 21">评分中</p>
            <p
              class="status published"
              v-if="item.status === 20 || item.status === 3 ||item.status === 23"
            >已评分</p>
          </div>
        </div>
        <div class="info-box">
          <p class="title">{{item.title}}</p>
          <p class="brief textEllipsis" style="width:2.2rem;">{{item.brief}}</p>
          <div class="flexBox flexAlign time-box">
            <p class="brief" style="margin-right:0.08rem;">提交时间</p>
            <p class="title" style="margin:0;">{{item.publish_time.substring(5,16)}}</p>
          </div>
        </div>
        <div style="display:flex;justify-content:center;align-items:center;width:100%;padding:0.15rem 0;" v-if="hasMore">
            <img style="width:0.15rem;height:0.15rem;margin-right:0.05rem;" src="../../assets/images/contribute/loading.gif" alt />
            <p style="font-size:0.15rem;">加载中</p>
        </div>
      </div>
      <img
        v-if="!list.length"
        class="no-data-img style1"
        src="../../assets/images/nodata/home_list.png"
        alt
      />
      <p v-if="!hasMore" class="no-data-text">没有更多了</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'eventList',
  data () {
    return {
      type: '',
      id: '',
      page: 1,
      requested: false,
      hasMore: true,
      count: 10,
      detail: {},
      list: []
    }
  },
  methods: {
    goDetail (item) {
      this.$router.push({
        path: '/imgdetail',
        query: { id: item.id, type: this.type === 'rate' ? 'committee' : '' }
      })
    },
    getDetail () {
      const param = {
        access_token: this.getToken(),
        activity_id: this.id
      }
      this.$api.getActivityDetail(param).then(res => {
        if (res.data.ErrorCode === 0) {
          this.detail = res.data.data
          this.getList(this.id)
        }
      })
    },
    getList (id) {
      const param = {
        access_token: this.getToken(),
        page: this.page,
        per_num: this.count,
        activity_id: id,
        committee_member_id: this.getCookie('memberId')
      }
      this.$api.getActivityDetailList(param).then(res => {
        if (res.data.ErrorCode === 0) {
          this.list = res.data.data.data
          this.requested = true
        }
      })
    },
    loadMore () {
      if (!this.hasMore) return
      this.page++
      const param = {
        access_token: this.getToken(),
        page: this.page,
        per_num: this.count,
        activity_id: this.id
      }
      this.$api.getActivityDetailList(param).then(res => {
        if (res.data.ErrorCode === 0) {
          if (res.data.data.data.length) {
            this.list = this.list.concat(res.data.data.data)
            if (res.data.data.data.length < this.count) {
              this.hasMore = false
            }
          } else {
            this.hasMore = false
          }
        }
      })
    }
  },
  created () {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getDetail()
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  p {
    &.title {
      color: rgba(51, 51, 51, 1);
      font-size: 0.14rem;
      margin-bottom: 0.11rem;
    }
    &.brief {
      color: rgba(153, 153, 153, 1);
      font-size: 0.12rem;
    }
  }
  .top {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    height: 0.64rem;
    background-color: #fff;
    padding-top: 0.3rem;
    padding-bottom: 0.12rem;
    .title {
      line-height: 0.22rem;
      font-size: 0.16rem;
      text-align: center;
      color: #333333;
    }
    img {
      width: 0.11rem;
      height: 0.19rem;
      top: 0.33rem;
      left: 0.15rem;
      position: absolute;
    }
  }
  .top-img {
    width: 100%;
    height: 2.17rem;
    margin-top: 0.64rem;
  }
  .main-box {
    padding: 0.15rem;
    font-family: SourceHanSansCN;
    font-weight: 400;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
  }
  .list-box {
    background-color: rgb(252, 252, 252);
    .list-item {
      padding: 0.17rem 0 0.12rem;
      &.border-top {
        border-top: 1px solid rgb(240, 240, 240);
      }
      .img-box {
        width: 1rem;
        height: 0.7rem;
        margin-right: 0.1rem;
        position: relative;
      }
      .info-box {
        height: 100%;
        padding-top: 0.04rem;
        .time-box {
          margin-top: 0.11rem;
        }
      }
    }
  }
}
</style>
