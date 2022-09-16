<template>
  <div v-if="prepare" class="options-page">
    <card class="options-container">
      <template v-slot:title>
        <h1>配置背题选项</h1>
      </template>
      <div class="options">
        <!-- 题库选择 -->
        <div class="option-item">
          <label for="repo-selector">选择题库</label>
          <Select v-model="options.repo" id="repo-selector">
            <Option v-for="(repo, index) in repos" :value="repo" :key="index">{{
              repo
            }}</Option>
          </Select>
        </div>
        <!-- 标签选择 -->
        <div class="option-item">
          <label for="tag-selector">选择标签</label>
          <Select v-model="options.tag" id="rag-selector">
            <Option v-for="(tag, index) in tags" :value="tag" :key="index">{{
              tag
            }}</Option>
          </Select>
        </div>
        <!-- 重要程度选择 -->
        <div class="option-item">
          <label for="imp-selector">选择重要程度</label>
          <Select v-model="options.importance" id="imp-selector">
            <Option
              v-for="(imp, index) in importances"
              :value="imp"
              :key="index"
              >{{ imp }}</Option
            >
          </Select>
        </div>
        <!-- 题目数量 -->
        <div class="option-item">
          <label for="num-selector">选择题目数量</label>
          <Select v-model="options.num" id="num-selector">
            <Option v-for="(num, index) in nums" :value="num" :key="index">{{
              num
            }}</Option>
          </Select>
        </div>
      </div>

      <!-- 开始 -->
      <div class="func-area">
        <Button type="success" @click="loadingQuizs" long>开始背题</Button>
      </div>
    </card>
  </div>
  <div v-else class="rem-page">
    <div class="rem-container">
      <div class="title">
        <div class="title-info">
          <span class="info-item" style="margin-left: 12px"
            >#{{ quiz.id }}</span
          >
          <span class="info-item">理解程度:{{ quiz.level }}</span>
          <span class="info-item">重要程度:{{ quiz.importance }}</span>
          <span class="info-item">标签:{{ quizTags }}</span>
          <span class="info-item">还剩{{ quizs.length }}道</span>
        </div>
        <Divider size="small" style="margin: 0" />
        <div class="question">
          <p>{{ quiz.question }}</p>
        </div>
      </div>
      <Divider size="small" style="margin: 0" />
      <div class="content">
        <div class="answer" v-if="show">
          <div
            class="ansdesc-part"
            v-html="quiz.answer"
            @click="changeShow"
          ></div>
          <Divider size="small" style="margin: 0" />
          <div class="ref-part">
            <p>参考链接：</p>
            <p>{{ quiz.references }}</p>
          </div>
        </div>
        <div v-else class="tips" @click="changeShow">
          <span>点击显示/隐藏答案</span>
        </div>
      </div>
      <div class="footer">
        <Button type="success" size="large" @click="setLevel('已熟悉')"
          >已熟悉</Button
        >
        <Button type="primary" size="large" @click="setLevel('已理解')"
          >已理解</Button
        >
        <Button type="warning" size="large" @click="setLevel('不理解')"
          >不理解</Button
        >
        <Button type="info" size="large" @click="recircle">考虑一下</Button>
        <Button type="default" size="large" @click="giveup">不背了</Button>
      </div>
    </div>
  </div>
</template>

<script>
import request from "../request";

export default {
  name: "RemQuizPage",
  data() {
    return {
      prepare: true,
      repos: [],
      tags: [],
      nums: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      importances: ["重要", "理解", "了解", "未知", "全部"],
      options: {
        repo: "",
        tag: "全部",
        importance: "全部",
        num: 20,
      },
      //{id,question,answer,references,importance,level,tags}
      quizs: [
        {
          id: 1,
          question: "question1",
          answer: "answer1",
          references: "www.baidu.com",
          importance: "重要",
          level: "未知",
          tags: [{name:'html'}, {name:'css'}],
        },
        {
          id: 2,
          question: "question2",
          answer: "answer2",
          references: "www.bilibili.com",
          importance: "重要",
          level: "未知",
          tags: [{name:'java'}, {name:'c#'}],
        },
      ],
      show: false,
      loadingCom:null
    };
  },
  methods: {
    loadingQuizs() {
        if (!this.options.repo || this.options.repo == '') {
            this.$Modal.info({content:'请选择题库！'});
            return
        }

        this.loadingCom = this.$Message.loading({
            content:'正在加载题目中......',
            duration:0
        });
        request.get('/quiz/rem',{
            params:{
                repo:this.options.repo,
                number:this.options.num,
                tag:this.options.tag,
                importance:this.options.importance
            }
        })
        .then(resp=>{
            if (resp.status === 200) {
                this.loadingCom();
                this.quizs = resp.data;
                this.prepare = false;
            }
        })
    },
    changeShow() {
      this.show = !this.show;
    },
    recircle() {
      this.show = false;
      this.quizs.push(this.quizs.shift());
    },
    setLevel(level) {
      request
        .post("/quiz/setlevel", {
          quizId: this.quiz.id,
          level,
        })
        .then((result) => {
          if (result.status === 200) {
            this.show = false;
            this.quizs.shift();
            if (this.quizs.length === 0) {
              this.$Modal.info({
                content: "恭喜您，已全部背完！今天你又变强了呢！",
              });
              this.quizs = [];
              this.prepare = true;
            }
          }
        });
    },
    giveup(){
        this.quizs = [];
        this.prepare = true;
    }
  },

  computed: {
    quiz() {
      return this.quizs[0];
    },
    quizTags(){
        let rawTags = this.quizs[0].tags;
        return rawTags.map(tag=>{
            return tag.name
        }).join(',')
    }
  },

  mounted() {
    request.get("/repos/name").then((result) => {
      if (result.status === 200) {
        this.repos = result.repos;
      }
    });

    request.get("/tags").then((result) => {
      if (result.status === 200) {
        this.tags = result.tags;
        this.tags.push("全部");
      }
    });
  },
};
</script>

<style lang="less" scoped>
.options-page {
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .options-container {
    width: 40%;
    height: 90%;

    /deep/ .ivu-card-body {
      width: 100%;
      height: 88%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .options {
        flex: 1;
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;

        .option-item {
          flex: 1;
          padding: 12px 4px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .func-area {
        justify-self: flex-end;
        flex-basis: 60px;
        display: flex;
        align-items: center;
      }
    }
  }
}

#repo-selector,
#rag-selector,
#imp-selector,
#num-selector {
  width: 200px;
  margin: 0 4px;
}

.rem-page {
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .rem-container {
    width: 80%;
    height: 100%;
    border: 1px solid black;
    display: flex;
    flex-direction: column;

    .title {
      width: 100%;
      //   flex: 2;
      height: fit-content;
      min-height: 60px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;

      .title-info {
        flex: 3;
        width: 100%;
        height: fit-content;
        box-sizing: border-box;
        display: flex;
        font-size: 16px;

        .info-item {
          flex: 1;
        }
      }

      .question {
        flex: 7;
        width: 100%;
        padding: 4px 10px;
        box-sizing: border-box;
        text-align: left;
        font-size: 20px;
      }

      .question > p {
        margin: 4px 0;
      }
    }

    .content {
      width: 100%;
      flex: 8;
      box-sizing: border-box;
      overflow: auto;
      padding: 12px;
      position: relative;

      .answer {
        text-align: left;
        font-size: 16px;
        width: 100%;
        height: 100%;

        .ansdesc-part {
          width: 100%;
          height: 90%;
        }

        .ansdesc-part:hover {
          background-color: lightyellow;
          cursor: pointer;
        }

        .ref-part {
          width: 100%;
          height: 10%;
          overflow: auto;
        }
      }

      .tips {
        width: 100%;
        height: 100%;
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
    }

    .footer {
      width: 100%;
      flex: 2;
      border: 1px solid khaki;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
