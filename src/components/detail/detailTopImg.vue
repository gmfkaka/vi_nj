<template>
  <div class="top flexBox flexAlign flexCenter">
    <div class="swiper-box" v-if="swiperList.length">
      <swiper :options="swiperOption" ref="mySwiper" @click="goImgPreview">
          <swiper-slide v-for="(item,index) in swiperList" :key="index">
            <img style="width:100%;" class="swiper-lazy" :data-src="getImgUrl(item.photo_url,750)" alt />
            <div class="swiper-lazy-preloader"></div>
          </swiper-slide>
      </swiper>
    </div>
    <p class="indexText" ref="indexTitle"></p>
    <div class="back-box" @click="goBack">
      <img class="back" src="../../assets/images/detail/back.png" alt />
    </div>
    <div v-if="type === 'img'" class="collect-box">
      <img
        class="collect"
        v-if="!ifCollected"
        @click="addCollect"
        src="../../assets/images/detail/collect.png"
        alt
      />
      <img
        class="collect"
        v-else
        @click="delCollect"
        src="../../assets/images/detail/collected.png"
        alt
      />
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'detailTopImg',
  components: { swiper, swiperSlide },
  props: ['imgUrl', 'type', 'id', 'title', 'collected', 'swiperList'],
  data () {
    const that = this
    return {
      nowIndex: 1,
      ifCollected: false,
      swiperOption: {
        direction: 'horizontal',
        observer: true,
        observeParents: true,
        loop: true,
        // autoplay: {
        //   autoplay: true,
        //   delay: 5000
        // },
        slidesPerView: 'auto',
        centeredSlides: true,
        lazy: {
          loadPrevNext: true
        },
        on: {
          slideChangeTransitionStart: function () {
            // that.nowIndex = this.realIndex + 1
            that.$refs.indexTitle.innerHTML = `${this.realIndex + 1}/${that.swiperList.length}`
          }
        }
      }
    }
  },
  watch: {
    collected (val) {
      this.ifCollected = val
    }
  },
  methods: {
    // 添加收藏
    addCollect () {
      const param = {
        access_token: this.getToken(),
        origin_id: this.id,
        title: this.title,
        index_pic: this.imgUrl,
        type: 1
      }
      this.$api.addCollection(param).then(res => {
        if (res.data.ErrorText) Toast(res.data.ErrorText)
        if (res.data.ErrorCode === 0 && res.data.data.uuid) {
          this.ifCollected = true
          Toast('收藏成功')
        }
      })
    },
    // 取消收藏
    delCollect () {
      const param = {
        access_token: this.getToken(),
        origin_id: this.id,
        type: 1
      }
      this.$api.delCollection(param).then(res => {
        if (res.data.ErrorText) Toast(res.data.ErrorText)
        if (res.data.ErrorCode === 0 && res.data.data === 'success') {
          this.ifCollected = false
          Toast('取消收藏成功')
        }
      })
    },
    goImgPreview () {
      this.$router.push({path: '/imgpreview', query: {id: this.id, count: this.swiperList.length}})
    }
  }
}
</script>

<style lang='scss' scoped>
.top {
  height: 2.5rem;
  position: relative;
  background-color: #000;
  .swiper-box {
      width: 100%;
      height: 2.5rem;
      /deep/ {
        .swiper-container {
          width: 100%;
          height: 2.5rem;
          .swiper-wrapper {
            width: 100%;
            height: 100%;
            align-items: center !important;
            .swiper-slide {
              height: auto;
            }
          }
        }
      }
  }
  .indexText{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #fff;
    z-index: 9999999;
    text-align: center;
    padding-bottom: 0.1rem;
    font-size: 0.18rem;
  }
  .cover{
    width: 100%;
    max-height: 2.5rem;
  }
  .back-box{
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    top: 0.2rem;
    left: 0;
    z-index: 999999;
    .back {
      width: 0.11rem;
      height: 0.19rem;
      position: absolute;
      left: 0.15rem;
      top: 0.13rem;
    }
  }
  .collect-box{
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    top: 0.2rem;
    right: 0.05rem;
    z-index: 999999;
    .collect {
      width: 0.19rem;
      height: 0.19rem;
      position: absolute;
      right: 0.09rem;
      top: 0.14rem;
    }
  }
}
</style>
