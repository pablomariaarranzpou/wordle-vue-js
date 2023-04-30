<template>
  <WordleMain msg="Welcome to Your Vue.js App"/>
</template>

<script>
import WordleMain from './components/WordleMain.vue'

export default {
  lang: 'es',
  name: 'App',
  components: {
    WordleMain
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
