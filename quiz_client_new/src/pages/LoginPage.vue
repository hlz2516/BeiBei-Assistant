<template>
  <div class="container">
            <template v-if="!logined" >
                <login @log-in="login" @log-out="logout"  />
                <card style="width:400px;height:400px;">
                    <template v-slot:title>
                        <h3>
                            登录规则
                        </h3>
                    </template>
                    <p>
                        本网站无需注册即可登录，只要新用户名没有与其他用户重名，即可完成注册并登录；
                        如果要登录已经存在的用户名，需要输入正确的密码
                    </p>
                </card>
            </template>
             
            <div v-else>
                <h3>您已登录，点击<a @click="logout">这里</a>退出</h3>
            </div>
  </div>
</template>

<script>
import Login from '../components/Login.vue';

export default {
    name:'LoginPage',
    components:{
        Login
    },
    data() {
        return {
            logined:false
        }
    },
    methods: {
        login(){
            this.logined = true
        },
        logout(){
            localStorage.removeItem('token');
            this.logined = false
            this.$store.dispatch('resetUser');
        }
    },
    mounted() {
        if(localStorage.getItem('token')){
            this.logined = true
        }
    },
}
</script>

<style scoped>
.container{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: row;
    justify-content:space-around;
    align-items: center;
}
</style>