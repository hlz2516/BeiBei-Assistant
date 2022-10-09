<template>
  <div v-if="prepare" class="options-page">
    <card class="options-container">
      <template v-slot:title>
        <h1>配置背题选项</h1>
      </template>
      <div class="options">
        <!-- 选择模式 -->
        <div class="option-item" style="flex: 0">
          <label for="mode-selector">选择模式</label>
          <RadioGroup
            v-model="mode"
            id="mode-selector"
            @on-change="radioChanged"
          >
            <Radio label="随机模式"></Radio>
            <Radio label="目标模式"></Radio>
          </RadioGroup>
        </div>

        <!-- 题库选择 -->
        <div class="option-item" style="flex: 0">
          <label for="repo-selector">选择题库</label>
          <Select
            v-model="options.repo"
            id="repo-selector"
            @on-change="getCurRepo"
          >
            <Option v-for="(repo, index) in repos" :value="repo" :key="index">{{
              repo
            }}</Option>
          </Select>
        </div>

        <div v-if="mode === '随机模式'">
          <!-- 标签选择 -->
          <div class="option-item">
            <label for="tag-selector">选择标签</label>
            <Select
              v-model="options.tag"
              id="rag-selector"
              @on-open-change="tagSelectorOpen"
            >
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
        <div class="target-mode-tips" v-show="mode == '目标模式'">
          <p>请在右侧多选框中选择至少3道题目</p>
          <p>背题开始后，加载的题目就是你选择的题目</p>
        </div>
      </div>

      <!-- 开始 -->
      <div class="func-area">
        <Button type="success" @click="loadingQuizs" long>开始背题</Button>
      </div>
    </card>
    <card class="quiz-selector" v-show="mode === '目标模式'">
      <template v-slot:title>
        <search-bar
          v-model="searchText"
          height="30px"
          width="100%"
          input-bgc="#fff"
        />
      </template>
      <div class="quiz-list" ref="listContainer">
        <Table
          border
          :columns="quizSelector.columns"
          :data="pagedData"
          :loading="quizSelector.loading"
          @on-select="handleSelect"
          @on-select-cancel="handleUnselect"
          @on-selection-change="handleSelectQuiz"
          :height="listHeight"
        >
        </Table>
      </div>
      <Divider size="small" style="margin: 0" />
      <div class="quiz-list-page">
        <Page
          v-model="quizSelector.curPage"
          :total="quizSelector.data.length"
        />
      </div>
    </card>
  </div>

  <div v-else class="rem-page">
    <div class="rem-container">
      <div class="title">
        <div class="title-info">
          <span class="info-item" style="margin-left: 12px"
            >#{{ quiz.id || 0 }}</span
          >
          <span class="info-item">理解程度:{{ quiz.level || "unknown" }}</span>
          <span class="info-item"
            >重要程度:{{ quiz.importance || "unknown" }}</span
          >
          <span class="info-item">标签:{{ quiz.tags || "" }}</span>
          <span class="info-item">还剩{{ quizs.length || 0 }}道</span>
        </div>
        <Divider size="small" style="margin: 0" />
        <div class="question">
          <p>{{ quiz.question || "" }}</p>
        </div>
      </div>
      <Divider size="small" style="margin: 0" />
      <div class="content">
        <div class="answer" v-show="show">
          <div
            class="ansdesc-part"
            v-html="quiz.answer || ''"
            @click="changeShow"
          ></div>
          <Divider size="small" style="margin: 0" />
          <div class="ref-part">
            参考链接：
            <span v-html="quiz.references || ''"></span>
          </div>
        </div>
        <div v-show="!show" class="tips" @click="changeShow">
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
        <Button type="info" size="large" @click="recircle">已模糊</Button>
        <Button type="warning" size="large" @click="setLevel('不理解')"
          >不理解</Button
        >
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
      mode: "随机模式",
      searchText: "",
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
      quizs: [
        // {
        //   id: 1,
        //   question: "question1",
        //   answer: "answer1",
        //   references: "www.baidu.com",
        //   importance: "重要",
        //   level: "未知",
        //   tags: [ "html","css" ],
        // }
      ],
      quizIndex: 0,
      show: false,
      loadingCom: null,
      quizSelector: {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
          },
          {
            title: "问题",
            key: "question",
          },
        ],
        data: [],
        searchData: [],
        pageSize: 10,
        loading: true,
        curPage: 1,
        listHeight: 200,
      },
    };
  },
  methods: {
    loadingQuizs() {
      this.loadingCom = this.$Message.loading({
        content: "正在加载题目中......",
      });

      if (!this.options.repo || this.options.repo == "") {
        this.$Modal.warning({ title: "请选择题库！" });
        return;
      }

      if (this.mode === "随机模式") {
        if (this.tags.length === 0) {
          this.$Modal.warning({ title: "请选择标签！" });
          return;
        }

        request
          .get("/quiz/rem", {
            params: {
              repo: this.options.repo,
              number: this.options.num,
              tag: this.options.tag,
              importance: this.options.importance,
            },
          })
          .then((resp) => {
            if (resp.status === 200) {
              this.loadingCom();
              this.quizs = resp.data;
              this.prepare = false;
            }
          });
      } else {
        if (this.quizs.length < 3) {
          this.$Modal.info({ title: "选择题目数量小于3，请重新选择！" });
        } else {
          this.loadingCom();
          this.prepare = false;
        }
      }
    },
    changeShow() {
      this.show = !this.show;
    },
    recircle() {
      this.quizIndex = (this.quizIndex + 1) % this.quizs.length;
      this.show = false;
    },
    setLevel(level) {
      request
        .post("/quiz/setlevel", {
          quizId: this.quiz.id,
          level,
        })
        .then((result) => {
          if (result.status === 200) {
            return request.post("/quiz/remIncrease", {
              quizId: this.quiz.id,
            });
          }
        })
        .then((result) => {
          if (result.status === 200) {
            this.show = false;
            // this.quizs.shift();
            //把当前index指向的元素删除,当前index不变
            this.quizs.splice(this.quizIndex, 1);
            if (this.quizs.length === 0) {
              this.$Modal.info({
                content: "恭喜您，已全部背完！今天你又变强了呢！",
              });
              this.quizs = [];
              this.prepare = true;
              this.quizSelector.data = [];
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getCurRepo(value) {
      if (this.mode === "随机模式") {
        request
          .get("/tags_in_repo", {
            params: {
              repoName: value,
            },
          })
          .then((resp) => {
            if (resp.status === 200) {
              this.tags = resp.data;
              if (this.tags.length === 0) {
                throw new Error(`该题库[${value}]的标签数为0`);
              }
              this.tags.push("全部");
            }
          })
          .catch((error) => {
            this.$Modal.error({
              title: "获取题库的标签出现错误，请联系开发者",
            });
            console.error(error);
          });
      } else if (this.mode === "目标模式") {
        request
          .get("/quiz/quicksearch", {
            params: {
              key: `<${value}>`,
            },
          })
          .then((resp) => {
            if (resp.status === 200) {
              this.quizSelector.data = resp.data;
              this.quizSelector.data.forEach((item) => {
                item._checked = false;
              });
              this.quizSelector.loading = false;
              //计算下表格容器高度
              let style = window.getComputedStyle(this.$refs.listContainer);
              this.listHeight = parseInt(style.height, 10);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    tagSelectorOpen(flag) {
      if (flag) {
        if (this.options.repo == "") {
          this.$Modal.warning({
            title: "请先选择题库！",
          });
          return;
        }
      }
    },
    giveup() {
      this.quizs = [];
      this.prepare = true;
    },
    radioChanged(value) {
      if (value === "目标模式") {
        this.mode = "目标模式";
      }
    },
    handleSelectQuiz(selection) {
      // this.quizs = selection;
    },
    handleSelect(_, row) {
      let len = this.quizSelector.data.length;
      for (let i = 0; i < len; i++) {
        if (row.id === this.quizSelector.data[i].id) {
          this.quizSelector.data[i]._checked = true;
          this.quizs.push(this.quizSelector.data[i]);
          break;
        }
      }
    },
    handleUnselect(_, row) {
      let len = this.quizSelector.data.length;
      for (let i = 0; i <len; i++) {
        if (row.id === this.quizSelector.data[i].id) {
          this.quizSelector.data[i]._checked = false;
          this.quizs = this.quizs.filter((q) => {
            return q.id !== row.id;
          });
          break;
        }
      }
    },
  },

  computed: {
    quiz() {
      if (this.quizs.length === 0) {
        return null;
      }

      let index = this.quizIndex;
      if (index == this.quizs.length) {
        index--;
      }

      if (this.quizs[index].tags instanceof Array) {
        this.quizs[index].tags = this.quizs[index].tags.join(",");
      }

      //链接处理
      //原链接格式如：[标题](链接地址),[..](..)
      if (!this.quizs[index].references) {
        this.quizs[index].references = "";
      }
      //如果链接里包含</len;>说明已经被转换过，故跳过
      if (this.quizs[index].references.indexOf('</a>') > -1) {
        return this.quizs[index];
      }
      let refs = this.quizs[index].references.split(",");
      let htmlLinks = refs
        .map((ref) => {
          console.log('ref',ref);
          if (ref == "") {
            return "";
          }
          let regex1 = /\[(.+?)\]/;
          let regex2 = /\((.+?)\)/;
          let title = ref.match(regex1)[0];
          title = title.substring(1, title.length - 1);

          let link = ref.match(regex2)[0];
          link = link.substring(1, link.length - 1);

          return `<a href=${'"' + link + '"'} target='_blank'>${title}</a>`;
        })
        .join(";");
      this.quizs[index].references = htmlLinks;

      return this.quizs[index];
    },
    pagedData() {
      let startIndex =
        (this.quizSelector.curPage - 1) * this.quizSelector.pageSize;
      if (this.searchText.length > 0) {
        return this.quizSelector.data.filter((quiz) => {
          return quiz.question.indexOf(this.searchText) > -1;
        });
      } else
        return this.quizSelector.data.slice(
          startIndex,
          startIndex + this.quizSelector.pageSize
        );
    },
  },

  mounted() {
    request.get("/repos/name").then((result) => {
      if (result.status === 200) {
        this.repos = result.repos;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.options-page {
  width: 100%;
  height: 80vh;
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

        .target-mode-tips {
          flex: 1;
          padding: 12px 4px;
          display: flex;
          flex-direction: column;
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

  .quiz-selector {
    margin-left: 20px;
    width: 40%;
    height: 90%;

    /deep/ .ivu-card-body {
      width: 100%;
      height: calc(100% - 60px);
      padding: 0 16px 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .quiz-list {
        flex: 1;
      }

      .quiz-list-page {
        flex-basis: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

#repo-selector,
#rag-selector,
#imp-selector,
#num-selector,
#mode-selector {
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
          overflow: auto;
        }

        .ansdesc-part:hover {
          background-color: lightyellow;
          cursor: pointer;
        }

        .ref-part {
          width: 100%;
          height: 10%;
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
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
