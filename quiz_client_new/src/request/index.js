import axios from 'axios';
import app from '../main';


//参考尚品汇P16
const request = axios.create({
    baseURL:process.env.VUE_APP_SERVER_ADDR,
    timeout:5000
})

request.interceptors.request.use(config=>{
    //配置对象，可以配置请求头
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config
})

request.interceptors.response.use(succeed=>{
    //若返回成功，将直接返回对象中的data
    //对于token过期的处理
    if (succeed.data.status === 401) {
        //删除token
        localStorage.removeItem('token');
        //重置vuex state中用户信息
        app.config.globalProperties.$store.dispatch('resetUser');
        //重定位到/login
        app.config.globalProperties.$router.replace('/login');
    }
    return succeed.data
},reject=>{
    return Promise.reject(new Error('failed'))
})

export default request