<template>
  <div id="app" :style="'background: #f6f6f6;width:' +(mywidth)+'px'">
    <router-view ></router-view>
    <el-backtop></el-backtop>

    <div v-show="!(path==='/admin')
    &&!(path==='/SessionList')
    &&!(path==='/UserList')
    &&!(path==='/UserAdd')
    &&!(path==='/FileList')
    &&!(path==='/FileUpdate')
    &&!(path==='/UserListOp')
    &&!(path==='/UserAddOp')
    &&!(path==='/MyFile')
    &&!(path==='/MyFileUpdate')
    &&!(path==='/UserData')
    &&!(path==='/RecordFile')
    &&!(path==='/CollectFile')
    &&!(path==='/DownFile')
    &&!(path==='/AddFile')
    &&!(path==='/ActivityAdd')
    &&!(path==='/ActivityFile')
    &&!(path==='/ActivityUpdate')
    &&!(path==='/Background')
    &&!(path==='/login')
    &&!(path==='/register')
    &&!(path==='/ForgetPass')
    &&!(path==='/HelpSuggest')
    &&!(path==='/BackUp')
    &&!(path==='/AdminHome')
">
      <div class="content-floor footer-floor" :style="'width:'+mywidth+'px'">
        <div class="floor-container">
          <div class="footer-header clearfix">
            <dl>
              <dt>常见问题</dt>
              <dd><a href="javascript:" @click="toPage('OtLoginRegist')">注册/登录</a></dd>
              <dd><a href="javascript:" @click="toPage('OtUsernamePassword')">账号/密码</a></dd>
              <dd><a href="javascript:" @click="toPage('Copyright')">版权问题</a></dd>
            </dl>
            <dl>
              <dt>关于好多PPT网</dt>
              <dd><a href="javascript:" @click="toPage('AboutWe')">关于我们</a></dd>
              <dd><a href="javascript:" @click="toPage('Donation')">捐赠/赞赏</a></dd>

            </dl>
            <dl>
              <dt>产品服务</dt>
              <dd><a href="javascript:" @click="toPage('WeChatHao')">微信公众号</a></dd>
              <dd><a href="javascript:" @click="toPage('Blogs')">个人博客</a></dd>
              <dd><a href="javascript:" @click="toPage('HelpCenter')">投诉/建议</a></dd>
            </dl>
            <div class="service">
              <div class="title">客服咨询</div>
              <div class="mid clearfix">
                <a href="http://wpa.qq.com/msgrd?v=3&uin=1374856829&site=qq&menu=yes" class="click"><span
                  class="iconfont">&#xe640</span>点我交谈</a>
                <a href="javascript:" @click="toPage('CommonProblem')" class="question">常见问题<span>&#187</span></a>
              </div>
              <a href="javascrit:" class="email"><span class="iconfont">&#xe857</span>1374856829@qq.com</a>
            </div>
          </div>
          <div class="footer-mid">
            <div class="icon">
              <a href="https://weibo.com/2247843481/profile?rightmod=1&wvr=6&mod=personinfo"
                 class="iconfont">&#xe61f</a>
              <a href="http://wpa.qq.com/msgrd?v=3&uin=1374856829&site=qq&menu=yes" class="iconfont">&#xe640</a>
            </div>
            <div class="link">
              <a href="javascript:" @click="toPage('OtLoginRegist')">注册声明</a>
              <a href="javascript:" @click="toPage('Copyright')">版权声明</a>
              <a href="javascript:" @click="toPage('Privacy')">隐私声明</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>为了防范电信网络诈骗，如网民接到962110电话，请立即接听</p>
            <p class="info">Copyright ©2020-现在 好多PPT网 粤ICP备xxxxxxxx号-x ICP证书: 粤xx-xxxxxxxx上海工商
              <a href="javascript:"><img src="/static/qt/img/beianico.png" alt="">粤公网安备xxxxxxxxxxxxxx号</a>
              <a href="javascript:"><img src="/static/qt/img/label_sm_90020.png" alt=""></a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import "../static/qt/index.js"

  export default {
    name: 'App',
    data() {
      return {
        mywidth: (screen.availWidth * window.devicePixelRatio),
        timmer: null,
        path: ''
      }
    },
    watch: {
      $route(to, from) {
        this.path = to.path;
      }
    },
    created() {
    },
    mounted() {
      //this.$store.getters.isLogin
      this.path = this.$route.path;
      var session = sessionStorage.getItem("login");
      if (session == null || session === "") {
        //第一次打开
        sessionStorage.setItem("login", "first");
      }

      var cookie = this.$cookie.get('userck')
      const _this = this
      if (cookie != null || cookie !== "") {
        const url = this.baseUrl + '/findByName/' + cookie
        this.axios.get(url).then(function (resp) {
          _this.$store.dispatch('auserdata', resp.data)
        })

      }

      /*监听页面关闭
      window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
      window.addEventListener('unload', e => this.unloadHandler(e))*/

    },

    methods: {
      toPage(page) {
        this.$router.push({
          name: page
        })
      }
      /*监听页面关闭
      beforeunloadHandler() {
        this._beforeUnload_time = new Date().getTime();
      },
      unloadHandler(e) {
        this._gap_time = new Date().getTime() - this._beforeUnload_time;
        debugger
        //判断是窗口关闭还是刷新
        if (this._gap_time <= 5) {
          //如果是登录状态，关闭窗口前，移除用户
          const sessionUrl = this.baseUrl + "/sessionList/update"
          this.axios.post(sessionUrl, {
            sessionId: localStorage.getItem("currentSess"),
            state: "离线",
            endTime: new Date().getTime(),
          });
        }
      }*/
    },

  }
</script>

<style>
  @import "../static/qt/index.css";
  @import "../static/qt/max1220px.css";
  @import "../static/qt/icon_font/iconfont.css";
</style>
