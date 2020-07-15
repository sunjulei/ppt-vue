<template>
  <body>
  <img id="poster" :src="baseUrl+'/pptImg/bgImg/forget.jpg'" width='100%' height='100%'>
  <el-form :model="registerForm" class="login-container" label-position="left" :rules="rules" ref="registerForm"
           label-width="0px">

    <el-form-item>
      <a href="">
        <el-image  style="width: 100%; height: 100%;" :src="require('../../static/logo.png')">
        </el-image>
      </a>
      <h3 class="login_title">找回密码</h3>
    </el-form-item>

    <el-form-item prop="username" name="username">
      <el-input type="text" v-model="registerForm.username"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>



    <el-form-item  v-show="show">
      <el-button id="submit"
                 v-loading="loading"
                 element-loading-spinner="el-icon-loading"
                 element-loading-text="正在发送到邮箱……"
                 type="primary"

                 v-on:click="checkYzm('registerForm')">发送邮箱
      </el-button>
    </el-form-item>

    <el-form-item v-if="!show">
      <el-button id="submitRe" type="primary"  disabled>重新发送（{{count}}）
      </el-button>
    </el-form-item>

    <el-form-item style="width: 100%">
      <router-link :to="{path:'/login'}">
        <el-button id="toRegist" type="success">去登录</el-button>
      </router-link>
    </el-form-item>

  </el-form>
  </body>
</template>

<script>

  export default {
    name: 'ForgetPass',
    data() {
      return {
        registerForm: {
          username: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ]
        },
        loading: false,
        show: true,
        count: '',
        timer: null,
        TIME_COUNT : 60,
      };
    },

    methods: {
      checkYzm(formName) {
        let _this = this;
        this.$refs[formName].validateField('username', function (succ) {
          if (succ === "") {
            _this.loading = true;
            var checkUrl = _this.baseUrl + "/user/forgetPassword"
            _this.axios.post(checkUrl, {
              username: _this.registerForm.username
            }).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  message: "发送成功，请登录邮箱找回密码！",
                  type: 'success'
                });
              } else {
                _this.$message({
                  message: resp.data.message,
                  type: 'warning'
                });
              }
              _this.loading = false;
              _this.checkYzmTime();
            })
          }
        });

      },
      checkYzmTime() {
        if (!this.timer) {
          this.count = this.TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <=this.TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      }
    }
  }
  ;
</script>

<style>
  #submit {
    width: 100%;
    border: none
  }

  #toRegist {
    width: 100%;
    border: none
  }

  #poster {
    position: fixed;
    left: 0;
    top: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;

  }

  body {
    margin: 0px;
  }

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
