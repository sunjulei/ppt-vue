<template>
  <div>

    <div class="oths">
      <h3>账号密码</h3> <br>
      <p>
        1、这里的账号是指邮箱
      </p>

      <p>
        2、一个邮箱只能用于登录一个账号
      </p>

      <p>
        3、密码长度为6-20位
      </p>

      <p>
        4、忘记密码可通过邮箱方式找回
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OtUsernamePassword",
    methods: {
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
