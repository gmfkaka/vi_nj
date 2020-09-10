// 个人作品列表页 图集
<template>
  <div
    class="wrapper"
    v-wechat-title="'我的作品_视觉南京'"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10"
  >
    <header>
      <div class="list-header flexBox flexBox flexAlign grayBorder" ref="listHeader">
        <i class="backIcon" @click="goBack"></i>
        <div class="title">{{type === 'activity' ? '活动投稿' : '签约投稿'}}</div>
      </div>
    </header>
    <!-- 筛选 + 搜索 -->
    <div class="filter-box" :class="{'filter-box-stick':filterStick}">
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
              src="../../assets/images/common/spread.png"
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
              src="../../assets/images/common/spread.png"
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
    <div class="filter-box-sub" v-if="filterStick"></div>
    <!-- 图集列表 -->
    <div>
      <div v-if="list.length" class="flexBox flexBetween flexWrap p15" style="padding-top:0.15rem;">
        <div
          class="img-item"
          :class="{'mt10':index > 1}"
          v-for="(img,index) in list"
          :key="index"
        >
          <img
            v-if="img.index_pic"
            :src="getImgUrl(img.index_pic,336,200)"
            alt
            @click="goImgDetail(img.origin_id)"
          />
          <img
            v-else
            class="fullImg"
            src="../../assets/images/nodata/list_small.png"
            alt
            @click="goImgDetail(img.origin_id)"
          />
          <div class="img-info">
            <p class="title textEllipsis">{{img.title}}</p>
            <div class="info">
              <p class="date">{{img.created_at.substring(0,10)}}</p>
              <p
                class="title"
                @click="toggleOperation(img)"
                v-if="img.status === -5 || img.status === 4"
              >...</p>
              <mt-popup
                v-model="img.isPopup"
                popup-transition="popup-fade"
                :modal=false
              >
                <div class="operation">
                  <p @click="bring(img)">提审</p>
                  <p @click="edit(img)">编辑</p>
                  <p @click="del(img)">删除</p>
                </div>
              </mt-popup>
            </div>
            <p class="status checking" v-if="img.status === 1">审核中</p>
            <p class="status checked" v-if="img.status === 2">已审核</p>
            <p class="status published" v-if="img.status === 3">已上网</p>
            <p class="status ban" v-if="img.status === 4">已打回</p>
            <p class="status ban" v-if="img.status === -5">待提审</p>
          </div>
        </div>
      </div>
      <img v-else class="no-data-img style1 pt15" src="../../assets/images/nodata/home_list.png" alt />
      <p v-if="!hasMore" class="no-data-text">没有更多了</p>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox, Indicator } from 'mint-ui'
export default {
  name: 'myPublishList',
  data () {
    return {
      type: '',
      page: 1,
      count: 10,
      list: [],
      // 无限加载
      hasMore: false,
      // 区分刷新 无限加载
      isRefresh: true,
      requested: false,
      token: '',
      curPopupId: '',
      // filter-box吸顶
      filterStick: false,
      // listHeader高度
      listHeightHeight: 0,
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
    this.type = this.$route.query.type
    this.token = this.getToken()
    this.isRefresh = true
    this.getContent()
  },
  mounted () {
    this.getProvinceList()
    this.getListHeaderHeight()
    this.onScrollTop()
    // 搜索框“取消”事件
    this.$nextTick(() => {
      let cancel = this.$refs.mtSearch.$el.querySelectorAll('.mint-searchbar-cancel')[0]
      cancel.onclick = () => {
        this.toSearch()
      }
    })
  },
  watch: {
    '$route': 'getContent'
  },
  methods: {
    toSearch () {
      this.isRefresh = true
      this.getContent()
    },
    getContent () {
      let param = {
        access_token: this.getToken(),
        page: this.page,
        per_num: this.count
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
      if (this.type === 'activity') {
        param.act_id = 2
      } else {
        param.act_id = 1
      }
      this.$api.getUserGallery(param).then(res => {
        if (res.data.ErrorCode === 0) {
          // 有搜索内容时，隐藏搜索列表
          if (this.$refs.mtSearch) {
            // console.log(this.$refs.mtSearch.$el.querySelectorAll('.mint-search-list')[0])
            let mintSearchList = this.$refs.mtSearch.$el.querySelectorAll('.mint-search-list')[0]
            mintSearchList.style.display = 'none'
            // console.log(mintSearchList.style.display)
          }
          // if (res.data.data.data.length) {
          this.hasMore = true
          if (this.isRefresh) {
            this.list = res.data.data.data
          } else {
            this.list = this.list.concat(res.data.data.data)
          }
          // popup
          for (let item of this.list) {
            this.$set(item, 'isPopup', false)
          }
          if (res.data.data.data.length < this.count) {
            this.hasMore = false
          } else {
            this.hasMore = true
          }
          if (!res.data.data.data.length) {
            this.hasMore = false
          }
          // } else {
          //   this.hasMore = false
          // }
        }
        // this.requested = true
        this.isRefresh = false
      })
    },
    // 获取 .list-header 高度
    getListHeaderHeight () {
      if (this.$refs.listHeader) {
        // console.log(this.$refs.listHeader.offsetHeight)
        this.listHeightHeight = this.$refs.listHeader.offsetHeight
      }
    },
    // 监听滚动条 距离顶部-滚动距离
    onScrollTop () {
      const THIS = this
      window.addEventListener('scroll', function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop >= parseInt(THIS.listHeightHeight, 10)) {
          THIS.filterStick = true
        } else {
          THIS.filterStick = false
        }
      })
    },
    loadMore () {
      if (this.hasMore) {
        // console.log('++')
        this.page++
        this.getContent()
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
      if (res.id === '002') {
        // 国内
        this.isShowChinaAreaPopup = true
      } else if (res.id === '001') {
        // 全部地区
        this.selectCountryVal = ''
        this.isRefresh = true
        this.getContent()
      }
      this.isShowCountryPopup = false
    },
    // popup 国内 地区
    selectChinaArea () {
      const res = this.$refs['chinaArea-picker'].getValues()
      this.filterAddress = `${res[0].name}-${res[1].name}-${res[2].name}`
      this.selectCountryVal = parseInt(res[2].id, 10)
      this.isShowChinaAreaPopup = false
      this.isRefresh = true
      this.getContent()
    },
    // 选择稿件状态
    selectStatus () {
      const res = (this.$refs['status-picker'].getValues()[0])
      this.filterStatus = res.name
      this.selectStatusVal = res.value
      this.isShowStatusPopup = false
      this.isRefresh = true
      this.getContent()
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
          this.getContent()
        }
      }
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
      this.getContent()
    },
    // 跳转图集详情
    goImgDetail (id) {
      this.$api.getMyGalleryDetail(id).then(res => {
        if (res.data.ErrorText) {
          Toast(res.data.ErrorText)
        } else {
          this.$router.push({ path: '/imgdetail', query: { id } })
        }
      })
    },
    // 切换操作显示
    toggleOperation (item) {
      this.curPopupId = Number(item.origin_id)
      item.isPopup = !item.isPopup
      for (let videoItem of this.list) {
        if (Number(videoItem.origin_id) !== this.curPopupId) {
          videoItem.isPopup = false
        }
      }
    },
    // 操作-提审
    bring (item) {
      const param = {
        id: Number(item.origin_id),
        access_token: this.token
      }
      MessageBox.confirm('确定提审吗?').then(action => {
        this.toggleOperation(item)
        Indicator.open()
        this.$api.auditPhoto(param).then(res => {
          // console.log(res.data)
          if (res && res.data) {
            if (res.data.ErrorText) {
              Toast(res.data.ErrorText)
              Indicator.close()
            } else if (res.data.ErrorCode === 0 && res.data.data) {
              Toast('提审成功')
              Indicator.close()
              this.isrefresh = true
              this.getContent()
            }
          }
        })
      })
    },
    // 操作-编辑
    edit (item) {
      this.$router.push({
        path: '/contribute',
        query: {
          id: item.origin_id,
          tag: 'edit'
        }
      })
    },
    // 操作-删除
    del (item) {
      const param = {
        id: Number(item.origin_id),
        access_token: this.token
      }
      MessageBox.confirm('确定删除吗?').then(action => {
        this.toggleOperation(item)
        Indicator.open()
        this.$api.delPhoto(param).then(res => {
          // console.log(res.data)
          if (res && res.data) {
            if (res.data.ErrorText) {
              Toast(res.data.ErrorText)
              Indicator.close()
            } else if (res.data.ErrorCode === 0 && res.data.data) {
              Toast('删除成功')
              Indicator.close()
              this.isrefresh = true
              this.getContent()
            }
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  position: relative;
  background-color: #f8f8f8;
  min-height: 100%;
  padding-bottom: 0.3rem;
  .mt10 {
    margin-top: 0.1rem;
  }
  .img-item{
    position: relative;
    .info {
      // position: relative;
      /deep/ {
        .mint-popup {
          position: absolute;
          top: 50%;
          width: 100%;
          border-radius: 2px;
          .operation {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: .08rem .08rem 0;
            text-align: center;
            p {
              padding: .06rem 0;
              margin-bottom: .08rem;
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
  // 顶部筛选 搜索
  .filter-box {
    padding: .15rem;
    height: 1.51rem;
    background-color: #f8f8f8;
    font-size: .12rem;
    z-index: 99;
    // border-bottom: 1px solid red;
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
}
</style>
