<template>
  <div>

    <div class="oths">
      <h3>捐赠/赞赏</h3> <br>
      <p>
        如果觉得该网站有帮到你，那就请我喝咖啡吧！
      </p>
      <div >
        <img class="imgs"  :src="require('../../../static/img/zf.jpg')" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Donation"
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
    margin-bottom: 160px;
  }
  .imgs{
    width: 530px;
    height: auto;
  }
</style>
