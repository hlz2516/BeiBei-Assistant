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
            <LineChart
              title="近一周的背题情况"
              :datas="weekDatas"
              :category="weekCategory"
            />
          </Card>
        </div>
        <div class="gen-line-chart line-2">
          <Card style="height: 100%" dis-hover>
            <LineChart
              title="近30天的背题情况"
              :datas="monthDatas"
              :category="monthCategory"
            />
          </Card>
        </div>
      </div>
    </TabPane>
    <TabPane label="题库概况" name="repo_general">
      <Dropdown
        trigger="click"
        style="margin-left: 20px"
        @on-click="handleDropdown"
      >
        <Button type="primary">
          选择题库
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <template #list>
          <DropdownMenu>
            <DropdownItem v-for="(r, i) in repos" :key="i" :name="r">
              {{ r }}
            </DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
      <repo-charts :repo="curRepo" />
    </TabPane>
  </Tabs>
</template>

<script>
import PieChart from "../components/PieChart.vue";
import LineChart from "../components/LineChart.vue";
import UnitChart from "../components/UnitChart.vue";
import RepoCharts from "../components/RepoCharts.vue";
import request from "@/request";
import common from "../common/index";

export default {
  name: "GeneralPage",
  components: {
    PieChart,
    LineChart,
    UnitChart,
    RepoCharts,
  },
  data() {
    return {
      category: ["已熟悉", "已理解", "不理解", "未知"],
      weekCategory: [],
      monthCategory: [],
      genDatas: [
        {
          name: "已熟悉",
          value: 0,
        },
        {
          name: "已理解",
          value: 0,
        },
        {
          name: "不理解",
          value: 0,
        },
        {
          name: "未知",
          value: 0,
        },
      ],
      weekDatas: [],
      monthDatas: [],
      proGeneral: null,
      proRepoGeneral: null,
      proWeek: null,
      proMonth: null,
      repos: [],
      curRepo: "",
    };
  },
  methods: {
    handleDropdown(name) {
      this.curRepo = name;
    },
  },
  created() {
    this.proGeneral = request.get("/general/level");
    this.proWeek = request.get("/general/week");
    this.proMonth = request.get("/general/month");
  },
  mounted() {
    request
      .get("/repos")
      .then((result) => {
        if (result.status === 200) {
          this.repos = result.msg.map((item) => {
            return item.name;
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });

    this.proGeneral
      .then((result) => {
        if (result.status === 200) {
          // console.log('data',result.data);
          this.genDatas = this.genDatas.map((item) => {
            //去result.data中找有没有item.name === obj.level的
            //如果有，将其item.value改为obj.quizCount
            let sameLevel = result.data.filter((obj) => {
              return obj.level === item.name;
            });
            if (sameLevel.length === 1) {
              item.value = sameLevel[0].quizCount;
              return item;
            } else {
              return item;
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });

    this.proWeek
      .then((result) => {
        if (result.status === 200) {
          this.weekCategory = result.data
            .map((obj) => {
              return common.getWeekDay(obj.week);
            })
            .reverse();

          this.weekDatas = result.data
            .map((obj) => {
              return obj.count;
            })
            .reverse();
        }
      })
      .catch((err) => {
        console.error(err);
      });

    this.proMonth
      .then((result) => {
        if (result.status === 200) {
          this.monthCategory = result.data
            .map((obj) => {
              return obj.date;
            })
            .reverse();

          this.monthDatas = result.data
            .map((obj) => {
              return obj.count;
            })
            .reverse();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
</script>

<style scoped lang="less">
@card-padding: 5px;

.container {
  height: 80vh;
  margin-bottom: 20px;
  /deep/ .ivu-tabs-content {
    height: calc(100% - 37px);

    .gen-layout {
      height: 100%;
      display: flex;

      .gen-pie-part {
        flex: 3.5;
        padding: @card-padding;

        .ivu-card-body /deep/ {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
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

.charts {
  height: 30%;
  margin-top: 15px;
  display: flex;

  .repo-pie {
    flex: 3;
    padding: @card-padding;
  }

  .repo-detail {
    flex: 7;
    padding: @card-padding;
  }
}
</style>
