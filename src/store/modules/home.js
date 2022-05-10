import request from '@/utils/request'
import mockRequest from '@/utils/mockRequest'
const state={
    list:{}
};
const mutations={
      GETDATA(state,list){
         state.list=list;
      }
};
const actions={
       async getData({commit}){
           let result= await mockRequest({url:'/home/list',method:'get'});
           if(result.code==20000){
                 commit('GETDATA',result.data);
           }
       } 
};
const getters={

};
export default {
    state,
    mutations,
    actions,
    getters
}