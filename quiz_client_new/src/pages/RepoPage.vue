<template>
  <div>
    <Button class="ivu-m-16" size="large" type="primary" @click="createRepo"
      >新建题库</Button>

    <Button class="ivu-m-16" size="large" type="warning" @click="importRepo"
      >导入题库</Button>
  </div>

  <Modal v-model="newModal" title="请输入题库名" @on-ok="newRepo" @on-cancel="cancel">
    <Input type="text" v-model="newRepoName" ref="newRepo" />
  </Modal>


  <Modal v-model="delModal" title="注意！" @on-ok="delRepo" @on-cancel="delModal=false">
    <p>删除题库时会把题库内的所有题目删除，请谨慎操作！</p>
    <p>(为了保证每个用户的安全，暂时无法使用该功能！)</p>
  </Modal>

  <Modal v-model="impModal" title="请输入题库的独立密码（6位）" 
  @on-ok="download" @on-cancel="impModal=false" loading
  >
    <Input type="text" v-model="code" ref="impRepo" />
  </Modal>

  <Modal v-model="upModal" title="注意！" 
  @on-ok="upload" @on-cancel="upModal=false" loading
  >
    <p>仅支持一次性上传，这意味着您无法对公共题库中的题库进行修改或删除操作！</p>
    <p>所以请确保上传的题库对他人具有一定的借鉴意义</p>
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
        <Button class="ivu-mr-8" @click="handleUpload(row, index)">上传</Button>
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
        { title: "共享密码", key: "origin" },
        {
          title: "操作",
          slot: "action",
        },
      ],
      datas: [
        { name: "html", quizCount: 0 ,origin:''},
      ],
      editIndex: -1,
      editRepoName: "",
      newModal: false,
      delModal:false,
      impModal:false,
      upModal:false,
      newRepoName: "",
      curRepoName:"",
      curIndex:-1,
      loading: true,
      req: null,
      code:''
    };
  },
  methods: {
    handleEdit(row, index) {
      this.editRepoName = row.name;
      this.editIndex = index;
    },
    handleUpload(row, index){
      this.upModal = true;
      this.curIndex = index;
      this.curRepoName = row.name;
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
    importRepo(){
      this.impModal = true;
      this.$nextTick(() => {
        this.$refs.impRepo.focus();
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
    download(){
      const duped = this.datas.filter(data=>{
        return data.origin === this.code;
      })

      if (duped.length > 0) {
        this.$Modal.info({ content: "已经下载过该题库，不允许重复下载！" });
        this.impModal = false;
        return;
      }

      request.post('/repodownload',{code:this.code})
      .then(result=>{
        if (result.status === 200) {
          this.impModal = false;
        }
      })
      .catch(error=>{
        console.error(error);
      })
    },
    upload(){
      request.post('/repoupload',{name:this.curRepoName})
      .then(result=>{
        if (result.status === 200) {
          this.datas[this.curIndex].origin = result.origin;
          this.upModal = false;
        }
      })
      .catch(error=>{
        console.error(error);
      })
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
