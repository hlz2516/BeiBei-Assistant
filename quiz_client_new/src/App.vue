<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="general">
          <div class="layout-user">
            <div class="avatar">
              <Avatar icon="ios-person" />
            </div>
            <div class="user-name">我是张三</div>
          </div>
          <div class="layout-nav">
            <MenuItem name="newQues">
              <Icon type="md-bulb" />
              出 题
            </MenuItem>
            <MenuItem name="remQues">
              <Icon type="md-play" />
              背 题
            </MenuItem>
            <MenuItem name="general">
              <Icon type="md-pulse" />
              概 况
            </MenuItem>
            <MenuItem name="general">
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

        <div class="ivu-b main-part">
          <div class="doughs-part">
            <div class="divide">
              <card class="expand"></card>
            </div>
            <div class="divide">
              <card class="expand"></card>
            </div>
          </div>
          <div class="line-part">
            <div class="divide">
              <card class="expand"></card>
            </div>
            <div class="divide">
              <card class="expand"></card>
            </div>
          </div>
        </div>
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; View Design</Footer>
    </Layout>
  </div>
</template>

<script>
import BarChart from "./components/BarChart.vue";
import DoughnutChart from "./components/DoughnutChart.vue";

export default {
  components: { BarChart, DoughnutChart },
  name: "App",
};
</script>

<style lang="less">
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

@padding-len:8px;

.main-part {
  min-height: 750px;
  display: flex;
  padding: @padding-len;

  .doughs-part {
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }

  .line-part {
    flex: 7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }
  
  .divide {
    flex: 1;
    padding: @padding-len;

    .expand {
      width: 100%;
      height: 100%;
    }
  }
}






</style>
