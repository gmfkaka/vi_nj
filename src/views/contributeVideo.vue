<template>
  <div class="wrapper" v-if="token">
    <div class="top">
      <div class="inner flexBox flexAlign flexBetween p15">
        <img src="../assets/images/detail/back2.png" @click="back" alt />
        <p class="title" style="flex:1;">发视频</p>
        <p class="button" @click="publish">上传</p>
      </div>
    </div>
    <!-- 视频 -->
    <div class="img-box flexBox flexWrap pd15" v-if="(upLoading || upLoadingFinished)">
        <div class="flexBox flexWrap" style="width:100%;">
          <div class="video-item">
            <img class="main-video" :src="videoCover" alt="">
            <!-- <video class="main-video" :src="videoSrc"></video> -->
            <!-- 上传状态 -->
            <div class="upload-mask" v-if="upLoading">
              <div>
                <div style="margin-bottom:0.1rem;">
                  <!-- <img style="width:0.15rem;height:0.15rem;margin-right:0.05rem;" src="../assets/images/contribute/loading.gif" alt /> -->
                  <p style="font-size:0.16rem;">上传中（{{videoProgress}}%）</p>
                </div>
                <mt-progress :value="videoProgress" :bar-height="4"></mt-progress>
              </div>
            </div>
            <!-- 上传完成 -->
            <div class="finish-mask" v-if="upLoadingFinished">
              <img src="../assets/images/contribute/bofang.png" alt="">
              <div class="info-box">
                <p>{{videoSize}}</p>
                <p>{{videoDuration}}</p>
              </div>
            </div>
          </div>
        </div>
    </div>
    <!-- 填写信息 -->
    <div class="main">
      <div class="cover-box flexBox flexAlign flexBetween" v-if="!upLoading && !upLoadingFinished">
        <p>请选择视频</p>
        <img @click="selectVideo" src="../assets/images/contribute/add_small.png" alt class="icon" />
      </div>
      <!-- 图片input -->
      <input
        v-if="isShowInput"
        style="display: none;"
        @change="fileChange($event)"
        type="file"
        ref="file"
        accept="video/*"
      />
      <div class="cover-box flexBox flexAlign flexBetween">
        <p>封面图片</p>
        <img v-if="videoCover" :src="videoCover" class="video" alt="">
        <!-- <img v-if="videoCover" :src="videoCover" class="video" alt="">
        <img v-else @click="selectCover" src="../assets/images/contribute/add_small.png" alt class="icon" /> -->
      </div>
      <!-- 封面input -->
      <input
        v-if="isShowInput"
        style="display: none;"
        @change="coverChange($event)"
        type="file"
        ref="cover"
        accept="image/*"
        multiple="multiple"
      />
      <div class="info-item flexBox">
        <p class="left">视频名称<i></i></p>
        <input type="text" placeholder="请输入视频名称" v-model="title" />
        <span class="required">*</span>
      </div>
      <div class="info-item flexBox" style="align-items:center;">
        <p class="left">添加标签<i></i></p>
        <div class="flexBox flexWrap" style="width:2.58rem;">
          <div v-for="(item,idx) in tagList" :key="idx" class="tag-item">
            {{item}}
            <img class="icon" src="../assets/images/contribute/delete.png" @click.stop="deleteTag(idx)" />
          </div>
          <div class="tag-item add-icon" @click="openTags">+</div>
        </div>
        <!-- <p class="right">{{addingTag}}</p>
        <i class="moreIcon"></i> -->
      </div>
      <div class="info-item flexBox" @click="openPicker">
        <p class="left">拍摄时间<i></i></p>
        <p class="right">{{time}}</p>
        <i class="moreIcon"></i>
      </div>
      <div class="info-item flexBox" @click="chinaVisible = true">
        <p class="left">拍摄地点<i></i></p>
        <p class="right">{{area}}</p>
        <i class="moreIcon"></i>
      </div>
      <div class="info-item flexBox">
        <p class="left">添加描述<i></i></p>
        <input type="text" placeholder="请输入描述" v-model="brief" />
      </div>
    </div>
    <!-- 地区选择框 国内外 -->
    <mt-popup v-model="chinaVisible" position="bottom">
      <div class="picker-head flexBox">
        <p class="item" @click="chinaVisible = false">取消</p>
        <p class="item" @click="chooseChina">确认</p>
      </div>
      <mt-picker :slots="chinaSlots" style="width:3.75rem;" ref="china-picker"></mt-picker>
    </mt-popup>
    <!-- 弹出层 地区选择框 -->
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
    <!-- 弹出层 增加标签 -->
    <mt-popup class="tag-mask" v-model="addTagsVisible" pop-transition="popup-fade" :modal="false">
      <div class="top">
        <div class="inner flexBox flexAlign flexBetween p15">
          <p class="title" style="line-height:0.2rem;">标签</p>
          <img src="../assets/images/detail/back2.png" @click="closeTags" alt />
          <p class="button" @click="closeTags">取消</p>
        </div>
      </div>
      <div class="tag-main">
        <input type="text" placeholder="添加标签(多个标签间可用空格隔开)" v-model="addingTag"/>
        <div class="button" @click="addTags">完成</div>
      </div>
    </mt-popup>
    <!-- 弹出层 选择日期 -->
    <mt-datetime-picker
      class="date-mask"
      ref="picker"
      type="date"
      :startDate="new Date('1901-01-01')"
      :endDate="new Date()"
      v-model="pickerValue"
      @confirm="handleDate"
    ></mt-datetime-picker>
    <!-- 弹出层 上传中 -->
    <div class="submit-mask" v-if="submiting">
      <p>上传中，请耐心等待…</p>
      <mt-progress :value="submitProgress" :bar-height="10"></mt-progress>
    </div>
  </div>
</template>
<script>
import { Toast, MessageBox, Indicator } from 'mint-ui'
export default {
  name: 'contribute',
  components: {
    Toast
  },
  data () {
    return {
      id: '',
      token: '',
      loading: false,
      submitAble: true,
      addTagsVisible: false,
      imgList: [],
      title: '',
      brief: '',
      area: '',
      time: '',
      addingTag: '',
      tagList: [],
      isShowInput: true,
      progress: 0,
      pickerValue: new Date(),
      published: false,
      uploadImgList: [],
      coverList: [],
      upLoading: false, // 是否上传中
      upLoadingFinished: false, // 是否上传完成，
      submiting: false,
      submitProgress: 0,
      videoDuration: '',
      videoSize: '',
      videoSrc: '',
      videoFile: null,
      videoProgress: 0,
      videoId: 1, // 视频稿件id
      videoCover: '',
      china: 1, // 1国内 0国外
      videoInfo: {},
      onLine: navigator.onLine,
      // 国内外选择框
      chinaVisible: false,
      chinaSlots: [
        {
          flex: 1,
          values: ['国内', '国外'],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      // 地区选择
      areaVisible: false,
      addressStr: '',
      areaSlots: [
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
      // 编辑详情
      editInfo: {}
    }
  },
  computed: {
    tags () {
      return this.tagList.join(',')
    }
  },
  methods: {
    // 返回 提示
    back () {
      if (this.videoInfo.hash_id && !this.published) {
        MessageBox.confirm('页面内容尚未保存，确定要离开吗?').then(action => {
          if (action === 'confirm') {
            this.$router.go(-1)
          }
        })
      } else {
        this.$router.go(-1)
      }
    },
    // 打开标签弹层
    openTags () {
      // console.log(this.tagList)
      // this.addTagsVisible = true
      if (this.tagList.length === 15) {
        Toast('最多添加15个标签！')
        return
      }
      MessageBox.prompt('请输入标签').then(({ value, action }) => {
        if (action === 'confirm') {
          // 去首尾空格
          value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
          if (value.length >= 10) {
            Toast('标签不能超过10个字')
          } else {
            this.tagList.push(value)
          }
        }
      })
    },
    // 关闭标签弹层
    closeTags () {
      this.addTagsVisible = false
      this.addingTag = ''
    },
    // 添加标签
    addTags () {
      // 去首尾空格
      this.addingTag = this.addingTag.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      this.tagList = this.addingTag.split(' ')
      if (this.tagList.length === 15) {
        MessageBox('提示', '最多添加15个标签！')
        return
      }
      this.addTagsVisible = false
    },
    // 删除标签
    deleteTag (index) {
      this.tagList.splice(index, 1)
    },
    // 触发图片选择
    selectVideo () {
      this.$refs.file.click()
    },
    // 触发封面选择
    selectCover () {
      this.$refs.cover.click()
    },
    // 处理视频选择
    fileChange ($event) {
      const _this = this
      this.loading = true
      const files = _this.$refs.file.files[0]
      this.videoFile = files
      // console.log(files)
      if (files.size >= 2000000000) {
        Toast('上传的视频不能大于2G，请重新上传')
        return
      }
      this.videoSize = this.getfilesize(files.size) // 获取文件大小
      // 获取视频时长
      const url = URL.createObjectURL(files)
      const audioElement = new Audio(url)
      audioElement.addEventListener('loadedmetadata', function (_event) {
        _this.videoDuration = _this.intervalTime(parseInt(audioElement.duration))
      })
      this.videoSrc = URL.createObjectURL(files)
      this.upLoading = true
      // 上传视频
      let formData = new FormData()
      formData.append('file', this.videoFile)
      formData.append('access_token', this.token)
      formData.append('setting_ids', 1)
      formData.append('is_transcode', 1)
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          let per = ((progressEvent.loaded / progressEvent.total) * 100) | 0
          if (per === 100) {
            this.videoProgress = 99 // 最后一步服务器等待时间较长 此时先将进度条置为99%
          } else {
            this.videoProgress = per
          }
        }
      }
      this.$api.uploadVideo(formData, config).then(res => {
        if (res.data.hash_id) {
          this.videoInfo = res.data
          this.videoCover = this.videoInfo.index_pic_url
          this.upLoading = false
          this.upLoadingFinished = true
        }
      })
    },
    // 处理封面选择
    coverChange ($event) {
      const files = this.$refs.cover.files[0]
      let formData = new FormData()
      formData.append('access_token', this.token)
      formData.append('file', files)
      this.$api.uploadCover(formData).then(res => {
        if (res.data.ErrorCode === 0) {
          this.videoCover = res.data.data.url
          const data = {
            origin_url: res.data.data.url,
            cut_url: res.data.data.url,
            origin_cover: res.data.data.key,
            cut_cover: res.data.data.key,
            chosed: true
          }
          this.coverList[0] = data
        }
      })
    },
    // 打开日期选择器
    openPicker () {
      this.$refs.picker.open()
    },
    // 选择国内外
    chooseChina () {
      if (this.$refs['china-picker'].getValues()[0] === '国外') {
        this.area = '国外'
        this.china = 0
        this.chinaVisible = false
      } else {
        this.chinaVisible = false
        this.areaVisible = true
        this.china = 1
      }
    },
    // 获取省级列表
    getAreaList () {
      this.$api.getAreaList('pro').then(res => {
        if (res.data.data.length) {
          this.areaSlots[0].values = res.data.data
        }
      })
    },
    // 监听省份选择变动 同步请求接口
    onAreaChange (picker, values) {
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
    // 确认地区选择
    chooseArea () {
      const res = this.$refs['area-picker'].getValues()
      this.area = `${res[0].name}-${res[1].name}-${res[2].name}`
      let obj = {
        pro_id: res[0].id,
        pro_name: res[0].name,
        city_id: res[1].id,
        city_name: res[1].name,
        area_id: res[2].id,
        area_name: res[2].name
      }
      this.addressStr = JSON.stringify(obj)
      this.areaVisible = false
    },
    // 选择拍摄日期
    handleDate (data) {
      let d = new Date(data)
      this.time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    },
    // 提交
    publish () {
      if (!this.videoInfo.hash_id) {
        Toast('视频还未上传完成！')
        return
      }
      if (!this.title) {
        Toast('标题不能为空！')
        return
      }
      let formData = new FormData()
      formData.append('access_token', this.token)
      formData.append('author', this.getCookie('author'))
      formData.append('title', this.title)
      formData.append('info', JSON.stringify(this.videoInfo))
      // 描述
      if (this.brief) {
        formData.append('brief', this.brief)
      }
      // 关键词
      if (this.tagList.length) {
        formData.append('keywords', this.tagList.join(','))
      }
      // 拍摄时间
      if (this.time) {
        formData.append('shoot_time', this.time)
      }
      // 国外
      if (this.china === 0) {
        formData.append('china', 0)
      }
      // 选择地区
      if (this.addressStr) {
        formData.append('area', this.addressStr)
      }
      // 自选封面
      if (this.coverList.length) {
        formData.append('cover_type', 1)
        formData.append('cover_keys', JSON.stringify(this.coverList))
      }
      this.submiting = true
      let config = {
        onUploadProgress: progressEvent => {
          this.submitProgress = ((progressEvent.loaded / progressEvent.total) * 100) | 0
        }
      }
      if (this.id) {
        // 编辑提交
        const param = {
          access_token: this.token,
          author: this.getCookie('author'),
          title: this.title,
          brief: this.brief ? this.brief : '',
          shoot_time: this.time ? this.time : '',
          keywords: this.tagList.length > 0 ? this.tagList.join(',') : '',
          // cover_keys: JSON.stringify(this.editInfo.cover_keys),
          id: this.id
        }
        // 地区
        if (this.addressStr && this.china !== 0) {
          param.area = this.addressStr
        }
        if (this.china === 0) {
          param.china = 0
        }
        this.$api.updateVideo(param).then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
          }
          if (res.data.data === 'success') {
            this.submiting = false
            this.published = true
            Toast('编辑成功！')
            setTimeout(() => {
              this.$router.push('/homemy')
            }, 1000)
          }
        })
      } else {
        // 创建提交
        this.$api.createVideo(formData, config).then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
          }
          if (res.data.data === 'success') {
            this.submiting = false
            this.published = true
            Toast('提交成功！')
            setTimeout(() => {
              this.$router.push('/homemy')
            }, 1000)
          }
        })
      }
    },
    // 转换视频时间为时分秒
    intervalTime  (interval, format) {
      format = format || 'min:sec'
      return format
        .replace('min', this.operateTime(Math.floor(interval / 60)))
        .replace('sec', this.operateTime(Math.floor(interval % 60)))
    },
    operateTime (time) {
      return time < 10 ? '0' + time : time
    },
    // 转换文件大小
    getfilesize (size) {
      if (!size) { return '' }
      var num = 1024.00 // byte
      if (size < num) { return size + 'B' }
      if (size < Math.pow(num, 2)) { return (size / num).toFixed(2) + 'K' } // kb
      if (size < Math.pow(num, 3)) { return (size / Math.pow(num, 2)).toFixed(2) + 'M' } // M
      if (size < Math.pow(num, 4)) { return (size / Math.pow(num, 3)).toFixed(2) + 'G' } // G
      return (size / Math.pow(num, 4)).toFixed(2) + 'T' // T
    },
    // 上传过程中断网提示
    offlineTip () {
      if (this.upLoading) {
        Toast('网络超时')
      }
    },
    // 获取编辑详情
    getDetail () {
      Indicator.open()
      const param = {
        id: this.id,
        access_token: this.token
      }
      this.$api.getVideoDetail(param.id).then(res => {
        if (res && res.data) {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
            Indicator.close()
          } else if (res.data.data) {
            this.editInfo = {...res.data.data}
            Indicator.close()
            // console.log('this.editInfo', this.editInfo)
            // 处理编辑数据
            // 视频部分
            this.upLoadingFinished = true
            this.videoCover = this.editInfo.index_pic
            this.videoSize = this.editInfo.size_format
            this.videoDuration = this.editInfo.duration_format
            this.videoInfo.hash_id = this.editInfo.hash_id
            // 标题
            this.title = this.editInfo.title
            // 标签
            this.tagList = this.editInfo.keywords ? this.editInfo.keywords.split(',') : []
            // 拍摄时间
            let tempTime = this.editInfo.shoot_time ? new Date(this.editInfo.shoot_time) : ''
            if (!tempTime || !tempTime.getFullYear()) {
              this.time = ''
            } else {
              this.time = tempTime.getFullYear() + '-' + (tempTime.getMonth() + 1) + '-' + tempTime.getDate()
            }
            // 拍摄地点
            // console.log(!this.editInfo.area && this.editInfo.area !== '')
            let tempArea = this.editInfo.area ? JSON.parse(this.editInfo.area) : ''
            if (this.editInfo.area && tempArea.pro_id) {
              this.area = `${tempArea.pro_name}-${tempArea.city_name}-${tempArea.area_name}`
              this.addressStr = this.editInfo.area
            } else if (this.editInfo.area === '') {
              this.area = '国外'
              this.china = 0
            } else if (this.editInfo.area && !tempArea.pro_id) {
              this.area = ''
            }
            // 描述
            this.brief = this.editInfo.brief ? this.editInfo.brief : ''
          }
        }
      })
    }
  },
  created () {
    this.id = this.$route.query.id
    this.token = this.getToken()
    !this.token && this.$router.push('/login')
    if (this.id) this.getDetail()
  },
  mounted () {
    this.getAreaList()
    window.addEventListener('offline', this.offlineTip) // 检测断网
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  // min-height: 100%;
  .top {
    height: 0.64rem;
    background-color: #fff;
    padding-top: 0.3rem;
    padding-bottom: 0.12rem;
    .title {
      line-height: 0.22rem;
      font-size: 0.16rem;
      text-align: center;
      width: 100%;
      position: absolute;
      left: 0;
      color: #333;
    }
    .button {
      color: #dd2f3c;
      font-size: 0.14rem;
      z-index: 999;
    }
    img {
      width: 0.11rem;
      height: 0.19rem;
      z-index: 999;
    }
  }
  .img-box {
    background: rgba(248, 248, 248, 1);
    .tips{
        font-size: 0.12rem;
        color: #888888;
        margin-bottom: 0.1rem;
    }
    &.pd15{
      padding: 0.15rem;
    }
    .video-item {
      width: 100%;
      height: 1.93rem;
      margin-bottom: 0.04rem;
      position: relative;
      .main-video {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
      .del {
        width: 0.14rem;
        height: 0.14rem;
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
      }
      .upload-mask {
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 0.73rem;
        /deep/ {
          .mt-progress {
            width: 2.35rem;
            margin: 0 auto;
            height: 0.15rem;
            line-height: 0.15rem;
            .mt-progress-progress {
              background-color: #dd2f3c;
            }
          }
        }
        p {
          text-align: center;
          font-size: 0.12rem;
          color: #fff;
        }
      }
      .finish-mask{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: 0.44rem;
          height: 0.44rem;
        }
        .info-box{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.1rem;
          display: flex;
          justify-content: space-between;
          p{
            color: #fff;
            font-size: 0.14rem;
          }
        }
      }
    }
  }
  .main {
    padding: 0.3rem 0.15rem 0.15rem;
    .cover-box {
      padding-left: 0.14rem;
      margin-bottom: 0.24rem;
      height: 0.4rem;
      p {
        font-size: 0.12rem;
        color: #888888;
      }
      .icon {
        width: 0.4rem;
        height: 0.4rem;
      }
      .video{
        width: 0.4rem;
        height: 0.4rem;
        object-fit: fill;
      }
    }
    .info-item {
      .left {
        width: 0.58rem !important;
      }
      input {
        left: 0.9rem !important;
        width: 2.5rem !important;
        border: 0;
        background-color:transparent;
        FILTER: alpha(opacity=0);
      }
      .info-icon {
        width: 0.18rem;
        height: 0.18rem;
        position: absolute;
        right: 0;
        top: 0;
      }
      .tag-item{
        background: #f2f6f9;
        border-radius: 10px;
        padding: 0.02rem 0.12rem;
        font-size: 0.14rem;
        color: #666;
        line-height: 0.2rem;
        text-align: center;
        margin-right: 0.08rem;
        margin-bottom: 0.08rem;
        position: relative;
        .icon{
          width: 0.1rem;
          height: 0.1rem;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .add-icon{
        font-size: 0.18rem;
      }
    }
  }
  .button-box {
    .item {
      width: 100%;
      height: 0.38rem;
      line-height: 0.38rem;
      margin-bottom: 0.3rem;
      background: rgba(221, 47, 60, 1);
      border-radius: 3px;
      font-size: 0.16rem;
      text-align: center;
      color: #fff;
    }
  }
  .tag-mask {
    width: 100%;
    height: 100%;
    .tag-main {
      background-color: rgb(248, 248, 248);
      min-height: 6.03rem;
      input {
        width: 100%;
        height: 0.45rem;
        margin: 0.1rem 0;
        padding: 0.12rem 0.15rem;
        box-sizing: border-box;
        font-size: 0.14rem;
        border: 0;
        &::-webkit-input-placeholder {
          color: #a6a6a6;
          font-size: 0.14rem;
        }
      }
      .button {
        background: rgba(221, 47, 60, 1);
        border-radius: 3px;
        width: 3.45rem;
        height: 0.38rem;
        line-height: 0.38rem;
        text-align: center;
        color: #fff;
        font-size: 0.16rem;
        margin: 0 auto;
      }
    }
  }
  .confirm-mask {
    width: 2.75rem;
    height: 1.72rem;
    border-radius: 2px;
    img {
      width: 0.24rem;
      height: 0.24rem;
      display: block;
      margin: 0.26rem auto 0.18rem;
    }
    .title {
      font-size: 0.14rem;
      color: #333;
      text-align: center;
      margin-bottom: 0.32rem;
    }
    .button-box {
      padding: 0 0.64rem;
      .item {
        width: 0.64rem;
        height: 0.32rem;
        line-height: 0.32rem;
        font-size: 0.13rem;
        &.cancel {
          border: 1px solid rgba(196, 196, 196, 1);
          background-color: #fff;
          color: #c4c4c4;
        }
      }
    }
  }
  .date-mask {
    /deep/ {
      .mint-datetime-action {
        color: rgb(99, 99, 99);
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
  .submit-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p{
      font-size: 0.16rem;
      margin-bottom: 0.2rem;
      color: #fff;
    }
    /deep/ {
      .mt-progress {
        width: 2.55rem;
        margin: 0 auto;
        height: 0.15rem;
        line-height: 0.15rem;
        .mt-progress-runway{
          border-radius: 10px;
        }
        .mt-progress-progress {
          background-color: #dd2f3c;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>
