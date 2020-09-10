// cssid 9902 视频专区 单列列表
<template>
  <div class="wrapper" v-wechat-title="this.title+'_视觉南京'" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <header>
      <div class="list-header flexBox flexBox flexAlign grayBorder">
        <i class="backIcon" @click="goBack"></i>
        <div class="title">{{title}}</div>
      </div>
    </header>
    <div v-if="requested">
      <div class="video-container" v-if="list.length">
        <div class="video-item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
          <img class="fullImg" :src="getImgUrl(item.index_pic,750,422)" alt />
          <img src="../../assets/images/common/video_icon.png" alt class="icon alignCenter" />
          <div class="info flexBox flexAlign flexBetween">
            <p class="textEllipsis" style="width:80%;">{{item.title}}</p>
            <p class="duration">{{item.duration_format}}</p>
          </div>
        </div>
      </div>
      <img
        v-else
        class="no-data-img style1 pt15"
        src="../../assets/images/nodata/home_list.png"
        alt
      />
      <div style="display:flex;justify-content:center;align-items:center;width:100%;padding:0.15rem 0;" v-if="hasMore">
          <img style="width:0.15rem;height:0.15rem;margin-right:0.05rem;" src="../../assets/images/contribute/loading.gif" alt />
          <p style="font-size:0.15rem;">加载中</p>
      </div>
      <p v-if="!hasMore" class="no-data-text">没有更多了</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'liststyle2',
  data () {
    return {
      offset: 0,
      count: 10,
      title: '',
      id: '',
      list: [],
      hasMore: true,
      requested: false
    }
  },
  methods: {
    getContent (id) {
      if (!this.hasMore) return
      const param = {
        column_id: id,
        offset: this.offset,
        count: this.count
      }
      this.$api.getContent(param).then(res => {
        if (res.data.length) {
          if (!this.title) this.title = res.data[0].column_name
          this.list = this.list.concat(res.data)
          if (res.data.length < this.count) {
            this.hasMore = false
          }
          this.requested = true
        } else {
          this.requested = true
          this.hasMore = false
        }
      })
    },
    loadMore () {
      this.offset += 10
      this.getContent(this.id)
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getContent(this.id)
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .video-container {
    .video-item {
      display: block;
      width: 100%;
      height: 2.11rem;
      margin-bottom: 0.1rem;
      position: relative;
      .icon {
        width: 0.4rem;
        height: 0.4rem;
      }
      .info {
        width: 100%;
        height: 0.46rem;
        position: absolute;
        bottom: 0;
        padding: 0 0.15rem;
        font-family: PingFangSC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        font-size: 0.16rem;
        .duration {
          font-size: 0.13rem;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
