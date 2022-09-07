<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="login">
          <div class="layout-user">
            <div class="avatar">
              <Avatar icon="ios-person" />
            </div>
            <div class="user-name">{{userName}}</div>
          </div>
          <div class="layout-nav">
            <MenuItem name="login" to="/login">
              <Icon type="md-person" />
              登 录
            </MenuItem>
            <MenuItem name="newQues">
              <Icon type="md-bulb" />
              出 题
            </MenuItem>
            <MenuItem name="remQues" to="/home">
              <Icon type="md-play" />
              背 题
            </MenuItem>
            <MenuItem name="general" to="/general">
              <Icon type="md-pulse" />
              概 况
            </MenuItem>
            <MenuItem name="setup" >
              <Icon type="md-cog" />
              设 置
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{ padding: '0 50px' }">
        <Breadcrumb :style="{ margin: '20px 0' }">
          <BreadcrumbItem>general</BreadcrumbItem>
        </Breadcrumb>
        <router-view></router-view>
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; View Design</Footer>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      userName:'未登录'
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
  width: 420px;
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
