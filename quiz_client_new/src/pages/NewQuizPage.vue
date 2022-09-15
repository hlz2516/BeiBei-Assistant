<template>
  <div class="container">
    <div class="left-layout">
      <div class="search-part">
        <search-bar
          :value="searchText"
          v-on:input="getSearchValue"
          @keyup.enter="search"
          width="100%"
        />
      </div>
      <div class="result-part ivu-bb ivu-bl ivu-br">
        <List item-layout="vertical" border split>
          <ListItem
            v-for="(data, index) in curPageData"
            :key="data.id"
            @click.capture="loadToForm(index)"
            style="cursor: pointer"
          >
            <ListItemMeta
              :title="data.question.substr(0, 15)"
              :description="data.answer.substr(0, 20)"
            />
          </ListItem>
        </List>
      </div>
      <div class="pagation-part">
        <Page
          :total="result.data.length"
          :page-size="result.pageSize"
          v-model="curPage"
        />
      </div>
    </div>
    <card class="center-layout">
      <div class="card-body">
        <!-- 问题 -->
        <div style="flex: 1" class="ques-part">
          <div class="q-label">
            <label for="question">问题:</label>
          </div>
          <div class="q-input">
            <input type="text" id="question" v-model="quiz.question" />
          </div>
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 答案 -->
        <div style="flex: 5" class="canscroll">
          <Tiptap width="100%" height="100%" v-model="quiz.answer" />
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 参考链接 -->
        <div style="flex: 0.6" class="links-part">
          <div class="link-label">
            <label for="links">参考链接:</label>
          </div>
          <div class="link-input">
            <input type="text" id="links" v-model="quiz.references" />
          </div>
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 标签 -->
        <div style="flex: 1" class="tags-part">
          <div class="tags-input">
            <AutoComplete
              v-model="tagText"
              :data="allTags"
              :filter-method="filterMethod"
              placeholder="输入适合该问题的标签"
              style="width: 180px"
            >
            </AutoComplete>
            <Icon
              type="ios-add-circle-outline"
              class="add-sign"
              @click="addTag"
            />
          </div>
          <div class="tags-container">
            <Tag
              v-for="(tag, index) in quiz.tags"
              :key="tag"
              closable
              @on-close="handleTagClose(index)"
              class="tag"
              >{{ tag }}</Tag
            >
          </div>
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 所属题库 + 重要性 -->
        <div style="flex: 1" class="others-part">
          <div style="flex: 1" class="repo-select">
            <label for="repo-selector">所属题库</label>
            <Select v-model="quiz.curRepo" placeholder="" id="repo-selector">
              <Option
                v-for="(repo, index) in repos"
                :value="repo"
                :key="index"
                >{{ repo }}</Option
              >
            </Select>
          </div>
          <div style="flex: 1" class="repo-select">
            <label for="imp-selector">重要程度</label>
            <Select v-model="quiz.curImp" placeholder="" id="imp-selector">
              <Option v-for="(imp, index) in imps" :value="imp" :key="index">{{
                imp
              }}</Option>
            </Select>
          </div>
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 功能按钮 -->
        <div style="flex: 1" class="func-part">
          <Button type="primary" @click="submit" :disabled="submitDisabled"
            >提交</Button
          >
          <Button type="info" @click="reset">重置</Button>
        </div>
      </div>
    </card>
    <card class="right-layout">
      <!-- 说明如何搜索 -->
      <template v-slot:title>
        <h3>搜索规则说明</h3>
      </template>
      <p>目前仅支持快速搜索，只需输入关键词即可，优先按照id，问题/答案，标签名进行查找</p>
    </card>
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";
import Tiptap from "../components/Tiptap.vue";
import request from "../request";

export default {
  name: "NewQuizPage",
  components: {
    SearchBar,
    Tiptap,
  },
  data() {
    return {
      quiz: {
        id: 0,
        question: "",
        answer: "",
        references: "",
        tags: [],
        curRepo: "",
        curImp: "",
      },
      result: {
        //一页多少数据
        pageSize: 8,
        //数据明细
        data: [],
      },
      searchText: "",
      allTags: [],
      tagText: "",
      repos: [],
      imps: ["重要", "理解", "了解", "未知"],
      submitDisabled: false,
      curPage: 1,
    };
  },
  computed: {
    curPageData() {
      let pageSize = this.result.pageSize;
      let startIndex = (this.curPage - 1) * pageSize;
      return this.result.data.slice(startIndex, startIndex+ pageSize);
    },
  },
  methods: {
    loadToForm(index) {
      this.quiz.id = this.result.data[index].id;
      this.quiz.question = this.result.data[index].question;
      this.quiz.answer = this.result.data[index].answer;
      this.quiz.references = this.result.data[index].references;
      this.quiz.curImp = this.result.data[index].importance;
      this.quiz.curRepo = this.result.data[index].repoName;
      //对tags做特殊处理
      let tags = this.result.data[index].tags.map((tag) => {
        return tag.name;
      });
      this.quiz.tags = tags;
    },
    getSearchValue(value) {
      this.searchText = value;
    },
    search() {
      if (this.searchText.trim() == "") {
        return;
      }
      request
        .get("/quiz/quicksearch", {
          params: {
            key: this.searchText,
          },
        })
        .then((resp) => {
          if (resp.status === 200) {
            this.result.data = resp.data;
          }
        })
        .catch((reason) => {
          console.error(reason);
        });
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    addTag() {
      if (this.tagText == "") return;
      if (this.quiz.tags.length >= 5) return;
      this.quiz.tags.push(this.tagText);
      this.tagText = "";
    },
    handleTagClose(index) {
      this.quiz.tags.splice(index, 1);
    },
    submit() {
      //先检查必填项是否都填写完善
      if (this.quiz.question == "") {
        this.$Modal.info({ content: "请输入问题" });
        return;
      }
      if (this.quiz.answer.length < 10) {
        this.$Modal.info({ content: "回答字数过少，请重新组织语言" });
        return;
      }
      if (this.quiz.tags.length < 1) {
        this.$Modal.info({ content: "请至少选择一个标签！" });
        return;
      }
      if (this.quiz.curRepo == "") {
        this.$Modal.info({ content: "请选择题库！" });
        return;
      }
      if (this.quiz.curImp == "") {
        this.$Modal.info({ content: "请选择重要程度！" });
        return;
      }
      this.submitDisabled = true;
      //提交请求
      request
        .post("/quiz/add", {
          id: this.quiz.id,
          question: this.quiz.question,
          answer: this.quiz.answer,
          references: this.quiz.references,
          tags: this.quiz.tags,
          importances: this.quiz.curImp,
          repo: this.quiz.curRepo,
        })
        .then((result) => {
          if (result.status === 200) {
            this.quiz.id = result.quizId;
            this.$Notice.info({ desc: "已成功提交！" });
            this.submitDisabled = false;
          }
        })
        .catch((reason) => {
          this.$Notice.error({ title: "提交失败！", desc: reason });
          this.submitDisabled = false;
        });
    },
    reset() {
      this.quiz = {
        id: 0,
        question: "",
        answer: "",
        references: "",
        tags: [],
        curRepo: "",
        curImp: "",
      };
      this.tagText = "";
    },
  },
  mounted() {
    request.get("/tags").then((result) => {
      if (result.status === 200) {
        this.allTags = result.tags;
      }
    });

    request.get("/repos/name").then((result) => {
      if (result.status === 200) {
        this.repos = result.repos;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 85vh;
  display: flex;
  align-items: stretch;
  padding: 8px;
}

.left-layout {
  flex-basis: 360px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  .search-part {
    flex-basis: 40px;
    padding-bottom: 8px;
  }

  .result-part {
    flex: 1;
    overflow: auto;
  }

  .pagation-part {
    flex-basis: 48px;
    padding-top: 8px;
    text-align: center;
  }
}

.center-layout {
  flex: 3;
  margin: 8px;

  /deep/ .ivu-card-body {
    width: 100%;
    height: 100%;
    .card-body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-around;

      .ques-part {
        display: flex;
        align-items: stretch;
        font-size: 28px;

        .q-label {
          flex-basis: 75px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .q-input {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
        }
      }

      .links-part {
        display: flex;
        align-items: stretch;
        font-size: 14px;

        .link-label {
          flex-basis: 75px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .link-input {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }

      .tags-part {
        display: flex;
        align-items: center;
        .tags-input {
          flex: 2.5;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .add-sign {
            font-size: 24px;
            transform: translate(-50%, 0);
            cursor: pointer;
          }
        }

        .tags-container {
          flex: 7.5;
          overflow: hidden;

          .tag {
            margin: 0 4px;
          }
        }
      }

      .others-part {
        display: flex;
        align-items: center;

        .repo-select {
          display: flex;
          justify-content: flex-start;
          font-size: 16px;
          line-height: 32px;

          #repo-selector,
          #imp-selector {
            width: 200px;
            margin: 0 4px;
          }
        }
      }

      .func-part {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
}

.right-layout {
  flex: 1;
  margin: 8px;
}

#question {
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  border: 0;
  outline: none;
}

#links {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 0;
  outline: none;
}

.canscroll {
  overflow: auto;
}
</style>
