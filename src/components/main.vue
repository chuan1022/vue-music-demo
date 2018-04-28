<template>
  <div class="app">
    <app-header></app-header>
    <app-tab></app-tab>
    <keep-alive>
      <router-view class="view"></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import appHeader from './app-header'
import appTab from './app-tab'
import player from './player'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    appHeader, appTab, player
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .app{
    height: 100%;
    padding-bottom: 70px;
    box-sizing: border-box;
  }
</style>
