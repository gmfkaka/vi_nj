<template>
  <div class="info-box">
    <p class="title" v-if="type === 'img' && data.photo_count">{{`${data.title}（共${data.photo_count}张）`}}</p>
    <p class="title" v-else>{{data.title}}</p>
    <div class="icon-box flexBox flexAlign">
      <i class="viewIcon"></i>
      <p class="number">{{data.click_num !== '' ? data.click_num : 0}}</p>
      <i class="praiseIcon" @click="doPraise" style="margin-right:0;"></i>
      <p class="number">{{data.praise_num !== '' ? data.praise_num : 0}}</p>
      <i class="downloadIcon" v-if="type === 'img'"></i>
      <p class="number" v-if="type === 'img'">{{data.downloads !== '' ? data.downloads : 0}}</p>
    </div>
    <!-- 图集有详情 -->
    <div v-if="type === 'img'" class="detail-icon-box flexBox flexAlign" @click="goImgPreview">
      <p>详情</p>
      <i class="moreIcon"></i>
    </div>
    <!-- 标签 -->
    <div class="tag-box flexBox flexWrap" v-if="data.keywords != ''">
      <p class="tag-item" v-if="!tagList.length">{{data.keywords}}</p>
      <p class="tag-item" v-else v-for="(item,index) in tagList" :key="index">{{item}}</p>
    </div>
    <p class="detail" v-if="data.brief" v-html="data.brief"></p>
  </div>
</template>

<script>
export default {
  name: 'detailMainInfo',
  props: ['data', 'type', 'id', 'count'],
  data () {
    return {
      tagList: []
    }
  },
  methods: {
    goImgPreview () {
      this.$router.push({path: '/imgpreview', query: {id: this.id, count: this.count}})
    },
    // 点赞|点击量长链接 start
    bin2hex (str) {
      var result = ''
      for (var i = 0; i < str.length; i++) {
        result += this.int16_to_hex(str.charCodeAt(i))
      }
      return result
    },
    int16_to_hex (i) {
      var result = i.toString(16)
      var j = 0
      while (j + result.length < 6) {
        result = '0' + result
        j++
      }
      return result
    },
    cans () {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var txt = 'http://www.vjnj.cn/'
      ctx.textBaseline = 'top'
      ctx.font = "14px 'Arial'"
      ctx.textBaseline = 'vjnj'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText(txt, 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText(txt, 4, 17)
      var b64 = canvas.toDataURL().replace('data:image/png;base64,', '')
      var bin = atob(b64)
      var crc = this.bin2hex(bin.slice(-16, -12))
      crc = crc.toUpperCase()
      return crc
    },
    hoge_Websocket (op_type) {
      var device_token = this.cans()
      // console.log(device_token)
      if (this.id) {
        var serv = 'wss://ldas.cloud.hoge.cn/produce/pcontent/h5/375/' + device_token + '?secret=d624e9f635a3dc1a2bcb99d47d88c281'
        // 123是客户授权ID，后面的secret不需要更改
        // 分享页的终端类型是h5，PC的终端类型是web
        var hg_Websocket = new WebSocket(serv)
        let that = this
        hg_Websocket.onopen = function (evt) {
          let obj = {
            customer_id: '375',
            client_type: 'h5',
            device_token: device_token,
            data_bundle_id: that.data.type,
            site_id: '1',
            op_type: op_type,
            create_time: that.data.publish_time,
            data_content_id: that.data.content_id,
            data_title: that.data.title,
            data_content_fromid: that.data.id,
            data_column_id: that.data.column_id,
            content_type: 'content'
          }
          // 可以打印出来传给接口的参数，检查是否有错误
          // console.log(JSON.stringify(obj), 'send')
          hg_Websocket.send(JSON.stringify(obj))
        }
        hg_Websocket.onclose = function (evt) {}
        hg_Websocket.onmessage = function (evt) {
          var data = JSON.parse(evt.data)
          var t
          if (t = parseInt(data['k'])) {
            setTimeout(function () {
              hg_Websocket.send(text)
            }, t * 1000)
          };
        }
        hg_Websocket.onerror = function (evt, e) {}
      }
    },
    // 点赞
    doPraise () {
      this.hoge_Websocket('like')
      this.data.praise_num += 1
    }
    // 点赞|点击量长链接 end
  },
  created () {
    if (this.data.keywords.indexOf(',') !== -1) {
      this.tagList = this.data.keywords.split(',')
    }
    this.hoge_Websocket('click')
  }
}
</script>

<style lang='scss' scoped>
.info-box {
  padding: 0.15rem;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  position: relative;
  .detail-icon-box {
    font-size: 0.14rem;
    color: #a6a6a6;
    position: absolute;
    top: 0.25rem;
    right: 0.1rem;
    p {
      margin-right: 0.05rem;
    }
  }
  .tag-box {
    margin: 0.2rem 0 0.12rem;
  }
  p {
    &.title {
      width: 90%;
      font-size: 0.18rem;
      font-weight: 500;
      color: #333;
      margin-bottom: 0.14rem;
    }
    &.number {
      margin-left: 0.02rem;
      margin-right: 0.2rem;
      font-size: 0.13rem;
      color: #a6a6a6;
    }
    &.tag-item {
      background: rgba(242, 242, 242, 1);
      border-radius: 2px;
      padding: 0.04rem 0.08rem;
      font-size: 0.14rem;
      color: #666;
      margin-right: 0.08rem;
      margin-bottom: 0.08rem;
    }
    &.detail {
      font-size: 0.15rem;
      color: rgba(51, 51, 51, 1);
      line-height: 0.21rem;
      text-align: justify;
      margin-top: 0.1rem;
    }
  }
}
</style>
