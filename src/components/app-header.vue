<template>
  <h3>
    <div class="logo"></div>
    <div class="text">vue-music</div>
  </h3>
</template>
<style lang="less" scoped>

  @import "../assets/styles/mixin";
  @import "../assets/styles/variable";

  h3 {
    font-size: 0;
    text-align: center;
    position: relative;
    .logo{
      .bg-image('../image/logo');
      width: 30px;
      height: 32px;
      background-size: 30px 32px;
      display: inline-block;
      margin-top: 6px;
      margin-right: 9px;
    }
    .text{
      display: inline-block;
      line-height: 44px;
      font-size: @font-size-large;
      vertical-align: top;
    }
  }
</style>

<script>
export default {
}
</script>
