// 指定长度和基数
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

//深拷贝数据
function deepCopy(data) {
    //string,number,bool,null,undefined,symbol
    //object,array,date
    if (data && typeof data === "object") {
      //针对函数的拷贝
      if (typeof data === "function") {
        let tempFunc = data.bind(null);
        tempFunc.prototype = deepCopy(data.prototype);
        return tempFunc;
      }
  
      switch (Object.prototype.toString.call(data)) {
        case "[object String]":
          return data.toString();
        case "[object Number]":
          return Number(data.toString());
        case "[object Boolean]":
          return new Boolean(data.toString());
        case "[object Date]":
          return new Date(data.getTime());
        case "[object Array]":
          var arr = [];
          for (let i = 0; i < data.length; i++) {
            arr[i] = deepCopy(data[i]);
          }
          return arr;
  
        //js自带对象或用户自定义类实例
        case "[object Object]":
          var obj = {};
          for (let key in data) {
            //会遍历原型链上的属性方法，可以用hasOwnProperty来控制 （obj.hasOwnProperty(prop)
            obj[key] = deepCopy(data[key]);
          }
          return obj;
      }
    } else {
      //string,number,bool,null,undefined,symbol
      return data;
    }
  }
  

module.exports = {
    uuid,
    deepCopy
}
