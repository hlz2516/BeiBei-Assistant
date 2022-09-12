<template>
  <Button class="ivu-m-16" size="large" type="primary" @click="createRepo"
    >新建题库</Button
  >
  <Modal v-model="newModal" title="请输入题库名" @on-ok="newRepo" @on-cancel="cancel">
    <Input type="text" v-model="newRepoName" ref="newRepo" />
  </Modal>


  <Modal v-model="delModal" title="注意！" @on-ok="delRepo" @on-cancel="delModal=false">
    <p>删除题库时会把题库内的所有题目删除，请谨慎操作！</p>
    <p>(为了保证每个用户的安全，暂时无法使用该功能！)</p>
  </Modal>


  <Table border :columns="columns" :data="datas" :loading="loading">
    <template #repoName="{ row, index }">
      <Input type="text" v-model="editRepoName" v-if="editIndex === index" />
      <span v-else>{{ row.name }}</span>
    </template>

    <template #action="{ row, index }">
      <div v-if="editIndex === index">
        <Button class="ivu-mr-8" @click="handleSave(index)">保存</Button>
        <Button class="ivu-mr-8" @click="editIndex = -1">取消</Button>
      </div>
      <div v-else>
        <Button class="ivu-mr-8" @click="handleEdit(row, index)">编辑</Button>
        <Button class="ivu-mr-8" @click="remove(index)">删除</Button>
      </div>
    </template>
  </Table>
</template>

<script>
import request from "../request";

export default {
  name: "RepoPage",
  data() {
    return {
      columns: [
        { title: "题库", slot: "repoName" },
        { title: "题目数量", key: "quizCount" },
        {
          title: "操作",
          slot: "action",
        },
      ],
      datas: [
        { name: "html", quizCount: 0 },
        { name: "css", quizCount: 0 },
      ],
      editIndex: -1,
      editRepoName: "",
      newModal: false,
      delModal:false,
      newRepoName: "",
      loading: true,
      req: null,
    };
  },
  methods: {
    handleEdit(row, index) {
      this.editRepoName = row.name;
      this.editIndex = index;
    },
    handleSave(index) {
      //发送请求
      request
        .post("/repoedit", {
          oldName: this.datas[index].name,
          newName: this.editRepoName,
        })
        .then((result) => {
          if (result.status === 200) {
            this.datas[index].name = this.editRepoName;
            this.editIndex = -1;
          }
        })
        .catch((reason) => {
          console.error("修改题库名失败！", reason);
        });
    },
    remove(index) {
      this.delModal = true;
    },
    createRepo() {
      this.newModal = true;
      this.$nextTick(() => {
        this.$refs.newRepo.focus();
      });
    },
    newRepo() {
      const newData = {
        name: this.newRepoName,
        quizCount: 0,
      };
      this.datas.push(newData);
      //发送请求
      request.post("/repoadd", newData).then((result) => {
        if (result.status === 200) {
          this.newRepoName = "";
          this.newModal = false;
        }
      });
    },
    cancel() {
      this.newRepoName = "";
      this.newModal = false;
    },
    delRepo(index){

    }
  },
  created() {
    //发送数据请求
    this.req = request.get("/repos");
  },
  mounted() {
    //等待数据接收完成后，将loading改为false
    this.req
      .then((data) => {
        this.datas = data.msg;
        this.loading = false;
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
};
</script>

<style></style>
