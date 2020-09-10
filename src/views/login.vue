<template>
  <div class="login">
    <mt-header>
      <mt-button icon="back" slot="left" @click.native="goBack"></mt-button>
    </mt-header>
    <div class="logoBox">
      <img src="../assets/vinj_Logo.png" alt />
    </div>
    <div class="content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">验证码登录</mt-tab-item>
        <mt-tab-item id="2">账号密码登录</mt-tab-item>
      </mt-navbar>
      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <div class="inputBox">
            <mt-field placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
            <i class="leftIcon phoneIcon"></i>
          </div>
          <div class="inputBox noCloseIcon">
            <mt-field placeholder="请输入验证码" v-model="captcha" class="captcha">
              <p class="code remain" v-if="!ifCaptcha" @click="getCaptcha">获取验证码</p>
              <p class="code remain" v-else>{{`${captchaSeconds}秒`}}</p>
            </mt-field>
            <i class="leftIcon captchaIcon"></i>
          </div>
          <mt-button v-if="!captchaLoginable" type="danger" size="large" disabled>登录</mt-button>
          <mt-button v-else type="danger" size="large" @click="login(0)">登录</mt-button>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div class="inputBox">
            <mt-field placeholder="请输入账号" v-model="username"></mt-field>
            <i class="leftIcon nameIcon"></i>
          </div>
          <div class="inputBox noCloseIcon" v-if="!showPwd">
            <mt-field placeholder="请输入密码" type="password" v-model="password">
              <i class="no_readIcon" @click="showPassWord"></i>
            </mt-field>
            <i class="leftIcon passwordIcon"></i>
          </div>
          <div class="inputBox noCloseIcon" v-else>
            <mt-field placeholder="请输入密码" type="text" v-model="password">
              <i class="is_readIcon" @click="showPassWord"></i>
            </mt-field>
            <i class="leftIcon passwordIcon"></i>
          </div>
          <mt-button v-if="!userNameLoginable" type="danger" size="large" disabled>登录</mt-button>
          <mt-button v-else type="danger" size="large" @click="login(1)">登录</mt-button>
        </mt-tab-container-item>
      </mt-tab-container>
      <div class="bottom flexBox flexBetween">
        <p>
          <router-link to="/forgetpassword">忘记密码</router-link>
        </p>
        <p>
          还没有账号?
          <router-link to="/register">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import secret from '../lib/secret'
export default {
  name: 'login',
  data () {
    return {
      selected: '1',
      username: '',
      password: '',
      phone: '',
      captcha: '',
      captchaLoginable: false,
      captchaSeconds: 60,
      ifCaptcha: false,
      userNameLoginable: false,
      showPwd: false
    }
  },
  computed: {
    captchaFlag () {
      const { phone, captcha } = this
      return { phone, captcha }
    },
    userNameFlag () {
      const { username, password } = this
      return { username, password }
    }
  },
  watch: {
    captchaFlag: {
      handler: function (val) {
        if (val.phone && val.captcha) {
          this.captchaLoginable = true
        } else {
          this.captchaLoginable = false
        }
      },
      deep: true
    },
    userNameFlag: {
      handler: function (val) {
        if (val.username && val.password) {
          this.userNameLoginable = true
        } else {
          this.userNameLoginable = false
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取验证码
    getCaptcha () {
      if (!this.phone) {
        Toast('手机号不能为空')
      } else if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        Toast('手机号格式有误')
      } else {
        this.$api.getPhoneCode(this.phone, 'login').then(res => {
          if (res.data.ErrorText) {
            Toast(res.data.ErrorText)
          } else if (res.data.data[0] === 'success') {
            Toast('已发送验证码！')
            this.ifCaptcha = true
            this.timer = setInterval(() => {
              if (this.captchaSeconds === 1) {
                this.ifCaptcha = false
                clearInterval(this.timer)
                this.captchaSeconds = 60
              } else {
                this.captchaSeconds--
              }
            }, 1000)
          }
        })
      }
    },
    // 切换显示密码
    showPassWord () {
      this.showPwd = !this.showPwd
    },
    // 登录
    login (type) {
      let param = {}
      // 验证码登录
      if (type === 0) {
        param.member_name = this.phone
        param.mobile_verifycode = this.captcha
        param.password = ''
      }
      // 密码登录
      if (type === 1) {
        param.member_name = this.username
        param.password = secret.Encrypt(this.password)
      }
      this.$api.login(param).then(res => {
        if (res.data.ErrorText) {
          Toast(res.data.ErrorText)
        }
        if (res.data.data.access_token) {
          this.setCookie('access_token', res.data.data.access_token)
          this.setCookie('groupId', res.data.data.group_id)
          this.setCookie('memberId', res.data.data.member_id)
          this.setCookie('author', res.data.data.nick_name)
          Toast('登录成功！')
          setTimeout(() => {
            this.$router.push('/homemy')
          }, 1000)
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.login {
  padding: 33px 15px;
  /deep/ {
    .mint-header {
      background-color: #fff;
      .mint-header-button {
        .mint-button {
          color: #dd2f3c;
          .mintui {
            font-size: 0.2rem;
          }
        }
      }
    }
  }
  .logoBox {
    overflow: hidden;
    margin-top: 0.38rem;
    text-align: center;
    img {
      width: 1.21rem;
      height: 0.38rem;
    }
  }
  .content {
    margin-top: 0.46rem;
    /deep/ {
      .mint-navbar {
        padding-bottom: 2px;
        border-bottom: 1px solid #e3e3e3;
        .mint-tab-item {
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(155, 155, 155, 1);
          &.is-selected {
            font-weight: 600;
            color: rgba(74, 74, 74, 1);
            border-color: rgba(221, 47, 60, 1);
          }
          .mint-tab-item-label {
            font-size: 0.16rem;
          }
        }
      }
      .mint-tab-container-item {
        margin-top: 0.41rem;
        .inputBox {
          position: relative;
          &.noCloseIcon{
            /deep/{
              .mint-field-clear{
                display: none;
              }
            }
          }
          .leftIcon {
            position: absolute;
            left: 0.12rem;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .mint-cell {
          width: 3.45rem;
          height: 0.38rem;
          background: rgba(248, 248, 248, 1);
          border-radius: 0.06rem;
          margin-bottom: 0.3rem;
          .mint-cell-value {
            position: relative;
            input {
              padding-left: 0.22rem;
              background: rgba(248, 248, 248, 1);
              border: 0;
            }
          }
          .mint-field-other {
            .code {
              color: rgba(221, 47, 60, 1);
              padding-left: 0.12rem;
              border-left: 1px solid rgba(221, 47, 60, 1);
              &.remain {
                width: 0.82rem;
                text-align: center;
              }
            }
          }
        }
      }
      .mint-button {
        width: 100%;
        // background:rgba(221,47,60,0.6);
      }
    }
    .bottom {
      margin-top: 0.12rem;
      font-size: 0.12rem;
      font-family: PingFangSC;
      font-weight: 400;
      p {
        color: rgba(74, 74, 74, 1);
        a {
          color: rgba(221, 47, 60, 1);
        }
      }
    }
  }
}
</style>
