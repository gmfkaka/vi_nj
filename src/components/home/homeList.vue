// 首页列表 四小图
<template>
  <div class="wrapper flexBox flexBetween flexWrap">
    <div class="item" v-for="(item,index) in list.slice(0,4)" :key="index" :class="{'mb10':index < 2}" @click="goDetail(item)">
        <img v-if="item.index_pic" class="img" :src="getImgUrl(item.index_pic,336,244)" alt="">
        <img v-else class="fullImg" src="../../assets/images/nodata/list_small2.png" alt="">
        <p class="text">{{item.title}}</p>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  name: 'homeList',
  props: ['list', 'type'],
  methods: {
    goDetail (item) {
      if (this.type === 'event') {
        this.$router.push({ path: '/eventdetail', query: { id: item.origin_id } })
      } else {
        this.$api.getGalleryDetail(item.origin_id).then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
          } else {
            this.$router.push({ path: '/imgdetail', query: { id: item.origin_id } })
          }
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.wrapper{
    padding: 0 0.15rem;
    .item{
        width: 1.68rem;
        height: 1.22rem;
        position: relative;
        &.mb10{
            margin-bottom: 0.1rem;
        }
        .img{
            width: 1.68rem;
            height: 1.22rem;
        }
        .text{
            box-sizing: border-box;
            padding-left: 0.1rem;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: absolute;
            bottom: 0;
            height: 0.33rem;
            line-height: 0.33rem;
            font-size:0.15rem;
            font-family:SourceHanSansCN;
            font-weight:500;
            color:rgba(255,255,255,1);
            background: rgba(0,0,0,0.2);
        }
    }
}
</style>
