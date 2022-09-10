<template>
  <div class="demo-login">
    <Login @on-submit="handleSubmit">
      <UserName name="username" :rules="userNameRule" />
      <Password name="password" password :rules="pwdRule" />
      <div class="demo-auto-login" style="height:10px;">
        <span class="error">{{errorInfo}}</span>
        <a @click="modalInfo">忘记密码</a>
      </div>
      <Submit />
    </Login>
  </div>
</template>
<script>
import request from "../request/index";
import common from '../common';

export default {
  data() {
    const userNameValidator = (rule,value,callback)=>{
        if(!value || value.length === 0){
            callback(new Error('请输入用户名'))
            return
        }
        if (value.length < 3 || value.length > 12) {
            callback(new Error('请控制用户名长度在3~12之间'))
            return
        }
        callback();
    }

    const pwdValidator = (rule,value,callback)=>{
        if (!value || value.length === 0) {
            callback(new Error('请输入密码'))
            return
        }
        let regex = /^[a-zA-Z]\w{5,17}$/;
        if (!regex.test(value)) {
            callback(new Error('以字母开头，长度在6-18之间，只能包含字符、数字和下划线'));
            return
        }
        callback();
    }

    return {
      userNameRule: {
        validator:userNameValidator
      },
      pwdRule:{
        validator:pwdValidator
      },
      errorInfo:''
    };
  },
  emits: ["logIn", "logOut"],
  methods: {
    handleSubmit(valid, { username, password }) {
      if (valid) {
        request
          .post("/login", {
            name: username,
            password,
          })
          .then((resp) => {
            switch (resp.status) {
              case 200:
                //保存jwt字符串到loacalstorage
                localStorage.setItem("token", resp.token);
                //解析token得到userinfo
                let info = common.getInfoFromJwt(resp.token);
                info = JSON.parse(info);
                this.$store.dispatch('setUser',info);
                //触发父组件LoginPage的login方法，刷新局部页面
                this.$emit("logIn");
                break;
              case 207:
                this.errorInfo = '密码错误，请重新输入密码';
                break;
              case 401:
                this.errorInfo = 'token过期，请重新登录';
              default:
                //其他情况可能是服务器发生内部错误，我们都清除掉客户端的token，并还原user信息
                localStorage.removeItem('token');
                this.$store.dispatch('resetUser');
                this.$emit("logOut");
                break;
            }
          });
      }
    },
    modalInfo() {
      this.$Modal.info({ content: "请联系开发者，QQ：714251494" });
    },
  },
};
</script>
<style>
.demo-login {
  width: 400px;
  margin: 0 auto !important;
}
.demo-auto-login {
  margin-bottom: 16px;
  text-align: left;
}
.demo-auto-login a {
  float: right;
}

.error{
    color: red;
    font-size: 14px;
    line-height: 18px;
}
</style>
