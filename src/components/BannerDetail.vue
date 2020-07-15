<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <img style="height:450px;width:100%;" :src="baseUrl+bannerData.imgUrl">
        </div>
      </el-col>
    </el-row>


    <div class="content-floor pic-floor">
      <div class="floor-container" :style="'margin-left:'+(mywidth)+'px'">
        <div class="pic-list clearfix">
          <div class="pic-item" v-for="item in fileListData">
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

          </div>

        </div>
      </div>
    </div>

    <el-pagination
      style="margin-bottom: 30px;text-align: center"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="page">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "BannerDetail",
    data() {
      return {
        mywidth: (screen.availWidth * window.devicePixelRatio)*0.09,
        pageSize: '0',
        total: '0',
        bannerData: {
          id: '',
          title: '',
          imgUrl: '',
          order: '',
        },
        fileDownHisData: {},
        fileListData: [],
        fileCollectHisData: {},
        collectTempData: [],

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
      async page(currentPage) {
        parent.window.scrollTo(0, 0);//滚到顶端
        let _this = this;

        var url = this.baseUrl + "/pptFile/findFileByMenuAndType/" + '0/' + this.bannerData.title + '/' + (currentPage - 1) + '/20';
        await this.axios.get(url).then(async function (resp) {
          _this.collectTempData = resp.data.content
          _this.pageSize = resp.data.size
          _this.total = resp.data.totalElements

          var username = _this.$cookie.get('userck')
          if (username !== 'null' && localStorage.getItem("isLogin") === "true") {
            for (let i = 0; i < resp.data.content.length; i++) {
              var fileCollUrl = _this.baseUrl + "/fileCollect/fileIsCollect/" + username + "/" + resp.data.content[i].id;
              await _this.axios.get(fileCollUrl).then(function (resp2) {
                if (resp2.data !== 0) {
                  _this.collectTempData[i].isCollect = true;
                } else {
                  _this.collectTempData[i].isCollect = false;
                }
              })
            }
          }
          _this.fileListData = _this.collectTempData;
        })

      },
      //通过ID获得Banner相关数据
      async initBannerData() {
        let _this = this
        var id = this.$route.query.id
        var url = this.baseUrl + '/indexBanner/findById/' + id;
        await this.axios.get(url).then(function (resp) {
          _this.bannerData = resp.data
          _this.page(1)
        })

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
      this.initBannerData();
      //加载文件列表...
    }
  }
</script>

<style scoped>

</style>
