<template>
  <Modal :model-value="showModel" @on-cancel="this.$emit('handleControl')">
    <template #header>
      <h3>大家的评论</h3>
    </template>
    <div class="center">
      <DescriptionList
        layout="vertical"
        :col="1"
        class="comment-list"
        :gutter="8"
      >
        <Description v-for="comment in pagedComments" :key="comment.id">
          <template #term>
            <div class="term-part">
              <span class="commenter">{{ comment.commenter }}:</span>
              <span class="comment-time"
                >发表于 {{ $filters.formatTime(comment.create_time) }}</span
              >
            </div>
          </template>
          <p style="padding: 0 8px">
            {{ comment.comment }}
          </p>
        </Description>
        <Divider style="margin: 0" />
      </DescriptionList>
      <div class="page-part">
        <Page :total="comments.length" v-model="curPage" />
      </div>
    </div>
    <template #footer>
      <Input
        placeholder="评价一下这套题库吧~"
        v-model="content"
        @keyup.enter="addComment"
      />
    </template>
  </Modal>
</template>

<script>
import request from "../request";

export default {
  name: "CommentsModal",
  emits: ["handleControl"],
  props: {
    showModel: {
      type: Boolean,
      default: false,
    },
    repoCode: {
      type: String,
    },
  },
  data() {
    return {
      comments: [],
      curPage: 1,
      pageSize: 8,
      content: "",
    };
  },
  computed: {
    pagedComments() {
      let startIndex = (this.curPage - 1) * this.pageSize;
      return this.comments.slice(startIndex, this.pageSize + startIndex);
    },
  },
  watch: {
    repoCode(newVal) {
      request
        .get("/comments", {
          params: {
            code: newVal,
          },
        })
        .then((result) => {
          if (result.status === 200) {
            this.comments = result.comments;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  methods: {
    addComment() {
        request.post('/comment/add',{
            code:this.repoCode,
            comment:this.content
        })
        .then((result)=>{
            if (result.status === 200) {
                this.comments.unshift(result.comment);
                this.content = ''
            }
        })
        .catch(error=>{
            console.error(error);
        })
    },
  },
};
</script>

<style>
.center {
  height: 400px;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.page-part {
  flex-basis: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comment-list {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.term-part {
  overflow: hidden;
}

.commenter {
  float: left;
  font-weight: 600;
}

.comment-time {
  float: right;
  margin-right: 60px;
  color: lightgray;
  font-size: 12px;
}
</style>