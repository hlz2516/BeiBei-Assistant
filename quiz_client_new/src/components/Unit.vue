<template>
  <Poptip trigger="hover" :title="question">
    <div class="unit" @click="$emit('unitclick')" ref="unit"></div>
    <template #content>
      <p>重要性：{{importance}}</p>
      <p>标签：{{tags.join(',')}}</p>
      <p>熟悉程度：{{level}}</p>
    </template>
  </Poptip>
</template>

<script>
export default {
  name: "Unit",
  props: {
    color: {
      type: String,
      default: "#FFF",
    },
    question: {
      type: String,
      default: "",
    },
    tags: {
      type: Array,
      default: [],
    },
    level:{
      type: String,
      default:'未知'
    },
    importance:{
      type:String,
      default:'未知'
    }
  },
  emits: ["unitclick"],
  mounted() {
    this.$refs.unit.style.setProperty('background-color',this.color);
  },
};
</script>

<style>
.unit {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 2px;
  cursor: pointer;
  background-color: #fff;
}
</style>