<template>
  <div class="charts">
    <div class="repo-pie" ref="pie">
      <PieChart
        radius="60%"
        :category="category"
        :datas="repoData"
        :size="pieSize"
      />
    </div>
    <div class="repo-detail" v-show="repo">
      <UnitChart
        :datas="unitDatas"
        :UnitOnClick="toNewQuiz"
        width="100%"
        height="100%"
      />
    </div>
  </div>
</template>

<script>
import PieChart from "./PieChart.vue";
import UnitChart from "./UnitChart.vue";
import request from "../request";

export default {
  name: "RepoCharts",
  components: {
    PieChart,
    UnitChart,
  },
  data() {
    return {
      category: ["已熟悉", "已理解", "不理解", "未知"],
      repoData: [],
      unitDatas: [],
      pieSize: [],
    };
  },
  props: ["repo"],
  watch: {
    repo(newVal) {
      //在sessionstorage中尝试读取对应repo的data，
      let data = sessionStorage.getItem(newVal);
      //若有，则直接取饼图的数据和明细数据
      if (data) {
        this.repoData = JSON.parse(data);
        let unitDatas = sessionStorage.getItem(newVal + "*");
        this.unitDatas = JSON.parse(unitDatas);
      }
      //若没有，则发送请求
      else {
        let repoData = [
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
        ];

        request
          .get("/general/repolevels", {
            params: {
              repoName: newVal,
            },
          })
          .then((result) => {
            if (result.status === 200) {
              //计算出新的repoData
              repoData = repoData.map((item) => {
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
              //赋给真正的repoData，更新图表
              this.repoData = repoData;
              //把这条记录放入sessionstorage
              sessionStorage.setItem(newVal, JSON.stringify(this.repoData));
              //请求该题库下的所有题目，借用quicksearch接口
              return request.get("/quiz/quicksearch", {
                params: {
                  key: `<${newVal}>`,
                },
              });
            }
          })
          .then((result) => {
            if (result.status === 200) {
              this.unitDatas = result.data;
              //记录入sessionstorage
              sessionStorage.setItem(newVal + "*", JSON.stringify(result.data));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }

      this.$nextTick(() => {
        let w = parseInt(window.getComputedStyle(this.$refs.pie)["width"], 10);
        let h = parseInt(window.getComputedStyle(this.$refs.pie)["height"], 10);
        this.pieSize = [w, h];
      });
    },
  },
  methods: {
    toNewQuiz(i) {
      this.$router.push({
        name: "newquiz",
        params: {
          id: this.unitDatas[i].id,
          question: this.unitDatas[i].question,
          answer: this.unitDatas[i].answer,
          references: this.unitDatas[i].references,
          tags: this.unitDatas[i].tags,
          repoName: this.unitDatas[i].repoName,
          importance: this.unitDatas[i].importance,
        },
      });
      this.$store.dispatch("setMenuItemDelay", "newquiz");
    },
  },
};
</script>

<style lang="less" scoped>
.charts {
  height: 30%;
  margin-top: 15px;
  display: flex;
  @card-padding: 5px;

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