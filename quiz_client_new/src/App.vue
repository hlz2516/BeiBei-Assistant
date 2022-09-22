<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          v-bind:active-name="activedName"
          @onSelect="handleSelect"
        >
          <div class="layout-user">
            <div class="avatar">
              <Avatar icon="ios-person" />
            </div>
            <div class="user-name">{{ $store.state.userName }}</div>
          </div>
          <div class="layout-nav">
            <MenuItem name="login" to="login">
              <Icon type="md-person" />
              登 录
            </MenuItem>
             <MenuItem name="repo" to="repo">
              <Icon type="ios-paper" />
              题库管理
            </MenuItem>
            <MenuItem name="newQues" to="newQuiz">
              <Icon type="md-bulb" />
              出 题
            </MenuItem>
            <MenuItem name="remQues" to="remQuiz">
              <Icon type="md-play" />
              背 题
            </MenuItem>
            <MenuItem name="general" to="general">
              <Icon type="md-pulse" />
              概 况
            </MenuItem>
            <MenuItem name="sponsor">
              <Icon type="md-heart-outline" />
              赞 助
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{ padding: '0 50px', margin: '30px 0' }">
        <router-view v-slot="{ Component }" v-if="isRouterAlive">
          <!-- <keep-alive> -->
            <component :is="Component" />
          <!-- </keep-alive> -->
        </router-view>
      </Content>
      <Footer class="layout-footer-center">
        <p>Powered by Express & Vue3 | Designed by View Design</p> 
        </Footer>
    </Layout>
  </div>
</template>

<script>
import {ref} from 'vue';
import common from "./common";

export default {
  name: "App",
  provide(){
    return {
      reload:this.reload
    }
  },
  setup() {
    //准备数据
    let activedName = ref("login");
    let isRouterAlive = ref(true);
    //准备方法
    function handleSelect(name) {
      if (name === "login") {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        //目前只能通过这种重置再改变的方式让active的样式生效
        setTimeout(() => {
          activedName.value = '';
        }, 0);
        setTimeout(() => {
          activedName.value = 'login';
        }, 0);
      } else {
        activedName.value = name;
      }
    }

    function reload() {  
      isRouterAlive.value = false;
      this.$nextTick(()=>{
        isRouterAlive.value = true;
      })
    }

    return {
      activedName,
      isRouterAlive,
      handleSelect,
      reload
    }
  },

  mounted() {
    this.$router.replace("/login");
    const jwt = localStorage.getItem("token");
    if (jwt) {
      // console.log(jwt);
      let info = common.getInfoFromJwt(jwt.toString());
      info = JSON.parse(info);
      this.$store.dispatch("setUser", info);
    }
  },
};
</script>

<style>
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei";
}

.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-user {
  width: 160px;
  height: 40px;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 10px;
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.layout-nav {
  width: 600px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
.layout .ivu-layout-header {
  background: #191a23;
}
.layout-topMiddleBottom .ivu-menu-light {
  background: none;
  color: #fff;
}

.avatar {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-name {
  flex: 7;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #d7dde4;
}
</style>
