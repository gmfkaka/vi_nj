<template>
  <div class="my-wrapper" v-wechat-title="this.userInfo.nick_name+'_视觉南京'" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <!-- 顶部 个人资料 -->
    <div class="my-top">
      <img class="back" @click="goBack" src="../../assets/images/detail/back.png" alt />
      <div class="my-info flexBox">
        <img
          v-if="userInfo.avatar"
          class="avatar"
          :src="getImgUrl(userInfo.avatar,168,168)"
          alt
        />
        <img v-else class="avatar" src="../../assets/images/my/avatar@2x.png" alt />
        <div class="my-box">
          <div class="my-name-box flexBox">
            <p class="my-name" v-if="userInfo.nick_name">{{userInfo.nick_name}}</p>
            <img
              v-if="userInfo.extensions && userInfo.extensions.gender === '男'"
              class="gender-icon"
              src="../../assets/images/my/male.png"
              alt
            />
            <img
              v-if="userInfo.extensions && userInfo.extensions.gender === '女'"
              class="gender-icon"
              src="../../assets/images/my/female.png"
              alt
            />
          </div>
        </div>
      </div>
      <div class="my-number-box flexBox">
        <div class="my-number-item flexBox flexMiddle flexColumn">
          <p class="number-text">{{userInfo.works || 0}}</p>
          <div class="flexBox flexAlign">
            <img src="../../assets/images/my/number_icon1.png" alt class="number-icon" />
            <p class="number-sub-text">作品</p>
          </div>
        </div>
        <div class="my-number-item flexBox flexMiddle flexColumn">
          <p class="number-text">{{userInfo.photo_count || 0}}</p>
          <div class="flexBox flexAlign">
            <img src="../../assets/images/my/number_icon4.png" alt class="number-icon" />
            <p class="number-sub-text">图片</p>
          </div>
        </div>
        <div class="my-number-item flexBox flexMiddle flexColumn">
          <p class="number-text">{{userInfo.clicks || 0}}</p>
          <div class="flexBox flexAlign">
            <img src="../../assets/images/my/number_icon2.png" alt class="number-icon" />
            <p class="number-sub-text">浏览</p>
          </div>
        </div>
      </div>
    </div>
    <!-- tab -->
    <div class="nav flexBox">
      <div class="nav-item" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">
        <div class="nav-text" :class="{'active':index === currentTab}">{{item}}</div>
        <div class="nav-border" v-if="index === currentTab"></div>
      </div>
    </div>
    <!-- 作品 -->
    <div class="main" v-if="currentTab === 0 && workRequested">
      <div class="work-contribute-box" style="padding-top:0.15rem;">
        <div class="img-box flexBox flexBetween flexWrap p15">
          <div class="img-item" v-for="(item,index) in workList" :key="index" @click="goImgDetail(item)">
            <img
              v-if="item.index_pic"
              style="width:100%;height:100%;"
              :src="getImgUrl(item.index_pic,340,224)"
              alt
            />
             <img v-else class="no-data-img" style="width:100%;height:100%;" src="../../assets/images/nodata/home_list.png" alt />
            <div
              class="img-info flexBox flexAlign flexBetween"
              style="background:rgba(0,0,0,0.2);"
            >
              <p>{{item.title}}</p>
              <!-- <p>04:24</p> -->
            </div>
            <!-- <div class="img-info-two" v-if="type === 1">
        <p class="title">{{蒲公英}}</p>
        <p class="sub-title">&lt;南京秋季作品展&gt;</p>
            </div>-->
            <!-- <img class="video-icon alignCenter" src="../assets/images/common/video_icon.png" alt=""> -->
            <!-- <div class="duration" v-if="type === 1" >04:24</div> -->
          </div>
        </div>
        <img
          v-if="!workList.length"
          class="no-data-img style1"
          src="../../assets/images/nodata/home_list.png"
          alt
        />
        <div style="display:flex;justify-content:center;align-items:center;width:100%;padding:0.15rem 0;" v-if="workHasMore">
            <img style="width:0.15rem;height:0.15rem;margin-right:0.05rem;" src="../../assets/images/contribute/loading.gif" alt />
            <p style="font-size:0.15rem;">加载中</p>
        </div>
        <p v-if="!workHasMore" class="no-data-text">没有更多了</p>
      </div>
    </div>
    <!-- 收藏 -->
    <div class="main" v-if="currentTab === 1 && collectionRequested">
      <!-- 收藏列表 -->
      <div class="img-box flexBox flexBetween flexWrap" style="padding:0.15rem;">
        <div class="img-item" v-for="(item,index) in collectionList" :key="index" @click="goImgDetail(item)">
          <img style="width:100%;height:100%;" :src="getImgUrl(item.index_pic,170,112)" alt />
          <div
            v-if="item.type == 1"
            class="img-info flexBox flexAlign flexBetween"
            style="background: rgba(0,0,0,.1);"
          >
            <p class="textEllipsis">{{item.title}}</p>
          </div>
          <div v-if="item.type == 2">
            <div class="img-info flexBox flexAlign flexBetween" style="background: rgba(0,0,0,.1);">
              <p class="textEllipsis">{{item.title}}</p>
              <p>{{item.time}}</p>
            </div>
            <img class="video-icon alignCenter" src="../../assets/images/common/video_icon.png" alt />
          </div>
        </div>
        <img
          v-if="!collectionList.length"
          class="no-data-img style1"
          src="../../assets/images/nodata/home_list.png"
          alt
        />
        <p v-if="!collectHasMore" class="no-data-text">没有更多了</p>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  name: 'userDetail',
  data () {
    return {
      member_id: null,
      tabList: ['作品', '收藏'],
      currentTab: 0,
      userInfo: {},
      // 作品
      currentWork: 0,
      workHasMore: true,
      workList: [],
      workOffset: 0,
      workRequested: false,
      workPage: 1,
      // 收藏
      collectionList: [],
      collectOffset: 0,
      collectHasMore: true,
      collectionRequested: false
    }
  },
  methods: {
    // 切换tab
    changeTab (index) {
      this.currentTab = index
      index === 1 && this.getCollection()
    },
    // 获取作品列表
    getWork () {
      const param = {
        author_id: this.member_id,
        page: this.workPage,
        per_num: 10
      }
      this.$api.getOthersWork(param).then(res => {
        if (res.data.ErrorCode === 0) {
          this.workList = res.data.data.data
          if (res.data.data.data.length < 10) {
            this.workHasMore = false
          }
          this.workRequested = true
        }
      })
    },
    // 作品加载更多
    getMoreWork () {
      this.workPage++
      const param = {
        author_id: this.member_id,
        page: this.workPage,
        per_num: 10
      }
      this.$api.getOthersWork(param).then(res => {
        if (res.data.ErrorCode === 0) {
          if (res.data.data.data.length) {
            this.workList = this.workList.concat(res.data.data.data)
            if (res.data.data.data.length < 10) {
              this.workHasMore = false
            }
          } else {
            this.workHasMore = false
          }
        }
      })
    },
    // 获取收藏列表
    getCollection () {
      if (this.collectionRequested) return
      let param1 = {
        author_id: this.member_id,
        offset: 0,
        count: 20
      }
      this.$api.getOthersCollection(param1).then(res => {
        if (res.data.ErrorCode === 0) {
          if (res.data.data.data.length) {
            this.collectionList = this.collectionList.concat(res.data.data.data)
            if (res.data.data.data.length < 20) {
              this.collectHasMore = false
            }
          }
          this.collectionRequested = true
        }
      })
    },
    // 收藏加载更多
    getMoreCollection () {
      this.collectOffset += 20
      const param = {
        author_id: this.member_id,
        offset: this.collectOffset,
        count: 20
      }
      this.$api.getOthersCollection(param).then(res => {
        if (res.data.ErrorCode === 0) {
          if (res.data.data.data.length) {
            this.collectionList = this.collectionList.concat(res.data.data.data)
            if (res.data.data.data.length < 20) {
              this.collectHasMore = false
            }
          } else {
            this.collectHasMore = false
          }
        }
      })
    },
    // 跳转活动列表
    goEventList () {
      this.$router.push('/eventlist')
    },
    // 跳转稿件详情页
    goEventDetail () {
      this.$router.push('/eventdetail')
    },
    // 获取用户信息
    getUserInfo (id) {
      this.$api.getUserInfo(id).then(res => {
        if (res.data.ErrorCode === 0) {
          this.userInfo = res.data.data
        } else {
          Toast(res.data.ErrorText)
        }
      })
    },
    goImgDetail (item) {
      this.$api.getGalleryDetail(item.origin_id).then(res => {
        if (res.data.ErrorText) {
          Toast(res.data.ErrorText)
        } else {
          this.$router.push({ path: '/imgdetail', query: { id: item.origin_id } })
        }
      })
    },
    loadMore () {
      this.currentTab === 0 && this.getMoreWork()
      this.currentTab === 1 && this.getMoreCollection()
    }
  },
  created () {
    this.member_id = this.$route.query.id
    this.getUserInfo(this.member_id)
    this.getWork()
  }
}
</script>
<style lang='scss' scoped>
.my-wrapper {
  .my-top {
    .back {
      width: 0.11rem;
      height: 0.19rem;
      position: absolute;
      top: 0.33rem;
      left: 0.15rem;
    }
    height: 2.8rem;
    background-color: #1c3644;
    padding-top: 0.7rem;
    .my-info {
      padding-left: 0.2rem;
      margin-bottom: 0.3rem;
      .avatar {
        width: 0.84rem;
        height: 0.84rem;
        border-radius: 50%;
        margin-right: 0.2rem;
      }
      .my-box {
        padding-top: 0.18rem;
        .my-name-box {
          .my-name {
            font-size: 0.2rem;
            font-family: SourceHanSansCN;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            margin-right: 0.1rem;
          }
          .gender-icon {
            width: 0.17rem;
            height: 0.17rem;
            margin-top: 0.03rem;
          }
        }
      }
    }
    .my-number-box {
      .my-number-item {
        width: 50%;
        .number-text {
          font-size: 0.24rem;
          font-family: ArialMT;
          color: rgba(255, 255, 255, 1);
          margin-bottom: 0.16rem;
        }
        .number-icon {
          width: 0.14rem;
          height: 0.14rem;
          margin-right: 0.04rem;
        }
        .number-sub-text {
          font-size: 0.14rem;
          font-family: SourceHanSansCN;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
  .nav {
    height: 0.44rem;
    margin-top: -0.1rem;
    background-color: #fff;
    border-radius: 8px 8px 0px 0px;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
    padding-top: 0.08rem;
    .nav-item {
      width: 0.75rem;
      height: 0.34rem;
      line-height: 0.34rem;
      position: relative;
      .nav-text {
        text-align: center;
        font-size: 0.14rem;
        font-family: SourceHanSansCN;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        &.active {
          color: rgba(221, 47, 60, 1);
        }
      }
      .nav-border {
        width: 0.37rem;
        height: 0.02rem;
        background: rgba(221, 47, 60, 1);
        position: absolute;
        left: 50%;
        bottom: -0.02rem;
        transform: translate(-50%, -50%);
      }
    }
  }
  .main {
    .count-box {
      height: 0.38rem;
      padding-left: 0.1rem;
      .flex-item {
        height: 0.24rem;
        line-height: 0.24rem;
        padding: 0 0.1rem;
        text-align: center;
        font-size: 0.12rem;
        margin-right: 0.12rem;
        color: #999999;
        &.active {
          background: rgba(187, 187, 187, 0.2);
          border-radius: 0.16rem;
          color: #333333;
        }
      }
    }
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
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
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
        .status {
          width: 0.38rem;
          height: 0.18rem;
          line-height: 0.18rem;
          text-align: center;
          font-size: 0.09rem;
          color: #fff;
          background: rgba(245, 166, 35, 1);
          border-radius: 0.12rem;
          position: absolute;
          top: 0.08rem;
          right: 0.12rem;
          &.checking {
            background: rgba(245, 166, 35, 1);
          }
          &.dahui {
            background-color: #d0021b;
          }
          &.checked {
            background-color: #41a856;
          }
          &.daitijiao {
            background-color: #3688ff;
          }
          &.pinfenzhong {
            background-color: #41a856;
          }
          &.yipinfen {
            background-color: #999999;
          }
        }
      }
    }
    .contribute {
      height: 0.38rem;
      background-color: #fff;
      padding-left: 0.17rem;
      .icon {
        width: 0.18rem;
        height: 0.15rem;
      }
      .text {
        font-size: 0.12rem;
        font-family: SourceHanSansCN;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-left: 0.1rem;
        padding-right: 2.6rem;
      }
    }
    .work-contribute-box {
      .work-contribute-title {
        height: 0.4rem;
        border-bottom: 1px solid rgba(240, 240, 240, 1);
        .text {
          font-size: 0.14rem;
          font-family: SourceHanSansCN;
          font-weight: 400;
          color: rgba(221, 47, 60, 1);
        }
      }
    }
  }
}
</style>
