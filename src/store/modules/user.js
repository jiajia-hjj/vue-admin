//登录、退出登录、获取东湖信息
import { login, logout, getInfo } from '@/api/user'
// 获取|设置|移除token
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入酷游模块当中重置路由的方法
import router, { resetRouter,asyncRoutes,constantRoutes,anyRoutes } from '@/router'
import { Promise } from 'core-js'

const getDefaultState = () => {
  return {
    //token
    token: getToken(),
    // 用户名
    name: '',
    //用户头像
    avatar: '',
    // 服务器返回的菜单信息，根据不同角色，返回的标记信息，数组里面的元素是字符串
    routes:[],
    //按钮权限信息
    buttons:[],
    //角色信息
    roles:[],
    //对比之后【项目中已有的异步路由，和服务器中返回的标志信息进行对比，最终需要展示的路由】
    resultAsyncRoutes:[],
    resultAllRoutes:[]
  }
}

const state = getDefaultState()  
//唯一修改state的地方
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //  // 存用户名
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  //  // 用户头像
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  // 存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    // 用户名
       state.name=userInfo.name;
      //用户头像
       state.avatar=userInfo.avatar;
      // 菜单权限标记
       state.routes=userInfo.routes;
      //按钮权限标记
       state.buttons=userInfo.buttons;
      // 用户角色
       state.roles=userInfo.roles;
  },
  //最终计算出来的异步路由
  SET_RESULTASYNCROUTES(state,asyncRoutes){
     //vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes=asyncRoutes;
    //计算出当前用户需要展示所有路由
    state.resultAllRoutes=constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
         //给路由器添加新的路由

    router.addRoutes(state.resultAllRoutes);
  }
}
//定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes=(asyncRoutes,routes)=>{
  
  return asyncRoutes.filter(item=>{
      if(routes.indexOf(item.name)!=-1){
          //递归:别忘记还有2、3、4、5、6级路由
        if(item.children&&item.children.length>0){
          item.children=computedAsyncRoutes(item.children,routes)
        }
       return true;
      }
      

    })
    // console.log(result)
}
const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result =await login({ username: username.trim(), password: password })
    if(result.code==20000){
      const { data } = result
      // vuex存储token
      commit('SET_TOKEN', data.token);
      // 本地持久化存储token
      setToken(data.token);
    }else{
      return new Promise.reject(new Error)
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息：返回的数据包含：用户名name、用户头像avatar、routes[返回的标志：不同的用户应该展示哪些菜单]、roles用户角色、button[按钮信息：按钮权限用的标记] 
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
          //vuex存储用户全部的信息
        commit('SET_USERINFO', data);
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes));
        // const { name, avatar } = data
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

