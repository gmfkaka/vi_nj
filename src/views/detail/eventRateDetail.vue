<template>
  <div class="wrapper" v-wechat-title="'评分活动详情_视觉南京'">
    <detail-top-img :imgUrl="detail.indexpic"></detail-top-img>
    <detail-main-info :data="detail"></detail-main-info>
    <img class="icon" src="../../assets/images/detail/rate.png" alt="">
    <p>请登录网页端评分</p>
  </div>
</template>

<script>
import detailTopImg from '../../components/detail/detailTopImg';
import detailMainInfo from '../../components/detail/detailMainInfo';
export default {
  name: 'eventRateDetail',
  components: {
    detailTopImg,
    detailMainInfo
  },
  data () {
    return {
      detail: {
        indexpic:
          'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1050893341,2471506596&fm=26&gp=0.jpg',
        title: '河西中央公园璀璨亮相',
        imgNum: 4,
        viewNum: 256,
        praiseNum: 256,
        downloadNum: 256,
        tagList: ['冰岛']
      }
    }
  },
  methods: {},
  created () {}
}
</script>

<style lang='scss' scoped>
.wrapper {
    .icon{
        display: block;
        width: 1.4rem;
        height: 1.4rem;
        margin: 0.55rem auto 0.14rem;
    }
    p{
        font-size: 0.12rem;
        color:rgba(153,153,153,1);
        text-align: center;
    }
}
</style>
