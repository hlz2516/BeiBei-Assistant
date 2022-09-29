<template>
  <Tabs value="general" class="container">
    <TabPane label="总体概况" name="general" class="gen-layout">
      <div class="gen-pie-part">
        <Card style="height: 100%" dis-hover>
          <PieChart radius="60%" :category="category" :datas="genDatas" />
        </Card>
      </div>
      <div class="gen-line-part">
        <div class="gen-line-chart line-1">
          <Card style="height: 100%" dis-hover>
            <LineChart title="近一周的背题情况" :datas="weekDatas" :category="weekCategory" />
          </Card>
        </div>
        <div class="gen-line-chart line-2">
          <Card style="height: 100%" dis-hover>
            <LineChart title="近30天的背题情况" :datas="monthDatas" :category="monthCategory" />
          </Card>
        </div>
      </div>
    </TabPane>
    <TabPane label="题库概况" name="repo_general">
      <Dropdown style="margin-left: 20px">
        <Button type="primary">
            选择题库
            <Icon type="ios-arrow-down"></Icon>
        </Button>
        <template #list>
            <DropdownMenu>
                <DropdownItem>题库一</DropdownItem>
                <DropdownItem>题库二</DropdownItem>
            </DropdownMenu>
        </template>
    </Dropdown>
    <div class="charts">
      
    </div>
    </TabPane>
  </Tabs>
</template>

<script>
import PieChart from '../components/PieChart.vue';
import LineChart from '../components/LineChart.vue';

export default {
  name: "GeneralPage",
  components:{
    PieChart,LineChart
  },
  data() {
    return {
      category:['已熟悉','已理解','不理解','未知'],
      weekCategory:['周六','周日','周一','周二','周三','周四','周五'],
      monthCategory:['9.28','9.28','9.28','9.28','9.29','9.28','9.28','9.28','9.28','9.29','9.28','9.28','9.28','9.28','9.29','9.28','9.28','9.28','9.28','9.29'],
      genDatas:[
        {
          name:'已熟悉',
          value:30
        },
        {
          name:'已理解',
          value:220
        },
        {
          name:'不理解',
          value:10
        },
        {
          name:'未知',
          value:300
        }
      ],
      weekDatas:[20,50,0,0,35,0,0],
      monthDatas:[10,20,60,50,80,60,40,50,20,30,10,20,60,50,80,60,40,50,20,30]
    };
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.container {
  height: 80vh;
  margin-bottom: 20px;
  /deep/ .ivu-tabs-content {
    height: calc(100% - 37px);

    .gen-layout {
      height: 100%;
      display: flex;
      @card-padding: 5px;

      .gen-pie-part {
        flex: 3.5;
        padding: @card-padding;

        .ivu-card-body /deep/ {
          height: 100%;
        }
      }

      .gen-line-part {
        flex: 6.5;
        padding: @card-padding;
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .gen-line-chart {
          flex: 1;
        }

        .line-1 {
          padding-bottom: @card-padding;
          .ivu-card-body /deep/ {
            height: 100%;
          }
        }

        .line-2 {
          padding-top: @card-padding;
          .ivu-card-body /deep/ {
            height: 100%;
          }
        }
      }
    }
  }
}

.charts{
  height: 88%;
  margin-top: 15px;
  display: flex;
}
</style>
