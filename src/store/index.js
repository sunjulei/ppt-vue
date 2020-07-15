
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={
  userdata: {
    id: '',
    name: '',
    username: '',
    password: '',
    headImg: ''
    // collectList: [],
    // downloadList: [],
  },
  isLogin: "false",
  userCookie: ''
};
const getters = {   //实时监听state值的变化(最新状态)
  isLogin(state) {  //方法名随意,主要是来承载变化的showFooter的值

    return localStorage.getItem("isLogin")
  },

  userdata(state){
    // return state.userdata
    return JSON.parse(localStorage.getItem("userdata"))
  }
};
const mutations = {
  loginT(state) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    localStorage.setItem("isLogin", "true");
    state.isLogin = 'true';
  },
  loginF(state) {  //同上
    localStorage.setItem("isLogin", "false");
    state.isLogin = 'false';
  },
  userdataMu(state,data){ //同上，这里面的参数除了state之外还传了需要增加的值sum
    localStorage.setItem("userdata", JSON.stringify(data));
    state.userdata=data;
    // alert("UserMu"+data)
  }
};

const actions = {
  aloginT(context) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
    context.commit('loginT');
  },
  aloginF(context) {  //同上注释
    context.commit('loginF');
  },
  auserdata(context,data){   //同上注释，num为要变化的形参
    context.commit('userdataMu',data)
  }
};
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;
