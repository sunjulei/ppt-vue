<template>
  <body>
  <img id="poster" :src="baseUrl+'/pptImg/bgImg/regist.jpg'" width='100%' height='100%'>
  <el-form :model="registerForm" class="login-container" label-position="left" :rules="rules" ref="registerForm"
           label-width="0px">

    <el-form-item>
      <a href="">
        <el-image  style="width: 100%; height: 100%;" :src="require('../../static/logo.png')">
        </el-image>
      </a>
      <h3 class="login_title">用户注册</h3>
    </el-form-item>






    <el-form-item prop="name">

      <el-input type="text" v-model="registerForm.name"
                auto-complete="off" placeholder="昵称"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input type="password" v-model="registerForm.password" placeholder="密码" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item prop="checkPass">
      <el-input type="password" v-model="registerForm.checkPass" placeholder="确认密码" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item prop="username" name="username">
      <el-input type="text" v-model="registerForm.username"
                auto-complete="off" placeholder="邮箱"></el-input>
    </el-form-item>

    <el-form-item prop="yzm">
      <el-input type="text" name="yzm" v-model="registerForm.yzm"
                auto-complete="off" placeholder="验证码">
      </el-input>

    </el-form-item>

    <el-form-item  v-show="show">
      <el-button id="subYzm"
                 v-loading="loading"
                 element-loading-spinner="el-icon-loading"
                 element-loading-text="正在发送验证码……"
                 type="primary"
                 style="width: 100%"
                 v-on:click="checkYzm('registerForm')">获取验证码
      </el-button>
    </el-form-item>

    <el-form-item v-if="!show" >
      <el-button id="subReYzm" type="primary" style="width: 100%"  disabled>重新获取（{{count}}）
      </el-button>
    </el-form-item>


    <el-form-item style="width: 100%">
      <el-button type="primary" id="submit" v-on:click="register('registerForm')">注册</el-button>
    </el-form-item>

    <el-form-item style="width: 100%">
      <router-link :to="{path:'/login'}">
        <el-button id="toRegist" type="success">有账号，去登录</el-button>
      </router-link>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>

  export default {
    name: 'register',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度不小于6位'));
        } else {
          if (this.registerForm.checkPass !== '') {
            this.$refs.registerForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registerForm: {
          name: '',
          username: '',
          password: '',
          checkPass: '',
          yzm: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 3, max: 20, message: '昵称长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          yzm: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 6, max: 6, message: '请输入6位数的验证码', trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}

          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
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
            var checkUrl = _this.baseUrl + "/user/yzm"
            _this.axios.post(checkUrl, {
              username: _this.registerForm.username
            }).then(function (resp) {
              if (resp.data.code === 200) {
                _this.$message({
                  message: "验证码发送成功！！",
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

      register(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // var params = new URLSearchParams();
            // params.append('param1', _this.registerForm);
            // params.append('param2', 'value2');
            // yzm: _this.registerForm.yzm
            _this.axios
              .post(_this.baseUrl + '/register/' + _this.registerForm.yzm, _this.registerForm)
              .then(res => {
                if (res.data.code === 200) {
                  _this.$message({
                    message: '注册成功！',
                    type: 'success'
                  });

                  _this.$router.push({
                    name: 'login'
                  })

                  // 注册成功后自动登录
                  /*this.axios
                    .post(_this.baseUrl + '/login', {
                      name: this.registerForm.name,
                      username: this.registerForm.username,
                      password: this.registerForm.password
                    })
                    .then(res => {
                      if (res.data.code === 200) {
                        var username = res.data.data.username
                        _this.$cookie.set('userck', username)//失效单位时间：天
                        _this.$store.state.userCookie = this.$cookie.get('userck')//保存到全局 /config/user.js
                        _this.$store.dispatch('aloginT')
                        const url = _this.baseUrl+'/findByName/' + username
                        this.axios.get(url).then(function (resp) {
                          _this.$store.dispatch('auserdata', resp.data)
                        })
                        _this.$router.replace('/');
                      }
                    })*/


                } else if (res.data.code === 400) {
                  _this.$message({
                    message: res.data.message,
                    type: 'warning'
                  });
                }
              })
          } else {
            _this.$message({
              message: '请检查参数是否有误！',
              type: 'error'
            });
            return false;
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
