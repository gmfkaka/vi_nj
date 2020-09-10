<template>
  <div class="wrapper" v-wechat-title="this.detail.title+'_视觉南京'" v-if="detail.id">
    <div class="video-box">
      <video
        v-if="detail.indexpic && !tag"
        :src="detail.video.host+detail.video.dir+detail.video.filepath+detail.video.filename"
        class="video fullImg"
        controls
        :poster="detail.indexpic.host+detail.indexpic.dir+detail.indexpic.filepath+detail.indexpic.filename"
        x5-playsinline="true"
        webkit-playsinline="true"
        playsinline="true"
      ></video>
      <video
        v-if="tagDetail.indexpic && tag"
        :src="tagDetail.url"
        class="video fullImg"
        controls
        :poster="tagDetail.indexpic"
        x5-playsinline="true"
        webkit-playsinline="true"
        playsinline="true"
      ></video>
      <img class="back" @click="goBack" src="../../assets/images/detail/back.png" alt />
    </div>
    <!-- 主要信息 -->
    <!-- <detail-main-info v-if="detail.title" :data="detail"></detail-main-info> -->
    <!-- 作者信息 -->
    <div class="info-box flexBox flexAlign">
      <img v-if="detail.avatar" class="avatar" :src="detail.avatar" alt />
      <img v-else class="avatar" src="../../assets/images/my/avatar.png" alt />
      <div class="user-info flexColumn flexBox">
        <p class="name">{{detail.author}}</p>
        <!-- <p class="count">{{`共${detail.userInfo.workNum}个作品`}}</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import detailMainInfo from '../../components/detail/detailMainInfo'
export default {
  name: 'videoDetail',
  components: {
    detailMainInfo
  },
  data () {
    return {
      detail: {},
      tag: '',
      tagDetail: {}
    }
  },
  methods: {
    getDetail (id) {
      this.$api.getDetail(id).then(res => {
        if (res.status === 200) {
          this.detail = res.data
        }
      })
    },
    getTagDetail (id) {
      this.$api.getTagVideoDetail(id).then(res => {
        if (res.status === 200) {
          this.tagDetail = {...res.data.data}
          console.log(this.tagDetail)
        }
      })
    }
  },
  created () {
    this.tag = !!this.$route.query.tag
    if (this.tag) {
      this.getTagDetail(this.$route.query.id)
    } else {
      this.getDetail(this.$route.query.id)
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .video-box {
    position: relative;
    height: 2.5rem;
    .back {
      width: 0.11rem;
      height: 0.19rem;
      position: absolute;
      top: 0.33rem;
      left: 0.15rem;
    }
  }
  .info-box {
    padding: 0.15rem;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
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
  }
}
</style>
