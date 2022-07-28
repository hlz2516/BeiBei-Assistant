<template>
  <div id="container">
    <div class="tags">
      <div class="tag-title">
        <h4>请选择一个与面试题相关的标签</h4>
      </div>
      <div class="tag-content">
        <el-tag
          class="mytag"
          v-for="tag in tags"
          :key="tag.name"
          :hit="tag.choose"
          @click="handleChange(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>
    <div class="number">
      <div class="num-title"><h4>请选择题目数量</h4></div>
      <div class="num-content">
        <div>
          <input
            type="radio"
            name="num"
            value="10"
            v-model="number"
            id="r1"
          /><label for="r1">10道</label>
        </div>
        <div>
          <input
            type="radio"
            name="num"
            value="15"
            v-model="number"
            id="r2"
          /><label for="r2">15道</label>
        </div>
        <div>
          <input
            type="radio"
            name="num"
            value="20"
            v-model="number"
            id="r3"
          /><label for="r3">20道</label>
        </div>
        <div>
          <input
            type="radio"
            name="num"
            value="30"
            v-model="number"
            id="r4"
          /><label for="r4">30道</label>
        </div>
      </div>
    </div>
    <div class="func">
      <button @click="start">开始</button>
    </div>
  </div>
</template>

<script>
import Tag from "../components/Tag.vue";

export default {
  name: "SelectPage",
  data() {
    return {
      tags: [
        {
          name: "html",
          choose: false,
        },
      ],
      choosedTag: "",
      number: 0,
    };
  },
  components: {
    Tag,
  },
  methods: {
    start() {
      if (this.choosedTag.length < 1) {
        alert("请选择一个标签再开始!");
        return;
      }

      this.$addr
        .get("/api/quizs", {
          params: {
            tag: this.choosedTag,
            number: this.number,
          },
        })
        .then((resp) => {
          if (resp.status === 200) {
            this.$store.commit("quizSet", resp.data);
            this.$router.push("/rem");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleChange(tag) {
      //记录一下当前tag的choose状态
      let curState = tag.choose
      //将每个tag的状态置为false
      for (let i = 0; i < this.tags.length; i++) {
        this.tags[i].choose = false
      }
      //根据记录的choose状态决定更不更新choosedTag
      if (!curState) {
        this.choosedTag = tag.name;
        tag.choose = true
      } else {
        this.choosedTag = "";
      }
    },
  },
  beforeCreate() {
    this.$addr
      .get("/api/alltags")
      .then((resp) => {
        if (resp.status >= 200 && resp.status < 300) {
          this.tags = resp.data.map((val) => {
            return { name: val, choose: false };
          });
        } else
          return new Promise((_, reject) => {
            reject(`网络错误,code:${resp.status},message:${resp.statusText}`);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  watch: {
    tags: {
      deep: true,
      handler(newval){
        this.tags = newval
      }
    },
  },
};
</script>

<style scoped>
#container {
  width: 1000px;
  height: 650px;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.tags {
  width: 96%;
  height: 250px;
  border: 1px solid black;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}

.tag-title {
  flex: 3;
  background-color: lightgreen;
}

.tag-content {
  flex: 7;
  background-color: yellow;
  padding: 4px;
}

.tag {
  float: left;
  margin-right: 50px;
}

.number {
  width: 96%;
  height: 250px;
  border: 1px solid black;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}

.num-title {
  flex: 3;
  background-color: lightgreen;
}

.num-content {
  flex: 7;
  background-color: yellow;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.num-content > div {
  margin: 5px 0;
}

.order-selector {
  flex: 3;
  border: 1px solid black;
  margin: 2px;
}

.num-selector {
  flex: 7;
  border: 1px solid black;
  margin: 2px;
}

.func {
  width: 96%;
  height: 60px;
  border: 1px solid black;
  margin: 20px auto;
  position: relative;
}

.func > button {
  width: 100%;
  height: 100%;
}

.mytag {
  width: 100px;
  float: left;
  margin-right: 20px;
}

.mytag:hover {
  cursor: pointer;
}
</style>