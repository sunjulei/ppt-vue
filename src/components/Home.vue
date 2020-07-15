<template>
  <div>
    <!--悬浮条——搜索框-->
    <fixed-top-wrap>
      <div class="topbar">
        <div class="topbar-container">
          <el-row style="bottom: 0px; z-index: 0;text-align: center; height: 100px" justify="center" align="middle"
                  v-if="true" type="flex">

            <el-col :xs="8" :sm="8">
              <a href="">
                <el-image @click="backIndex" style="width: 370px; height: 150px;"
                          :src="require('../../static/logo.png')">
                </el-image>
              </a>
            </el-col>

            <el-col :xs="8" :sm="8">
              <div>
                <el-input class="input-with-select" placeholder="请输入内容" v-model="selectFile.input">
                  <el-select v-model="selectFile.select" slot="prepend" placeholder="全部">
                    <el-option label="全部" value="0"></el-option>
                    <el-option v-for="item in menuActiveData" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <el-button @click="selectFileClick" slot="append" icon="el-icon-search">
                  </el-button>
                </el-input>
              </div>
            </el-col>
            <el-col :xs="8" :sm="8">

              <router-link :to="{path:'/login'}">
                <el-button v-if="'true'!==this.isIndexLogin" type="primary" plain>登录</el-button>
              </router-link>
              <router-link :to="{path:'/register'}">
                <el-button v-if="'true'!==this.isIndexLogin" type="success" plain>注册</el-button>
              </router-link>


              <div v-if="'true'===this.isIndexLogin" style="align-items: center;display: flex;margin-left: 30%">
                <el-button v-if="'true'===this.isIndexLogin" @click="logout" type="primary" plain>注销</el-button>&emsp;

                <el-popover
                  placement="bottom"
                  trigger="hover">
                  <router-link to="/admin">
                    <el-link :underline="false" type="info">管理平台</el-link>
                  </router-link>
                  <br>
                  <br>
                  <router-link to="/HelpCenter">
                    <el-link :underline="false" type="info">投诉建议</el-link>
                  </router-link>
                  <div slot="reference">
                    <el-avatar v-if="'true'===this.isIndexLogin&&this.userdata.headImg==null">
                      {{userdata.name}}
                    </el-avatar>
                    <img class="img-circle" style="width: 40px;height: 40px"
                         v-if="'true'===this.isIndexLogin&&this.userdata.headImg!=null"
                         :src="baseUrl+this.userdata.headImg">
                  </div>
                </el-popover>


              </div>
            </el-col>

          </el-row>
        </div>
      </div>
    </fixed-top-wrap>

    <div class="filebody">
      <div>
        <!--菜单和分类-->
        <div style="background: #ffffff;width:90%;margin: 0 auto;">
          <el-tabs :stretch="true" style="margin-top: 20px" v-model="menuActive" @tab-click="menuClick">
            <el-tab-pane label="全部" name="全部"/>
            <el-tab-pane :labelContent="item.id" v-for="item in menuActiveData" :label="item.name" :name="item.name+''">

              <el-tabs :stretch="true" v-model="typeActive" @tab-click="typeClick">
                <el-tab-pane label="全部" name="全部"/>

                <el-tab-pane v-for="item2 in typeActiveData" :label="item2.typeName"
                             :name="item2.typeName+''">
                </el-tab-pane>
              </el-tabs>

            </el-tab-pane>
          </el-tabs>
        </div>
      </div>


      <!--置顶-->
<!--      <el-divider></el-divider>-->

      <!--首页——文件列表-->
      <FileListShow v-if="isRouterAlive==1" style="margin: 50px auto"></FileListShow>

      <!--首页——推荐页-->
      <FileOtherListShow v-if="isRouterAlive==2" style="margin: 50px auto"></FileOtherListShow>

      <!--课件-->
      <!--      <CoursewareFile v-if="isRouterAlive==3" style="margin-top: 50px"></CoursewareFile>-->
    </div>


  </div>
</template>

<script>
  import FileListShow from './FileListShow.vue';
  import FixedTopWrap from '../components/FixedTopWrap';
  import FileOtherListShow from "./FileOtherListShow.vue";
  // import CoursewareFile from "./CoursewareFile.vue";

  export default {
    name: 'Home',
    provide() {
      return {
        reload: this.reload
      };
    },
    components: {
      FileListShow,
      FileOtherListShow,
      FixedTopWrap,
      // CoursewareFile,
    },
    data() {
      return {
        isIndexLogin: '',
        userdata: {
          id: '',
          name: '',
          username: '',
          password: '',
          headImg: ''
        },
        menuId: '0',
        menuActive: '全部',
        menuActiveData: [],
        typeActive: '全部',
        typeActiveData: [],
        isRouterAlive: 2,
        selectFile: {
          menuId: '',
          input: '',
          select: '0'
        }
      };
    },
    methods: {
      menuClick(tabMenu, event) {
        const _this = this;
        _this.typeActive = '全部'

        this.axios.get(this.baseUrl + '/pptType/findAllByMenuName/' + tabMenu.label).then(function (resp) {
          _this.typeActiveData = resp.data
        })

        _this.menuId = tabMenu.labelContent;
        this.typeClick();

        /*if (_this.menuId == "7") {
          this.$nextTick(function () {
            this.isRouterAlive = 3;
            this.$router.push({
              name: 'CoursewareFile'
            });
          })
          return false;
        } else if (_this.menuId == "8") {
          //字体下载
        } else {
          this.typeClick()
        }*/


      },
      typeClick() {
        const _this = this;
        this.isRouterAlive = 2;
        this.$nextTick(function () {
          this.isRouterAlive = 1;
          this.$router.push({
            name: 'FileListShow',
            query: {menuId: _this.menuId, menuName: _this.menuActive, typeName: _this.typeActive}
          });
        })

        /*if (_this.menuId == "7") {
          this.isRouterAlive = 1;
          this.$nextTick(function () {
            this.isRouterAlive = 3;
            this.$router.push({
              name: 'CoursewareFile',
              query: {typeName: _this.typeActive}
            });
          })
        }
        else if (_this.menuId == "8"){

        }
        else{
          this.isRouterAlive = 2;
          this.$nextTick(function () {
            this.isRouterAlive = 1;
            this.$router.push({
              name: 'FileListShow',
              query: {menuId: _this.menuId, menuName: _this.menuActive, typeName: _this.typeActive}
            });
          })
        }*/


      },
      selectFileClick() {
        const _this = this;
        this.menuActive = '全部'
        this.isRouterAlive = 2;
        this.$nextTick(function () {
          this.isRouterAlive = 1;
          this.$router.push({
            name: 'FileListShow',
            query: {menuId: _this.selectFile.select, typeName: _this.selectFile.input}
          });
        })
      },
      backIndex() {
        this.menuActive = '全部'
        this.$nextTick(function () {
          this.isRouterAlive = 2;
          this.$router.push({
            name: 'FileOtherListShow',
          });
        })

      },
      logout() {
        //提交结束时间
        const sessionUrl = this.baseUrl + "/sessionList/update"
        this.axios.post(sessionUrl, {
          sessionId: localStorage.getItem("currentSess"),
          state: "离线",
          endTime: new Date().getTime(),
        }).then(function () {
        });

        localStorage.removeItem("currentSess"),
          localStorage.removeItem("userdata");
        this.$store.dispatch('aloginF')
        this.$store.state.userCookie = ""
        this.$cookie.set('userck', null)
        window.location.reload();
      },
    },
    created() {
      const _this = this;

      this.isIndexLogin = localStorage.getItem("isLogin");

      this.axios.get(this.baseUrl + '/pptMenu/findAll').then(function (resp) {
        _this.menuActiveData = resp.data
      });
      // this.selectFileClick()


    },
    mounted() {

    },
    beforeUpdate() {
      this.userdata = JSON.parse(localStorage.getItem("userdata"))
    },

  };
</script>
<style>

  .el-select .el-input {
    width: 120px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  body {
    margin: 0px;
    background: #f6f6f6;
  }

  .filebody {
    margin: 50px 20px 20px;
  }


</style>
