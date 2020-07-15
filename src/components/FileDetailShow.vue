<template>
  <div id="curr-body">


    <el-row :gutter="0">
      <div id="main-top"></div><!--留顶部空白用-->
      <el-page-header style="margin: 10px 100px" @back="goIndex" content="首页"></el-page-header>
      <el-col :span="14" style="text-align: center;width: 800px;height: auto">
        <div class="grid-content bg-purple" style="padding: 10px 20px">
          <br>
          <h3 style="color:#757575;text-align: center;padding-bottom: 20px">{{fileData.title}} </h3>
          <br>
          <br>
          <video style="width: 750px;height: auto;margin-bottom: 100px"
                 v-if="fileData.videoUrl!=''" controls autoplay
                 :src="this.baseUrl+fileData.videoUrl"/>

          <div >
              <img style="width: 750px;height: auto" v-for="url in imgUrlList" :key="url" :src="baseUrl+url"/>
          </div>
        </div>

      </el-col>

      <el-col :span="6">
        <div>
          <div class="grid-content bg-purple" style="padding: 40px 20px 30px 30px">
            <el-button style="width: 50%" type="primary" @click="downloadFileById">免费下载</el-button>

            <el-button @click="clickCollectLess(fileData.id)" title="已收藏" v-show="fileData.isCollect" type="primary"
                       icon="el-icon-star-off" circle></el-button>
            <el-button @click="clickCollectAdd(fileData.id)" title="点击收藏" v-show="!fileData.isCollect"
                       icon="el-icon-star-off" circle></el-button>
            <br>
            <br>
            下载：{{fileData.downNum}} &emsp; 收藏：{{fileData.collectNum}}
          </div>
          <br>
          <div class="grid-content bg-purple" style="padding: 20px 30px">

            作者：{{fileData.author}} <br><br>
            大小：{{fileData.size}}<br><br>
            页数：{{fileData.pagNum}}页<br><br>
            上传时间：{{fileData.upData.split(" ")[0]}}<br><br>
          </div>
          <br>
          <div class="grid-content bg-purple" style="padding: 20px 30px;color: #6a7074">
            标签：<span style="white-space: pre-line;">{{fileData.tag}}</span>
          </div>
          <br>
          <div class="grid-content bg-purple" style="padding: 20px 30px;color: #6a7074">
            说明：<span style="white-space: pre-line;">{{fileData.fileDesc}}</span>
          </div>
        </div>
      </el-col>

    </el-row>

  </div>

</template>

<script>

  export default {
    name: "FileDetailShow",
    data() {
      return {
        fileData: {
          id: '',
          name: '',
          downUrl: '',
          tag: '',
          title: '',
          type: '',
          menu: '',
          size: '',
          desc: '',
          collectNum: '0',
          downNum: '0',
          pagNum: '',
          author: '',
          roughImgUrl: '',
          detailImgUrl: '',
          upData: '',
          videoUrl: ''
        },
        imgUrlList: [],
        fileHistData: {},
        fileDownHisData: {},
        fileCollectHisData: {},
      }
    },
    methods: {
      //返回首页
      goIndex(){
        window.location.href=''
      },
      downloadFileById() {
        var id = this.$route.query.id
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
        let _this = this;
        var username = this.$cookie.get('userck')
        if (username === "null" && localStorage.getItem("isLogin") !== "true") {
          this.$message({
            type: 'warning',
            message: '请先登录后收藏'
          });
        } else {
          this.fileData.isCollect = true;
          this.fileCollectHisData.fileId = id;
          this.fileCollectHisData.username = username;
          var fileCollectUrl = this.baseUrl + "/fileCollect/add"
          this.axios.post(fileCollectUrl, this.fileCollectHisData);
          _this.fileData.collectNum += 1;
          _this.$message({
            type: 'success',
            message: '收藏成功'
          });
        }

      },
      clickCollectLess(id) {
        let _this = this;
        var username = this.$cookie.get('userck')
        if (username === "null" && localStorage.getItem("isLogin") !== "true") {
          this.$message({
            type: 'warning',
            message: '请先登录后收藏'
          });
        } else {
          this.fileData.isCollect = false;
          this.fileCollectHisData.fileId = id;
          this.fileCollectHisData.username = username;
          var url = this.baseUrl + "/fileCollect/deleteByFileIdAndUsername"
          this.axios.post(url, this.fileCollectHisData);
          _this.fileData.collectNum -= 1;
          _this.$message({
            type: 'success',
            message: '已取消收藏'
          });
        }

      },
      //收藏数
      initCollNum(id) {
        let _this = this;
        var url = this.baseUrl + "/fileCollect/countNum/" + id
        this.axios.get(url).then(function (resp) {
          if (resp.data.code == 200) {
            _this.fileData.collectNum = resp.data.data
          }
        })
      },
      //下载数
      initDownNum(id) {
        let _this = this;
        var url = this.baseUrl + "/fileDown/countNum/" + id
        this.axios.get(url).then(function (resp) {
          if (resp.data.code == 200) {
            _this.fileData.downNum = resp.data.data
          }
        })
      }
    },
    created() {
      var _this = this
      var id = this.$route.query.id
      var username = this.$cookie.get('userck')

      var fileUrl = this.baseUrl + "/pptFile/findFileById/" + id
      this.axios.get(fileUrl).then(async function (resp) {
        _this.collectTempData = resp.data.data[0]
        _this.imgUrlList = resp.data.imgUrlList

        var fileCollUrl = _this.baseUrl + "/fileCollect/fileIsCollect/" + username + "/" + resp.data.data[0].id;
        await _this.axios.get(fileCollUrl).then(function (resp2) {
          if (resp2.data == 0) {
            _this.collectTempData.isCollect = false;
          } else {
            _this.collectTempData.isCollect = true;
          }
        })
        _this.fileData = _this.collectTempData;
        //收藏数
        _this.initCollNum(id);
        //下载数
        _this.initDownNum(id);
      })

      if (username !== 'null' && localStorage.getItem("isLogin") === "true") {
        this.fileHistData.fileId = id;
        this.fileHistData.username = username
        var fileHistUrl = this.baseUrl + "/fileHistory/add"
        this.axios.post(fileHistUrl, this.fileHistData);
      }
    }
  }

</script>

<style scoped>
  #curr-body{
  background: #ffffff;
}
  #main-top{
    margin-top: 100px;
    margin-bottom: 20px;
  }

  last-child {
    margin-bottom: 0;
  }


  .el-col {
    margin-left: 100px;
    border-radius: 4px;
  }


  .bg-purple {
    background: rgba(243, 243, 243, 0.5);
  }



  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

</style>
