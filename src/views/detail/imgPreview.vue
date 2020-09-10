<template>
  <div class="wrapper" v-wechat-title="'图集预览_视觉南京'" v-if="swiperList.length">
    <div class="top">
      <img class="back alignCenter" @click="goBack" src="../../assets/images/detail/back.png" alt />
      <p ref="indexTitle"></p>
      <!-- {{`${nowIndex}/${swiperList.length}`}} -->
    </div>
    <div class="swiper-box">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item,index) in swiperList" :key="index">
          <img style="width:100%;" class="swiper-lazy" :data-src="getImgUrl(item.photo_url,750)" alt />
          <div class="swiper-lazy-preloader"></div>
          <div class="brief-box brief-spread">
            <p class="title" v-if="item.brief !== ''">{{item.brief}}</p>
            <p class="title" v-else>{{brief}}</p>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- <p class="title textEllipsis">{{swiperList[nowIndex-1].brief}}</p> -->
    <!-- <div class="brief-box" v-if="!ifBriefAll">
      <p class="title textEllipsis" style="flex:1;" v-if="swiperList[nowIndex-1].brief !== ''">{{swiperList[nowIndex-1].brief}}</p>
      <p class="title textEllipsis" style="flex:1;" v-else>{{brief}}</p>
      <div class="spread" @click="toggleBrief" v-if="swiperList[nowIndex-1].brief.length > 17 || brief.length > 17">
        <p style="margin-right:5px;">展开</p>
        <i class="down"></i>
      </div>
    </div> -->
    <!-- <div class="brief-box brief-spread">
       <p class="title" v-if="swiperList[nowIndex-1].brief !== ''">{{swiperList[nowIndex-1].brief}}</p>
       <p class="title" v-else>{{brief}}</p>
    </div> -->
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'imgPreview',
  components: { swiper, swiperSlide },
  data () {
    const that = this
    return {
      brief: '',
      ifBriefAll: false,
      nowIndex: 1,
      swiperList: [],
      swiperOption: {
        direction: 'horizontal',
        observer: true,
        observeParents: true,
        loop: true,
        autoplay: false,
        slidesPerView: 'auto',
        centeredSlides: true,
        lazy: {
          loadPrevNext: true
        },
        on: {
          transitionEnd: function () {
            that.nowIndex = this.realIndex + 1
            // that.ifBriefAll = false
            that.$refs.indexTitle.innerHTML = `${this.realIndex + 1}/${that.swiperList.length}`
          }
        }
      }
    }
  },
  methods: {
    getData (id, count) {
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
    getDetail (id) {
      this.$api.getGalleryDetail(id).then(res => {
        if (res.data.ErrorCode === 0) {
          this.brief = res.data.data.brief
        }
      })
    },
    toggleBrief () {
      this.ifBriefAll = !this.ifBriefAll
    }
  },
  created () {
    this.getDetail(this.$route.query.id)
    this.getData(this.$route.query.id, this.$route.query.count)
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  height: 100%;
  background-color: #000;
  position: relative;
  .top {
    z-index: 999;
    position: absolute;
    left: 0;
    right: 0;
    height: 0.6rem;
    line-height: 0.3rem;
    text-align: center;
    font-size: 0.16rem;
    color: #fff;
    background: rgba(0,0,0,.5);
    padding-top: 0.25rem;
    .back {
      width: 0.11rem;
      height: 0.19rem;
      position: absolute;
      top: 0.4rem;
      left: 0.2rem;
    }
  }
  .swiper-box {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      /deep/ {
        .swiper-container {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          .swiper-wrapper {
            display: flex !important;
            align-items: center !important;
            .swiper-slide {
              height: 100%;
              display: flex;
              align-items: center;
            }
          }
        }
      }
  }
  .brief-box{
    background: rgba(0,0,0,.5);
    position: absolute;
    bottom: 0.1rem;
    left: 0;
    right: 0;
    height: 1.75rem;
    padding: 0 0.15rem;
    z-index: 999;
    display: flex;
    flex-direction: row;
    p {
      line-height: 0.3rem;
      color: #fff;
      font-size: 0.18rem;
    }
    i {
      border: solid #fff;
      border-width: 0 1px 1px 0;
      display: inline-block;
      padding: 3px;
      &.down {
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
      }
      &.up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
      }
    }
    .spread{
      height: 0.3rem;
      display: flex;
      align-items: center;
      flex-direction: row;
    }
  }
  .brief-spread{
    height: 1.75rem;
    overflow-y: auto;
  }
}
</style>
