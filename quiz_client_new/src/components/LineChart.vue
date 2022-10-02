<template>
  <div ref="line" id="line"></div>
</template>

<script>
import * as echarts from "echarts";
import themeObj from "../styles/walden.project.json";

export default {
  name: "LineChart",
  data() {
    return {
      chart: null,
    };
  },
  props: {
    title: {
      type: String,
      default: "示例",
    },
    datas: {
      type: Array,
      default: [],
    },
    category: {
      type: Array,
      defualt: [],
    },
  },
  mounted() {
    echarts.registerTheme("walden", themeObj.theme);
    this.chart = echarts.init(this.$refs.line, "walden");
    this.chart.setOption({
      title: {
        text: this.title,
      },
      xAxis: {
        type: "category",
        data: this.category,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: this.datas,
          type: "line",
          label: {
            show: true,
            position: "top",
            textStyle: {
              fontSize: 12,
            },
          },
        },
      ],
    });
  },
  unmounted() {
    echarts.dispose(this.chart);
    this.chart = null;
  },
  watch: {
    category(newVal) {
      console.log('category updated');
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: newVal
        },
      });
    },
    datas(newVal) {
      console.log('datas updated');
      this.chart.setOption({
        series: [
          {
            data: newVal,
            type: "line",
            label: {
              show: true,
              position: "top",
              textStyle: {
                fontSize: 12,
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
#line {
  width: 100%;
  height: 100%;
}
</style>