<template>
  <div class="ivu-b main-part">
    <div class="doughs-part">
      <div class="divide">
        <card class="expand">
          <template v-slot:title>
            <h3>题目的熟悉程度概况</h3>
          </template>
          <DoughnutChart />
        </card>
      </div>
      <div class="divide">
        <card class="expand">
          <template v-slot:title>
            <h3>题目的标签概况</h3>
          </template>
          <DoughnutChart />
        </card>
      </div>
    </div>
    <div class="line-part">
      <div class="divide">
        <card class="expand">
          <line-chart />
        </card>
      </div>
      <div class="divide">
        <card class="expand">
          <line-chart />
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from "../components/BarChart.vue";
import DoughnutChart from "../components/DoughnutChart.vue";
import LineChart from "../components/LineChart.vue";

export default {
  name: "GeneralPage",
  components: { BarChart, DoughnutChart, LineChart },
};
</script>

<style scoped lang="less">
@padding-len: 4px;

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
