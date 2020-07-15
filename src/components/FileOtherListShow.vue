<template>
  <div>
    <div>
      <el-carousel :interval="3000" type="card" height="330px">
        <el-carousel-item v-for="item in bannerData" :key="item.imgUrl">
          <router-link target="_blank" :to="{path:'/BannerDetail',query:{id:item.id}}">
            <img :src="baseUrl+item.imgUrl">
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </div>


    <div class="content-floor pic-floor">
      <div class="floor-container" :style="'margin-left:'+(mywidth*0.09)+'px'">
        <div class="floor-header">
          <a href="javascript:">
            <span class="title">精选PPT</span>
          </a>
          <router-link target="_blank" :to="{path:'/RecomMore'}">
            <a class="more">

              查看更多
              <i class="arrow">→</i>
            </a>
          </router-link>
        </div>

        <div class="pic-list clearfix">
          <div class="pic-item" v-for="item in recomData">
            <a href="javascript:">
              <div class="img-box">
                <img :src="baseUrl+item.roughImgUrl"  style="margin-top: -88px">

                <img :src="baseUrl+item.detailImgUrl.split('\n')[1]"  style="margin-top: 87px">
                <span class="is-business"></span>
                <div class="img-mask">
                  <router-link target="_blank" :to="{path:'/FileDetailShow',query:{id:item.id}}">
                    <div style="width: 100%;height: 100%"></div>
                  </router-link>
                  <span class="star iconfont"
                        @click="clickCollectAdd(item.id)">&#xe81a</span>

                  <span class="starH iconfont"
                        :id="'H'+item.id"
                        v-show="item.isCollect"
                        @click="clickCollectLess(item.id)">&#xe81a</span>

                  <span class="starH iconfont"
                        :id="'T'+item.id"
                        style="visibility: hidden"
                        @click="clickCollectLess(item.id)">&#xe81a</span>

                  <button class="btn" @click="downloadFileById(item.id)">
                    <i class="iconfont">&#xe6ca</i>
                    免费下载
                  </button>
                </div>
              </div>
              <div class="text-box clearfix">
                <span class="pic-type is-jx">精选</span>
                <span class="pic-title text-ellipsis">{{item.title}}</span>

                <el-popover
                  placement="top"
                  trigger="click">
                  <router-link :to="{path:'/HelpCenter',query:{title:item.title,id:item.id}}">
                    <el-link :underline="false" type="info">投诉</el-link>
                  </router-link>
                  <div slot="reference" class="pic-more">...</div>
                </el-popover>

              </div>
            </a>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>

  export default {
    name: "FileOtherListShow",
    data() {
      return {
        mywidth: (screen.availWidth * window.devicePixelRatio),
        bannerData: [],
        recomData: [],
        recomTempData: [],
        fileDownHisData: {},
        fileCollectHisData: {},
      }
    },
    methods: {
      downloadFileById(id) {
        var username = this.$cookie.get('userck')
        if (username !== null && localStorage.getItem("isLogin") === "true") {
          var url = this.baseUrl + "/pptFile/download/" + id
          this.downHistory(id, username);
          window.location.href = url
        } else {
          this.$message({
            type: 'info',
            message: '登录后免费下载'
          });
        }
      },
      downHistory(id, username) {
        this.fileDownHisData.fileId = id;
        this.fileDownHisData.username = username;
        var fileDownUrl = this.baseUrl + "/fileDown/add"
        this.axios.post(fileDownUrl, this.fileDownHisData);
      },
      clickCollectAdd(id) {
        var username = this.$cookie.get('userck')

        if (username === "null" && localStorage.getItem("isLogin") !== "true") {
          this.$message({
            type: 'warning',
            message: '请先登录后收藏'
          });
        } else {
          document.getElementById('T' + id).style.visibility = "visible";//显示
          this.fileCollectHisData.fileId = id;
          this.fileCollectHisData.username = username;
          var fileCollectUrl = this.baseUrl + "/fileCollect/add"
          this.axios.post(fileCollectUrl, this.fileCollectHisData);
          this.$message({
            type: 'success',
            message: '收藏成功'
          });
        }
      },
      clickCollectLess(id) {
        var username = this.$cookie.get('userck')
        if (username === "null" && localStorage.getItem("isLogin") !== "true") {
          this.$message({
            type: 'warning',
            message: '请先登录后收藏'
          });
        } else {
          document.getElementById('H' + id).style.visibility = "hidden";//隐藏
          document.getElementById('T' + id).style.visibility = "hidden";//隐藏
          var username = this.$cookie.get('userck')
          this.fileCollectHisData.fileId = id;
          this.fileCollectHisData.username = username;
          var url = this.baseUrl + "/fileCollect/deleteByFileIdAndUsername"
          this.axios.post(url, this.fileCollectHisData);
          this.$message({
            type: 'success',
            message: '已取消收藏'
          });
        }

      },
    },
    created() {
      //banner滚动条
      let _this = this

      var bannerUrl = this.baseUrl + '/indexBanner/findAll/0/15';
      this.axios.get(bannerUrl).then(function (resp) {
        _this.bannerData = resp.data.content
      })

      //推荐栏
      var recomUrl = this.baseUrl + '/pptFile/findRecom/0/16';
      this.axios.get(recomUrl).then(async function (resp) {
        _this.recomTempData = resp.data.content

        var username = _this.$cookie.get('userck')
        if (username !== "" && username !== undefined) {
          for (let i = 0; i < resp.data.content.length; i++) {
            var fileCollUrl = _this.baseUrl + "/fileCollect/fileIsCollect/" + username + "/" + resp.data.content[i].id;
            await _this.axios.get(fileCollUrl).then(function (resp2) {
              if (resp2.data !== 0) {
                _this.recomTempData[i].isCollect = true;
              } else {
                _this.recomTempData[i].isCollect = false;
              }

            })
          }
        }
        _this.recomData = _this.recomTempData;
      })
    }
  }
</script>

<style scoped>
  /* start banner 样式*/
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item img {
    border-radius: 8px;
    height: 100%;
    width: 100%;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  /* end banner 样式*/
</style>
