<template>
  <div class="wrapper" v-wechat-title="this.detail.title+'_视觉南京'" v-if="detail.id">
    <!-- 顶部主图 -->
    <detail-top-img
      v-if="detail.index_pic && swiperList.length"
      :imgUrl="detail.index_pic"
      :swiperList="swiperList"
      :type="'img'"
      :id="id"
      :title="detail.title"
      :collected="ifCollect"
    ></detail-top-img>
    <!-- 主要信息 -->
    <detail-main-info
      v-if="detail.title"
      :data="detail"
      :type="'img'"
      :id="detail.id"
      :count="detail.photo_count"
    ></detail-main-info>
    <!-- 作品信息 -->
    <div class="info-box">
      <p class="detail">作品信息</p>
      <div class="work-box">
        <div class="work-item flexBox flexAlign" style="margin-bottom:0.1rem;" v-if="detail.id">
          <p class="sub-title">ID</p>
          <p class="detail">{{detail.id}}</p>
        </div>
        <div class="work-item flexBox flexAlign">
          <p class="sub-title">上传时间</p>
          <p class="detail">{{detail.publish_time.substring(0,10)}}</p>
        </div>
      </div>
    </div>
    <!-- 评分 -->
    <div class="rate-box"  v-if="type === 'committee'" @click="goRatePage">
      <img class="icon" src="../../assets/images/detail/rate.png" alt="">
      <p>请登录网页端评分</p>
    </div>
    <!-- 作者列表 -->
    <div
      class="info-box flexBox flexAlign"
      v-for="(item,index) in authorList"
      :key="index"
      style="border-bottom-width:0;padding:0.1rem 0.15rem;"
      @click="goAuthorPage(item.author_id)"
    >
      <img v-if="item.avatar" class="avatar" :src="item.avatar" alt />
      <img v-else class="avatar" src="../../assets/images/my/avatar.png" alt />
      <div class="user-info flexColumn flexBox">
        <p class="name">{{item.author}}</p>
        <p class="count" v-if="item.author_id !== 0">{{`共${item.gallery_total}个作品`}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import detailTopImg from '../../components/detail/detailTopImg'
import detailMainInfo from '../../components/detail/detailMainInfo'
export default {
  name: 'imgDetail',
  components: {
    detailTopImg,
    detailMainInfo
  },
  data () {
    return {
      id: '',
      detail: {},
      ifCollect: false,
      type: '',
      authorList: [],
      indexpic: '',
      swiperList: []
    }
  },
  methods: {
    getDetail (id) {
      this.$api.getGalleryDetail(id).then(res => {
        if (res.data.ErrorCode === 0) {
          this.detail = res.data.data
          this.authorList = this.detail.author_info
          this.getSwiperList(this.id, this.detail.photo_count)
        }
      })
    },
    // id为0的用户不是摄影师 没有个人主页
    goAuthorPage (id) {
      if (id === 0) return
      this.$router.push({ path: '/userdetail', query: { id } })
    },
    // 判断是否收藏
    getCollectStatus () {
      const param = {
        access_token: this.getToken(),
        origin_id: this.id,
        type: 1
      }
      this.$api.getCollectionStatus(param).then(res => {
        if (res.data.ErrorCode === 0) {
          if (res.data.data.is_collect == 1) {
            this.ifCollect = true
          }
          if (res.data.data.is_collect == 0) {
            this.ifCollect = false
          }
        }
      })
    },
    // 获取轮转图
    getSwiperList (id, count) {
      this.$api.getGalleryPhotos(id, 1, count).then(res => {
        if (res.data.ErrorCode === 0) {
          // res.data.data.data.forEach(val => {
          //   let tmp = val.photo_url.split(val.photo_key)
          //   // 预览采用压缩图片
          //   val.compress_url = `${tmp[0]}750x/${val.photo_key}`
          // })
          this.swiperList = res.data.data.data
        }
      })
    },
    // 去网页评分
    goRatePage () {
      // window.location.href = 'http://www.baidu.com'
    }
  },
  created () {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getDetail(this.id)
    this.getCollectStatus()
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .info-box {
    padding: 0.15rem;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    position: relative;
    .work-box {
      margin-top: 0.2rem;
    }
    .rate-box {
      margin-top: 0.2rem;
    }
    .avatar {
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      margin-right: 0.1rem;
    }
    .user-info {
      .name {
        font-size: 0.15rem;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        padding: 0.03rem 0 0.06rem;
      }
      .count {
        font-size: 0.12rem;
        color: rgba(153, 153, 153, 1);
      }
    }
    p {
      &.detail {
        font-size: 0.15rem;
        color: rgba(51, 51, 51, 1);
        line-height: 0.21rem;
        text-align: justify;
        &.status-one {
          color: #55a375;
        }
      }
      &.sub-title {
        font-size: 0.15rem;
        color: #999999;
        width: 0.6rem;
        margin-right: 0.2rem;
      }
      &.rate {
        font-size: 0.52rem;
        color: rgba(245, 166, 35, 1);
      }
    }
  }
  .rate-box{
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 0.3rem;
    .icon{
        display: block;
        width: 1.4rem;
        height: 1.4rem;
        margin: 0.35rem auto 0.14rem;
    }
    p{
        font-size: 0.12rem;
        color:rgba(153,153,153,1);
        text-align: center;
    }
  }
}
</style>
