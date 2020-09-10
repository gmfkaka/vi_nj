import { Toast } from 'mint-ui'
const mixin = {
  methods: {
    // 后退
    goBack () {
      this.$router.go(-1)
    },
    // 跳转页面
    goToPage (link) {
      this.$router.push(`/${link}`)
    },
    // 去详情页
    goDetail (item) {
      const id = item.id
      const type = item.type
      // 图集
      if (type === 'gallery' || type === 'atlas') {
        this.$api.getGalleryDetail(item.origin_id).then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
          } else {
            this.$router.push({ path: '/imgdetail', query: { id: item.origin_id } })
          }
        })
      }
      if (type === 'pic') {
        this.$api.getGalleryDetail(item.atlas_id).then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
          } else {
            this.$router.push({ path: '/imgdetail', query: { id: item.atlas_id } })
          }
        })
      }
      type === 'video' && this.$router.push({path: '/videodetail', query: {id}})
      type === 'activity' && this.$router.push({path: '/eventdetail', query: {id: item.origin_id}})
      if (type === 'link') window.location.href = item.outlink
    },
    // 获取用户token
    getToken () {
      return this.getCookie('access_token')
    },
    // 存cookie 一天过期
    setCookie (name, value) {
      let exp = new Date()
      exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000)
      document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
    },
    // 读取cookie
    getCookie (name) {
      let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
      if (arr != null) return unescape(arr[2])
      return false
    },
    // 删除cookie
    delCookie (name) {
      let exp = new Date()
      exp.setTime(exp.getTime() - 1)
      let cval = this.getCookie(name)
      if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() }
    },
    // 图片拼接地址
    getImgUrl (url, width = 0, height = 0) {
      return `${url}?imageView/0/h/${height}/w/${width}`
    },
    // 按某一属性值排序
    compare (property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    }
  }
}
export { mixin }
