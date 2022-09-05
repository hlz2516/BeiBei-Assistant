<template>
  <div class="container">
    <div class="card" @click="toSelectQuiz">背 题</div>
    <div class="card" @click="toNewQuiz">出 题</div>
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
  width:100%;
  height: 100%;
  border: 1px solid black;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.card {
  /* width: 90%;
  height: 45%; */
  width: 40%;
  height: 80%;
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

@media screen and (min-width: 380px) and (max-width: 600px) {
  .card{
    width: 80%;
    height: 80%;
  }

  .card:last-child {
    display: none;
  }
}

.card:hover {
  background-color: lightyellow;
}
</style>