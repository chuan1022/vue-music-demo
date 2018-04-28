<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>

@import './assets/styles/index.less';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @color-theme;
  height: 100%;
  .bg {
    width: 100px;
    height: 100px;
    .bg-image('../image/logo');
    .border-radius(50px);
  }
}
</style>
