<template>
  <Tabs v-model="repoType">
    <TabPane label="个人题库" name="private">
      <div>
        <Button class="ivu-m-16" size="large" type="primary" @click="createRepo"
          >新建题库</Button
        >
        <!-- <Button class="ivu-m-16" size="large" type="warning" @click="importRepo"
          >导入题库</Button
        > -->
      </div>

      <Table
        border
        :columns="priRepos.columns"
        :data="priRepos.datas"
        :loading="priRepos.loading"
      >
        <template #repoName="{ row, index }">
          <Input
            type="text"
            v-model="priRepos.editRepoName"
            v-if="priRepos.editIndex === index"
          />
          <span v-else>{{ row.name }}</span>
        </template>

        <template #action="{ row, index }">
          <div v-if="priRepos.editIndex === index">
            <Button class="ivu-mr-8" @click="handleSave(index)">保存</Button>
            <Button class="ivu-mr-8" @click="priRepos.editIndex = -1"
              >取消</Button
            >
          </div>
          <div v-else>
            <Button class="ivu-mr-8" @click="handleUpload(row, index)"
              >上传</Button
            >
            <Button class="ivu-mr-8" @click="handleEdit(row, index)"
              >编辑</Button
            >
            <Button class="ivu-mr-8" @click="remove(index)">删除</Button>
          </div>
        </template>
      </Table>
    </TabPane>
    <TabPane label="公共题库" name="public">
      <div class="search">
        <SearchBar
          v-model="pubRepos.stext"
          width="250px"
          height="30px"
          half-radius
          placeholder="题库名/共享密码"
        />
      </div>

      <Table border :columns="pubRepos.columns" :data="curPageData">
        <template #name="{ row }">
          <strong>{{ row.name }}</strong>
        </template>
        <template #action="{ row }">
          <Button type="primary" size="small" @click="download(row)" style="margin-right:16px;"
            >下载</Button
          >
          
          <Button type="warning" size="small" @click="checkOutComments(row)"
            >评论</Button
          >
        </template>
      </Table>
      <div class="page-part">
        <Page
          v-model="pubRepos.curPage"
          :total="curPageData.length"
          show-total
        />
      </div>
    </TabPane>
  </Tabs>

  <Modal
    v-model="newModal"
    title="请输入题库名"
    @on-ok="newRepo"
    @on-cancel="cancel"
  >
    <Input type="text" v-model="priRepos.newRepoName" ref="newRepo" />
  </Modal>

  <Modal
    v-model="delModal"
    title="注意！"
    @on-ok="delRepo"
    @on-cancel="delModal = false"
  >
    <p>删除题库时会把题库内的所有题目删除，请谨慎操作！</p>
    <p>(为了保证每个用户的安全，暂时无法使用该功能！)</p>
  </Modal>

  <Modal
    v-model="upModal"
    title="注意！"
    @on-ok="upload"
    @on-cancel="upModal = false"
    loading
  >
    <p>
      仅支持一次性上传，这意味着您无法对公共题库中的题库进行修改或删除操作！
    </p>
    <p>所以请确保上传的题库对他人具有一定的借鉴意义</p>
  </Modal>

  <CommentsModal :showModel="commentsModal" @handleControl="handleControl" :repoCode="pubRepos.curRepo?pubRepos.curRepo.code:''" />
</template>

<script>
import request from "../request";
import moment from "moment";
import CommentsModal from '../components/CommentsModal.vue';

export default {
  name: "RepoPage",
  components:{CommentsModal},
  inject: ["reload"],
  data() {
    return {
      priRepos: {
        columns: [
          { title: "题库", slot: "repoName" },
          { title: "题目数量", key: "quizCount" },
          { title: "题库来源", key: "origin" },
          {
            title: "操作",
            slot: "action",
          },
        ],
        datas: [{ name: "html", quizCount: 0, origin: "" }],
        editIndex: -1,
        editRepoName: "",
        newRepoName: "",
        curRepoName: "",
        curIndex: -1,
        loading: true,
      },
      pubRepos: {
        curPage: 1,
        pageSize: 10,
        stext: "",
        columns: [
          { title: "题库", key: "name" },
          { title: "创作者", key: "creator" },
          { title: "共享密码", key: "code" },
          { title: "题目数量", key: "quiz_count" },
          { title: "下载次数", key: "download_time", sortable: true },
          { title: "创建时间", key: "create_time", sortable: true },
          {
            title: "操作",
            slot: "action",
          },
        ],
        datas: [
          //   {
          //     "id": 1,
          //     "code": "2asbaW",
          //     "name": "前端",
          //     "creator": "tom",
          //     "download_time": 0,
          //     "create_time": "2022-09-22T04:56:55.000Z",
          //     "PubQuizzes": [
          //         {
          //             "id": 1,
          //             "code": "2asbaW",
          //             "question": "ques",
          //             "answer": "ans",
          //             "importance": "未知",
          //             "tags": [
          //                 "java",
          //                 "C#",
          //                 "php"
          //             ]
          //         },
          //         {
          //             "id": 2,
          //             "code": "2asbaW",
          //             "question": "ques1",
          //             "answer": "ans1",
          //             "importance": "未知",
          //             "tags": [
          //                 "node",
          //                 "javascript"
          //             ]
          //         },
          //         {
          //             "id": 3,
          //             "code": "2asbaW",
          //             "question": "ques2",
          //             "answer": "ans2",
          //             "importance": "未知",
          //             "tags": []
          //         }
          //     ]
          // }
        ],
        filteredData: [],
        myComment:'',
        curRepo:null
      },
      newModal: false,
      delModal: false,
      impModal: false,
      upModal: false,
      commentsModal:false,
      reqPri: null,
      reqPub: null,
      code: "",
      repoType: "private",
    };
  },
  computed: {
    curPageData() {
      let pageSize = this.pubRepos.pageSize;
      let startIndex = (this.pubRepos.curPage - 1) * pageSize;
      //如果有搜索文字，则加载筛选过的数据
      if (this.pubRepos.stext.length > 0) {
        let datas = this.pubRepos.datas.filter((data) => {
          return (
            data.name.indexOf(this.pubRepos.stext) > -1 ||
            data.code == this.pubRepos.stext
          );
        });
        return datas.slice(startIndex, startIndex + pageSize);
      } else {
        return this.pubRepos.datas.slice(startIndex, startIndex + pageSize);
      }
    },
  },
  methods: {
    // test(row, index) {
    //   console.log("row", row);
    //   console.log("index", index);
    // },
    handleEdit(row, index) {
      this.priRepos.editRepoName = row.name;
      this.priRepos.editIndex = index;
    },
    handleUpload(row, index) {
      this.upModal = true;
      this.priRepos.curIndex = index;
      this.priRepos.curRepoName = row.name;
    },
    handleSave(index) {
      //发送请求
      request
        .post("/repo/edit", {
          oldName: this.priRepos.datas[index].name,
          newName: this.priRepos.editRepoName,
        })
        .then((result) => {
          if (result.status === 200) {
            this.priRepos.datas[index].name = this.priRepos.editRepoName;
            this.priRepos.editIndex = -1;
          } else {
            this.$Modal.warning({
              title: "已存在相同名称的题库，请换个名字！",
            });
            return;
          }
        })
        .catch((reason) => {
          console.error("修改题库名失败！", reason);
        });
    },
    remove() {
      this.delModal = true;
    },
    createRepo() {
      this.newModal = true;
      this.$nextTick(() => {
        this.$refs.newRepo.focus();
      });
    },
    importRepo() {
      this.impModal = true;
      this.$nextTick(() => {
        this.$refs.impRepo.focus();
      });
    },
    newRepo() {
      //如果与个人题库中的题库名重复，则提示并返回
      let repoNames = this.priRepos.datas.map((data) => {
        return data.name;
      });
      if (repoNames.indexOf(this.priRepos.newRepoName) > -1) {
        this.$Modal.warning({ title: "与已有题库的题库名重复，请换个名字！" });
        return;
      }
      const newData = {
        name: this.priRepos.newRepoName,
        quizCount: 0,
      };
      this.priRepos.datas.push(newData);
      //发送请求
      request
        .post("/repo/add", newData)
        .then((result) => {
          if (result.status === 200) {
            this.priRepos.newRepoName = "";
            this.newModal = false;
          }
        })
        .catch((reason) => {
          console.error(reason);
        });
    },
    download(row) {
      const duped = this.priRepos.datas.filter((data) => {
        return data.origin === row.code;
      });

      if (duped.length > 0) {
        this.$Modal.info({ content: "已经下载过该题库，不允许重复下载！" });
        return;
      }

      request
        .post("/repo/download", { code: row.code })
        .then((result) => {
          if (result.status === 200) {
            this.$Notice.success({ title: "下载成功！" });
            //刷新页面
            this.reload();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    upload() {
      //如果超过60s还没上传完，提示上传失败
      let timer = setTimeout(() => {
        this.$Modal.error({ title: "上传失败！详情错误请询问开发者" });
        this.upModal = false;
      }, 60000);

      request
        .post("/repo/upload", { name: this.priRepos.curRepoName })
        .then((result) => {
          if (result.status === 200) {
            this.priRepos.datas[this.priRepos.curIndex].origin = result.origin;
            this.upModal = false;
            clearTimeout(timer);
            this.$Notice.success({ title: "上传成功！" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    cancel() {
      this.priRepos.newRepoName = "";
      this.newModal = false;
    },
    delRepo() {},
    formatTime(t) {
      return moment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    checkOutComments(row){
      this.pubRepos.curRepo = row;
      this.commentsModal = true;
    },
    handleControl(){
      this.commentsModal = ! this.commentsModal;
    }
  },
  created() {
    //发送数据请求
    this.reqPri = request.get("/repos");
    this.reqPub = request.get("/pubrepos");
  },
  mounted() {
    this.reqPri
      .then((data) => {
        if (data.status === 200) {
          this.priRepos.datas = data.msg;
          this.priRepos.loading = false;
        }
      })
      .catch((reason) => {
        console.error(reason);
      });

    this.reqPub
      .then((data) => {
        if (data.status === 200) {
          // console.log(data.data);
          data.data.forEach((elem, ind, arr) => {
            arr[ind].quiz_count = elem.PubQuizzes.length;
            arr[ind].create_time = this.formatTime(elem.create_time);
          });
          this.pubRepos.datas = data.data;
        }
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
};
</script>

<style scoped>
.search {
  height: 60px;
  display: flex;
  align-items: center;
}

.page-part {
  margin: 20px 0;
  height: 60px;
  text-align: center;
}
</style>
