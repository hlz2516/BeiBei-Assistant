<template>
  <div class="tag-container" v-show="!remove">
    <div class="area-1" @click="toEdit">
      <i class="iconfont add">&#xe600;</i>
    </div>
    <div class="area-2">
      <input type="text" v-show="isEditting" v-model="content" ref="input" />
      <p v-show="!isEditting">{{ content }}</p>
    </div>
    <div v-show="isEditting" class="area-3">
      <div @click="doneEdit">
        <i class="iconfont">&#xebe6;</i>
      </div>
      <div @click="handleX">
        <i class="iconfont">&#xe6c9;</i>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/iconfonts/iconfont.css';

export default {
  name: "WritableTag",
  data() {
    return {
      content: this.tag || "",
      isEditting: false,
      remove: false,
    };
  },
  methods: {
    toEdit() {
      this.isEditting = true;
      this.$nextTick(()=>{
        this.$refs.input.focus();
      })
    },
    doneEdit() {
      this.onConfirm && this.onConfirm();
      this.isEditting = false;
    },
    handleX() {
      if (this.onCancel) {
        if (this.onCancel()) {
          this.remove = true;
        } else {
          this.content = ''
          this.remove = false;
          this.isEditting = false;
        }
      } else {
        this.remove = true;
      }
    },
  },
  mounted() {

  },
  props: ["tag", "onConfirm", "onCancel"],
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

.area-2 > input {
  width: 128px;
  box-sizing: border-box;
  height: 24px;
}

.area-2 > p {
  margin: 0;
  font-size: 12px;
  line-height: 24px;
}

.area-3 {
  width: 52px;
  height: 24px;
  box-sizing: border-box;
  float: left;
  border: 1px solid green;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.area-3 > div {
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  float: right;
  border: 1px solid purple;
  text-align: center;
}

.area-3 > div :hover {
  cursor: pointer;
  background-color: rgba(150, 150, 150, 0.1);
}

.area-3 > div > i {
  position: relative;
  top: -10%;
}
</style>