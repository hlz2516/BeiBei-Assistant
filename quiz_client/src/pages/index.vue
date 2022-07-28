<template>
  <div class="container">
    <div class="card" @click="toNewQuiz">出 题</div>
    <div class="card" @click="toSelectQuiz">背 题</div>
    <div class="card" @click="test">概 况</div>
  </div>
</template>

<script>
export default {
  methods: {
    toNewQuiz() {
      this.$router.push('/newquiz')
    },
    toSelectQuiz() {
      this.$router.push('/select')
    },
    test(){
      
    }
  },
};
</script>

<style scoped>
.container {
  width: 1100px;
  height: 450px;
  border: 1px solid black;
  padding: 10px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.card {
  width: 350px;
  height: 400px;
  border: 1px solid blue;
  background-color: yellowgreen;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: bold;
  font-family: "Courier New", Courier, monospace;
  cursor: pointer;
}

.card:hover {
  background-color: lightyellow;
}
</style>