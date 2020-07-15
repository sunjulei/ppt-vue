<template>
  <body>

  <img id="poster" :src="baseUrl+'/pptImg/bgImg/login.jpg'" width='100%' height='100%'>
  <el-form class="login-container" label-position="left"
           label-width="0px">

    <el-form-item>
      <router-link to="/AdminHome">
        <el-image style="width: 100%; height: 100%;" :src="require('../../static/logo.png')">
        </el-image>
      </router-link>
      <h3 class="login_title">系统登录</h3>
    </el-form-item>

    <el-form-item>
      <el-input type="text" v-model="loginForm.username"
                auto-complete="off" placeholder="邮箱"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button type="primary" id="submit" v-on:click="login">登录</el-button>
    </el-form-item>

    <el-form-item style="width: 100%">
      <router-link :to="{path:'/register'}">
        <el-button id="toRegist" type="success">没账号，去注册</el-button>
      </router-link>
    </el-form-item>

    <el-form-item style="width: 100%">
      <router-link :to="{path:'/ForgetPass'}">
        <el-button id="forgetPass" type="info" style="width: 100%">忘记密码</el-button>
      </router-link>
    </el-form-item>

  </el-form>
  </body>
</template>

<script>

  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        }
      };
    },

    methods: {
      login() {
        let _this = this;
        if (this.loginForm.username === '' || this.loginForm.password === '') {
          _this.$message({
            type: 'warning',
            message: '账号或密码不能为空 !'
          });

        } else {
          this.axios
            .post(_this.baseUrl + '/login', {
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            .then(res => {
              if (res.data.code === 200) {
                var username = res.data.data.username
                // var password=res.data.data.password
                // var a = Date.now();
                _this.$cookie.set('userck', username, 30)//失效单位时间：天
                _this.$store.state.userCookie = this.$cookie.get('userck')//保存到全局 /config/user.js
                _this.$store.dispatch('aloginT')

                const url = _this.baseUrl + '/findByName/' + username
                this.axios.get(url).then(function (resp) {
                  _this.$store.dispatch('auserdata', resp.data)
                })

                var sessionId = this.generateUUID();
                localStorage.setItem("currentSess", sessionId)
                var d = new Date().getTime();
                const sessionUrl = this.baseUrl + "/sessionList/save"
                this.axios.post(sessionUrl, {
                  user: username,
                  sessionId: sessionId,
                  state: "在线",
                  startTime: d,
                  ip: returnCitySN["cip"],
                  address: returnCitySN["cname"]
                }).then(function () {
                  _this.$message({
                    type: 'success ',
                    message: '登录成功 !'
                  });
                })

                _this.$router.replace('/');
              } else if (res.data.code === 400) {
                _this.$message({
                  type: 'warning',
                  message: '账号或密码错误 !'
                });
              }
            })
            .catch(failResponse => {
              _this.$message({
                type: 'error',
                message: "未知错误：" + failResponse
              });
            });
        }
      },
      generateUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
          d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid.replace("-", "");
      }
    }
  };
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
    margin: 0;
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
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
