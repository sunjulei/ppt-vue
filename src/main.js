// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import qs from 'qs'
import store from './store'//引入store
import axios from 'axios'

import router from './router'

Vue.use(ElementUI);
Vue.use(qs)

Vue.prototype.axios = axios

import VueCookie from 'vue-cookie'

Vue.use(VueCookie)

Vue.config.productionTip = false

//图片放大
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer);
//滚动条
import GeminiScrollbar from 'vue-gemini-scrollbar'

Vue.use(GeminiScrollbar)

Viewer.setDefaults({
  Options: {
    "inline": true,
    "button": true,
    "navbar": true,
    "title": true,
    "toolbar": true,
    "tooltip": true,
    "movable": true,
    "zoomable": true,
    "rotatable": true,
    "scalable": true,
    "transition": true,
    "fullscreen": true,
    "keyboard": true,
    "url": "data-source"
  }
});


// Vue.prototype.baseUrl = process.env.API_ROOT;
Vue.prototype.baseUrl = "http://localhost:8181/pptapi";
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//使用store
  components: {App},
  template: '<App/>'

})
