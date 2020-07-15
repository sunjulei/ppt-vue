<template>
  <div>

    <div class="oths">
      <h3>注册登录</h3> <br>
      <p>
        1、<a @click="toPage('register')">注册</a>：在注册页面输入账号、昵称、密码、验证码，即可注册成功 <br><br>
        其中验证码会通过邮箱的形式发送，并且邮箱作为登录的账号使用
      </p>
      <br>
      <p>
        2、<a @click="toPage('login')">登录</a>：在登录页面输入账号以及密码即可登录成功，账号是指邮箱
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OtLoginRegist",
    methods:{
      toPage(page) {
        this.$router.push({
          name: page
        })
      }
    }
  }
</script>

<style scoped>
  body{
    background: #f8fafc;
  }
  .oths {
    font-size: 20px;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 320px;
  }
</style>
