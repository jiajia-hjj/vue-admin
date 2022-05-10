import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({
  showSpinner: false,
}); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  console.log(to.redirectedFrom);
  // 启动进度条

  NProgress.start();
  // 设置页面标题
  document.title = getPageTitle(to.meta.title);

  const hasToken = getToken();

  if (hasToken) {
    //有token的情况
    if (to.path === "/login") {
      //是去登录页的话，直接进入到主页面
      next({
        path: "/",
      });
      NProgress.done();
    } else {
      //不是去登录页的话，先判断是否有个人信息(个人信息，权限)
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo != "") {
        //有个人信息，直接进入页面
        next();
      } else {
        //没有个人信息，获取个人信息
        try {
          //获取个人信息成功
          await store.dispatch("user/getInfo");
          if (to.redirectedFrom) {
            // next(to.redirectedFrom)
            router.replace(to.redirectedFrom);
          } else {
            next();
          }
        } catch (error) {
          // 获取个人信息失败，说明命令过去删除令牌并转到登录页面重新登录
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* 没有token的情况*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next();
    } else {
      //其他没有访问权限的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
