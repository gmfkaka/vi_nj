// cssid 9906 五图突出一张
// cssid 9907 双列四图
// cssid 9910 双列两图
<template>
  <div class="wrapper" v-wechat-title="this.title+'_视觉南京'" v-if="navList.length > 1"  v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <!-- 底部 -->
    <header>
      <div class="list-header flexBox flexBox flexAlign grayBorder">
        <i class="backIcon" @click="goBack"></i>
        <div class="title">{{title}}</div>
      </div>
    </header>
    <!-- 导航栏 -->
    <div class="nav-bar-container">
      <div class="nav-bar">
        <div
          class="nav-item"
          :class="{'active':index === 0}"
          v-for="(item,index) in navList"
          :key="index"
          @click="goList(item)"
        >{{item.name}}</div>
      </div>
    </div>
    <!-- 轮播 -->
    <swiper v-if="swiperList.length" :list="swiperList" class="swiper"></swiper>
    <!-- 列表 -->
    <div class="container p15">
      <div class="item-box" v-for="(item,index) in navList.slice(1,navList.length)" :key="index">
        <div class="column-name flexBox flexBetween flexAlign mb10" @click="goList(item)">
          <div class="flexBox flexAlign">
            <div class="title">{{item.name}}</div>
          </div>
          <i class="moreIcon"></i>
        </div>
        <!-- 上大图 两小图 -->
        <div v-if="cssid == 9906">
          <!-- 大图 -->
          <div class="imgs-box mb10" v-if="item.data.length">
            <div class="large-img flexBox flexMiddel" @click="goDetail(item.data[0])">
              <img class="fullImg" :src="getImgUrl(item.data[0].index_pic,690,508)" alt />
            </div>
            <div class="img-brief">
              <p>{{item.data[0].title}}</p>
              <p class="date">{{item.data[0].publish_time.substring(0,10)}}</p>
            </div>
          </div>
          <!-- 小图 -->
          <div class="flexBox flexBetween" v-if="item.data.length > 1">
            <div
              class="img-item"
              v-for="(img,index) in item.data.slice(1,3)"
              :key="index"
              @click="goDetail(img)"
            >
              <img v-if="img.index_pic" :src="getImgUrl(img.index_pic,336,200)" alt />
              <img v-else class="fullImg" src="../../assets/images/nodata/list_small.png" alt />
              <div class="img-info">
                <p class="title textEllipsis">{{img.title}}</p>
                <p class="date">{{img.publish_time.substring(0,10)}}</p>
              </div>
            </div>
          </div>
          <img v-else class="fullImg" src="../../assets/images/nodata/home_updated.png" alt />
        </div>
        <!-- 四小图 -->
        <div class="flexBox flexBetween flexWrap" v-if="cssid == 9907 || cssid == 9908 || cssid === 0">
          <div
            class="img-item"
            :class="{'mt10':index < 2}"
            v-for="(img,index) in item.data.slice(0,4)"
            :key="index"
            @click="goDetail(img)"
          >
            <img v-if="img.index_pic" :src="getImgUrl(img.index_pic,336,200)" alt />
            <img v-else class="fullImg" src="../../assets/images/nodata/list_small.png" alt />
            <div class="img-info">
              <p class="title textEllipsis">{{img.title}}</p>
              <p class="date">{{img.publish_time.substring(0,10)}}</p>
            </div>
          </div>
          <img
            v-if="!item.data.length"
            class="fullImg"
            src="../../assets/images/nodata/home_updated.png"
            alt
          />
        </div>
        <!-- 两小图 -->
        <div class="flexBox flexBetween" v-if="cssid == 9910">
          <div
            class="img-item"
            v-for="(img,index) in item.data.slice(0,2)"
            :key="index"
            @click="goDetail(img)"
          >
            <img v-if="img.index_pic" :src="getImgUrl(img.index_pic,336,200)" alt />
            <img v-else class="fullImg" src="../../assets/images/nodata/list_small.png" alt />
            <div class="img-info">
              <p class="title textEllipsis">{{img.title}}</p>
              <p class="date">{{img.publish_time.substring(0,10)}}</p>
            </div>
          </div>
          <img
            v-if="!item.data.length"
            class="fullImg"
            src="../../assets/images/nodata/home_updated.png"
            alt
          />
        </div>
      </div>
    </div>
     <div style="display:flex;justify-content:center;align-items:center;width:100%;padding:0.15rem 0;" v-if="hasMore">
        <img style="width:0.15rem;height:0.15rem;margin-right:0.05rem;" src="../../assets/images/contribute/loading.gif" alt />
        <p style="font-size:0.15rem;">加载中</p>
    </div>
    <!-- 加载更多 -->
    <div class="load-more flexBox flexAlign flexMiddle" @click="loadMore" v-if="hasMore">
      <img class="icon" src="../../assets/images/style/loadmore.png" alt />
      <p>点击加载更多</p>
    </div>
  </div>
</template>

<script>
import swiper from '../../components/common/swiper'
export default {
  name: 'liststyle6',
  components: {
    swiper
  },
  data () {
    return {
      cssid: '',
      offset: 0,
      count: 10,
      title: '',
      id: '',
      hasMore: true,
      navList: [{ name: '全部' }],
      swiperList: [],
      list: []
    }
  },
  methods: {
    // 去列表页
    goList (item) {
      if (!item.id) return
      this.$router.push({
        path: '/liststyle5',
        query: { title: item.name, id: item.id }
      })
    },
    // 获取全部数据
    getColumnList (fid) {
      if (!this.hasMore) return
      const param = {
        fid,
        offset: this.offset,
        count: this.count
      }
      this.$api.getColumnContent(param).then(res => {
        if (res.data.length) {
          this.navList = this.navList.concat(res.data)
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
    // 获取轮播图
    getSwiperList (id) {
      this.$api.getColumnContent({ column_id: id }).then(res => {
        if (res.data.length) {
          this.swiperList = res.data[0].index_pics
          this.title = res.data[0].name
          this.cssid = res.data[0].cssid
        }
      })
    },
    loadMore () {
      this.offset += 10
      this.getColumnList(this.id)
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getColumnList(this.id)
    this.getSwiperList(this.id)
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  background-color: #f8f8f8;
  height: 100%;
  padding-bottom: 0.3rem;
  .nav-bar-container {
    background-color: #fff;
  }
  .container {
    .item-box {
      margin-top: 0.3rem;
      &.mt15 {
        margin-top: 0.15rem;
      }
      &.mt10 {
        margin-top: 0.1rem;
      }
      .column-name {
        font-size: 0.18rem;
        font-family: PingFangSC;
        font-weight: 500;
        color: rgba(61, 61, 61, 1);
      }
      .imgs-box {
        .large-img {
          width: 100%;
          height: 2.54rem;
          overflow: hidden;
          img {
            width: 100%;
            max-height: 100%;
          }
        }
        .img-brief {
          background-color: #fff;
          p {
            font-size: 0.14rem;
            font-family: SourceHanSansCN;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            padding: 0 0.12rem;
            line-height: 0.2rem;
            padding-top: 0.1rem;
            &.date {
              font-size: 0.12rem;
              font-family: ArialMT;
              font-weight: 400;
              color: rgba(132, 132, 132, 1);
            }
          }
        }
      }
    }
  }
}
</style>
