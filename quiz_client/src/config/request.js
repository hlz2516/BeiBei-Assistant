import axios from 'axios';
import tools from '../tools/index';

let baseURL

if(process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:3000';
} else if(process.env.NODE_ENV === 'production') {
    baseURL = 'http://www.normal-hu.top:9900';
}

const request =  axios.create({
    baseURL,
    timeout:5000
})

request.interceptors.request.use(req=>{
    // console.log(req);
    //对于发送的每个数据项都要进行编码处理
    
    return req
})

request.interceptors.response.use(res=>{
    // console.log(res);
    //对于接收的每个数据项都要进行解码处理

    return res
})

export default request