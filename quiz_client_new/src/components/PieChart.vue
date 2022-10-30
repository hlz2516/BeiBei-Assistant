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
      default: "",
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
    size:{
      type:Array,
      default:[]
    }
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
    window.onresize = ()=>{
      this.chart.resize();
    }
  },
  unmounted() {
    echarts.dispose(this.chart);
    this.chart = null;
  },
  watch: {
    datas(newVal) {
      this.chart.setOption({
        series: {
          type: "pie",
          data: newVal,
          radius: this.radius,
        },
      });
    },
    size(newVal){
      if (newVal instanceof Array) {
        if (newVal.length === 2){
          this.chart.resize({
            width:newVal[0],
            height:newVal[1]
          })
        }
      }
    }
  },
};
</script>

<style scoped>
#pie {
  width: 100%;
  height: 100%;
}
</style>