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
    
    return req
})

request.interceptors.response.use(res=>{
    // console.log(res);

    return res
})

export default request