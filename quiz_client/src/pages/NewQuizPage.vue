<template>
  <el-container id="container">
    <el-aside id="aside">
      <div class="search-container">
        <input
          type="text"
          id="search"
          v-model="keyWord"
          placeholder="题号/关键词"
          @keyup.enter="getQuizList"
          @blur="getQuizList"
        />
      </div>
      <div class="result-container">
        <div
          v-for="quiz in quizList"
          :key="quiz.id"
          class="quiz-info"
          @click="showQuizInfo(quiz)"
        >
          {{ quiz.id }}.{{ quiz.title }}
        </div>
      </div>
    </el-aside>
    <el-main style="overflow: hidden">
      <div class="title">
        <div class="title-label-area">
          <label for="title-edit"><a class="title-label">问题</a></label>
        </div>
        <div class="title-edit-area">
          <input type="text" id="title-edit" v-model="title" />
        </div>
      </div>
      <div class="content">
        <my-quill-editor
          v-model="content"
          ref="contentEditor"
          placeholder="请在这里输入答案"
        />
      </div>
      <div class="tags-container" ref="tagArea">
        <el-tag
          class="mytag"
          :key="tag.name"
          v-for="tag in tags"
          closable
          :disable-transitions="false"
          :ref="tag.name"
          :hit="tag.choose"
          @close="handleClose(tag.name)"
          @click="handleChange(tag)"
        >
          {{ tag.name }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+ New Tag</el-button
        >
      </div>
      <div class="tags-container">
        <label for="">重要程度</label>
        <input
          type="radio"
          id="ipt"
          name="imp"
          value="important"
          v-model="importance"
        />
        <label for="ipt">重要</label>
        <input
          type="radio"
          id="und"
          name="imp"
          value="understand"
          v-model="importance"
        />
        <label for="und">理解</label>
        <input
          type="radio"
          id="kno"
          name="imp"
          value="know"
          v-model="importance"
        />
        <label for="kno">了解</label>
        <input
          type="radio"
          id="unk"
          name="imp"
          value="unknown"
          v-model="importance"
        />
        <label for="unk">未知</label>
      </div>
      <div class="func">
        <!-- 点击提交时，保留原来的数据不变，直到用户点击清空，每次清空时，会生成一个新id；清空前id不变 -->
        <button @click="submit">提交</button>
        <button @click="clear">清空</button>
        <button @click="submitAndClear">提交并清空</button>
        <button @click="remove">删除</button>
        <button @click="back">返回主页</button>
        <div id="bingo-icon" :class="bingoIconList" ref="bingoIcon">
          <i :class="`iconfont ${icon}`"></i>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import MyQuillEditor from "../components/MyQuillEditor.vue";
import time from "time-formater";

import "../assets/iconfonts/iconfont.css";

export default {
  name: "NewQuiz",
  data() {
    return {
      id: "",
      // index: "",
      title: "",
      tags: [
        {
          name: "tag1",
          choose: false,
        },
      ],
      choosedTags: [],
      content: "",
      icon: "",
      inputVisible: false,
      inputValue: "",
      importance: "unknown",
      bingoIconList: "",
      keyWord: "",
      quizList: [],
    };
  },
  components: {
    MyQuillEditor,
  },

  computed: {
    transInfo() {
      return {
        id: this.id,
        question: this.title,
        answer: this.content,
        tags: this.choosedTags,
        importance: this.importance,
        level: "unknown",
        level_time: "",
      };
    },
  },
  methods: {
    submit() {
      // console.log('transInfo',this.transInfo);
      //先检查是否存在选中的标签
      if (this.choosedTags.length < 1) {
        return;
      }
      this.transInfo.level_time = time().format("YYYY-MM-DD HH:mm:ss");

      this.$addr
        .post("/api/new", this.transInfo)
        .then((resp) => {
          if (resp.status >= 200 && resp.status < 300) {
            // this.$refs.bingoIcon.classList.add("commited", "succeed");
            this.icon = "icon-duigou";
            setTimeout(() => {
              this.bingoIconList = "commited succeed";
            }, 100);
            this.id = resp.data;
          } else {
            return new Promise((resolve, reject) => {
              reject(`网络错误,code:${resp.status},message:${resp.statusText}`);
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.icon = "icon-cuo";
          // this.$refs.bingoIcon.classList.add("commited", "failed");
          setTimeout(() => {
            this.bingoIconList = "commited failed";
          }, 100);
        });
    },
    clear() {
      this.id = "";
      this.title = "";
      this.content = "";
      //重置choosedTags
      this.choosedTags = [];
      //清空选中标签
      this.tags.forEach((tag) => {
        tag.choose = false;
      });
      //重要程度重置为未知
      this.importance = "unknown";
    },
    submitAndClear() {
      if (this.choosedTags.length < 1) {
        return;
      }
      this.transInfo.level_time = time().format("YYYY-MM-DD HH:mm:ss");

      this.$addr
        .post("/api/new", this.transInfo)
        .then((resp) => {
          if (resp.status >= 200 && resp.status < 300) {
            this.id = resp.data;
            this.icon = "icon-duigou";
            // this.$refs.bingoIcon.classList.add("commited-clear", "succeed");
            setTimeout(() => {
              this.bingoIconList = "commited-clear succeed";
            }, 100);
            this.clear();
          } else {
            return new Promise((resolve, reject) => {
              reject(`网络错误,code:${resp.status},message:${resp.statusText}`);
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.icon = "icon-cuo";
          // this.$refs.bingoIcon.classList.add("commited-clear", "failed");

          setTimeout(() => {
            this.bingoIconList = "commited-clear succeed";
          }, 100);
        });
    },
    remove() {
      this.$addr.get("/api/quizrem?id=" + this.id).then((resp) => {
        if (resp.status === 200 && resp.data === "OK") {
          if (resp.data === "OK") {
            this.icon = "icon-duigou";
            setTimeout(() => {
              this.bingoIconList = "remove succeed";
            }, 100);
            this.clear();
          } else {
            this.icon = "icon-cuo";
            setTimeout(() => {
              this.bingoIconList = "remove failed";
            }, 100);
          }
        }
      });
    },
    back() {
      this.$router.back();
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    handleChange(tag) {
      if (!tag.choose) {
        if (this.choosedTags.indexOf(tag.name) === -1) {
          this.choosedTags.push(tag.name);
        }
      } else {
        let index = this.choosedTags.indexOf(tag.name);
        if (index !== -1) {
          this.choosedTags.splice(index, 1);
        }
      }
      tag.choose = !tag.choose;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tags.push({ name: inputValue, choose: false });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    getQuizList() {
      this.$addr
        .get("/api/quiz", {
          params: {
            keyword: this.keyWord,
          },
        })
        .then((resp) => {
          if (resp.status === 200) {
            // console.log(resp.data);
            // this.id = resp.data.id
            // this.title = resp.data.question
            // this.content = resp.data.answer
            // this.importance = resp.data.importance
            // //标签处理
            // this.choosedTags = resp.data.tags.split('|')
            // for (let i = 0; i < this.choosedTags.length; i++) {
            //   this.choosedTags[i] = this.choosedTags[i]
            // }
            // this.tags.forEach((elem)=>{
            //   if (this.choosedTags.indexOf(elem.name) > -1) {
            //     elem.choose = true
            //   }
            // })
            this.quizList = [];
            Array.from(resp.data).forEach((quiz) => {
              this.quizList.push({
                id: quiz.id,
                title: quiz.question,
                content: quiz.answer,
                importance: quiz.importance,
                tags: quiz.tags,
              });
            });
          }
        });
    },
    showQuizInfo(quiz) {
      this.id = quiz.id;
      this.title = quiz.title;
      this.content = quiz.content;
      this.importance = quiz.importance;
      //标签处理
      this.choosedTags = quiz.tags.split("|");
      this.tags.forEach((elem) => {
        if (this.choosedTags.indexOf(elem.name) > -1) {
          elem.choose = true;
        }else{
          elem.choose = false;
        }
      });
    },
  },
  created() {
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
  mounted() {
    let container = this.$refs.contentEditor.$el.querySelector(".ql-container");
    container.style.height = "300px";
    //给动画元素绑定动画完成的触发事件
    this.$refs.bingoIcon.addEventListener("animationend", () => {
      this.bingoIconList = "";
      this.icon = "";
    });
  },
  beforeDestroy() {},
};
</script>

<style scoped>
#container {
  width: 90%;
  height: 90%;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.post-edit {
  width: 100%;
  height: 800px;
  box-sizing: border-box;
  border: 2px solid purple;
}

.title {
  width: 96%;
  height: 60px;
  border: 1px solid black;
  margin: 10px auto;
  display: flex;
}

.title-label {
  font-size: 32px;
  font-weight: bold;
  line-height: 60px;
  text-decoration: none;
  color: black;
  cursor: default;
}

.title-label-area {
  flex: 1;
  text-align: center;
}

.title-edit-area {
  height: max-content;
  width: max-content;
  flex: 9;
}

#title-edit {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  outline: none;
  font-size: 32px;
  border: 0;
}

.content {
  width: 96%;
  height: fit-content;
  border: 1px solid black;
  margin: 10px auto;
}

.tags-container {
  width: 96%;
  min-height: 30px;
  height: fit-content;
  border: 1px solid black;
  margin: 10px auto;
  padding: 5px;
}

.tag {
  float: left;
  margin-right: 50px;
}

.func {
  width: 96%;
  height: 60px;
  border: 1px solid black;
  margin: 10px auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}

.func > button {
  width: 100px;
  height: 30px;
}

#bingo-icon {
  position: absolute;
  width: fit-content;
  height: fit-content;
  /* color: green; */
  opacity: 0;
  z-index: 10;
}

#bingo-icon .iconfont {
  font-size: 28px;
}

.succeed {
  color: green;
}

.failed {
  color: red;
}

.commited {
  left: 150px;
  top: 50%;
  /* color: green; */
  transform: translate(0, -50%);
  animation-name: an-commited;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
}

.commited-clear {
  left: 555px;
  top: 50%;
  transform: translate(0, -50%);
  animation-name: an-commited;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
}

.remove {
  left: 748px;
  top: 50%;
  transform: translate(0, -50%);
  animation-name: an-commited;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
}

@keyframes an-commited {
  from {
    opacity: 0%;
  }

  60% {
    opacity: 100%;
  }

  to {
    opacity: 0%;
  }
}

.show-index {
  margin: 0;
  float: right;
  line-height: 30px;
}

#aside {
  border: 1px solid black;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.search-container {
  width: 100%;
  /* min-height: 30px; */
  border: 1px solid black;
  box-sizing: border-box;
  flex: 0.5;
}
.result-container {
  width: 100%;
  flex: 9.5;
  box-sizing: border-box;
  border: 1px solid red;
  padding: 10px 4px;
  overflow: auto;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.mytag:hover {
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

#search {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.quiz-info {
  width: 100%;
  height: 50px;
  border: 1px solid black;
  margin: 8px 0;
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;
}
</style>