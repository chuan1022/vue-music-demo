<template>
  <div class="loading">
    <vue-loading  class="loading" type="spin" color="#ffcd32" :size="{ width: '50px', height: '50px' }"></vue-loading>  
  </div>
</template>
<style lang="less" scoped>
.loading {
  text-align: center;
  margin: 20px auto;
}
</style>
<script>
import vueLoading from "vue-loading-template";
export default {
  components: {
    vueLoading
  }
};
</script>
