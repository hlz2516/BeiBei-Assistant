import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    quizs: [
      // {
      //   id: "078529BB9C251263",
      //   question: "问题2问题2问题2问题2",
      //   answer: "<b>答案2</b>",
      //   tags: "js",
      //   importance: "important",
      //   level: "unknown",
      //   level_time: "2022-07-26 01:09:50",
      // },
      // {
      //   id: "078529BB9C251264",
      //   question: "问题3问题3问题3问题3",
      //   answer: "<b>答案3</b>",
      //   tags: "js",
      //   importance: "understand",
      //   level: "unknown",
      //   level_time: "2022-07-27 01:09:50",
      // },
    ],
    leftQuiz:null,
    quizCount:0
  },
  mutations: {
    quizSet(state, newQuizs) {
      state.quizs = newQuizs;
      state.quizCount = newQuizs.length
    },
    quizConcat(state, newQuizs) {
      state.quizs = state.quizs.concat(newQuizs);
    },
    quizClear(state) {
      state.quizs = [];
    },
    quizRecircle(state) {
      state.quizs.push(state.quizs.shift());
    },
    quizPop(state) {
      if (state.quizs.length === 0) {
        return
      }
      state.leftQuiz = state.quizs.shift();
    },
  },
});
