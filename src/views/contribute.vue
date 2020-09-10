<template>
  <div class="wrapper" v-if="token">
    <div class="top">
      <div class="inner flexBox flexAlign flexBetween p15">
        <p class="title">{{id ? '活动投稿' : '投稿'}}</p>
        <img src="../assets/images/detail/back2.png" @click="back" alt />
      </div>
    </div>
    <!-- 图片 -->
    <div class="img-box flexBox flexWrap" :class="{'pd15':imgList.length}">
      <!-- <p class="drag-btn">开启排序</p> -->
      <p
        style="width:100%;"
        class="tips"
      >
        <span v-if="imgList.length">开启排序后，长按图片可拖动排序</span>
        <span
          class="drag-btn"
          v-if="imgList.length && !isDraggable"
          @click="openDraggable"
        >开启排序</span>
        <span
          class="drag-btn"
          v-if="isDraggable"
          @click="closeDraggable"
        >关闭排序</span>
      </p>
      <!-- 图片可拖动排序 -->
      <draggable v-model="imgList" v-if="isDraggable">
        <transition-group class="flexBox flexWrap">
          <div
            class="img-item"
            :class="{'ml4':index % 3 !== 0}"
            v-for="(item,index) in imgList"
            @click="toggleCover(index)"
            :key="item.id"
          >
            <img class="main-img" :src="item.src" alt />
            <!-- 上传状态 -->
            <div class="upload-mask">
              <div v-if="!item.ifComplete">
                <mt-progress :value="item.progress" :bar-height="4"></mt-progress>
                <div style="display:flex;align-items:center;justify-content:center;">
                  <img style="width:0.15rem;height:0.15rem;margin-right:0.05rem;" src="../assets/images/contribute/loading.gif" alt />
                  <p>上传中</p>
                </div>
              </div>
              <p v-else style="margin-top:0.48rem;">上传完成</p>
            </div>
            <img
              class="del"
              @click.stop="deleteImg(index,item)"
              src="../assets/images/contribute/delete.png"
              alt
            />
          </div>
        </transition-group>
      </draggable>
      <!-- 图片不可排序 -->
      <transition-group class="flexBox flexWrap" v-else>
        <div
          class="img-item"
          :class="{'ml4':index % 3 !== 0}"
          v-for="(item,index) in imgList"
          @click="toggleCover(index)"
          :key="item.id"
        >
          <img class="main-img" :src="item.src" alt />
          <!-- 上传状态 -->
          <div class="upload-mask">
            <div v-if="!item.ifComplete">
              <mt-progress :value="item.progress" :bar-height="4"></mt-progress>
              <div style="display:flex;align-items:center;justify-content:center;">
                <img style="width:0.15rem;height:0.15rem;margin-right:0.05rem;" src="../assets/images/contribute/loading.gif" alt />
                <p>上传中</p>
              </div>
            </div>
            <p v-else style="margin-top:0.48rem;">上传完成</p>
          </div>
          <img
            class="del"
            @click.stop="deleteImg(index,item)"
            src="../assets/images/contribute/delete.png"
            alt
          />
        </div>
      </transition-group>
      <!-- 图片input -->
      <input
        v-if="isShowInput"
        style="display: none;"
        @change="fileChange($event)"
        type="file"
        ref="file"
        accept="image/*"
        multiple="multiple"
      />
    </div>
    <!-- 填写信息 -->
    <div class="main">
      <div class="cover-box flexBox flexAlign flexBetween">
        <p>请选择图片</p>
        <img @click="selectPic" src="../assets/images/contribute/add_small.png" alt class="icon" />
      </div>
      <div class="info-item flexBox">
        <p class="left">标题<i></i></p>
        <input type="text" placeholder="请输入标题" v-model="title" />
        <span class="required">*</span>
      </div>
      <div class="info-item flexBox">
        <p class="left">描述<i></i></p>
        <input type="text" placeholder="请输入描述" v-model="brief" />
        <span class="required">*</span>
      </div>
      <div class="info-item flexBox" @click="chinaVisible = true">
        <p class="left">地区<i></i></p>
        <p class="right">{{area}}</p>
        <i class="moreIcon"></i>
      </div>
      <div class="info-item flexBox" style="align-items:center;">
        <p class="left">标签<i></i></p>
        <div style="width:2.58rem;display:flex;flex-wrap:wrap;">
          <div v-for="(item,idx) in tagList" :key="idx" class="tag-item">
            {{item}}
            <img class="icon" src="../assets/images/contribute/delete.png" @click.stop="deleteTag(idx)" />
          </div>
          <div class="tag-item add-icon" @click="openTags">+</div>
        </div>
        <!-- <p class="right">{{addingTag}}</p>
        <i class="moreIcon"></i> -->
      </div>
      <div class="info-item flexBox" style="margin-bottom:0;" @click="openPicker">
        <p class="left">拍摄时间<i></i></p>
        <p class="right">{{time}}</p>
        <i class="moreIcon"></i>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="button-box p15 flexBox flexBetween" v-if="submitAble">
      <p class="item" @click="publish">提交</p>
    </div>
    <!-- 按钮 -->
    <div class="button-box p15 flexBox flexBetween" v-else>
      <p class="item" style="background:#e0777f;">提交</p>
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
    <!-- 弹出层 设置封面 -->
    <mt-popup v-model="coverVisible" popup-transition="popup-fade" class="cover-mask">
      <div class="cover-top">
        <img
          class="back alignCenter"
          @click="toggleCover(coverIndex-1)"
          src="../assets/images/detail/back.png"
          alt
        />
        {{`${coverIndex}/${imgList.length}`}}
        <p class="del" @click="deleteImg(coverIndex-1)">删除</p>
      </div>
      <div class="swiper-box">
        <swiper :options="swiperOption" ref="mySwiper" v-show="imgList.length && coverVisible">
          <swiper-slide v-for="(item,index) in imgList" :key="index">
            <img style="width:100%;" :src="item.src" alt />
          </swiper-slide>
        </swiper>
      </div>
      <div class="cover-bottom" v-if="imgList.length && coverVisible">
        <div class="input-box flexBox flexAlign">
          <p>描</p>
          <p>述</p>
          <input type="text" placeholder="添加描述" v-model="imgList[coverIndex-1].upLoadData.brief" />
        </div>
        <div class="set-box flexBox flexAlign">
          <img
            v-if="!imgList[coverIndex-1].upLoadData.ifCoverSet"
            @click="setCover(imgList[coverIndex-1])"
            src="../assets/images/contribute/set_cover.png"
            alt
          />
          <img
            v-else
            @click="setCover(imgList[coverIndex-1])"
            src="../assets/images/contribute/set_covered.png"
            alt
          />
          <p>设为封面</p>
        </div>
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
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Toast, MessageBox, Indicator } from 'mint-ui'
import draggable from 'vuedraggable'
export default {
  name: 'contribute',
  components: {
    draggable,
    Toast,
    swiper,
    swiperSlide
  },
  data () {
    const that = this
    return {
      // 是否开启排序
      isDraggable: false,
      ifCovering: false,
      token: '',
      loading: false,
      id: '',
      submitAble: true,
      addTagsVisible: false,
      coverVisible: false,
      coverIndex: 1,
      imgList: [],
      title: '',
      brief: '',
      area: '',
      time: '',
      addingTag: '',
      tagList: [],
      isShowInput: true,
      progress: 0,
      ifCoverSet: false,
      pickerValue: new Date(),
      published: false,
      uploadImgList: [],
      coverList: [],
      china: 1, // 1国内 0国外
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
      swiperOption: {
        direction: 'horizontal',
        observer: true,
        observeParents: true,
        loop: true,
        autoplay: false,
        slidesPerView: 'auto',
        centeredSlides: true,
        on: {
          slideChangeTransitionStart: function () {
            that.coverIndex = this.realIndex + 1
          }
        }
      },
      // 编辑详情
      editInfo: {},
      tag: '',
      category_id: 0,
      author: '',
      delete_ids: [],
      // 新增提交 cover_keys
      new_cover_keys: []
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
      if (!this.published && this.title) {
        MessageBox.confirm('页面内容尚未保存，确定要离开吗?').then(action => {
          if (action === 'confirm') {
            this.$router.go(-1)
          }
        })
      } else {
        this.$router.go(-1)
      }
    },
    openDraggable () {
      this.isDraggable = true
    },
    closeDraggable () {
      this.isDraggable = false
    },
    // 打开标签弹层
    openTags () {
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
    selectPic () {
      this.$refs.file.click()
    },
    // 处理选择图片 上传获取图片地址
    fileChange ($event) {
      this.loading = true
      let nowIndex = this.imgList.length
      const _this = this
      let files = _this.$refs.file.files
      // console.log('files', _this.$refs.file.files)
      for (let i = 0; i < files.length; i++) {
        let target = 500 / (files[i].size / 1000) // 10s理论应该达到的百分比
        // console.log(target)
        // let reader = new FileReader()
        // reader.readAsDataURL(files[i])
        // reader.onloadend = function () {
        //   _this.imgList.push({
        //     id: _this.imgList.length,
        //     brief: '',
        //     src: this.result,
        //     fileSrc: files[i],
        //     progress: 0,
        //     upLoadData: {}, // 上传需要的格式
        //     ifComplete: false,
        //     targetPecent: target
        //   })
        // }
        _this.imgList.push({
          id: _this.imgList.length,
          brief: '',
          src: URL.createObjectURL(files[i]),
          fileSrc: files[i],
          progress: 0,
          upLoadData: {}, // 上传需要的格式
          ifComplete: false,
          targetPecent: target
        })
        // 上传单张图片
        let formData = new FormData()
        formData.append('file', files[i])
        formData.append('access_token', this.token)
        let config = {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: progressEvent => {
            let complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0
            if (files.length === 1) {
              _this.imgList[nowIndex].progress = complete === 100 ? 99 : complete
            } else {
              _this.imgList[nowIndex + i].progress = complete === 100 ? 99 : complete
            }
          }
        }
        this.$api.uploadGallery(formData, config).then(res => {
          this.loading = false
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
          }
          if (res.data.ErrorCode === 0) {
            if (files.length === 1) {
              _this.imgList[nowIndex].ifComplete = true
              res.data.data.ifCoverSet = false
              _this.imgList[nowIndex].upLoadData = res.data.data
              _this.imgList[nowIndex].upLoadData.brief = ''
            } else {
              _this.imgList[nowIndex + i].ifComplete = true
              res.data.data.ifCoverSet = false
              _this.imgList[nowIndex + i].upLoadData = res.data.data
              _this.imgList[nowIndex + i].upLoadData.brief = ''
            }
          }
        })
        // console.log('_this.imgList', _this.imgList)
      }
      // 防止相同的图片删除后无法再次添加
      this.isShowInput = false
      setTimeout(() => {
        this.isShowInput = true
      }, 10)
    },
    // 删除图片
    deleteImg (index, item) {
      MessageBox.confirm('确定要删除该图片吗?').then(action => {
        this.imgList.splice(index, 1)
        this.delete_ids.push(item.id)
        // 处理选择封面图2数字
        if (this.coverIndex !== 1) {
          this.coverIndex--
        }
      })
    },
    // 切换显示封面弹层
    toggleCover (index) {
      if (!this.loading) {
        this.coverIndex = index + 1
        this.swipe.slideTo(index)
      }
      this.coverVisible = !this.coverVisible
    },
    // 监听封面下标变动
    handleChange (index) {
      this.coverIndex = index + 1
    },
    // 设为封面
    setCover (item) {
      // console.log(item)
      // new_cover_keys
      let tempCover = {
        origin_url: item.upLoadData.photo_url,
        cut_url: item.upLoadData.photo_url,
        origin_cover: item.upLoadData.photo_key,
        cut_cover: item.upLoadData.photo_key,
        chosed: true
      }
      this.new_cover_keys = []
      this.new_cover_keys.push(tempCover)
      // console.log('//', tempCover)
      this.ifCovering = true
      // Indicator.open({
      //   text: '设置封面中...',
      //   spinnerType: 'fading-circle'
      // })
      this.imgList.forEach((vv) => {
        vv.upLoadData.ifCoverSet = item.id == vv.id
      })
      if (item.upLoadData.ifCoverSet && !this.id && !this.tag) {
        let formData = new FormData()
        formData.append('access_token', this.token)
        formData.append('file', this.imgList[this.coverIndex - 1].fileSrc)
        this.$api.uploadCover(formData).then(res => {
          if (res.data.ErrorCode === 0) {
            const data = {
              origin_url: res.data.data.url,
              cut_url: res.data.data.url,
              origin_cover: res.data.data.key,
              cut_cover: res.data.data.key,
              chosed: true
            }
            this.coverList[0] = data
            this.ifCovering = false
            Indicator.close()
          }
        })
      }
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
      if (!this.title) {
        Toast('标题不能为空！')
        return
      }
      if (!this.brief) {
        Toast('描述不能为空！')
        return
      }
      if (!this.imgList.length) {
        Toast('至少上传一张图片！')
        return
      }
      if (!this.coverList.length) {
        if (!this.ifCovering) {
          Toast('请点击图片设置封面图！')
        }
        return
      }
      let photos = []
      this.imgList.forEach(ele => {
        if (ele.upLoadData) {
          photos.push(ele.upLoadData)
        } else {
          photos.push(ele)
        }
      })
      // console.log('pho', photos)
      photos.sort(this.compare('order_id')) // 按上传返回顺序排序
      let param = {
        access_token: this.token,
        title: this.title,
        brief: this.brief,
        photos: JSON.stringify(photos),
        cover_type: 1,
        cover_keys: JSON.stringify(this.coverList)
      }
      // 关键词
      if (this.tagList.length) {
        param.keywords = this.tagList.join(',')
      }
      // 拍摄时间
      if (this.time) {
        param.shoot_time = this.time
      }
      // 国外
      if (this.china === 0 && !this.addressStr) {
        param.china = 0
        param.area = ''
      }
      // 选择地区
      if (this.addressStr) {
        param.china = 1
        param.area = this.addressStr
      }
      // 是活动投稿
      if (this.id && !this.tag) {
        param.act_id = this.id
      }
      // 编辑
      if (this.id && this.tag) {
        param.atlas_id = this.id
      }
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      if (this.id && this.tag) {
        // 编辑提交
        // console.log('param', param)
        // cover_keys
        param.cover_keys = []
        // this.coverList.forEach(item => {
        //   let tempItem = {}
        //   tempItem.cut_cover = item.cut_cover
        //   tempItem.cut_url = item.cut_url
        //   tempItem.origin_cover = item.origin_cover
        //   tempItem.origin_url = item.origin_url
        //   param.cover_keys.push(tempItem)
        // })
        // console.log('提交', this.new_cover_keys)
        this.new_cover_keys.forEach(item => {
          let tempItem = {}
          tempItem.cut_cover = item.cut_cover
          tempItem.cut_url = item.cut_url
          tempItem.origin_cover = item.origin_cover
          tempItem.origin_url = item.origin_url
          param.cover_keys.push(tempItem)
        })
        param.cover_keys = JSON.stringify(param.cover_keys)
        // console.log(param.cover_keys)
        // photos
        param.photos = []
        // console.log('this.imgList', this.imgList)
        this.imgList.forEach(item => {
          let tempItem = {}
          tempItem.photo_url = item.photo_url || item.upLoadData.photo_url
          tempItem.photo_key = item.photo_key || item.upLoadData.photo_key
          tempItem.material_id = item.material_id || item.upLoadData.material_id
          tempItem.photo_name = item.photo_name || item.upLoadData.photo_name
          tempItem.id = item.upLoadData.id || item.id
          tempItem.order_id = item.order_id || item.upLoadData.order_id
          tempItem.brief = item.brief || item.upLoadData.brief
          // tempItem.tags = (item.tags && item.tags.length > 0) ? item.tags : ''
          if (item.tag && item.tags.length > 0) {
            tempItem.tags = item.tags
          } else if (item.upLoadData.tag && item.upLoadData.tag.length > 0) {
            tempItem.tags = item.upLoadData.tag
          } else {
            tempItem.tags = ''
          }
          param.photos.push(tempItem)
        })
        // console.log('param.photos', param.photos)
        param.photos = JSON.stringify(param.photos)
        // delete_ids
        if (this.delete_ids.length > 0) {
          param.delete_ids = this.delete_ids.join(',')
        }
        param.category_id = this.category_id
        param.author = this.author
        Indicator.open('提交中')
        this.submitAble = false
        this.$api.updatePhoto(param).then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
            Indicator.close()
            this.submitAble = true
          }
          if (res.data.data === 'success') {
            this.published = true
            Indicator.close()
            Toast('提交成功！')
            setTimeout(() => {
              this.$router.push('/homemy')
            }, 1000)
          }
        })
      } else {
        // 创建提交
        Indicator.open('提交中')
        this.submitAble = false
        param.cover_keys = []
        param.cover_keys = JSON.stringify([...this.new_cover_keys])
        // console.log('00', this.new_cover_keys)
        this.$api.createGallery(param, config).then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
            Indicator.close()
            this.submitAble = true
          }
          if (res.data.data === 'success') {
            this.published = true
            Indicator.close()
            Toast('提交成功！')
            setTimeout(() => {
              this.$router.push('/homemy')
            }, 1000)
          }
        })
      }
    },
    // 获取编辑详情
    getDetail () {
      // const vthis = this
      Indicator.open()
      const param = {
        id: Number(this.id),
        access_token: this.token
      }
      this.$api.getPhoteDetail(param).then(res => {
        if (res && res.data) {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
            Indicator.close()
          } else if (res.data.data) {
            this.editInfo = {...res.data.data}
            Indicator.close()
            // console.log('this.editInfo', this.editInfo)
            // 处理编辑数据
            let tempInfo = {...this.editInfo.cover}
            // console.log('tempInfo', tempInfo)
            // category_id
            this.category_id = tempInfo.category_id
            // author
            this.author = tempInfo.author
            // 图片列表
            this.imgList = [...this.editInfo.photo]
            this.imgList.forEach((item, idx) => {
              this.$set(item, 'src', item.photo_url)
              this.$set(item, 'ifComplete', true)
              this.$set(item, 'upLoadData', {
                ifCoverSet: item.is_cover === 1,
                photo_url: item.photo_url,
                photo_key: item.photo_key
              })
              // this.$set(item, 'fileSrc', vthis.$refs.file.files[idx])
            })
            // console.log(vthis.$refs.file.files)
            // console.log('this.imgList', this.imgList)
            // 设置封面图
            this.coverList = [...this.editInfo.cover.cover_keys]
            // console.log(this.coverList)
            this.coverList.forEach(item => {
              let tempCover = {
                origin_url: item.origin_url,
                cut_url: item.cut_url,
                origin_cover: item.origin_cover,
                cut_cover: item.cut_cover,
                chosed: true
              }
              this.new_cover_keys.push(tempCover)
            })
            // 标题
            this.title = tempInfo.title
            // 描述
            this.brief = tempInfo.brief
            // 地区
            let tempArea = tempInfo.area ? JSON.parse(tempInfo.area) : ''
            if (tempInfo.area) {
              this.area = `${tempArea.pro_name}-${tempArea.city_name}-${tempArea.area_name}`
              this.addressStr = tempInfo.area
            } else if (!tempInfo.area && tempInfo.area !== '') {
              this.area = '国外'
              this.china = 0
            }
            // 标签
            this.tagList = tempInfo.keywords ? [...tempInfo.keywords] : ''
            // 拍摄时间
            let tempTime = tempInfo.shoot_time ? new Date(tempInfo.shoot_time) : ''
            if (!tempTime || !tempTime.getFullYear()) {
              this.time = ''
            } else {
              this.time = tempTime.getFullYear() + '-' + (tempTime.getMonth() + 1) + '-' + tempTime.getDate()
            }
          }
        }
      })
    }
  },
  created () {
    this.id = this.$route.query.id
    this.token = this.getToken()
    this.tag = !!this.$route.query.tag
    if (!this.token) this.$router.push('/login')
    if (this.id) this.getDetail()
  },
  mounted () {
    this.getAreaList()
    this.swipe = this.$refs.mySwiper.swiper
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  min-height: 100%;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.12rem;
      color: #888888;
      margin-bottom: 0.1rem;
      // 开启、关闭排序
      .drag-btn {
        display: inline-block;
        width: .8rem;
        height: .3rem;
        line-height: .3rem;
        border-radius: 3px;
        text-align: center;
        font-size:.12rem;
        color: #fff;
        background:#dd2f3c;
        // opacity: .6;
      }
    }
    &.pd15{
      padding: 0.15rem;
    }
    .img-item {
      width: 1.12rem;
      height: 1.12rem;
      margin-bottom: 0.04rem;
      position: relative;
      &.ml4 {
        margin-left: 0.04rem;
      }
      &.ml0 {
        margin-left: 0 !important;
      }
      .main-img {
        width: 100%;
        height: 100%;
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
        /deep/ {
          .mt-progress {
            width: 0.6rem;
            margin: 0.4rem auto 0.1rem;
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
    }
  }
  .main {
    padding: 0.3rem 0.15rem 0.15rem;
    .cover-box {
      padding-left: 0.14rem;
      margin-bottom: 0.24rem;
      p {
        font-size: 0.12rem;
        color: #888888;
      }
      .icon {
        width: 0.4rem;
        height: 0.4rem;
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
        // height: 0.2rem;
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
  .cover-mask {
    width: 100%;
    height: 100%;
    background-color: #000;
    .cover-top {
      position: absolute;
      // top: 0.3rem;
      left: 0;
      right: 0;
      height: 0.6rem;
      line-height: 0.3rem;
      text-align: center;
      font-size: 0.16rem;
      color: #fff;
      background: rgba(0,0,0,.5);
      padding-top: 0.15rem;
      .back {
        width: 0.11rem;
        height: 0.19rem;
        position: absolute;
        top: 50%;
        left: 0.15rem;
      }
      .del {
        position: absolute;
        right: 0.15rem;
        top: 0.14rem;
        font-size: 0.14rem;
        color: #fff;
      }
    }
    .swiper-box {
      position: absolute;
      top: 0;
      bottom: 0;
      // top: 0.64rem;
      // bottom: 0.4rem;
      left: 0;
      right: 0;
      z-index: -1;
      /deep/ {
        .swiper-container {
          position: absolute;
          // top: 0.8rem;
          // bottom: 0.65rem;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          .swiper-wrapper {
            display: flex !important;
            align-items: center !important;
            .swiper-slide {
              height: auto;
            }
          }
        }
      }
    }
    .cover-bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      padding: 0.23rem 0.15rem 0.15rem;
      .input-box {
        height: 0.66rem;
        p {
          color: #fff;
          font-size: 0.14rem;
          margin-right: 0.1rem;
        }
        input {
          margin-left: 0.15rem;
          background-color: transparent;
          color: #fff;
          border: 0;
          outline: 0;
          font-size: 0.14rem;
          color: rgba(255, 255, 255, 0.4);
          border: 0;
          &::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.14rem;
          }
        }
      }
      .set-box {
        height: 0.5rem;
        img {
          width: 0.2rem;
          height: 0.2rem;
          margin-right: 0.09rem;
        }
        p {
          font-size: 0.14rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
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
}
</style>
