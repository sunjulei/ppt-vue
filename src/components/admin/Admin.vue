<template>
  <div>
    <div>
      <link rel="apple-touch-icon" href="https://i.imgur.com/QRAUqs9.png">
      <link rel="shortcut icon" href="https://i.imgur.com/QRAUqs9.png">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.0/normalize.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css">
      <link rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/pixeden-stroke-7-icon@1.2.3/pe-icon-7-stroke/dist/pe-icon-7-stroke.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.0/css/flag-icon.min.css">
      <link rel="stylesheet" href="./static/admin/assets/css/cs-skin-elastic.css">
      <link rel="stylesheet" href="./static/admin/assets/css/style.css">
      <link href="https://cdn.jsdelivr.net/npm/chartist@0.11.0/dist/chartist.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/jqvmap@1.5.1/dist/jqvmap.min.css" rel="stylesheet">
    </div>

    <div>
      <div style="background: #f1f2f7;">
        <!-- Left Panel -->
        <aside style="background: #fff;width: 250px" id="left-panel" class="left-panel">
          <nav class="navbar navbar-expand-sm navbar-default">
            <div id="main-menu" class="main-menu collapse navbar-collapse">

              <el-menu style="border: rgb(0,0,0)" class="el-menu-vertical-demo"
                       @open="handleOpen" @close="handleClose" :unique-opened="true"
                       :collapse="isCollapse">

                <el-submenu index="1" v-if="currentRole==='admin'">
                  <template slot="title">
                    <i class="el-icon-s-tools"></i>
                    <span slot="title">系统管理</span>
                  </template>


                  <router-link to="/SessionList">
                    <el-menu-item index="1-1">
                      <i class="el-icon-s-platform"></i>
                      <span slot="title">会话列表</span>
                    </el-menu-item>
                  </router-link>


                  <router-link to="/BackUp">
                    <el-menu-item index="1-2">
                      <i class="el-icon-coin"></i>
                      <span slot="title">数据备份</span>
                    </el-menu-item>
                  </router-link>

                  <!--<el-submenu index="1-2">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span slot="title">角色管理</span>
                    </template>
                    <el-menu-item index="1-2-1">
                      <i class="el-icon-menu"></i>
                      <span slot="title">角色列表</span>
                    </el-menu-item>
                    <el-menu-item index="1-2-2">
                      <i class="el-icon-menu"></i>
                      <span slot="title">新建角色</span>
                    </el-menu-item>
                  </el-submenu>

                  <el-submenu index="1-3">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span slot="title">菜单管理</span>
                    </template>

                    <router-link to="/MenuList">
                      <el-menu-item index="1-3-1">
                        <i class="el-icon-menu"></i>
                        <span slot="title">菜单列表</span>
                      </el-menu-item>
                    </router-link>

                    <el-menu-item index="1-3-2">
                      <i class="el-icon-menu"></i>
                      <span slot="title">新建菜单</span>
                    </el-menu-item>
                  </el-submenu>-->

                  <el-submenu index="1-4">
                    <template slot="title">
                      <i class="el-icon-user-solid"></i>
                      <span slot="title">用户权限</span>
                    </template>

                    <router-link to="/UserList">
                      <el-menu-item index="1-4-1">
                        <i class="el-icon-user"></i>
                        <span slot="title">用户列表</span>
                      </el-menu-item>
                    </router-link>

                    <router-link to="/UserAdd">
                      <el-menu-item index="1-4-2">
                        <i class="el-icon-plus"></i>
                        <span to="/SessionList" slot="title">添加用户</span>
                      </el-menu-item>
                    </router-link>
                  </el-submenu>
                </el-submenu>

                <el-submenu index="2" v-if="currentRole==='operator'||currentRole==='admin'">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">运维管理</span>
                  </template>

                  <router-link to="/FileList">
                    <el-menu-item index="2-1">
                      <i class="el-icon-tickets"></i>
                      <span slot="title">文件管理</span>
                    </el-menu-item>
                  </router-link>


                  <el-submenu index="2-2">
                    <template slot="title">
                      <i class="el-icon-user-solid"></i>
                      <span slot="title">用户管理</span>
                    </template>
                    <router-link to="/UserListOp">
                      <el-menu-item index="2-2-1">
                        <i class="el-icon-user"></i>
                        <span slot="title">用户列表</span>
                      </el-menu-item>
                    </router-link>
                    <router-link to="/UserAddOp">
                      <el-menu-item index="2-2-2">
                        <i class="el-icon-plus"></i>
                        <span slot="title">新增用户</span>
                      </el-menu-item>
                    </router-link>
                  </el-submenu>

                  <router-link to="/Background">
                    <el-menu-item index="2-2-5">
                      <i class="el-icon-picture"></i>
                      <span slot="title">背景管理</span>
                    </el-menu-item>
                  </router-link>

                  <el-submenu index="2-3">
                    <template slot="title">
                      <i class="el-icon-files"></i>
                      <span slot="title">专题管理</span>
                    </template>
                    <router-link to="/ActivityFile">
                      <el-menu-item index="2-3-1">
                        <i class="el-icon-notebook-2"></i>
                        <span slot="title">专题列表</span>
                      </el-menu-item>
                    </router-link>

                    <router-link to="/ActivityAdd">
                      <el-menu-item index="2-3-2">
                        <i class="el-icon-plus"></i>
                        <span slot="title">新建专题</span>
                      </el-menu-item>
                    </router-link>
                  </el-submenu>

                  <router-link to="/HelpSuggest">
                    <el-menu-item index="2-4">
                      <i class="el-icon-warning-outline"></i>
                      <span slot="title">投诉建议</span>
                    </el-menu-item>
                  </router-link>
                </el-submenu>

                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-s-custom"></i>
                    <span slot="title">个人中心</span>
                  </template>

                  <router-link to="/UserData">
                    <el-menu-item index="3-3">
                      <i class="el-icon-user"></i>
                      <span slot="title">个人资料</span>
                    </el-menu-item>
                  </router-link>

                  <router-link to="/AddFile">
                    <el-menu-item index="3-1">
                      <i class="el-icon-upload2"></i>
                      <span slot="title">上传文件</span>
                    </el-menu-item>
                  </router-link>

                  <router-link to="/MyFile">
                    <el-menu-item index="3-2">
                      <i class="el-icon-notebook-2"></i>
                      <span slot="title">我的文件</span>
                    </el-menu-item>
                  </router-link>


                  <router-link to="/CollectFile">
                    <el-menu-item index="3-4">
                      <i class="el-icon-collection-tag"></i>
                      <span slot="title">收藏记录</span>
                    </el-menu-item>
                  </router-link>

                  <router-link to="/DownFile">
                    <el-menu-item index="3-5">
                      <i class="el-icon-download"></i>
                      <span slot="title">下载记录</span>
                    </el-menu-item>
                  </router-link>

                  <router-link to="/RecordFile">
                    <el-menu-item index="3-6">
                      <i class="el-icon-view"></i>
                      <span slot="title">浏览历史</span>
                    </el-menu-item>
                  </router-link>
                </el-submenu>
              </el-menu>

            </div>
          </nav>
        </aside>
        <!-- /#left-panel -->
        <!-- Right Panel -->
        <div id="right-panel" class="right-panel">
          <!-- Header-->
          <header id="header" class="header">
            <div class="top-left">
              <div style="height: 30px" class="navbar-header">
                <router-link to="/admin">
                  <a class="navbar-brand" href=""><img :src="require('../../../static/admin/images/logo.png')" alt="Logo"></a>
                </router-link>
                <a class="navbar-brand hidden" href=""><img :src="require('../../../static/admin/images/logo2.png')" alt="Logo"></a>
                <a id="menuToggle" class="menutoggle" @click="collClick"><i class="el-icon-s-fold"></i></a>
              </div>
            </div>
            <div class="top-right">
              <div class="header-menu">

                <el-button style="text-align: center;margin: 8px 0" @click="logout" type="primary" plain>注销</el-button>&emsp;

                <el-popover
                  placement="bottom"
                  trigger="hover">
                  <el-link :underline="false" type="info" href="">回到首页</el-link>
                  <br>
                  <br>
                    <el-link :underline="false" type="info" href="#/HelpCenter">投诉建议</el-link>
                  <div slot="reference"  v-if="'true'===this.isIndexLogin" style="align-items: center;margin-top: 8px">
                    <img slot="reference"  class="img-circle" style="width: 40px;height: 40px"
                         v-if="'true'===this.isIndexLogin&&this.userdata.headImg!=null"
                         :src="baseUrl+this.userdata.headImg">

                    <el-avatar  v-if="'true'===this.isIndexLogin&&this.userdata.headImg==null"
                               style="width: 40px;height: 40px"> {{userdata.name}}
                    </el-avatar>
                  </div>
                </el-popover>


              </div>
            </div>
          </header>

          <div style="width: 95%" class="content">
            <router-view></router-view>
            <div style="margin-bottom: 500px"></div>
          </div>
          <!-- /.content -->
          <div class="clearfix"></div>
          <!-- Footer -->
          <!--<footer style="width: 95%" class="site-footer">
            <div class="footer-inner bg-white">
              <div class="row">
                <div class="col-sm-6">
                  Copyright &copy; 2020 sunlee
                </div>
              </div>
            </div>
          </footer>-->
          <!-- /.site-footer -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Admin",
    data() {
      return {
        isCollapse: false,
        currentRole: '',
        isIndexLogin: '',
        userdata: '',
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      collClick() {
        if (this.isCollapse) {
          this.isCollapse = false
          $('template').removeClass('open');
          $('#left-panel').toggleClass('open-menu');
        } else {
          this.isCollapse = true;
          $('template').toggleClass('open');
          $('#left-panel').removeClass('open-menu');
        }
        // var windowWidth = $(window).width();
        // if (windowWidth<1010) {
        //   $('template').removeClass('open');
        //   if (windowWidth<760){
        //     $('#left-panel').slideToggle();
        //   } else {
        //     $('#left-panel').toggleClass('open-menu');
        //   }
        // } else {
        //   $('template').toggleClass('open');
        //   $('#left-panel').removeClass('open-menu');
        // }
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

        this.$router.push({
          name: 'Home',
        });
      },
    },
    created() {
      let _this = this;

      var username = this.$cookie.get('userck')
      if (username === 'null') {
        this.$router.push({
          name: 'login'
        })

        return;
      } else {
        this.isIndexLogin = 'true'
      }

      const url = this.baseUrl + '/findByName/' + username
      this.axios.get(url).then(function (resp) {
        _this.currentRole = resp.data.role;

        // if (resp.data.role === 'admin') {
        //   _this.currentActive = '1-1'
        //   _this.$router.push({
        //     name: 'SessionList',
        //   });
        // } else if (resp.data.role === 'operator') {
        //   _this.currentActive = '2-1'
        //   _this.$router.push({
        //     name: 'UserListOp',
        //   });
        // } else {
        //   _this.currentActive = '3-3'
        //   _this.$router.push({
        //     name: 'UserData',
        //   });
        // }
      })
    },
    beforeUpdate() {
      this.userdata = JSON.parse(localStorage.getItem("userdata"))
    },
  }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    min-height: 820px;
  }

</style>
