<template>
  <div>

    <div class="oths">
      <h3>微信公众号：编程与技术</h3> <br>
      <p>一个不定时分享有趣干货、技术杂贴的公众号</p>
      <img class="imgs" alt="扫码关注" :src="require('../../../static/img/gzh.png')">
    </div>
  </div>
</template>

<script>
  export default {
    name: "WeChatHao"
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
    margin-bottom: 170px;
  }

  .imgs{
    width: 400px;
    height: auto;
  }
</style>
