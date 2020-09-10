import Vue from 'vue'
import axios from 'axios'
import { mixin } from '../lib/utils'
// import qs from 'qs';
const token = mixin.methods.getCookie('access_token')
// axios.interceptors.request.use((config) => {
//   if(config.method  === 'post' && config.data.constructor !== FormData){
//     config.data = qs.stringify(config.data);
//   }
//   return config;
// },(error) =>{
//   return Promise.reject(error);
// });
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// const baseUrl = 'http://mapi2.dev.hoge.cn/api/v1/'
// const baseUrl2 = 'http://plus-middle-end.dev.hoge.cn/api/'

// 防止线上接口跨域 nginx做了中转
const baseUrl = 'http://h5.vinj.cn/mapi/api/v1/'
const baseUrl2 = 'http://h5.vinj.cn/middle/api/'

/* 栏目列表数据 */
export const getColumnContent = (params) => axios.get(`${baseUrl}column_contents.php`, { params })
/* 栏目内容 */
export const getContent = (params) => axios.get(`${baseUrl}contents.php`, { params })
/* 详情 */
export const getDetail = (id) => axios.get(`${baseUrl}item.php?id=${id}`)
/* 图集详情 */
export const getGalleryDetail = (id) => axios.get(`${baseUrl2}gallery/detail/${id}`)
/* 我的作品图片预览 */
export const getMyGalleryDetail = (id) => axios.get(`${baseUrl2}gallery/detail/${id}?force=1`)
/* 图集图片列表 */
export const getGalleryPhotos = (id, page, count) => axios.get(`${baseUrl2}gallery/photos/${id}?page=${page}&per_num=${count}`)
/* 首页轮播图 */
export const getHomeSwiperList = (page, count) => axios.get(`${baseUrl2}publish/newest_photos?page=${page}&per_num=${count}`)
/* 搜索 */
export const getSearchList = (keyword, page, count) => axios.get(`${baseUrl2}gallery/photo/common/search?search_text=${keyword}&page=${page}&page_num=${count}`)
/* 注册 */
export const register = (param) => axios.post(`${baseUrl2}member/register`, param)
/* 获取验证码 */
export const getPhoneCode = (phone, type) => axios.get(`${baseUrl2}member/sendCode?member_name=${phone}&type=${type}`)
/* 登录 */
export const login = (param) => axios.post(`${baseUrl2}member/login`, param)
/* 忘记密码 */
export const forgotPwd = (phone) => axios.get(`${baseUrl2}member/forgotPwd?member_name=${phone}`)
/* 重置密码 */
export const resetPwd = (param) => axios.post(`${baseUrl2}member/resetPwd`, param)
/* 获取自己数据统计 */
export const getMyData = (token) => axios.get(`${baseUrl2}member/works/data?access_token=${token}`)
/* 获取自己用户信息 */
export const getMyInfo = (token) => axios.get(`${baseUrl2}member/info?access_token=${token}`)
/* 获取他人用户信息 */
export const getUserInfo = (id) => axios.get(`${baseUrl2}member/getOthersInfo?author_id=${id}`)
/* 获取用户作品-图集 */
export const getUserGallery = (params) => axios.get(`${baseUrl2}gallery/personal/publish`, {params})
/* 添加收藏 */
export const addCollection = (params) => axios.post(`${baseUrl2}member/collect/add`, params)
/* 取消收藏 */
export const delCollection = (params) => axios.post(`${baseUrl2}member/collect/del`, params)
/* 判断是否收藏 */
export const getCollectionStatus = (params) => axios.get(`${baseUrl2}member/collect/is_collect`, {params})
/* 获取我的收藏 */
export const getMyCollection = (params) => axios.get(`${baseUrl2}member/collect/my`, {params})
/* 获取他人收藏 */
export const getOthersCollection = (params) => axios.get(`${baseUrl2}member/collect/others`, {params})
/* 获取他人作品 */
export const getOthersWork = (params) => axios.get(`${baseUrl2}gallery/others/photos`, {params})
/* 获取用户参与的活动 */
export const getUserActivityList = (token) => axios.get(`${baseUrl2}activity/list?access_token=${token}`)
/* 获取用户参与的评分活动 */
export const getUserCommitteeList = (token) => axios.get(`${baseUrl2}activity/committeeList?access_token=${token}`)
/* 获取活动作品列表 */
export const getActivityDetailList = (params) => axios.get(`${baseUrl2}activity/detail`, {params})
/* 获取活动作品详情 */
export const getActivityDetail = (params) => axios.get(`${baseUrl2}activity/details`, {params})
/* 更新个人用户信息 */
export const updateMyInfo = (param) => axios.post(`${baseUrl2}member/updateInfo`, param)
/* 获取地区列表 */
export const getAreaList = (type, fid) => axios.get(`${baseUrl2}member/location?type=${type}&fid=${fid}&access_token=${token}`)
/* 创建图集 */
export const createGallery = (param) => axios.post(`${baseUrl2}gallery/create`, param)
/* 上传视频 */
export const uploadVideo = (param, config) => axios.post(`${baseUrl2}video/upload`, param, config)
/* 创建视频 */
export const createVideo = (param, config) => axios.post(`${baseUrl2}video/video_create`, param, config)
/* 封面上传 */
export const uploadCover = (param, config) => axios.post(`${baseUrl2}gallery/cover/upload`, param, config)
/* 摄影师列表 */
export const getShootHome = (params) => axios.get(`${baseUrl2}publish/shoot_home`, {params})
/* 投稿上传 */
export const uploadGallery = (param, config) => axios.post(`${baseUrl2}gallery/upload`, param, config)
/* 活动列表 */
export const getActivityHome = (params) => axios.get(`${baseUrl2}publish/column_content_list`, {params})

// 获取图集编辑详情
export const getPhoteDetail = (params) => axios.get(`${baseUrl2}gallery/photo/detail`, {params})
// 图集提审
export const auditPhoto = (param) => axios.put(`${baseUrl2}gallery/audit`, param)
// 图集删除
export const delPhoto = (params) => axios.delete(`${baseUrl2}gallery/delete`, {params})
// 图集编辑提交
export const updatePhoto = (param) => axios.put(`${baseUrl2}gallery/photo/update`, param)

// 获取视频列表
export const getVideoList = (params) => axios.get(`${baseUrl2}video/personal/list`, {params})
// 获取视频编辑详情
export const getVideoDetail = (id) => axios.get(`${baseUrl2}video/detail/${id}`)
// 视频提审
export const auditVideo = (param) => axios.put(`${baseUrl2}video/audit`, param)
// 视频删除
export const delVideo = (params) => axios.delete(`${baseUrl2}video/delete`, {params})
// 视频编辑提交
export const updateVideo = (param) => axios.put(`${baseUrl2}video/personal/update`, param)
// 获取视频详情
export const getTagVideoDetail = (id) => axios.get(`http://middle-api.plus.vinj.cn/api/video/detail/${id}`)

Vue.mixin({
  beforeCreate () {
    const options = this.$options
    if (options.api) {
      this.$api = options.api
    } else if (options.parent && options.parent.$api) {
      this.$api = options.parent.$api
    }
  }
})
