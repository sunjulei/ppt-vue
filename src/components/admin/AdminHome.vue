<template>

  <div>
    <div>
      <el-row v-if="currentRole!='member'">

        <router-link to="UserListOp">
          <el-col :span="3" :offset="0">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <img :src="require('../../../static/img/usericon.png')"
                   class="image">
              <div style="padding: 14px;text-align: center">
                <span>新增用户：<span class="num">{{usersNum}}</span></span>

              </div>
            </el-card>
          </el-col>
        </router-link>

        <router-link to="FileList">
          <el-col :span="3" :offset="3">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <img :src="require('../../../static/img/fileicon.png')"
                   class="image">
              <div style="padding: 14px;text-align: center">
                <span>新增文件：<span class="num">{{filesNum}}</span></span>
              </div>
            </el-card>
          </el-col>
        </router-link>

        <router-link to="HelpSuggest">
          <el-col :span="3" :offset="3">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <img :src="require('../../../static/img/tousuicon.png')"
                   class="image">
              <div style="padding: 14px;text-align: center">
                <span>新增消息：<span class="num">{{toususNum}}</span></span>
              </div>
            </el-card>
          </el-col>
        </router-link>

       <!-- <router-link to="">
          <el-col :span="3" :offset="3">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <img src="/static/img/tjicon.png"
                   class="image">
              <div style="padding: 14px;text-align: center">
                <span>数据统计</span>
              </div>
            </el-card>
          </el-col>
        </router-link>-->
      </el-row>

      <el-row v-if="currentRole=='member'" style="text-align: center">
        <h2>欢迎访问个人管理后台</h2>
        <br>
        <br>
        <h4>若页面发生异常，建议尝试刷新</h4>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AdminHome",
    data() {
      return {
        usersNum:'0',
        filesNum:'0',
        toususNum:'0',
        currentRole:''
      };
    },
    methods:{
      initData() {
        let _this=this;

        var username=this.$cookie.get('userck')
        const url = this.baseUrl + '/findByName/' + username
        this.axios.get(url).then(function (resp) {
          _this.currentRole = resp.data.role;
        })

        var userUrl=this.baseUrl+"/user/todayNum";
        this.axios.get(userUrl).then(function (resp) {
          if(resp.data.code==200){
            _this.usersNum=resp.data.data
          }
        })

        var fileUrl=this.baseUrl+"/pptFile/todayNum";
        this.axios.get(fileUrl).then(function (resp) {
          if(resp.data.code==200){
            _this.filesNum=resp.data.data
          }
        })

        var tsUrl=this.baseUrl+"/helpSuggest/todayNum";
        this.axios.get(tsUrl).then(function (resp) {
          if(resp.data.code==200){
            _this.toususNum=resp.data.data
          }
        })

      }
    },
    created() {
      this.initData();
    },

  }
</script>

<style scoped>
  .el-card{
    background: rgba(0, 172, 237, 0);
  }

  .image {
    height: 160px;
    width: 100%;
    display: block;
  }

  .num{
    font-size: 18px;
    color: #00aced;
  }

</style>
