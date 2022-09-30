import { createStore } from "vuex";

export default createStore({
  state: {
    userId: -1,
    userName: "未登录",
    menuItem: "login",
  },
  getters: {},
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setMenuItem(state, itemName) {
      state.menuItem = itemName;
    },
  },
  actions: {
    setUser(context, user) {
      // console.log('id',user.id,'name',user.name);
      context.commit("setUserId", user.id);
      context.commit("setUserName", user.name);
    },
    resetUser(context) {
      context.commit("setUserId", -1);
      context.commit("setUserName", "未登录");
    },
    setMenuItemDelay(context, name) {
      context.commit("setMenuItem", '');
      setTimeout(() => {
        context.commit("setMenuItem", name);
      }, 100);
    },
  },
  modules: {},
});
