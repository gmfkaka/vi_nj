<template>
  <div class="swiper-box">
    <mt-swipe :auto="4000" v-if="list.length">
      <mt-swipe-item v-for="(item,index) in list" :key="index" @click.native="goDetail">
        <img class="fullImg" :src="item.host+item.dir+item.filepath+item.filename" alt />
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
export default {
  name: 'swiperList',
  props: ['list']
}
</script>
<style lang='scss' scoped>
.swiper-box {
  height: 1.95rem;
  /deep/ {
    .mint-swipe-item {
      width: 100%;
      height: 1.95rem;
      overflow: hidden;
    }
    .mint-swipe-indicators {
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(10, 10, 10, 0.6) 100%
      );
      width: 100%;
      text-align: center;
      height: 0.46rem;
      bottom: 0;
      .mint-swipe-indicator {
        margin-top: 0.3rem;
        width: 0.22rem;
        height: 0.03rem;
        opacity: 0.8;
        background-color: rgba(255, 255, 255, 0.3);
        z-index: 999;
        &.is-active {
          background-color: #fff;
        }
      }
    }
  }
}
</style>
