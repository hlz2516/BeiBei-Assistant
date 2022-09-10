function getInfoFromJwt(jwtStr){
    let payLoad = jwtStr.split('.')[1];
    return window.atob(payLoad);
}

export default {
    getInfoFromJwt
}