// cssid 9905 历史影像 双列列表
<template>
  <div class="wrapper" v-wechat-title="this.title+'_视觉南京'" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <header>
      <div class="list-header flexBox flexBox flexAlign grayBorder">
        <i class="backIcon" @click="goBack"></i>
        <div class="title">{{title}}</div>
      </div>
    </header>
      <div v-if="requested">
        <div v-if="list.length" class="flexBox flexBetween flexWrap p15" style="padding-top:0.15rem;">
          <div class="img-item" :class="{'mt10':index > 1}" v-for="(img,index) in list" :key="index" @click="goDetail(img)">
            <img v-if="img.index_pic" :src="getImgUrl(img.index_pic,336,200)" alt />
            <img v-else class="fullImg" src="../../assets/images/nodata/list_small.png" alt />
            <div class="img-info">
              <p class="title textEllipsis">{{img.title}}</p>
              <p class="date">{{img.publish_time.substring(0,10)}}</p>
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
import { Toast } from 'mint-ui'
export default {
  name: 'liststyle5',
  components: {
    Toast
  },
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
    this.title = this.$route.query.title
    this.id = this.$route.query.id
    this.getContent(this.id)
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  background-color: #f8f8f8;
  height: 100%;
  overflow-y: auto;
  .mt10 {
    margin-top: 0.1rem;
  }
}
</style>
