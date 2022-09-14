<template>
  <div class="container">
    <div class="left-layout">
      <div class="search-part">
        <search-bar :value="searchText" v-on:input="getValue" width="100%" />
      </div>
      <div class="result-part ivu-bb ivu-bl ivu-br"></div>
      <div class="pagation-part">
        <Page :total="100" />
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
            <input type="text" id="question" />
          </div>
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 答案 -->
        <div style="flex: 5" class="canscroll">
          <Tiptap width="100%" height="100%" />
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 参考链接 -->
        <div style="flex: 0.6" class="links-part">
          <div class="link-label">
            <label for="links">参考链接:</label>
          </div>
          <div class="link-input">
            <input type="text" id="links" />
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
            <Icon type="ios-add-circle-outline" class="add-sign" @click="addTag" />
          </div>
          <div class="tags-container">
            <!-- <Tag closable @on-close="handleTagClose" class="tag">标签三</Tag>
            <Tag closable @on-close="handleTagClose" class="tag">标签三</Tag> -->
            <Tag v-for="(tag,index) in tags" :key="tag" closable @on-close="handleTagClose(index)" class="tag">{{tag}}</Tag>
          </div>
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 所属题库 + 重要性 -->
        <div style="flex: 1" class="others-part">
            <div style="flex:1" class="repo-select">
                <label for="repo-selector">所属题库</label>
                <Select v-model="curRepo" placeholder="" id="repo-selector" >
                    <Option v-for="(repo,index) in repos" :value="repo" :key="index">{{ repo }}</Option>
                </Select>
            </div>
            <div style="flex:1" class="repo-select">
                <label for="imp-selector">重要程度</label>
                <Select v-model="curImp" placeholder="" id="imp-selector" >
                    <Option v-for="(imp,index) in imps" :value="imp" :key="index">{{ imp }}</Option>
                </Select>
            </div>
        </div>
        <Divider size="small" style="margin: 0" />
        <!-- 功能按钮 -->
        <div style="flex: 1" class="func-part">
            <Button type="primary">提交</Button>
            <Button type="info">重置</Button>
        </div>
      </div>
    </card>
    <card class="right-layout">
      <!-- 说明如何搜索 -->
    </card>
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";
import Tiptap from "../components/Tiptap.vue";
export default {
  name: "NewQuizPage",
  components: {
    SearchBar,
    Tiptap,
  },
  data() {
    return {
      searchText: "",
      allTags: ["html", "css", "javascript", "json", "vue", "react"],
      tags:["html","css"],
      tagText: "",
      repos:["what","fuck"],
      curRepo:"",
      imps:["重要","理解","了解","未知"],
      curImp:""
    };
  },
  methods: {
    getValue(value) {
      this.searchText = value;
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    addTag(){
        if (this.tagText == "")
            return
        if(this.tags.length >= 5)
            return
        this.tags.push(this.tagText);
    },
    handleTagClose(index){
        this.tags.splice(index,1);
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
          .add-sign{
            font-size: 24px;
            transform: translate(-50%,0);
            cursor: pointer;
          }
        }

        .tags-container {
          flex: 7.5;
          overflow: hidden;

          .tag{
            margin: 0 4px;
          }
        }
      }

      .others-part{
        display: flex;
        align-items: center;

        .repo-select{
            display: flex;
            justify-content: flex-start;
            font-size: 16px;
            line-height: 32px;

            #repo-selector,#imp-selector{
                width:200px;
                margin: 0 4px;
            }
        }
      }

      .func-part{
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
