// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import './assets/style/reset.css'
import './assets/style/global.css'
import './assets/style/common.scss'
import 'mint-ui/lib/style.css'
import './assets/js/rem.js'
import Mint from 'mint-ui'
import { mixin } from './lib/utils'
import * as api from './lib/api'
import VueWechatTitle from 'vue-wechat-title'
// import progressive from 'progressive-image/dist/vue'
// Vue.use(progressive, {
//   removePreview: true,
//   scale: false,
//   lazyClass: 'lazy'
// })
Vue.use(VueWechatTitle)
Vue.mixin(mixin)
Vue.use(Mint)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  api,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 百度统计
  if (to.path) {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  next()
})
