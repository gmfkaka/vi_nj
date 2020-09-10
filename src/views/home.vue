<template>
  <div class="home">
    <img class="pub-icon" v-if="showButton" style="bottom:1.8rem;" @click="goContribute(0)" src="../assets/images/my/upload_video.png" alt />
    <img class="pub-icon" v-if="showButton" style="bottom:1rem;" @click="goContribute(1)" src="../assets/images/my/upload_img.png" alt />
    <img class="pub-icon" v-if="showButton" @click="toggleButton" src="../assets/images/my/upload_close.png" alt />
    <img class="pub-icon" v-else @click="toggleButton" src="../assets/images/my/upload_add.png" alt />
    <div class="main">
      <!-- 顶部 -->
      <div class="top flexBox flexAlign flexBetween">
        <img class="menu" @click="toggleNav" src="../assets/images/home/icon_menu.png" alt />
        <img class="logo" src="../assets/vinj_Logo.png" alt />
        <img class="user" @click="goUserCenter" src="../assets/images/home/icon_my.png" alt />
        <img class="search" @click="goToPage('search')" src="../assets/images/home/search.png" alt />
      </div>
      <!-- 导航 -->
      <!-- <div class="nav-bar-container" v-if="navList.length > 1">
        <div class="nav-bar">
          <div
            class="nav-item"
            :class="{'active':index === navSelected}"
            v-for="(item,index) in navList"
            :key="index"
            @click="goList(item.name,item.id,item.css_id)"
          >{{item.name}}</div>
        </div>
      </div> -->
      <!-- 左侧导航-->
      <div class="left-nav" :class="[showNav ? 'nav-active':'']"  @click="toggleNav" @touchmove.prevent>
        <div class="left-nav-box" >
           <div
            class="nav-item"
            :class="{'active':index === navSelected}"
            v-for="(item,index) in navList"
            :key="index"
            @click="goList(item.name,item.id,item.css_id)"
          >{{item.name}}</div>
        </div>
      </div>
      <div class="top-img" v-if="navList.length > 1">
        <img class="fullImg" src="../assets/images/home/banner.png" alt />
        <p class="top-text alignCenter" style="top:30%;">捕获瞬间之美&nbsp;&nbsp;&nbsp;&nbsp;邂逅最美南京</p>
      </div>
      <!-- 最新图片 轮播 -->
      <div class="imgs-wrapper diff-bg">
        <home-title :title="'最新图片'"></home-title>
        <swiper :options="swiperOption" ref="mySwiper" v-if="slideList.length">
          <swiper-slide v-for="(item,index) in slideList" :key="index">
            <img class="swiper-img fullImg" :src="getImgUrl(item.index_pic,686,386)" alt />
            <p class="swiper-text">{{item.title}}</p>
          </swiper-slide>
        </swiper>
        <img v-else class="no-data-img style1" src="../assets/images/nodata/home_list.png" alt />
      </div>
      <!-- 活动广告 -->
      <div class="event" @click="goAd" v-if="adSrc">
        <img :src="adSrc" alt="">
      </div>
      <!-- 新闻图片 -->
      <div class="imgs-wrapper">
        <home-title :title="'新闻图片'" :data="newsData"></home-title>
        <div class="big-img-box">
          <img
            v-if="newsData.data[0]"
            class="big-img"
            :src="getImgUrl(newsData.data[0].index_pic,690,440)"
            @click="goDetail(newsData.data[0])"
            alt
          />
          <p class="title" v-if="newsData.data.length">{{newsData.data[0].title}}</p>
        </div>
        <home-list :list="newsData.data.slice(1,5)" v-if="newsData.data.length"></home-list>
        <img
          v-if="!newsData.data.length"
          class="no-data-img style1"
          src="../assets/images/nodata/home_list.png"
          alt
        />
      </div>
      <!-- 专题图片 -->
      <div class="imgs-wrapper diff-bg">
        <home-title :title="'专题图片'" :data="topicData"></home-title>
        <home-list :list="topicData.data" v-if="topicData.data.length"></home-list>
        <img
          v-if="!topicData.data.length"
          class="no-data-img style1"
          src="../assets/images/nodata/home_list.png"
          alt
        />
      </div>
      <!-- 航拍频道 -->
      <div class="imgs-wrapper">
        <home-title :title="'航拍频道'" :data="hangpaiData"></home-title>
        <div
          class="long-item"
          v-for="(item,index) in hangpaiData.data.slice(0,2)"
          :key="index"
          @click="goDetail(item)"
        >
          <img
            class="long-img"
            :class="{'mb12':index === 0}"
            :src="getImgUrl(item.index_pic,690,244)"
            alt
          />
          <div class="long-info flexBox flexBetween flexAlign">
            <div class="long-title textEllipsis" style="flex:1;">{{item.title}}</div>
            <div class="long-title author" v-if="JSON.parse(item.author)[0].author !== ''">作者：{{JSON.parse(item.author)[0].author}}</div>
          </div>
        </div>
        <img
          v-if="!hangpaiData.data.length"
          class="no-data-img style2"
          src="../assets/images/nodata/home_hangpai.png"
          alt
        />
      </div>
      <!-- 视频专区 -->
      <div class="imgs-wrapper" style="background-color:#223C41;">
        <home-title :title="'视频专区'" :type="1" :data="videoData"></home-title>
        <div class="video-list" v-if="videoData.data.length">
          <div
            class="video-item"
            v-for="(item,index) in videoData.data"
            :key="index"
            @click="goDetail(item)"
          >
            <img class="video-img fullImg" :src="getImgUrl(item.index_pic,600,438)" alt />
            <img class="video-icon alignCenter" src="../assets/images/common/video_icon.png" alt />
            <div class="video-info flexBox flexBetween flexAlign">
              <p class="video-title textEllipsis" style="width:80%;">{{item.title}}</p>
              <p class="video-title video-duration">{{item.duration_format}}</p>
            </div>
          </div>
        </div>
        <img v-else class="no-data-img style1" src="../assets/images/nodata/home_list.png" alt />
      </div>
      <!-- 活动摄影 -->
      <div class="imgs-wrapper diff-bg">
        <home-title :title="'活动摄影'" :data="eventData"></home-title>
        <home-list :list="eventData" :type="'event'" v-if="eventData.length"></home-list>
        <img v-else class="no-data-img style1" src="../assets/images/nodata/home_list.png" alt />
      </div>
      <!-- 摄影之家 -->
      <!-- <div class="imgs-wrapper diff-bg" style="padding-top:0;">
        <home-title :title="'摄影之家'" :data="sheyingData"></home-title>
        <div class="user-list" v-if="memberList.length">
          <div
            @click="goUserDetail(item.link)"
            class="user-item"
            v-for="(item,index) in memberList"
            :key="index"
          >
            <img
              v-if="item.avatar !== ''"
              class="avatar"
              :src="getImgUrl(item.index_pic,120,120)"
              alt
            />
            <img v-else class="avatar" src="../assets/images/my/avatar.png" alt />
            <p class="user-name">{{item.title}}</p>
            <div class="user-border"></div>
          </div>
        </div>
        <img v-else class="no-data-img style1" src="../assets/images/nodata/home_list.png" alt />
      </div> -->
    </div>
    <!-- <img class="pub-icon" @click="goContribute" src="../assets/images/my/upload_add.png" alt /> -->
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import homeTitle from '../components/home/homeTitle'
import homeList from '../components/home/homeList'
export default {
  name: 'home',
  components: {
    homeTitle,
    homeList,
    swiper,
    swiperSlide
  },
  data () {
    const that = this
    return {
      navSelected: 0,
      navList: [{ name: '首页' }],
      slideList: [],
      swiperOption: {
        direction: 'horizontal',
        observer: true,
        observeParents: true,
        loop: true,
        autoplay: {
          autoplay: true,
          delay: 3000
        },
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 5,
        on: {
          click: function () {
            that.$router.push({ path: '/imgdetail', query: { id: that.slideList[this.realIndex].origin_id } })
          }
        }
      },
      newsData: { data: [] },
      topicData: { data: [] },
      hangpaiData: { data: [] },
      videoData: { data: [] },
      eventData: { data: [] },
      sheyingData: { data: [] },
      memberList: [],
      showNav: false,
      adSrc: '',
      adLink: '',
      showButton: false // 是否显示上传按钮
    }
  },
  methods: {
    // 切换显示上传按钮
    toggleButton () {
      this.showButton = !this.showButton
    },
    // 跳转广告
    goAd () {
      window.location.href = this.adLink
    },
    // 最新图片跳转详情页
    goUpdatedDetail (id) {
      this.$router.push({ path: '/imgdetail', query: { id } })
    },
    // 跳转用户中心
    goUserCenter () {
      if (!this.getToken()) {
        this.$router.push('/login')
      } else {
        this.$router.push('/homemy')
      }
    },
    // 获取展示列表
    getColumnContent () {
      const param = { fid: 0, h5: 1 }
      this.$api.getColumnContent(param).then(res => {
        if (res.status === 200 && res.data.length) {
          this.navList = this.navList.concat(res.data)
          this.navList.forEach(ele => {
            if (ele.name === '最新图片') { this.slideList = ele.data }
            if (ele.name === '新闻图片') { this.newsData = ele }
            if (ele.name === '专题图片') { this.topicData = ele }
            if (ele.name === '航拍频道') { this.hangpaiData = ele }
            if (ele.name === '视频专区') { this.videoData = ele }
            if (ele.name === '活动摄影') { this.eventData = ele }
            if (ele.name === '摄影之家') { this.sheyingData = ele }
          })
          // this.getSwiperList()
          this.getMemberList()
          this.getActivityList()
          this.getAd()
        }
      })
    },
    // 获取轮播图 暂时不用
    // getSwiperList () {
    //   this.$api.getHomeSwiperList(1, 6).then(res => {
    //     if (res.data.data.length) {
    //       this.slideList = res.data.data
    //     }
    //   })
    // },
    // 获取摄影师列表
    getMemberList () {
      this.$api.getShootHome({father_column: 1}).then(res => {
        if (res.status === 200 && res.data.data.length) {
          this.memberList = res.data.data[0].data
        }
      })
    },
    // 获取活动列表
    getActivityList () {
      this.$api.getActivityHome({column_id: 26, type: 'activity', per_num: 30}).then(res => {
        if (res.status === 200 && res.data.data.data.length) {
          this.eventData = res.data.data.data
        }
      })
    },
    // 去列表详情页
    goList (title, id, cssid) {
      if (title === '首页') return
      cssid === 9901 && this.$router.push({ path: '/liststyle1', query: { id } })
      cssid === 9903 && this.$router.push({ path: '/liststyle3', query: { id } })
      cssid === 9904 && this.$router.push({ path: '/photographerlist', query: { id } })
      cssid === 9905 && this.$router.push({ path: '/liststyle5', query: { title, id } });
      (cssid === 9906 || cssid === 9907 || cssid === 9908 || cssid === 9910) && this.$router.push({ path: '/liststyle6', query: { id } })
      cssid === 9909 && this.$router.push({ path: '/liststyle2', query: { id } })
    },
    // 发布投稿
    goContribute (flag) {
      const token = this.getToken()
      if (!token) {
        this.$router.push('/login')
      } else {
        if (this.getCookie('groupId') === '2') {
          flag === 0 && this.$router.push('/contributeVideo')
          flag === 1 && this.$router.push('/contribute')
        } else {
          MessageBox('提示', '您还不是签约摄影师，请到视觉南京PC端签约后投稿')
        }
      }
    },
    // 去用户主页
    goUserDetail (id) {
      this.$router.push({ path: '/userdetail', query: { id } })
    },
    // 切换左侧导航
    toggleNav () {
      this.showNav = !this.showNav
    },
    // 获取广告图片和链接
    getAd () {
      this.$api.getColumnContent({ column_id: 111 }).then(res => {
        if (res.data[0].data[0].index_pic) {
          this.adLink = res.data[0].data[0].outlink
          this.adSrc = res.data[0].data[0].index_pic
        }
      })
    }
  },
  created () {
    this.getColumnContent()
  }
}
</script>
<style lang='scss' scoped>
.home {
  height: 100%;
  .top {
    padding: 0.2rem 0.15rem 0;
    height: 0.65rem;
    position: relative;
    border-bottom: 1px solid #f7f5f5;
    flex-direction: row;
    align-items: center;
    position: fixed;
    width: 100%;
    z-index: 999999;
    background-color: #fff;
    top: 0;
    left: 0;
    .menu{
      width: 0.19rem;
      height: 0.19rem;
    }
    .user{
      width: 0.2rem;
      height: 0.2rem;
      margin-right: 0.2rem;
      padding-top: 0.02rem;
    }
    .search {
      width: 0.18rem;
      height: 0.18rem;
    }
    .logo {
      width: 0.96rem;
      height: 0.3rem;
      margin-left: 1.06rem;
      margin-right: 0.7rem;
    }
  }
  .main {
    padding-top: 0.65rem;
    -webkit-overflow-scrolling: touch;
    .left-nav{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0.65rem;
      z-index: -1;
      &.nav-active{
          background: rgba(0,0,0,0.50);
          z-index: 9999999;
          .left-nav-box{
            left: 0;
          }
      }
      .left-nav-box{
        position: absolute;
        top: 0;
        left: -1.2rem;
        width: 1.2rem;
        height: 100%;
        z-index: 9999999;
        overflow-y: scroll;
        background: rgba(255,255,255,0.96);
        transition: left .1s ease-in;
        .nav-item {
          display: inline-block;
          padding: 0 0.15rem;
          text-align: center;
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.15rem;
          color: #333333;
          &.active {
            font-weight: 500;
            color: rgba(221, 47, 60, 1);
          }
        }
      }
    }
    .top-img {
      height: 1.93rem;
      position: relative;
      background-color: #1c3644;
      .top-text {
        width: 100%;
        text-align: center;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        font-size: 0.2rem;
      }
    }
    .imgs-wrapper {
      padding: 0.3rem 0;
      &.diff-bg {
        background: #f8f8f8;
      }
      &.pb0 {
        padding-bottom: 0;
      }
      /deep/ {
        .swiper-container {
          height: 1.93rem;
          .swiper-wrapper {
            align-items: center;
          }
          .swiper-slide {
            width: 3.43rem;
            height: 1.93rem;
            background-color: #ccc;
            position: relative;
          }
          .swiper-slide-prev {
            height: 80% !important;
          }
          .swiper-slide-next {
            height: 80% !important;
          }
          .swiper-text {
            height: 0.46rem;
            line-height: 0.46rem;
            position: absolute;
            bottom: 0;
            font-size: 15px;
            font-family: SourceHanSansCN;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            width: 100%;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.2);
          }
        }
      }
      .big-img-box {
        position: relative;
        padding: 0 0.15rem;
        margin-bottom: 0.12rem;
        .big-img {
          width: 3.45rem;
          height: 2.2rem;
          display: block;
        }
        .title {
          box-sizing: border-box;
          padding-left: 0.1rem;
          width: 3.45rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          bottom: 0;
          height: 0.33rem;
          line-height: 0.33rem;
          font-size: 0.15rem;
          font-family: SourceHanSansCN;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          background: rgba(0, 0, 0, 0.2);
        }
      }
      .long-item {
        position: relative;
        .long-img {
          width: 3.45rem;
          height: 1.22rem;
          margin: 0 auto;
          display: block;
          &.mb12 {
            margin-bottom: 0.12rem;
          }
        }
        .long-info {
          padding: 0 0.1rem;
          width: 3.45rem;
          height: 0.32rem;
          position: absolute;
          bottom: 0;
          left: 0.15rem;
          background: rgba(0, 0, 0, 0.1);
          .long-title {
            font-size: 0.15rem;
            font-family: SourceHanSansCN;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            &.author {
              font-size: 0.12rem;
            }
          }
        }
      }
      .video-list {
        width: 100%;
        height: 2.19rem;
        padding-left: 0.15rem;
        white-space: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        .video-item {
          display: inline-block;
          width: 3rem;
          height: 2.19rem;
          margin-right: 0.1rem;
          position: relative;
          .video-icon {
            width: 0.4rem;
            height: 0.4rem;
          }
          .video-info {
            height: 0.46rem;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0 0.1rem;
            background: rgba(0, 0, 0, 0.2);
            .video-title {
              font-size: 0.15rem;
              font-family: SourceHanSansCN;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
              .video-duration {
                font-size: 0.13rem;
                font-weight: 400;
              }
            }
          }
        }
      }
      .user-list {
        height: 1.3rem;
        padding-left: 0.17rem;
        white-space: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        .user-item {
          display: inline-block;
          width: 1.1rem;
          height: 1.3rem;
          background-color: #fff;
          margin-right: 0.05rem;
          padding-top: 0.2rem;
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
            background-color: #e2313d;
            margin: 0 auto;
          }
        }
      }
    }
    .event {
      // height: 0.48rem;
      padding: 0 0.15rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .pub-icon{
    width: 0.6rem;
    height: 0.6rem;
    position: fixed;
    z-index: 999998;
    bottom: 0.2rem;
    right: 0.2rem;
  }
}
</style>
