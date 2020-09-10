// 摄影之家子列表
<template>
  <div class="wrapper" v-wechat-title="this.title+'_视觉南京'" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <header>
      <div class="list-header flexBox flexBox flexAlign grayBorder">
        <i class="backIcon" @click="goBack"></i>
        <div class="title">{{title}}</div>
      </div>
    </header>
    <!-- 列表 -->
    <div class="list-container" v-if="requested">
        <div class="item-box">
          <div class="flexBox flexBetween flexWrap p15">
            <div
              class="user-item"
              :class="{'mt5':index > 2 }"
              v-for="(item,index) in list"
              :key="index"
              @click="goDetail(item)"
            >
              <img class="avatar" :src="getImgUrl(item.index_pic,120,120)" alt />
              <p class="user-name">{{item.title}}</p>
              <div class="user-border"></div>
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
    </div>
  </div>
</template>
<script>
export default {
  name: 'photographerList',
  data () {
    return {
      requested: false,
      title: '',
      count: 20,
      page: 1,
      list: [],
      hasMore: true
    }
  },
  methods: {
    // 跳转个人主页
    goDetail (item) {
      this.$router.push({ path: '/userdetail',
        query: {
          id: item.link
        } })
    },
    getData (id) {
      if (!this.hasMore) return
      const param = {
        page: this.page,
        per_num: this.count,
        child_id: id
      }
      this.$api.getShootHome(param).then(res => {
        if (res.data.data[0].data.length) {
          this.list = this.list.concat(res.data.data[0].data)
          if (res.data.data[0].data.length < this.count) {
            this.hasMore = false
          }
          this.requested = true
        } else {
          this.requested = true
          this.hasMore = false
        }
        this.requested = true
      })
    },
    loadMore () {
      this.page++
      this.getData(this.id)
    }
  },
  created () {
    this.title = this.$route.query.title
    this.id = this.$route.query.id
    this.getData(this.id)
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  background: #fff;
  .list-container {
    background-color: #f8f8f8;
    min-height: 6rem;
    padding-top: 0.15rem;
    .item-box {
      .user-item {
        display: inline-block;
        width: 1.1rem;
        height: 1.3rem;
        background-color: #fff;
        margin-right: 0.05rem;
        padding-top: 0.2rem;
        &.mt5 {
          margin-top: 0.05rem;
        }
        .avatar {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          margin: 0 auto 0.1rem;
          display: block;
        }
        .user-name {
          font-size: 0.14rem;
          font-family: SourceHanSansCN;
          font-weight: 400;
          text-align: center;
          margin-bottom: 0.05rem;
        }
        .user-border {
          width: 0.22rem;
          height: 0.03rem;
          background-color: #70d0fe;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
