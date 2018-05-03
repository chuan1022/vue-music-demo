<template>
  <div class="wrapper">
    <i class="iconfont">&#xe61a;</i>
    <input class="input" type="text" :placeholder="placeholder" v-model="key">
    <transition name="fade">
      <i class="iconfont" v-show="data" @click="delData">&#xe614;</i>
    </transition>
  </div>
</template>

<script>
export default {
  props:{
    placeholder:{
      type: String,
      default: '搜索歌手、歌曲'
    },
    data:{
      type:String,
      default: ''
    },
    // //1:搜索歌手、歌曲； 2：搜索歌曲
    // searchType: {
    //   type: Number,
    //   default: 1
    // }
  },
  data() {
    return {
      key:''
    };
  },
  computed:{
    
  },
  created() {},
  methods: {
    delData() {
      this.key = "";
    }
  },
  watch:{
    key(newVal,oldVal){ 
      this.$emit('change',newVal,oldVal)
    },
    data(newVal){
      this.key = newVal
    }
  }
};
</script>

<style lang="less" scoped>
@import "../styles/variable";
.wrapper {
  background: @color-highlight-background;
  padding: 10px 5px;
  margin: 10px;
  display: flex;
  align-items: center;
  text-align: center;
  border-radius: 5px;
  .iconfont {
    flex: 0 0 40px;
    // color: @color-text-d;
  }
  .input {
    outline: none;
    flex: 1;
    background: @color-highlight-background;
    color: @color-text;
    border: none;
    height: 20px;
  }
  .fade-enter-active, .fade-leave-active{
    transition: all .4s;
  }
  .fade-enter,.fade-leave-to{
    opacity: 0;
  }
}
</style>
