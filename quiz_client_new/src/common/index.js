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

// function compare(obj1, obj2) {
//     let isEqual = true;
//     //type判断null时会为object，所以这里要特殊处理
//     if (obj1 === null && obj2 === null) {
//       return true;
//     }

//     //如果是基本数据类型
//     if (typeof obj1 !== "object" && typeof obj2 !== "object") {
//       return obj1 === obj2;
//     }

//     //如果是数组
//     if (Array.isArray(obj1) && Array.isArray(obj2)) {
//       for (let i = 0; i < obj1.length; i++) {
//         isEqual = isEqual && compare(obj1[i], obj2[i]);
//       }
//       return isEqual;
//     }
//     //如果是对象
//     let isObj1 =
//       Object.prototype.toString.call(obj1).indexOf("Object") > -1;
//     let isObj2 =
//       Object.prototype.toString.call(obj2).indexOf("Object") > -1;
//     if (isObj1 && isObj2) {
//       for (const key in obj1) {
//         if (obj2.hasOwnProperty(key)) {
//             isEqual = isEqual && compare(obj1[key],obj2[key]);
//         }
//         else{
//             isEqual = false;
//         }
//       }
//       return isEqual;
//     }
//   }


export default {
    getInfoFromJwt,
    getWeekDay
}