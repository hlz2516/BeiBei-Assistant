<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {

  },
  methods:{
    
  },
  created(){
    this.$router.replace('/index')
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  /* 限制为可视区高度 */
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
}

</style>
