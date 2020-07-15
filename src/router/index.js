import Vue from 'vue'
import Router from 'vue-router'


import FileListShow from "../components/FileListShow";
import FileDetailShow from "../components/FileDetailShow";
import Home from "../components/Home";
import FileOtherListShow from "../components/FileOtherListShow";
import login from "../components/login";
import register from "../components/register";
import BannerDetail from "../components/BannerDetail";
import RecomMore from "../components/RecomMore";
import Admin from "../components/admin/Admin";
import SessionList from "../components/admin/sysAdmin/SessionList";
import UserList from "../components/admin/sysAdmin/UserList";
import UserAdd from "../components/admin/sysAdmin/UserAdd";
import FileList from "../components/admin/operator/FileList";
import FileUpdate from "../components/admin/sysAdmin/FileUpdate";
import UserListOp from "../components/admin/operator/UserListOp";
import UserAddOp from "../components/admin/operator/UserAddOp";
import MyFile from "../components/admin/user/MyFile";
import MyFileUpdate from "../components/admin/user/MyFileUpdate";
import UserData from "../components/admin/user/UserData";
import RecordFile from "../components/admin/user/RecordFile";
import CollectFile from "../components/admin/user/CollectFile";
import DownFile from "../components/admin/user/DownFile";
import AddFile from "../components/admin/user/AddFile";
import ActivityFile from "../components/admin/operator/ActivityFile";
import ActivityAdd from "../components/admin/operator/ActivityAdd";
import ActivityUpdate from "../components/admin/operator/ActivityUpdate";
import Background from "../components/admin/sysAdmin/Background";
import OtLoginRegist from "../components/other/OtLoginRegist";
import OtUsernamePassword from "../components/other/OtUsernamePassword";
import Copyright from "../components/other/Copyright";
import AboutWe from "../components/other/AboutWe";
import Donation from "../components/other/Donation";
import WeChatHao from "../components/other/WeChatHao";
import Blogs from "../components/other/Blogs";
import HelpCenter from "../components/other/HelpCenter";
import HelpSuggest from "../components/admin/operator/HelpSuggest";
import Privacy from "../components/other/Privacy";
import CommonProblem from "../components/other/CommonProblem";
import ForgetPass from "../components/ForgetPass";
import BackUp from "../components/admin/sysAdmin/BackUp";
import AdminHome from "../components/admin/AdminHome";
import CoursewareFile from "../components/CoursewareFile";


Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/FileListShow',
          name: 'FileListShow',
          component: FileListShow
        },
        {
          path: '/CoursewareFile',
          name: 'CoursewareFile',
          component: CoursewareFile
        },
        {
          path: '/FileOtherListShow',
          name: 'FileOtherListShow',
          component: FileOtherListShow
        },
      ]
    },
    {
      path: '/FileDetailShow',
      name: 'FileDetailShow',
      component: FileDetailShow
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/ForgetPass',
      name: 'ForgetPass',
      component: ForgetPass
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/BannerDetail',
      name: 'BannerDetail',
      component: BannerDetail
    },
    {
      path: '/RecomMore',
      name: 'RecomMore',
      component: RecomMore
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      redirect: '/AdminHome',
      children: [
        {
          path: '/AdminHome',
          name: 'AdminHome',
          component: AdminHome,
        },
        {
          path: '/SessionList',
          name: 'SessionList',
          component: SessionList,
        },
        {
          path: '/BackUp',
          name: 'BackUp',
          component: BackUp,
        },
        {
          path: '/UserList',
          name: 'UserList',
          component: UserList,
        },
        {
          path: '/UserAdd',
          name: 'UserAdd',
          component: UserAdd,
        },
        {
          path: '/FileList',
          name: 'FileList',
          component: FileList,
        },
        {
          path: '/FileUpdate',
          name: 'FileUpdate',
          component: FileUpdate,
        },
        {
          path: '/UserListOp',
          name: 'UserListOp',
          component: UserListOp,
        },
        {
          path: '/UserAddOp',
          name: 'UserAddOp',
          component: UserAddOp,
        },
        {
          path: '/MyFile',
          name: 'MyFile',
          component: MyFile,
        },
        {
          path: '/MyFileUpdate',
          name: 'MyFileUpdate',
          component: MyFileUpdate,
        },
        {
          path: '/UserData',
          name: 'UserData',
          component: UserData,
        },
        {
          path: '/RecordFile',
          name: 'RecordFile',
          component: RecordFile,
        },
        {
          path: '/CollectFile',
          name: 'CollectFile',
          component: CollectFile,
        },
        {
          path: '/DownFile',
          name: 'DownFile',
          component: DownFile,
        },
        {
          path: '/AddFile',
          name: 'AddFile',
          component: AddFile,
        },
        {
          path: '/ActivityFile',
          name: 'ActivityFile',
          component: ActivityFile,
        },
        {
          path: '/ActivityAdd',
          name: 'ActivityAdd',
          component: ActivityAdd,
        },
        {
          path: '/ActivityUpdate',
          name: 'ActivityUpdate',
          component: ActivityUpdate,
        },
        {
          path: '/Background',
          name: 'Background',
          component: Background,
        },
        {
          path: '/HelpSuggest',
          name: 'HelpSuggest',
          component: HelpSuggest,
        },

      ]
    },
    {
      path: '/OtLoginRegist',
      name: 'OtLoginRegist',
      component: OtLoginRegist,
    },
    {
      path: '/OtUsernamePassword',
      name: 'OtUsernamePassword',
      component: OtUsernamePassword,
    },
    {
      path: '/Copyright',
      name: 'Copyright',
      component: Copyright,
    },
    {
      path: '/AboutWe',
      name: 'AboutWe',
      component: AboutWe,
    },
    {
      path: '/Donation',
      name: 'Donation',
      component: Donation,
    },
    {
      path: '/WeChatHao',
      name: 'WeChatHao',
      component: WeChatHao,
    },
    {
      path: '/Blogs',
      name: 'Blogs',
      component: Blogs,
    },
    {
      path: '/HelpCenter',
      name: 'HelpCenter',
      component: HelpCenter,
    },
    {
      path: '/Privacy',
      name: 'Privacy',
      component: Privacy,
    },
    {
      path: '/CommonProblem',
      name: 'CommonProblem',
      component: CommonProblem,
    }
  ]
});


// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//
//   if (to.path === '/admin') {
//     if (localStorage.getItem("isLogin") === 'true') {
//       next();
//     }else {
//       next({path: '/login',})
//     }
//   } else {
//     next();
//   }
// });
// router.afterEach((to, from, next) => {
//   next();
// });

export default router;
