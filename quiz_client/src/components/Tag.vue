<template>
  <div class="tag-container">
    <div class="area-1">
      <i class="iconfont add">&#xe600;</i>
    </div>
    <div class="area-2" @click="handleChoosed" ref="area2">
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name:'tag',
  data() {
    return {
      content: this.tag || "",
      choosed: false,
    };
  },

  methods: {
    handleChoosed() {
      this.choosed = !this.choosed;
      this.$refs.area2.classList.toggle("choosed");
      this.$bus.$emit('tagChanged',this.content,this.choosed)
    },
    clear(){
      this.choosed = false
      this.$refs.area2.classList.remove("choosed");
    }
  },
  props: ["tag"],
};
</script>

<style scoped>
.tag-container {
  width: fit-content;
  height: 24px;
  border: 1px solid black;
}

.area-1 {
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  border: 1px solid red;
  float: left;
  text-align: center;
}

.area-1:hover {
  background-color: rgba(100, 100, 100, 0.1);
  cursor: pointer;
}

.area-1 .add {
  font-size: 16px;
  line-height: 24px;
}

.area-2 {
  width: auto;
  height: 24px;
  box-sizing: border-box;
  float: left;
  border: 1px solid blue;
  position: relative;
}

.area-2 > p {
  margin: 0;
  font-size: 12px;
  line-height: 24px;
}

.area-2:hover{
  cursor: pointer;
}

.choosed {
  background-color: rgba(124,252,0, 0.5);
}
</style>