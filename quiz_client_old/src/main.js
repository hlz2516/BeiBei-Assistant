import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router/router';
import ElementUI from 'element-ui';
import request from './config/request';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index';
// import './Mock/mock_server';

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ElementUI);

const vm = new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
    Vue.prototype.$addr = request
  }
}).$mount('#app')