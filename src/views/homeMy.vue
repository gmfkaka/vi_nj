<template>
  <div class="my-wrapper" v-infinite-scroll="getMoreCollectionImgList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <img class="pub-icon" v-if="showButton" style="bottom:1.8rem;" @click="goContribute(0)" src="../assets/images/my/upload_video.png" alt />
    <img class="pub-icon" v-if="showButton" style="bottom:1rem;" @click="goContribute(1)" src="../assets/images/my/upload_img.png" alt />
    <img class="pub-icon" v-if="showButton" @click="toggleButton" src="../assets/images/my/upload_close.png" alt />
    <img class="pub-icon" v-else @click="toggleButton" src="../assets/images/my/upload_add.png" alt />
    <!--  v-if="token && myInfo.id" -->
    <div v-if="token && myInfo.id">
      <!-- 顶部 个人资料 -->
      <div class="my-top" ref="myTop">
        <img class="back" @click="goToPage('home')" src="../assets/images/detail/back.png" alt />
        <img class="setting" @click="logout" src="../assets/images/my/quit.png" />
        <div class="my-info flexBox">
          <img
            v-if="myInfo.avatar"
            class="avatar"
            :src="getImgUrl(myInfo.avatar,168,168)"
            alt
          />
          <img v-else class="avatar" src="../assets/images/my/avatar@2x.png" alt />
          <div class="my-box">
            <div class="my-name-box flexBox">
              <p class="my-name" v-if="myInfo.nick_name">{{myInfo.nick_name}}</p>
              <img
                v-if="myInfo.extension.gender && myInfo.extension.gender.value === '男'"
                class="gender-icon"
                src="../assets/images/my/male.png"
                alt
              />
              <img
                v-if="myInfo.extension.gender && myInfo.extension.gender.value === '女'"
                class="gender-icon"
                src="../assets/images/my/female.png"
                alt
              />
            </div>
            <div class="become" v-if="myInfo.group_id !== 2" @click="become">成为签约摄影师</div>
          </div>
        </div>
        <div class="my-number-box flexBox">
          <div class="my-number-item flexBox flexMiddle flexColumn">
            <p class="number-text">{{userData.works || 0}}</p>
            <div class="flexBox flexAlign">
              <img src="../assets/images/my/number_icon1.png" alt class="number-icon" />
              <p class="number-sub-text">作品</p>
            </div>
          </div>
          <div class="my-number-item flexBox flexMiddle flexColumn">
            <p class="number-text">{{userData.photo_count || 0}}</p>
            <div class="flexBox flexAlign">
              <img src="../assets/images/my/number_icon4.png" alt class="number-icon" />
              <p class="number-sub-text">图片</p>
            </div>
          </div>
          <div class="my-number-item flexBox flexMiddle flexColumn">
            <p class="number-text">{{userData.clicks || 0}}</p>
            <div class="flexBox flexAlign">
              <img src="../assets/images/my/number_icon2.png" alt class="number-icon" />
              <p class="number-sub-text">访客</p>
            </div>
          </div>
        </div>
      </div>
      <!-- tab -->
      <div class="nav flexBox" ref="nav">
        <div
          class="nav-item"
          v-for="(item,index) in tabList"
          :key="index"
          @click="changeTab(index)"
        >
          <div class="nav-text" :class="{'active':index === currentTab}">{{item}}</div>
          <div class="nav-border" v-if="index === currentTab"></div>
        </div>
      </div>
      <!-- 作品 -->
      <div class="main" v-if="currentTab === 0">
        <!-- 选择类型切换 -->
        <div class="count-box flexBox flexAlign" ref="countBox">
          <!-- <div class="flex-item" :class="{'active':currentWork === 0}" @click="changeWork(0)">全部·36</div> -->
          <div
            class="flex-item"
            :class="{'active':currentWork === 0}"
            @click="changeWork(0)"
          >图片·{{publishImgCount1+publishImgCount2}}</div>
          <!-- 视频暂不支持 -->
          <div
            class="flex-item"
            :class="{'active':currentWork === 1}"
            @click="changeWork(1)"
          >视频·{{videoList.length}}</div>
        </div>
        <div class="filter-box-sub" v-if="filterStick && currentWork === 1"></div>
        <!-- 筛选 + 搜索 -->
        <div
          class="filter-box"
          :class="{'filter-box-stick':filterStick}"
          v-show="currentWork === 1"
          ref="filterBox"
        >
          <!-- 搜索 -->
          <div class="search-box">
            <form action="" v-on:submit.prevent="">
              <mt-search
                ref="mtSearch"
                v-model="searchVal"
                cancel-text="取消"
                placeholder="请输入文稿标题"
                @keyup.native="toSearch"
              ></mt-search>
            </form>
          </div>
          <!-- 时间快捷选项 -->
          <div class="date-shortcut-box">
            <span
              v-for="item in dateShortCutList"
              :key="item.id"
              :class="{'active':item.id === curDateShortCutId}"
              @click="selectDateShortCut(item)"
            >{{item.name}}</span>
          </div>
          <!-- 拍摄时间 -->
          <div class="date-box">
            <!-- 时间 -->
            <div class="filter-date-box">
              <span>拍摄时间</span>
              <span class="filterDate" @click="openStartDatePicker">{{filterStartDate}}</span>
              <span>至</span>
              <span class="filterDate" @click="openEndDatePicker">{{filterEndDate}}</span>
            </div>
            <!-- start时间 popup -->
            <mt-datetime-picker
              class="date-mask"
              ref="startDatePicker"
              type="date"
              :startDate="new Date('1901-01-01')"
              :endDate="new Date()"
              v-model="pickerStartValue"
              @confirm="handleStartDate"
            ></mt-datetime-picker>
            <!-- end时间 popup -->
            <mt-datetime-picker
              class="date-mask"
              ref="endDatePicker"
              type="date"
              :startDate="new Date('1901-01-01')"
              :endDate="new Date()"
              v-model="pickerEndValue"
              @confirm="handleEndDate"
            ></mt-datetime-picker>
          </div>
          <div class="merge-box">
            <!-- 拍摄地点 -->
            <div class="address-box">
              <!-- 地区 -->
              <div class="filter-address-box" @click="isShowCountryPopup = true">
                <!-- <span>拍摄地点</span> -->
                <span class="filterAddress">{{filterAddress}}</span>
                <!-- <i class="moreIcon"></i> -->
                <img
                  src="../assets/images/common/spread.png"
                  alt=""
                  style="width: .12rem;"
                >
              </div>
              <!-- 国内 国外 popup -->
              <mt-popup v-model="isShowCountryPopup" position="bottom">
                <div class="picker-head flexBox">
                  <p class="item" @click="isShowCountryPopup = false">取消</p>
                  <p class="item" @click="selectCountry">确认</p>
                </div>
                <mt-picker
                  :slots="countrySlots"
                  valueKey="name"
                  style="width:3.75rem;"
                  ref="country-picker"
                ></mt-picker>
              </mt-popup>
              <!-- 国内地区 popup -->
              <mt-popup v-model="isShowChinaAreaPopup" position="bottom">
                <div class="picker-head flexBox">
                  <p class="item" @click="isShowChinaAreaPopup = false">取消</p>
                  <p class="item" @click="selectChinaArea">确认</p>
                </div>
                <mt-picker
                  :slots="chinaAreaSlots"
                  value-key="name"
                  @change="onChinaAreaChange"
                  style="width:3.75rem;"
                  ref="chinaArea-picker"
                ></mt-picker>
              </mt-popup>
            </div>
            <!-- 稿件状态 -->
            <div class="status-box">
              <!-- 状态 -->
              <div class="filter-status-box" @click="isShowStatusPopup = true">
                <!-- <span>稿件状态</span> -->
                <span class="filterStatus">{{filterStatus}}</span>
                <!-- <i class="moreIcon"></i> -->
                <img
                  src="../assets/images/common/spread.png"
                  alt=""
                  style="width: .12rem;"
                >
              </div>
              <!-- 稿件状态 popup -->
              <mt-popup v-model="isShowStatusPopup" position="bottom">
                <div class="picker-head flexBox">
                  <p class="item" @click="isShowStatusPopup = false">取消</p>
                  <p class="item" @click="selectStatus">确认</p>
                </div>
                <mt-picker
                  :slots="statusSlots"
                  value-key="name"
                  style="width:3.75rem;"
                  ref="status-picker"
                ></mt-picker>
              </mt-popup>
            </div>
          </div>
        </div>
        <!-- 图片列表 -->
        <div v-if="currentWork === 0">
          <div class="divider"></div>
          <!-- 我要投稿 -->
          <!-- <div class="contribute flexBox flexAlign" @click="wantContribute">
            <img class="icon" src="../assets/images/my/contribute_icon.png" alt />
            <div class="text">我要投稿</div>
            <i class="moreIcon"></i>
          </div>
          <div class="divider"></div> -->
          <!-- 签约投稿 -->
          <div class="work-contribute-box">
            <router-link
              class="work-contribute-title flexBox flexAlign flexBetween p15"
              to="/mypublishlist"
            >
              <p class="text">签约投稿·{{publishImgCount1}}</p>
              <i class="moreIcon"></i>
            </router-link>
          </div>
          <div class="divider"></div>
          <!-- 活动投稿 -->
          <div class="work-contribute-box">
            <router-link
              class="work-contribute-title flexBox flexAlign flexBetween p15"
              to="/mypublishlist?type=activity"
            >
              <p class="text">活动投稿·{{publishImgCount2}}</p>
              <i class="moreIcon"></i>
            </router-link>
          </div>
          <div class="divider"></div>
        </div>
        <!-- 视频列表 -->
        <div
          v-if="currentWork === 1"
          class="video-box"
          v-infinite-scroll="videoLoadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
        >
          <div class="divider"></div>
          <!-- 视频列表无数据 -->
          <div style="padding: 0 .15rem;">
            <img
              class="fullImg"
              src="../assets/images/nodata/home_updated.png"
              alt
              v-if="videoList.length <= 0"
            />
          </div>
          <!-- 视频列表项 -->
          <div
            class="video-item"
            v-for="item in videoList"
            :key="item.id"
          >
            <!-- 提审前 status:-5 -->
            <video
              v-if="item.status === -5"
              :src="item.url"
              class="video"
              controls
              :poster="item.index_pic"
              x5-playsinline="true"
              webkit-playsinline="true"
              playsinline="true"
            ></video>
            <!-- 提审后 status:1 -->
            <div v-else class="video" @click="toVideoDetail(item)">
              <img :src="item.index_pic" style="width:100%;height:100%;">
              <img
                class="alignCenter"
                style="width:.4rem;height:.4rem;"
                src="../assets/images/common/video_icon.png"
                alt
              />
            </div>
            <div class="video-info">
              <p class="title">{{item.title}}</p>
              <!-- v-if="item.status !== -5" -->
              <p
                class="operate-btn"
                @click="toggleOperation(item)"
                v-if="item.status === -5 || item.status === 4"
              >...</p>
              <mt-popup
                v-model="item.isPopup"
                popup-transition="popup-fade"
                :modal=false
              >
                <div class="operation">
                  <p @click="bring(item)">提审</p>
                  <p @click="edit(item)">编辑</p>
                  <p @click="del(item)">删除</p>
                </div>
              </mt-popup>
            </div>
            <p class="status checking" v-if="item.status === 1">审核中</p>
            <p class="status checked" v-if="item.status === 2">已审核</p>
            <p class="status published" v-if="item.status === 3">已上网</p>
            <p class="status ban" v-if="item.status === 4">已打回</p>
            <p class="status ban" v-if="item.status === -5">待提审</p>
          </div>
          <p v-if="!videoHasMore" class="no-data-text">没有更多了</p>
        </div>
      </div>
      <!-- 活动 -->
      <div class="main" v-if="currentTab === 1 && activityRequested">
        <!-- 选择类型切换 -->
        <div class="count-box flexBox flexAlign">
          <div
            class="flex-item"
            :class="{'active':currentActivity === 0}"
            @click="changeEvent(0)"
          >参与活动·{{myActivityCount}}</div>
          <div
            class="flex-item"
            :class="{'active':currentActivity === 1}"
            @click="changeEvent(1)"
          >评分活动·{{myRateActivityCount}}</div>
        </div>
        <!-- 参与活动列表 -->
        <div v-if="currentActivity === 0">
          <div v-for="(item,index) in myActivityList" :key="index">
            <div class="divider"></div>
            <div class="event-item" @click="goEventDetail(item.id)">
              <img :src="getImgUrl(item.index_pic,690,400)" alt />
              <p class="title">{{item.title}}</p>
              <p class="brief">{{item.brief}}</p>
              <div class="info-box">
                <p>活动时间</p>
                <p
                  class="detail"
                >{{item.start_time.substring(5,16)}} 至 {{item.end_time.substring(5,16)}}</p>
                <p style="margin-top:0.15rem;">操作</p>
                <p class="detail">详情</p>
              </div>
              <div class="detail-box flexBox" @click.stop="goEventList(item.id)">
                <p>活动稿件</p>
                <img class="icon" src="../assets/images/my/my_detail_icon.png" alt />
              </div>
            </div>
          </div>
          <img
            v-if="!myActivityList.length"
            class="no-data-img style1"
            src="../assets/images/nodata/home_list.png"
            alt
          />
        </div>
        <!-- 评分活动列表 -->
        <div v-if="currentActivity === 1">
          <div v-for="(item,index) in myRateActivityList" :key="index">
            <div class="divider"></div>
            <div class="event-item" @click="goEventDetail(item.id,type)">
              <img :src="getImgUrl(item.index_pic,690,400)" alt />
              <p class="title">{{item.title}}</p>
              <p class="brief">{{item.brief}}</p>
              <div class="info-box">
                <p>活动时间</p>
                <p class="detail">{{item.start_time.substring(5,16)}} 至 {{item.end_time.substring(5,16)}}</p>
                <p style="margin-top:0.15rem;">操作</p>
                <p class="detail">详情</p>
              </div>
              <div class="detail-box flexBox" @click.stop="goEventList(item.id,'rate')">
                <p>活动稿件</p>
                <img class="icon" src="../assets/images/my/my_detail_icon.png" alt />
              </div>
            </div>
          </div>
          <img
            v-if="!myRateActivityList.length"
            class="no-data-img style1"
            src="../assets/images/nodata/home_list.png"
            alt
          />
        </div>
      </div>
      <!-- 收藏 -->
      <div class="main" v-if="currentTab === 2 && collectionRequested">
        <!-- 选择类型切换 -->
        <div class="count-box flexBox flexAlign">
          <!-- <div
            class="flex-item"
            :class="{'active':currentCollection === 0}"
            @click="changeCollection(0)"
          >全部·36</div>-->
          <div
            class="flex-item"
            :class="{'active':currentCollection === 0}"
            @click="changeCollection(0)"
          >图片·{{collectionImgList.length}}</div>
          <!-- 视频暂不支持 -->
          <div
            class="flex-item"
            :class="{'active':currentCollection === 1}"
            @click="changeCollection(1)"
          >视频·{{collectionVideoList.length}}</div>
        </div>
        <div class="divider"></div>
        <!-- 图片列表 -->
        <div
          class="img-box flexBox flexBetween flexWrap"
          v-if="currentCollection === 0"
          style="padding:0.15rem;"
        >
          <div
            class="img-item"
            v-for="(item,index) in collectionImgList"
            :key="index"
            @click="goImgDetail(item)"
          >
            <img
              style="width:100%;height:100%;"
              :src="getImgUrl(item.index_pic,340,200)"
              alt
            />
            <div
              class="img-info flexBox flexAlign flexBetween"
              style="background:rgba(0, 0, 0, 0.2);"
            >
              <p class="textEllipsis">{{item.title}}</p>
            </div>
          </div>
          <img
            v-if="!collectionImgList.length"
            class="no-data-img style1"
            src="../assets/images/nodata/home_list.png"
            alt
          />
          <p v-if="!collectionImgHasMore" class="no-data-text">没有更多了</p>
        </div>
        <!-- 视频列表 -->
        <div
          class="img-box flexBox flexBetween flexWrap"
          v-if="currentCollection === 1"
          style="padding:0.15rem;"
        >
          <div
            class="img-item"
            v-for="(item,index) in collectionVideoList"
            :key="index"
            @click="goVideoDetail(item)"
          >
            <img
              style="width:100%;height:100%;"
              :src="getImgUrl(item.extends.cover_url,340,200)"
              alt
            />
            <div
              class="img-info flexBox flexAlign flexBetween"
              style="background:rgba(0, 0, 0, 0.2);"
            >
              <p class="textEllipsis">{{item.extends.title}}</p>
              <p>{{item.extends.time}}</p>
            </div>
            <img class="video-icon alignCenter" src="../assets/images/common/video_icon.png" alt />
          </div>
          <img
            v-if="!collectionVideoList.length"
            class="no-data-img style1"
            src="../assets/images/nodata/home_list.png"
            alt
          />
        </div>
        <div class="divider"></div>
      </div>
      <!-- 资料 -->
      <div class="main" v-if="currentTab === 3">
        <!-- 基本信息 -->
        <div class="info-box p15">
          <div class="info-title flexBox">
            <div class="info-border"></div>
            <p class="text">基本信息</p>
          </div>
          <div class="info-item-box grayBorder">
            <div class="info-item flexBox">
              <p class="left">
                用户名
                <i></i>
              </p>
              <p class="right">{{myInfo.nick_name}}</p>
              <span class="required">*</span>
            </div>
            <div class="info-item flexBox" @click="genderVisible = true">
              <p class="left">
                性别
                <i></i>
              </p>
              <p class="right" v-if="gender">{{gender}}</p>
              <span class="required">*</span>
              <i class="moreIcon"></i>
            </div>
            <div class="info-item flexBox" @click="areaVisible = true">
              <p class="left">
                所在地
                <i></i>
              </p>
              <p class="right">{{`${prov}-${city}`}}</p>
              <span class="required">*</span>
              <i class="moreIcon"></i>
            </div>
            <div class="info-item flexBox" @click="showBrief">
              <p class="left">
                简介
                <i></i>
              </p>
              <i class="moreIcon"></i>
              <p class="right textEllipsis">{{brief}}</p>
            </div>
          </div>
        </div>
        <!-- 联系方式 -->
        <div class="info-box p15 b0">
          <div class="info-title flexBox">
            <div class="info-border"></div>
            <p class="text">联系方式</p>
          </div>
          <div class="info-item-box">
            <div class="info-item flexBox">
              <p class="left">
                QQ
                <i></i>
              </p>
              <input type="text" placeholder="请输入您的QQ" v-model="qqAcount" />
              <!-- <img class="lockIcon" src="../assets/images/my/lock_icon.png" alt /> -->
            </div>
            <div class="info-item flexBox">
              <p class="left">
                微信
                <i></i>
              </p>
              <input type="text" placeholder="请输入您的号" v-model="weChatAcount" />
              <!-- <img class="lockIcon" src="../assets/images/my/lock_icon.png" alt /> -->
            </div>
          </div>
        </div>
        <!-- 保存 -->
        <div class="confirm-box">
          <div class="button alignCenter" @click="saveInfo">保存</div>
        </div>
      </div>
    </div>
    <!-- 底部tab -->
    <!-- <div class="tab-bar flexBox">
      <div class="tab-bar-item flexBox flexAlign flexMiddle flexColumn" @click="goHome">
        <i class="homeIcon"></i>
        <p class="tab-text">首页</p>
      </div>
      <div class="tab-bar-item flexBox flexAlign flexMiddle flexColumn">
        <i class="myIconActive"></i>
        <p class="tab-text active">我的</p>
      </div>
      <i class="publishIcon alignCenter" @click="goContribute"></i>
    </div> -->
    <!-- 性别选择框 -->
    <mt-popup v-model="genderVisible" position="bottom">
      <div class="picker-head flexBox">
        <p class="item" @click="genderVisible = false">取消</p>
        <p class="item" @click="chooseGender">确认</p>
      </div>
      <mt-picker :slots="genderSlots" style="width:3.75rem;" ref="sex-picker"></mt-picker>
    </mt-popup>
    <!-- 地区选择框 -->
    <mt-popup v-model="areaVisible" position="bottom">
      <div class="picker-head flexBox">
        <p class="item" @click="areaVisible = false">取消</p>
        <p class="item" @click="chooseArea">确认</p>
      </div>
      <mt-picker
        :slots="areaSlots"
        value-key="name"
        @change="onAreaChange"
        style="width:3.75rem;"
        ref="area-picker"
      ></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
import { MessageBox, Toast, Indicator } from 'mint-ui'
export default {
  name: 'homeMy',
  data () {
    return {
      token: '',
      tabList: ['作品', '活动', '收藏', '资料'],
      currentTab: 0,
      userData: {},
      myInfo: {},
      showButton: false, // 是否显示上传按钮
      // 作品
      currentWork: 0,
      publishImgCount1: 0,
      publishImgCount2: 0,
      publishVideoCount: 0,
      // 活动
      currentActivity: 0,
      activityRequested: false,
      myActivityList: [],
      myActivityCount: '',
      myRateActivityList: [],
      myRateActivityCount: '',
      // 收藏
      currentCollection: 0,
      collectionRequested: false,
      collectionImgList: [],
      collectionImgOffset: 0,
      collectionImgHasMore: true,
      collectionVideoList: [],
      // 个人资料
      gender: '',
      brief: '',
      prov: '',
      city: '',
      qqAcount: '',
      weChatAcount: '',
      // 性别选择
      genderVisible: false,
      genderSlots: [
        {
          flex: 1,
          values: ['男', '女', '保密'],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      // 地区选择
      areaVisible: false,
      areaSlots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      // 用户id
      userId: '',
      // 视频列表
      videoList: [],
      videoPage: 1,
      videoCount: 10,
      videoHasMore: true,
      // popup
      curPopupId: '',
      // 视频列表区分刷新、上垃加载
      isrefresh: true,
      // filter-box吸顶
      filterStick: false,
      // myTop高度
      myTopHeight: 0,
      // nav高度
      navHeight: 0,
      // countBoxHeight
      countBoxHeight: 0,
      // 搜索框
      searchVal: '',
      /* 拍摄时间 */
      pickerStartValue: new Date(),
      pickerEndValue: new Date(),
      // 拍摄时间筛选 展示项
      filterStartDate: '请选择起始时间',
      filterEndDate: '请选择结束时间',
      // 拍摄时间 popup 显示/隐藏
      isShowStartDatePickPopup: false,
      isShowEndDatePickPopup: false,
      // 日期筛选快捷选项
      dateShortCutList: [
        {
          id: '001',
          name: '全部日期',
          value: 0
        },
        {
          id: '002',
          name: '近7天',
          value: 1
        },
        {
          id: '003',
          name: '近30天',
          value: 2
        },
        {
          id: '004',
          name: '近90天',
          value: 3
        }
        // {
        //   id: '005',
        //   name: '自定义日期',
        //   value: ''
        // }
      ],
      // 日期筛选 快捷选项 当前选中id
      curDateShortCutId: '001',
      // 日期筛选 快捷选项 当前选中value
      curDateShortCutVal: 0,
      // 起始时间 选中项
      selectStartDate: '',
      // 结束时间 选中项
      selectEndDate: '',
      /* 拍摄地点 */
      // 拍摄地点筛选 展示项
      filterAddress: '拍摄地点',
      // 国内 国外 popup 显示/隐藏
      isShowCountryPopup: false,
      countrySlots: [
        {
          flex: 1,
          values: [
            {
              id: '001',
              name: '全部拍摄地点'
            },
            {
              id: '002',
              name: '国内'
            }
            // {
            //   id: '003',
            //   name: '国外'
            // }
          ],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      // 国内 国外 选中项
      selectCountryVal: '',
      // 国内地区 popup 显示/隐藏
      isShowChinaAreaPopup: false,
      chinaAreaSlots: [
        {
          flex: 1,
          values: [],
          className: 'slot2',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot3'
        },
        {
          flex: 1,
          values: [],
          className: 'slot4',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot5'
        },
        {
          flex: 1,
          values: [],
          className: 'slot6',
          textAlign: 'center'
        }
      ],
      /* 稿件状态 */
      // 稿件状态筛选 展示项
      filterStatus: '稿件状态',
      // 稿件状态 popup 显示/隐藏
      isShowStatusPopup: false,
      statusSlots: [
        {
          flex: 1,
          values: [
            {
              id: '001',
              name: '全部稿件状态',
              value: 0
            },
            {
              id: '002',
              name: '审核中',
              value: 1
            },
            {
              id: '003',
              name: '已审核',
              value: 2
            },
            {
              id: '004',
              name: '已上网',
              value: 3
            },
            {
              id: '005',
              name: '已打回',
              value: 4
            },
            {
              id: '006',
              name: '待提审',
              value: -5
            }
          ],
          className: 'statusSlot',
          textAlign: 'center'
        }
      ],
      // 稿件状态 选中项
      selectStatusVal: ''
    }
  },
  created () {
    this.token = this.getToken()
    if (!this.token) {
      this.$router.replace('/login')
    } else {
      this.getMyInfo()
    }
  },
  mounted () {
    this.getProvinceList()
  },
  watch: {
    '$route': 'getMyInfo'
  },
  methods: {
    // 切换显示上传按钮
    toggleButton () {
      this.showButton = !this.showButton
    },
    become () {
      MessageBox('提示', '请到视觉南京PC端进行摄影师签约')
    },
    wantContribute () {
      if (this.getCookie('groupId') === '2') {
        this.$router.push('/contribute')
      } else {
        MessageBox('提示', '您还不是签约摄影师，请到视觉南京PC端签约后投稿')
      }
    },
    // 去首页
    goHome () {
      this.$router.push('/')
    },
    // 切换tab
    changeTab (index) {
      this.currentTab = index
      index === 1 && this.getMyActivityList()
      index === 2 && this.getCollection()
      index === 3 && this.getAreaList()
    },
    // 切换作品类型
    changeWork (index) {
      this.currentWork = index
      if (index === 1) {
        this.getElementsHeight()
        // 搜索框“取消”事件
        this.$nextTick(() => {
          let cancel = this.$refs.mtSearch.$el.querySelectorAll('.mint-searchbar-cancel')[0]
          cancel.onclick = () => {
            this.toSearch()
          }
        })
      }
    },
    // 切换活动类型
    changeEvent (index) {
      this.currentActivity = index
    },
    // 切换收藏类型
    changeCollection (index) {
      this.currentCollection = index
    },
    // 跳转活动列表
    goEventList (id, type = '') {
      this.$router.push({ path: '/eventlist', query: { id, type } })
    },
    // 跳转稿件详情页
    goEventDetail (id) {
      this.$router.push({ path: '/eventdetail', query: { id } })
    },
    // 获取作品数量
    getPublishCount () {
      // 图集 签约投稿
      const param1 = {
        access_token: this.token,
        act_id: 1
      }
      this.$api.getUserGallery(param1).then(res => {
        this.publishImgCount1 = res.data.data.total
      })
      // 图集 活动投稿
      const param2 = {
        access_token: this.token,
        act_id: 2
      }
      this.$api.getUserGallery(param2).then(res => {
        this.publishImgCount2 = res.data.data.total
      })
    },
    // 获取收藏列表
    getCollection () {
      if (this.collectionRequested) return
      // 图片
      let param1 = {
        access_token: this.getToken(),
        offset: 0,
        count: 20
      }
      this.$api.getMyCollection(param1).then(res => {
        if (res.data.ErrorCode === 0 && res.data.data.data) {
          if (res.data.data.data.length < 20) {
            this.collectionImgHasMore = false
          }
          this.collectionImgList = res.data.data.data
          this.collectionRequested = true
        }
      })
    },
    // 获取更多图片收藏
    getMoreCollectionImgList () {
      if (this.currentTab === 2 && this.collectionImgHasMore) {
        this.collectionImgOffset += 20
        let param = {
          access_token: this.getToken(),
          offset: this.collectionImgOffset,
          count: 20
        }
        this.$api.getMyCollection(param).then(res => {
          if (res.data.ErrorCode === 0) {
            if (res.data.data.data.length) {
              this.collectionImgList = this.collectionImgList.concat(
                res.data.data.data
              )
              if (res.data.data.data.length < 20) {
                this.collectionImgHasMore = false
              }
            } else {
              this.collectionImgHasMore = false
            }
          }
        })
      }
    },
    // 获取活动列表
    getMyActivityList () {
      if (this.activityRequested) return
      const token = this.getToken()
      // 参与活动列表
      this.$api.getUserActivityList(token).then(res => {
        if (res.data.ErrorCode === 0) {
          this.myActivityList = res.data.data.data
          this.myActivityCount = res.data.data.total
        }
      })
      // 评分活动列表
      this.$api.getUserCommitteeList(token).then(res => {
        if (res.data.ErrorCode === 0) {
          this.myRateActivityList = res.data.data.data
          this.myRateActivityCount = res.data.data.total
          this.activityRequested = true
        }
      })
    },
    // 获取用户信息
    getMyInfo () {
      this.$api.getMyInfo(this.token).then(res => {
        if (res.data.ErrorCode === 0 && res.data.data) {
          this.myInfo = res.data.data
          // 用户已签约则更新签约摄影师状态值
          if (this.getCookie('groupId') !== this.myInfo.group_id) {
            this.setCookie('groupId', this.myInfo.group_id)
          }
          this.userId = this.myInfo.program ? this.myInfo.program.user_id : ''
          this.gender = this.myInfo.extension.gender.value || ''
          this.brief = this.myInfo.brief || ''
          this.qqAcount = this.myInfo.extension.qqnum.value || ''
          this.weChatAcount = this.myInfo.extension.wechat.value || ''
          this.prov = this.myInfo.extension.prov.value || ''
          this.city = this.myInfo.extension.city.value || ''
        }
      })
      this.getPublishCount()
      this.getMyData()
      // 获取视频列表
      this.isrefresh = true
      this.getVideoList()
    },
    // 获取个人数据
    getMyData () {
      this.$api.getMyData(this.token).then(res => {
        this.userData = res.data.data
      })
    },
    // 退出登录
    logout () {
      MessageBox.confirm('确定退出登录?').then(action => {
        if (action === 'confirm') {
          this.delCookie('access_token')
          this.$router.push('/')
        }
      })
    },
    // 更新用户简介
    showBrief () {
      const that = this
      MessageBox.prompt('请输入个人简介').then(({ value, action }) => {
        if (action === 'confirm') {
          that.brief = value
        }
      })
    },
    // 获取省级列表
    getAreaList () {
      if (this.areaSlots[0].values.length) return
      this.$api.getAreaList('pro').then(res => {
        if (res.data.data.length) {
          this.areaSlots[0].values = res.data.data
        }
      })
    },
    // 获取城市列表
    area (id) {
      const that = this
      let promise = new Promise(function (resolve, reject) {
        that.$api
          .getAreaList('city', id)
          .then(res => {
            resolve(res.data.data)
          })
          .catch(error => {
            console.log(error)
          })
      })
      return promise
    },
    // 保存个人信息
    saveInfo () {
      let param = { access_token: this.token }
      // 性别
      if (this.gender) {
        if (this.gender === '男') {
          param.sex = 1
        }
        if (this.gender === '女') {
          param.sex = 2
        }
        if (this.gender === '保密') {
          param.sex = 3
        }
      }
      // 简介
      if (this.brief) {
        param.brief = this.brief
      }
      // qq
      if (this.qqAcount) {
        param.qq = this.qqAcount
      }
      // 微信
      if (this.weChatAcount) {
        param.wechat = this.weChatAcount
      }
      // 地区
      if (this.prov) {
        param.province = this.prov
      }
      if (this.city) {
        param.city = this.city
      }
      this.$api.updateMyInfo(param).then(res => {
        if (res.data.ErrorCode === 0) {
          Toast('保存成功！')
        }
      })
    },
    // 确认性别选择
    chooseGender () {
      this.gender = this.$refs['sex-picker'].getValues()[0]
      this.genderVisible = false
    },
    // 监听省份选择变动 同步请求接口
    onAreaChange (picker, values) {
      const that = this
      if (values[0]) {
        that.$api.getAreaList('city', values[0]['id']).then(res => {
          picker.setSlotValues(1, res.data.data)
        })
      }
    },
    // 确认地区选择
    chooseArea () {
      const res = this.$refs['area-picker'].getValues()
      this.prov = res[0].name
      this.city = res[1].name
      this.areaVisible = false
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
    // 去图集详情
    goImgDetail (item) {
      this.$api.getGalleryDetail(item.origin_id).then(res => {
        if (res.data.ErrorText) {
          Toast(res.data.ErrorText)
        } else {
          this.$router.push({ path: '/imgdetail', query: { id: item.origin_id } })
        }
      })
    },
    // 去视频详情
    goVideoDetail (item) {
      this.$router.push({
        path: '/videodetail',
        query: { id: item.origin_id }
      })
    },
    // 作品-视频列表-跳转视频详情
    toVideoDetail (item) {
      this.$router.push({
        path: '/tagVideodetail',
        query: { id: item.id }
      })
    },
    // 获取视频列表
    getVideoList () {
      const param = {
        user_id: this.userId,
        access_token: this.token,
        page: this.videoPage,
        per_num: this.videoCount
      }
      // 搜索值
      if (this.searchVal) {
        param.title = this.searchVal
      }
      // 时间快捷选项
      if (this.curDateShortCutId) {
        if (this.curDateShortCutId === '001') {
          param.date_search = ''
        } else {
          param.date_search = this.curDateShortCutVal
        }
      }
      // 时间筛选
      if (this.selectStartDate && this.selectEndDate) {
        param.start_time = this.selectStartDate
        param.end_time = this.selectEndDate
      }
      // 地区筛选
      if (this.selectCountryVal) {
        param.location_id = this.selectCountryVal
      }
      // 稿件状态筛选
      if (this.selectStatusVal === 0) {
        param.status = ''
      } else if (this.selectStatusVal) {
        param.status = this.selectStatusVal
      }
      this.$api.getVideoList(param).then(res => {
        if (res && res.data) {
          // 有搜索内容时，隐藏搜索列表
          if (this.$refs.mtSearch) {
            // console.log(this.$refs.mtSearch.$el.querySelectorAll('.mint-search-list')[0])
            let mintSearchList = this.$refs.mtSearch.$el.querySelectorAll('.mint-search-list')[0]
            mintSearchList.style.display = 'none'
            // console.log(mintSearchList.style.display)
          }
          this.videoHasMore = true
          if (this.isrefresh) {
            this.videoList = res.data.data.data
          } else {
            this.videoList = this.videoList.concat(res.data.data.data)
          }
          // popup
          for (let item of this.videoList) {
            this.$set(item, 'isPopup', false)
          }
          if (res.data.data.data.length < this.videoCount) {
            this.videoHasMore = false
          } else {
            this.videoHasMore = true
          }
        }
        // else {
        //   this.videoHasMore = false
        // }
        this.isrefresh = false
        // console.log(this.videoList)
      })
    },
    videoLoadMore () {
      if (this.videoHasMore) {
        // console.log('more')
        this.videoPage++
        this.getVideoList()
      }
    },
    // 切换视频操作
    toggleOperation (item) {
      this.curPopupId = Number(item.id)
      item.isPopup = !item.isPopup
      for (let videoItem of this.videoList) {
        if (Number(videoItem.id) !== this.curPopupId) {
          videoItem.isPopup = false
        }
      }
    },
    // 操作-提审
    bring (item) {
      const param = {
        id: Number(item.id),
        access_token: this.token
      }
      MessageBox.confirm('确定提审吗?').then(action => {
        this.toggleOperation(item)
        Indicator.open()
        this.$api.auditVideo(param).then(res => {
          if (res && res.data) {
            if (res.data.ErrorText) {
              Toast(res.data.ErrorText)
              Indicator.close()
            } else if (res.data.ErrorCode === 0 && res.data.data) {
              Toast('提审成功')
              Indicator.close()
              this.isrefresh = true
              this.getMyInfo()
            }
          }
        })
      })
    },
    // 操作-编辑
    edit (item) {
      this.$router.push({
        path: '/contributeVideo',
        query: {
          id: item.id
        }
      })
    },
    // 操作-删除
    del (item) {
      const param = {
        id: Number(item.id),
        access_token: this.token
      }
      MessageBox.confirm('确定删除吗?').then(action => {
        this.toggleOperation(item)
        Indicator.open()
        this.$api.delVideo(param).then(res => {
          if (res && res.data) {
            if (res.data.ErrorText) {
              Toast(res.data.ErrorText)
              Indicator.close()
            } else if (res.data.ErrorCode === 0 && res.data.data) {
              Toast('删除成功')
              Indicator.close()
              this.isrefresh = true
              this.getMyInfo()
            }
          }
        })
      })
    },
    toSearch () {
      this.isRefresh = true
      this.getMyInfo()
    },
    // 选择时间快捷选项
    selectDateShortCut (item) {
      this.curDateShortCutId = item.id
      this.curDateShortCutVal = item.value
      // 清空时间筛选
      this.selectStartDate = ''
      this.selectEndDate = ''
      this.filterStartDate = '请选择起始时间'
      this.filterEndDate = '请选择结束时间'
      this.isRefresh = true
      this.getMyInfo()
    },
    // 展示起始日期picker
    openStartDatePicker () {
      // this.isShowStartDatePickPopup = true
      this.$refs.startDatePicker.open()
    },
    // 选择起始时间
    handleStartDate (data) {
      let d = new Date(data)
      this.selectStartDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      this.filterStartDate = this.selectStartDate
      // console.log(this.selectStartDate)
      this.checkDate(this.selectStartDate, this.selectEndDate)
    },
    // 展示结束日期picker
    openEndDatePicker () {
      this.$refs.endDatePicker.open()
    },
    // 选择结束时间
    handleEndDate (data) {
      let d = new Date(data)
      this.selectEndDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      this.filterEndDate = this.selectEndDate
      // console.log(this.selectEndDate)
      this.checkDate(this.selectStartDate, this.selectEndDate)
    },
    // 对比起始时间与结束时间
    checkDate (startDate, endDate) {
      if (!startDate && endDate) {
        Toast('请选择开始时间！')
      } else if (startDate && endDate) {
        // 兼容ios Date.parse()，将中横线处理为/
        let tempStartDate = startDate.replace(/-/g, '/')
        let tempEndDate = endDate.replace(/-/g, '/')
        tempStartDate = Date.parse(tempStartDate) / 1000
        tempEndDate = Date.parse(new Date(tempEndDate)) / 1000
        if (tempEndDate < tempStartDate) {
          Toast('结束时间不能早于起始时间！')
        } else {
          this.curDateShortCutId = ''
          this.isRefresh = true
          this.getMyInfo()
        }
      }
    },
    // 获取省级列表
    getProvinceList () {
      this.$api.getAreaList('pro').then(res => {
        if (res.data.data.length) {
          this.chinaAreaSlots[0].values = res.data.data
        }
      })
    },
    // 监听省份选择变动 同步请求接口
    onChinaAreaChange (picker, values) {
      const that = this
      // 城市列表
      if (values[0]) {
        that.$api.getAreaList('city', values[0]['id']).then(res => {
          picker.setSlotValues(1, res.data.data)
        })
      }
      // 区列表
      if (values[1]) {
        that.$api.getAreaList('area', values[1]['id']).then(res => {
          picker.setSlotValues(2, res.data.data)
        })
      }
    },
    // popup 国内 国外
    selectCountry () {
      const res = this.$refs['country-picker'].getValues()[0]
      this.filterAddress = res.name
      // 国内
      if (res.id === '002') {
        this.isShowChinaAreaPopup = true
      } else if (res.id === '001') {
        // 全部地区
        this.selectCountryVal = ''
        this.isRefresh = true
        this.getMyInfo()
      }
      this.isShowCountryPopup = false
    },
    // popup 国内 地区
    selectChinaArea () {
      const res = this.$refs['chinaArea-picker'].getValues()
      // console.log(res)
      this.filterAddress = `${res[0].name}-${res[1].name}-${res[2].name}`
      this.isShowChinaAreaPopup = false
      this.selectCountryVal = parseInt(res[2].id, 10)
      this.isShowChinaAreaPopup = false
      this.isRefresh = true
      this.getMyInfo()
    },
    // 选择稿件状态
    selectStatus () {
      const res = (this.$refs['status-picker'].getValues()[0])
      this.filterStatus = res.name
      this.selectStatusVal = res.value
      this.isShowStatusPopup = false
      this.isRefresh = true
      this.getMyInfo()
    },
    // 获取 筛选+搜索 上面的所有元素高度
    getElementsHeight () {
      this.$nextTick(() => {
        let myTopEle = this.$refs.myTop
        let navEle = this.$refs.nav
        let countBoxEle = this.$refs.countBox
        if (myTopEle && navEle && countBoxEle) {
          this.myTopHeight = myTopEle.offsetHeight
          this.navHeight = navEle.offsetHeight
          this.countBoxHeight = countBoxEle.offsetHeight
          this.onSrollTop()
        }
        // console.log(this.myTopHeight)
        // console.log(this.navHeight)
        // console.log(this.countBoxHeight)
      })
    },
    onSrollTop () {
      const THIS = this
      let totalHeight = parseInt(this.myTopHeight, 10) + parseInt(this.navHeight, 10) + parseInt(this.countBoxHeight, 10) - 10
      // console.log(totalHeight)
      window.addEventListener('scroll', function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop >= parseInt(totalHeight, 10)) {
          // console.log('-====')
          THIS.filterStick = true
        } else {
          THIS.filterStick = false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.my-wrapper {
  // padding-bottom: 0.49rem;
  .pub-icon{
    width: 0.6rem;
    height: 0.6rem;
    position: fixed;
    z-index: 9999999;
    bottom: 0.2rem;
    right: 0.2rem;
  }
  .my-top {
    height: 2.8rem;
    background-color: #1c3644;
    padding-top: 0.7rem;
    .back{
      width: 0.11rem;
      height: 0.19rem;
      position: absolute;
      top: 0.34rem;
      left: 0.1rem;
    }
    .setting {
      width: 0.17rem;
      height: 0.19rem;
      position: absolute;
      top: 0.34rem;
      right: 0.16rem;
    }
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
        .become {
          margin-top: 0.18rem;
          width: 0.94rem;
          height: 0.24rem;
          line-height: 0.24rem;
          text-align: center;
          background: #ccc;
          border-radius: 2px;
          color: #fff;
          font-size: 0.11rem;
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
    // 筛选 + 搜索
    .filter-box {
      padding: .15rem;
      height: 1.51rem;
      background-color: #f8f8f8;
      font-size: .12rem;
      z-index: 99;
      // 搜索
      .search-box {
        margin-bottom: .15rem;
        /deep/{
          .mint-search {
            height: 100%;
          }
          .mint-searchbar {
            padding:0;
            background-color: #f8f8f8;
            border-radius: 2px;
          }
          // 放大镜
          .mint-searchbar-inner .mintui-search {
            margin-right: 5px;
          }
        }
      }
      // 日期快捷选项
      .date-shortcut-box {
        margin-bottom: .15rem;
        span {
          display: inline-block;
          padding: .05rem .1rem;
          margin-right: .1rem;
          color: #848484;
          border: 1px solid #848484;
        }
        span.active {
          border: 1px solid #333;
        }
      }
      // 日期筛选
      .date-box {
        display: flex;
        align-items: center;
        margin-bottom: .15rem;
        color: #333;
        .filter-date-box {
          display: flex;
          align-items: center;
          .filterDate {
            padding: 0 .1rem;
            color: #848484;
          }
        }
        .picker-head {
          height: 0.4rem;
          border: 1px solid #eaeaea;
          .item {
            text-align: center;
            width: 50%;
            height: 0.4rem;
            line-height: 0.4rem;
            font-size: 0.16rem;
            color: #636363;
          }
        }
      }
      // 地区 + 稿件状态
      div.merge-box {
        display: flex;
        align-items: center;
        // justify-content: space-between;
        // 地区
        .address-box {
          display: flex;
          align-items: center;
          flex:1;
          // margin-bottom: .15rem;
          margin-right: .15rem;
          color: #333;
          .filter-address-box{
            // height: .3rem;
            display: flex;
            align-items: center;
            .filterAddress {
              // padding: 0 .1rem;
              padding-right: .1rem;
              color: #333;
            }
          }
          .picker-head {
            height: 0.4rem;
            border: 1px solid #eaeaea;
            .item {
              text-align: center;
              width: 50%;
              height: 0.4rem;
              line-height: 0.4rem;
              font-size: 0.16rem;
              color: #636363;
            }
          }
        }
        // 稿件状态
        .status-box {
          display: flex;
          align-items: center;
          flex: 1;
          color: #333;
          .filter-status-box {
            display: flex;
            align-items: center;
            .filterStatus {
              // padding: 0 .1rem;
              padding-right: .1rem;
              color: #333;
            }
          }
          .picker-head {
            height: 0.4rem;
            border: 1px solid #eaeaea;
            .item {
              text-align: center;
              width: 50%;
              height: 0.4rem;
              line-height: 0.4rem;
              font-size: 0.16rem;
              color: #636363;
            }
          }
        }
      }
    }
    .filter-box-stick {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }
    .filter-box-sub {
      height: 1.51rem;
      background-color: #f8f8f8;
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
    // 视频列表
    .video-box {
      background: #f8f8f8;
      .video-item {
        position: relative;
        padding: .15rem;
        margin-bottom: .1rem;
        width: 100%;
        background: #fff;
        // 视频播放器
        .video {
          width: 100%;
          height: 2rem;
        }
        .video-info {
          display: flex;
          justify-content: space-between;
          .title {
            padding-top: .1rem;
            padding-bottom: .02rem;
            width: 70%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: .14rem;
            color: #333;
          }
          .operate-btn {
            color: #333;
          }
          /deep/ {
            .mint-popup {
              position: absolute;
              top: 60%;
              width: 100%;
              border-radius: 2px;
              .operation {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: .1rem .15rem 0;
                text-align: center;
                p {
                  padding: .1rem 0;
                  margin-bottom: .1rem;
                  width: 100%;
                  text-align: center;
                  font-size: .12rem;
                  color: #666;
                  // border: 1px solid red;
                  background: #f2f2f2;
                  border-radius: 2px;
                }
              }
            }
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
    .event-item {
      padding: 0.15rem;
      position: relative;
      img {
        width: 100%;
        height: 2rem;
        margin-bottom: 0.1rem;
      }
      .title {
        width: 100%;
        font-size: 0.14rem;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 0.1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .brief {
        font-size: 0.12rem;
        color: rgba(153, 153, 153, 1);
        padding-bottom: 0.15rem;
        border-bottom: 1px solid rgba(240, 240, 240, 1);
      }
      .info-box {
        padding-top: 0.15rem;
        p {
          font-size: 0.12rem;
          color: rgba(153, 153, 153, 1);
          &.detail {
            margin-top: 0.06rem;
            color: #333333;
          }
        }
      }
      .detail-box {
        position: absolute;
        left: 0.7rem;
        bottom: 0.15rem;
        p {
          font-size: 0.12rem;
          color: rgba(77, 150, 255, 1);
          margin-right: 0.08rem;
        }
        .icon {
          width: 0.05rem;
          height: 0.09rem;
          margin-bottom: 0;
        }
      }
    }
    .info-box {
      padding-top: 0.2rem;
      .info-title {
        margin-bottom: 0.24rem;
        .info-border {
          width: 0.05rem;
          height: 0.15rem;
          background-color: rgb(219, 50, 65);
          margin-right: 0.1rem;
        }
        .text {
          font-size: 0.16rem;
          color: #333;
          font-weight: 500;
        }
      }
      .info-item {
        padding-left: 0.12rem;
        position: relative;
        margin-bottom: 0.24rem;
        p {
          font-size: 0.14rem;
          &.left {
            width: 0.42rem;
            height: 0.2rem;
            color: #888888;
            text-align: justify;
            margin-right: 0.25rem;
            i {
              display: inline-block;
              width: 100%;
            }
          }
          &.right {
            color: rgba(51, 51, 51, 1);
            width: 2.58rem;
          }
        }
        .required {
          position: absolute;
          font-size: 0.1rem;
          color: red;
          top: 0.06rem;
          left: 0.06rem;
          transform: translate(-50%, -50%);
        }
        .moreIcon {
          position: absolute;
          right: 0;
          top: 0;
        }
        .lockIcon {
          width: 0.12rem;
          height: 0.15rem;
          position: absolute;
          right: 0.05rem;
        }
        input {
          width: 2.58rem;
          height: 0.2rem;
          font-size: 0.14rem;
          color: rgba(51, 51, 51, 1);
          position: absolute;
          top: -0.06rem;
          left: 0.78rem;
          border: 0;
          &::-webkit-input-placeholder {
            color: #a6a6a6;
            font-size: 0.14rem;
          }
        }
      }
    }
    .confirm-box {
      height: 0.68rem;
      background-color: #e8e8e8;
      position: relative;
      .button {
        width: 3.45rem;
        height: 0.38rem;
        line-height: 0.38rem;
        text-align: center;
        font-size: 0.16rem;
        color: #fff;
        background: rgba(221, 47, 60, 1);
        border-radius: 3px;
      }
    }
  }
  .picker-head {
    height: 0.4rem;
    border: 1px solid #eaeaea;
    .item {
      text-align: center;
      width: 50%;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.16rem;
      color: #636363;
    }
  }
}
</style>
