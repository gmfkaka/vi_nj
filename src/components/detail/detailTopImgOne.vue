<template>
  <div class="top flexBox flexAlign flexCenter">
    <img class="cover" :src="getImgUrl(imgUrl,750)" alt />
    <!-- <div class="swiper-box" v-if="swiperList.length">
      <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in swiperList" :key="index">
            <img style="width:100%;" :src="getImgUrl(item,750)" alt />
          </swiper-slide>
      </swiper>
    </div> -->
    <div class="back-box" @click="goBack">
      <img class="back" src="../../assets/images/detail/back.png" alt />
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'detailTopImg',
  components: { swiper, swiperSlide },
  props: ['imgUrl', 'type', 'id', 'title', 'swiperList'],
  data () {
    return {
      // swiperOption: {
      //   direction: 'horizontal',
      //   observer: true,
      //   observeParents: true,
      //   loop: true,
      //   autoplay: {
      //     autoplay: true,
      //     delay: 5000
      //   },
      //   slidesPerView: 'auto',
      //   centeredSlides: true
      // }
    }
  }
}
</script>

<style lang='scss' scoped>
.top {
  height: 2.5rem;
  position: relative;
  background-color: #000;
  // .swiper-box {
  //     width: 100%;
  //     height: 2.5rem;
  //     /deep/ {
  //       .swiper-container {
  //         width: 100%;
  //         height: 2.5rem;
  //         .swiper-wrapper {
  //           width: 100%;
  //           height: 100%;
  //           align-items: center !important;
  //           .swiper-slide {
  //             height: auto;
  //           }
  //         }
  //       }
  //     }
  // }
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
}
</style>
