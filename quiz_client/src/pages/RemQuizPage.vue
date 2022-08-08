<template>
  <div id="quiz-container">
    <div class="title">
      <div class="title-info">
        <span id="info-id">#{{ quiz.id }}</span>
        <span id="info-level">记忆程度:{{ quiz.level }}</span>
        <span id="info-imp">重要程度:{{ quiz.importance }}</span>
        <span id="info-quizs-done">{{ hasDone }} / {{ quizCount }}</span>
      </div>
      <div class="question">
        <p>{{ quiz.question }}</p>
      </div>
    </div>
    <div class="content">
      <div class="answer" v-if="show" @click="changeShow">
        <div v-html="quiz.answer"></div>
      </div>
      <div v-else class="tips" @click="changeShow">
        <span>点击显示/隐藏答案</span>
      </div>
    </div>
    <div class="footer">
      <button @click="toFamiliar">已熟悉</button>
      <button @click="toUnderstand">已理解</button>
      <button @click="toHard">不理解</button>
      <button @click="toRecircle">考虑一下</button>
      <button @click="cancel">返回</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import time from "time-formater";

export default {
  name: "RemQuiz",
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState({
      quizCount: "quizCount",
      quiz: (state) => {
        if (state.quizs.length === 0) {
          return state.leftQuiz;
        }
        return state.quizs[0];
      },
      hasDone: (state) => state.quizCount - state.quizs.length,
    }),
  },
  watch: {
    hasDone(newVal) {
      if (newVal === this.quizCount) {
        alert("您已完成本轮复习！");
        this.$router.back();
      }
    },
  },
  methods: {
    changeShow() {
      this.show = !this.show;
    },
    toFamiliar() {
      this.commitChgLevel("familiar");
    },
    toUnderstand() {
      this.commitChgLevel("understand");
    },
    toHard() {
      this.commitChgLevel("hard");
    },
    toRecircle() {
      this.show = false;
      this.$store.commit("quizRecircle");
    },
    cancel() {
      this.$router.back();
    },
    commitChgLevel(level) {
      this.$addr
        .get("/api/chglevel", {
          params: {
            id: this.quiz.id,
            level,
            level_time: time().format("YYYY-MM-DD HH:mm:ss"),
          },
        })
        .then((resp) => {
          if (resp.status === 200 && resp.data === "OK") {
            this.show = false;
            this.$store.commit("quizPop");
          }
        });
    },
  },
};
</script>

<style scoped>
#quiz-container {
  width: 96%;
  height: 96%;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
}

.title {
  width: 100%;
  /* flex: 2; */
  height: fit-content;
  border-bottom: 1px solid black;
  min-height: 60px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

@media screen and (min-width: 380px) and (max-width: 600px) {
  .title-info {
    font-size: 6px;
  }
}

.title-info {
  flex: 2;
  width: 100%;
  height: fit-content;
  border-bottom: 1px solid #e8dddd;
  box-sizing: border-box;
  display: flex;
}

#info-id {
  flex: 2;
  text-align: left;
  margin-left: 10px;
}

#info-level {
  flex: 3;
}

#info-imp {
  flex: 3;
}

#info-quizs-done {
  flex: 2;
}

.question {
  flex: 8;
  width: 100%;
  padding: 4px 10px;
  box-sizing: border-box;
  text-align: left;
  font-size: 18px;
}

.question > p {
  margin: 4px 0;
}

.content {
  width: 100%;
  flex: 8;
  box-sizing: border-box;
  border: 1px solid lightblue;
  overflow: auto;
  padding: 12px;
  position: relative;
}

.content > div {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.tips {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: darkgray;
}

.tips:hover {
  background-color: lightyellow;
  cursor: pointer;
}

.answer {
  text-align: left;
  font-size: 16px;
  overflow: hidden;
}

.answer:hover {
  background-color: lightyellow;
  cursor: pointer;
}

.footer {
  width: 100%;
  flex: 2;
  border: 1px solid khaki;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.footer > button {
  width: 100px;
  height: 30px;
}
</style>