<template>
  <div>

    <div class="oths">
      <h3>版权问题</h3> <br>
      <p>好多PPT网的宗旨是为用户提供免费、高质量的PPT用于学习，若有侵犯版权，请与客服联系！ <br>
        也可发送邮箱到1374856829@qq.com进行投诉！</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Copyright",
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
    margin-bottom: 420px;
  }
</style>
