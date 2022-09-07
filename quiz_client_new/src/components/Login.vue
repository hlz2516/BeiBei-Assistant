<template>
    <div class="demo-login">
        <Login @on-submit="handleSubmit">
            <UserName name="username" />
            <Password name="password" password />
            <div class="demo-auto-login">
                <Checkbox v-model="autoLogin" size="large">自动登录</Checkbox>
                <a @click="modalInfo">忘记密码</a>
            </div>
            <Submit />
        </Login>
    </div>
</template>
<script>
  import request from '../request/index';

    export default {
        data () {
            return {
                autoLogin: true
            }
        },
        methods: {
            handleSubmit (valid, { username, password }) {
                if (valid) {
                    // this.$Modal.info({
                    //     title: '输入的内容如下：',
                    //     content: 'username: ' + username + ' | password: ' + password
                    // });
                    request.post('/login',{
                      username,password
                    })
                }
            },
            modalInfo(){
              this.$Modal.info({content:"请联系开发者，QQ714251494"});
            }
        }
    }
</script>
<style>
    .demo-login{
        width: 400px;
        margin: 0 auto !important;
    }
    .demo-auto-login{
        margin-bottom: 24px;
        text-align: left;
    }
    .demo-auto-login a{
        float: right;
    }
</style>