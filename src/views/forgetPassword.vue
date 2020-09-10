<template>
  <div class="forget">
    <mt-header>
      <mt-button icon="back" slot="left" @click.native="goBack"></mt-button>
    </mt-header>
    <div class="logoBox">
      <img src="../assets/vinj_Logo.png" alt />
    </div>
    <div class="content">
      <div class="title">忘记密码</div>
      <form action>
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
          <input type="password"  v-if="!showPwd" v-model="password" />
          <input type="text" v-else v-model="password" />
          <i v-if="!showPwd" class="no_readIcon inputIcon" @click="showPwd = !showPwd"></i>
          <i v-else class="is_readIcon inputIcon" @click="showPwd = !showPwd"></i>
        </label>
        <label class="inputBox">
          <span>确认密码</span>
          <input type="password" v-if="!confirmShowPwd" v-model="confirmPassword" />
          <input type="text" v-else v-model="confirmPassword" />
          <i v-if="!confirmShowPwd" class="no_readIcon inputIcon" @click="confirmShowPwd = !confirmShowPwd"></i>
          <i v-else class="is_readIcon inputIcon" @click="confirmShowPwd = !confirmShowPwd"></i>
        </label>
      </form>
      <mt-button
        v-if="!canSubmit"
        size="large"
        style="background:rgba(221,47,60,0.6);color:#fff;"
      >提交</mt-button>
      <mt-button v-else type="danger" size="large" @click="submit">提交</mt-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import secret from '../lib/secret'
export default {
  name: 'forgetPassword',
  data () {
    return {
      password: '',
      confirmPassword: '',
      phone: '',
      captcha: '',
      memberId: '',
      canSubmit: false,
      ifCaptcha: false,
      captchaSeconds: 60,
      showPwd: false,
      confirmShowPwd: false
    }
  },
  computed: {
    submitFlag () {
      const { phone, captcha, password, confirmPassword } = this
      return { phone, captcha, password, confirmPassword }
    }
  },
  watch: {
    submitFlag: {
      handler: function (val) {
        if (val.phone && val.captcha && val.password && val.confirmPassword) {
          this.canSubmit = true
        } else {
          this.canSubmit = false
        }
      }
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
        // 验证输入的手机号是否已注册
        this.$api.forgotPwd(this.phone).then(res => {
          if (res.data.ErrorText === '未绑定') {
            Toast('此手机号未注册！')
            setTimeout(() => {
              this.$router.push('/register')
            }, 1000)
          } else {
            this.memberId = res.data.data[0].member_id
            this.$api.getPhoneCode(this.phone, 'forget').then(res => {
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
        })
      }
    },
    submit () {
      if (this.password !== this.confirmPassword) {
        Toast('两次输入的密码不一致！')
        return
      }
      const param = {
        member_name: this.phone,
        member_id: this.memberId,
        password: secret.Encrypt(this.password),
        verifycode: this.captcha
      }
      this.$api.resetPwd(param).then(res => {
        if (res.data.ErrorText) {
          Toast(res.data.ErrorText)
        }
        if (res.data.ErrorCode === 0) {
          Toast('密码修改成功！')
          setTimeout(() => {
            this.$router.push('/login')
          }, 1000)
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.forget {
  padding: 0.33rem 0.15rem;
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
