<template>
  <div class="container">
    <div class="left-layout">
      <div class="search-part">
        <search-bar v-model="searchText" @keyup.enter="search" width="100%" />
      </div>
      <div class="result-part ivu-bb ivu-bl ivu-br">
        <List item-layout="vertical" border split>
          <ListItem
            v-for="data in curPageData"
            :key="data.id"
            @click.capture="loadToForm(data)"
            style="cursor: pointer"
          >
            <ListItemMeta
              :title="data.question.substr(0, 15)"
              :description="beautifyDesc(data.answer)"
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
          <Tooltip
            content="注意，该选项会删除数据库中对应的题目，请谨慎操作！"
            placement="top"
            max-width="100px"
          >
            <Button type="error" @click="handleDelete">删除</Button>
          </Tooltip>

          <Tooltip
            content="注意，该选项会重置该题目的熟练度为未知，请谨慎操作！"
            placement="top"
            max-width="100px"
          >
            <Button type="warning" @click="handleResetLevel">重置熟练度</Button>
          </Tooltip>
        </div>
      </div>
    </card>
    <card class="right-layout">
      <!-- 说明如何搜索 -->
      <template v-slot:title>
        <h2>规则说明</h2>
      </template>
      <h3>搜索的书写规则</h3>
      <p>
        目前仅支持快速搜索，只需输入关键词即可，优先按照id，问题/答案，题库名，标签名进行查找
      </p>
      <p>
        快速搜索支持对于题目熟练度的特殊搜索，你可以搜索已熟悉的，已理解的，或不理解的题目，其搜索规则如下：
      </p>
      <p>[熟练度]</p>
      <p>熟练度的可选值：已熟悉，已理解，不理解</p>
      <h3>参考链接的书写规则</h3>
      <p>格式：[标题1](链接地址1),[标题2](链接地址2)...</p>
      <p>例如：[typeof与instanceof的区别](https:www.xxx.com/article?xxx=yyy)</p>
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
      return this.result.data.slice(startIndex, startIndex + pageSize);
    },
  },
  methods: {
    loadToForm(data) {
      this.quiz.id = data.id;
      this.quiz.question = data.question;
      this.quiz.answer = data.answer;
      this.quiz.references = data.references;
      this.quiz.curImp = data.importance;
      this.quiz.curRepo = data.repoName;
      this.quiz.tags = data.tags;
    },
    beautifyDesc(value) {
      value = value.replace(/<\/*\w+>/gi, "");
      return value.substr(0, 20);
    },
    // getSearchValue(value) {
    //   this.searchText = value;
    // },
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
      if (this.quiz.tags.indexOf(this.tagText) > -1) return;

      this.quiz.tags.push(this.tagText);
      this.tagText = "";
    },
    handleTagClose(index) {
      this.quiz.tags.splice(index, 1);
    },
    submit() {
      //先检查必填项是否都填写完善
      if (this.quiz.question == "") {
        this.$Modal.warning({ title: "请输入问题" });
        return;
      }
      //统计大概字数
      let content = this.quiz.answer.replace(/<\/?[a-z]+>/gi, "");
      if (content.length < 10) {
        this.$Modal.warning({ title: "回答字数过少，请重新组织语言" });
        return;
      }
      if (this.quiz.tags.length < 1) {
        this.$Modal.warning({ title: "请至少选择一个标签！" });
        return;
      }
      if (!this.quiz.curRepo || this.quiz.curRepo == "") {
        this.$Modal.warning({ title: "请选择题库！" });
        return;
      }
      if (!this.quiz.curImp || this.quiz.curImp == "") {
        this.$Modal.warning({ title: "请选择重要程度！" });
        return;
      }
      this.submitDisabled = true;
      if (this.quiz.id === 0) {
        //新建题目
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
              this.$Notice.success({ title: "已成功提交！" });
              this.submitDisabled = false;
            }
          })
          .catch((error) => {
            this.$Notice.error({ title: "提交失败！" });
            this.submitDisabled = false;
            console.error(error);
          });
      } else {
        //更新题目
        request
          .post("/quiz/update", {
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
              this.$Notice.success({ title: "已成功更新！" });
              this.submitDisabled = false;
            }
          })
          .catch((reason) => {
            this.$Notice.error({ title: "更新失败！" });
            this.submitDisabled = false;
          });
      }
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
    handleDelete() {
      if (this.quiz.id === 0) {
        this.$Modal.warning({
          title: "请指定数据库中已存在的题目后再进行删除！",
        });
        return;
      }

      request
        .post("/quiz/del", {
          quizId: this.quiz.id,
        })
        .then((resp) => {
          if (resp.status === 200) {
            this.$Notice.success({
              title: "已在数据库中删除该题目",
            });
            this.reset();
          }
        });
    },
    handleResetLevel() {
      if (this.quiz.id === 0) {
        this.$Modal.warning({
          title: "请指定数据库中已存在的题目后再重置熟练度！",
        });
        return;
      }

      request
        .post("/quiz/setlevel", {
          quizId: this.quiz.id,
          level: "未知",
        })
        .then((resp) => {
          if (resp.status === 200) {
            this.$Notice.success({
              title: "已重置该题目的熟练度为未知",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$Notice.error({
            title: "重置熟练度失败！",
          });
        });
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
  beforeRouteEnter(to, from, next) {
    console.log('to',to);
    // console.log('from',from);
    // next();
    //如果是从/general过来并且带有params，那么把值赋给这里的data
    if (from.name == "general" && Object.keys(to.params).length > 0) {
      next((vc) => {
        vc.quiz.id = to.params.id;
        vc.quiz.question = to.params.question;
        vc.quiz.answer = to.params.answer;
        vc.quiz.references = to.params.references;
        vc.quiz.tags = to.params.tags;
        vc.quiz.curRepo = to.params.repoName;
        vc.quiz.curImp = to.params.importance;
      });
    } else {
      next();
    }
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
          justify-content: space-between;
          align-items: center;
          .add-sign {
            font-size: 24px;
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
