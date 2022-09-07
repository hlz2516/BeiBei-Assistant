import axios from 'axios';

//参考尚品汇P16
const request = axios.create({
    baseURL:'/api',
    timeout:5000
})

request.interceptors.request.use(config=>{
    //配置对象，可以配置请求头
    return config
})

request.interceptors.response.use(succeed=>{
    //若返回成功，将直接返回对象中的data
    return succeed.data
},reject=>{
    return Promise.reject(new Error('failed'))
})

export default request