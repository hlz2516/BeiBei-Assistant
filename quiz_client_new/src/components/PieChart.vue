<template>
  <div ref="pie" id="pie"></div>
</template>

<script>
import * as echarts from "echarts";
import themeObj from "../styles/walden.project.json";

export default {
  name: "PieChart",
  data() {
    return {
      chart: null,
    };
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    datas: {
      type: Array,
      default: [],
    },
    category: {
      type: Array,
      defualt: [],
    },
    radius: {
      type: String,
      default: "100%",
    },
  },
  mounted() {
    echarts.registerTheme("walden", themeObj.theme);
    this.chart = echarts.init(this.$refs.pie, "walden");
    this.chart.setOption({
      title: {
        text: this.title,
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: this.category,
      },
      series: {
        type: "pie",
        data: this.datas,
        radius: this.radius,
      },
    });
  },
  unmounted() {
    echarts.dispose(this.chart);
    this.chart = null;
  },
};
</script>

<style scoped>
#pie{
    width: 100%;
    height: 100%;
}
</style>