import { createStore } from 'vuex'

export default createStore({
  state: {
    userId:-1,
    userName:'未登录'
  },
  getters: {
  },
  mutations: {
    setUserId(state,id){
      state.userId = id
    },
    setUserName(state,name){
      state.userName = name
    }
  },
  actions: {
    setUser(context,user){
      // console.log('id',user.id,'name',user.name);
      context.commit('setUserId',user.id);
      context.commit('setUserName',user.name);
    },
    resetUser(context){
      context.commit('setUserId',-1);
      context.commit('setUserName','未登录');
    }
  },
  modules: {
  }
})
