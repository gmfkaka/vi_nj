<template>
  <div class="img-box flexBox flexBetween flexWrap p15">
    <div class="img-item" v-for="(item,index) in list" :key="index">
      <img style="width:100%;height:100%;" :src="getImgUrl(item.index_pic,340,224)" alt />
      <div v-if="type === 0" class="img-info flexBox flexAlign flexBetween" style="background:rgba(0,0,0,0.2);">
        <p>{{item.title}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'imgList',
  props: ['list', 'type']
}
</script>
<style lang='scss' scoped>
.img-box {
  .img-item {
    width: 1.7rem;
    height: 1.12rem;
    margin-bottom: 0.05rem;
    position: relative;
    .video-icon {
      width: 0.3rem;
      height: 0.3rem;
    }
    .img-info {
      width: 100%;
      height: 0.3rem;
      position: absolute;
      bottom: 0;
      padding: 0 0.1rem;
      p {
        font-size: 0.12rem;
        color: #fff;
      }
    }
    .img-info-two {
      width: 70%;
      position: absolute;
      bottom: 0;
      padding-bottom: 0.08rem;
      padding-left: 0.09rem;
      p {
        color: #fff;
        font-size: 0.12rem;
        &.sub-title {
          margin-top: 0.08rem;
          font-size: 0.1rem;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    .duration {
      position: absolute;
      right: 0.1rem;
      bottom: 0.08rem;
      font-size: 0.12rem;
      color: #fff;
    }
  }
}
</style>
