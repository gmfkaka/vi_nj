<template>
  <div class="register">
    <mt-header>
      <mt-button icon="back" slot="left" @click.native="goBack"></mt-button>
    </mt-header>
    <div class="logoBox">
      <img src="../assets/vinj_Logo.png" alt />
    </div>
    <div class="content">
      <div class="title">
        注册账号
        <span>一旦注册，用户名和登录名将不能更改！</span>
      </div>
      <form action>
        <label class="inputBox">
          <span>昵称</span>
          <input type="text" v-model="username" />
        </label>
        <label class="inputBox">
          <span>手&nbsp;机&nbsp;号</span>
          <input type="tel" v-model="phone" />
        </label>
        <label class="inputBox">
          <span>验&nbsp;证&nbsp;码</span>
          <input type="tel" v-model="captcha" class="captcha" />
          <p class="code remain" v-if="!ifCaptcha" @click="getCaptcha">获取验证码</p>
          <p class="code remain" v-else>{{`${captchaSeconds}秒`}}</p>
        </label>
        <label class="inputBox">
          <span>密&nbsp;&nbsp;&nbsp;码</span>
          <input v-if="!showPwd" type="password" v-model="password" />
          <input v-else type="text" v-model="password" />
          <i v-if="!showPwd" class="no_readIcon inputIcon"  @click="showPassWord"></i>
          <i v-else class="is_readIcon inputIcon" @click="showPassWord"></i>
        </label>
      </form>
      <mt-button
        v-if="!canRegister"
        size="large"
        style="background:rgba(221,47,60,0.6);color:#fff;"
      >注册</mt-button>
      <mt-button v-else size="large" type="danger" @click="register">注册</mt-button>
    </div>
    <div class="bottom">
      <span>已经注册</span>
      <router-link to="/login">现在去登录</router-link>
    </div>
  </div>
</template>
<script>
import secret from '../lib/secret'
import { Toast } from 'mint-ui'
export default {
  name: 'register',
  data () {
    return {
      username: '',
      password: '',
      phone: '',
      captcha: '',
      ifCaptcha: false,
      captchaSeconds: 60,
      canRegister: false,
      showPwd: false
    }
  },
  computed: {
    registerAble () {
      const { phone, captcha, username, password } = this
      return { phone, captcha, username, password }
    }
  },
  watch: {
    registerAble: {
      handler: function (val) {
        if (val.phone && val.captcha && val.username && val.password) {
          this.canRegister = true
        } else {
          this.canRegister = false
        }
      },
      deep: true
    }
  },
  methods: {
    // 切换显示密码
    showPassWord () {
      this.showPwd = !this.showPwd
    },
    // 获取验证码
    getCaptcha () {
      if (!this.phone) {
        Toast('手机号不能为空')
      } else if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        Toast('手机号格式有误')
      } else {
        this.$api.getPhoneCode(this.phone, 'register').then(res => {
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
    // 注册
    register () {
      const param = {
        member_name: this.phone,
        nick_name: this.username,
        password: secret.Encrypt(this.password),
        mobile_verifycode: this.captcha
      }
      this.$api.register(param).then(res => {
        if (res.data.ErrorText) {
          Toast(res.data.ErrorText)
        }
        if (res.data.ErrorCode === 0 && res.data.data.id) {
          Toast('注册成功！')
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.register {
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
    .title {
      padding-bottom: 0.07rem;
      border-bottom: 0.01rem solid rgba(227, 227, 227, 1);
      font-size: 0.16rem;
      font-family: PingFangSC;
      font-weight: 600;
      color: rgba(74, 74, 74, 1);
      span {
        font-size: 0.12rem;
        font-weight: 400;
        color: rgba(221, 47, 60, 1);
      }
    }
    form {
      margin-top: 0.4rem;
      .inputBox {
        display: block;
        font-size: 0.14rem;
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-bottom: 0.3rem;
        position: relative;
        span {
          display: inline-block;
          width: 0.56rem;
        }
        input {
          width: 2.74rem;
          height: 0.38rem;
          background: rgba(248, 248, 248, 1);
          outline: none;
          border: none;
          border-radius: 0.06rem;
          box-sizing: border-box;
          padding-left: 0.1rem;
          &.captcha {
            padding-right: 1rem;
          }
        }
        .code {
          position: absolute;
          right: 0.2rem;
          top: 0.1rem;
          font-size: 0.14rem;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(221, 47, 60, 1);
          border-left: 1px solid #dd2f3c;
          padding-left: 0.12rem;
          background: rgba(248, 248, 248, 1);
          &.remain {
            width: 0.82rem;
            text-align: center;
          }
        }
        .inputIcon {
          position: absolute;
          right: 0.2rem;
          top: 0.12rem;
        }
      }
    }
  }
  .bottom {
    text-align: center;
    margin-top: 0.13rem;
    font-size: 0.12rem;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(74, 74, 74, 1);
    a {
      color: #dd2f3c;
    }
  }
}
</style>
