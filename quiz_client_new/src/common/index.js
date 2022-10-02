function getInfoFromJwt(jwtStr){
    let payLoad = jwtStr.split('.')[1];
    return window.atob(payLoad);
}

function getWeekDay(index) {  
    let day = '';
    switch (index) {
        case 0:
            day = '周日'
            break;
        case 1:
            day = '周一';
            break;
        case 2:
            day = '周二';
            break;
        case 3:
            day = '周三';
            break;
        case 4:
            day = '周四';
            break;
        case 5:
            day = '周五';
            break;
        case 6:
            day = '周六';
            break;
        default:
            break;
    }
    return day;
}

export default {
    getInfoFromJwt,
    getWeekDay
}