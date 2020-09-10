import Vue from 'vue'
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
const routes = [
  {
    path: '/',
    name: 'home',
    meta: {title: '视觉南京', keepAlive: true},
    component: () => import('../views/home')
  },
  {
    path: '/home',
    name: 'home1',
    meta: {title: '视觉南京', keepAlive: true},
    component: () => import('../views/home')
  },
  {
    path: '/homemy',
    name: 'homemy',
    meta: {title: '我的_视觉南京', keepAlive: true},
    component: () => import('../views/homeMy')
  },
  {
    path: '/userdetail',
    name: 'userdetail',
    component: () => import('../views/detail/userDetail')
  },
  {
    path: '/login',
    name: 'login',
    meta: {title: '登录_视觉南京'},
    component: () => import('../views/login')
  },
  {
    path: '/register',
    name: 'register',
    meta: {title: '注册_视觉南京'},
    component: () => import('../views/register')
  },
  {
    path: '/contribute',
    name: 'contribute',
    meta: {title: '投稿_视觉南京'},
    component: () => import('../views/contribute')
  },
  {
    path: '/contributeVideo',
    name: 'contributeVideo',
    meta: {title: '视频投稿_视觉南京'},
    component: () => import('../views/contributeVideo')
  },
  {
    path: '/forgetpassword',
    name: 'forgetpassword',
    meta: {title: '忘记密码_视觉南京'},
    component: () => import('../views/forgetPassword')
  },
  {
    path: '/liststyle1',
    name: 'liststyle1',
    component: () => import('../views/list/listStyle1')
  },
  {
    path: '/liststyle2',
    name: 'liststyle2',
    component: () => import('../views/list/listStyle2')
  },
  {
    path: '/liststyle3',
    name: 'liststyle3',
    component: () => import('../views/list/listStyle3')
  },
  {
    path: '/liststyle5',
    name: 'liststyle5',
    component: () => import('../views/list/listStyle5')
  },
  {
    path: '/liststyle6',
    name: 'liststyle6',
    component: () => import('../views/list/listStyle6')
  },
  {
    path: '/eventlist',
    name: 'eventlist',
    component: () => import('../views/list/eventList')
  },
  {
    path: '/photographerlist',
    name: 'photographerList',
    meta: {title: '摄影之家_视觉南京'},
    component: () => import('../views/list/photographerList')
  },
  {
    path: '/photographerlist2',
    name: 'photographerList2',
    component: () => import('../views/list/photographerList2')
  },
  {
    path: '/mypublishlist',
    name: 'mypublishlist',
    component: () => import('../views/list/myPublishList')
  },
  {
    path: '/eventdetail',
    name: 'eventdetail',
    component: () => import('../views/detail/eventDetail')
  },
  {
    path: '/eventratedetail',
    name: 'evenrRatedetail',
    component: () => import('../views/detail/eventRateDetail')
  },
  {
    path: '/imgdetail',
    name: 'imgdetail',
    component: () => import('../views/detail/imgDetail')
  },
  {
    path: '/imgpreview',
    name: 'imgpreview',
    component: () => import('../views/detail/imgPreview')
  },
  {
    path: '/videodetail',
    name: 'videodetail',
    component: () => import('../views/detail/videoDetail')
  },
  // 作品-视频列表-视频详情
  {
    path: '/tagVideodetail',
    name: 'tagVideodetail',
    component: () => import('../views/detail/tagVideodetail')
  },
  {
    path: '/search',
    name: 'search',
    meta: {title: '搜索_视觉南京', keepAlive: true},
    component: () => import('../views/search')
  }
]
export default new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) =>
    savedPosition || {
      x: 0,
      y: 0
    },
  routes
})
