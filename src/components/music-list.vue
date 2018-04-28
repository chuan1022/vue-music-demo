<template>
  <div class="wrapper">
    <header class="title" ref="title" :style="titleStyle">
      <i class="iconfont back" @click="back">&#xe624;</i>
      <span class="name">
        {{title}}
      </span>
    </header>
    <div class="bg-img" :style="bgStyle" ref="bgImg">
      <span class="playBtn" @click="randomPlay(songs)">
        <i class="iconfont">&#xe625;</i>
        <span>随机播放全部</span>
      </span>
    </div>
    <vue-loading v-show="!songs.length"></vue-loading>
    <scroll-view class="scroll" :listenScroll="true" :probeType="3" @scroll="scroll">
      <ul class="list">
        <li class="item" v-for="(item,index) in songs " :key="index" @click="play(songs,index)">
          <div v-if="rank" class="rank">
            <img v-if="index===0" class="rank_icon" src="../assets/image/rank1.svg">
            <img v-else-if="index===1" class="rank_icon" src="../assets/image/rank2.svg">
            <img v-else-if="index===2" class="rank_icon" src="../assets/image/rank3.svg">
            <span v-else>{{index+1}}</span>
          </div>
          <div class="info">
            <h2 class="name">{{item.name}}</h2>
            <p class="singer">{{item.singer}} - {{item.ablum}}</p>
          </div>
        
        </li>
      </ul>
    </scroll-view>
  </div>
</template>
<script>
import scrollView from "@/assets/vue/scroll-view";
import vueLoading from "@/assets/vue/vue-loading";
import { mapActions } from "vuex"

export default {
  components: {
    scrollView,vueLoading
  },
  props: {
    songs: {
      default: [],
      type: Array
    },
    title: {
      type: String,
      default: ""
    },
    bgImg: {
      type: String,
      default: ""
    },
    rank:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      toTop: false
    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`;
    },
    titleStyle() {
      return this.toTop
        ? { background: "#222", color: "#ffcd32" }
        : { background: "", color: "#fff" };
    }
  },
  methods: {
    ...mapActions({
      setPlay:'setPlay',
      setRandomPlay:'setRandomPlay'
    }),
    scroll(ev) {
      let scale = 1;
      let blur = 0;
      let percent = Math.abs(ev.y / 500);

      this.toTop = ev.y < -220 ? true : false;

      if (ev.y >= 0) {
        scale += percent;
        blur = 0;
      } else {
        blur = Math.min(10 * percent, 10);
      }
      this.$refs.bgImg.style.transform = `scale(${scale})`;
      this.$refs.bgImg.style.filter = `blur(${blur}px)`;
    },
    back() {
      this.$router.back();
    },
    play(songs,index){
      this.setPlay({
        songs: songs,
        index: index
      })
    },
    randomPlay(songs){
      this.setRandomPlay({
        songs: songs
      })
    }

  }
};
</script>
<style lang="less" scoped>
@import "../assets/styles/variable";
@import "../assets/styles/mixin";

.wrapper {
  .title {
    color: @color-text;
    line-height: 44px;
    height: 44px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 40;
    transition: all 1s;
    text-align: center;
    .back {
      position: absolute;
      left: 20px;
    }
  }
  .bg-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 200px;
    transform-origin: top;
    background-size: cover;
    padding-bottom: 60px;
    text-align: center;
    .playBtn {
      display: flex;
      width: 30%;
      margin: 0 auto;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-around;
      padding: 0 20px;
      font-size: @font-size-small;
      height: 30px;  
      border: 1px solid @color-theme;
      border-radius: 15px;
      .iconfont {
        margin-right: 10px;
        font-size: 18px;
      }
    }
  }
  .scroll {
    position: relative;
    width: 100%;
    height: calc(100vh - 260px);
    // overflow: hidden;
  }
  // .modal {
  //   position: absolute;
  //   top: 260px;
  //   width: 100%;
  //   height: 260px;
  //   background: @color-background;
  // }
  .list {
    background: @color-background;
    padding: 30px;
    .item {
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      .info{
        flex: 1;
        overflow: hidden;
        *{
          .noWrap();
        }
      }
      .rank{
        margin-right: 20px;
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        text-align: center;
        line-height: 40px;
        .rank_icon{
          width: 40px;
          height: 40px;
        }
      }
      .name {
        color: @color-text;
        line-height: 30px;
        font-size: @font-size-medium;
      }
      .singer {
        color: @color-text-d;
        font-size: @font-size-medium;
      }
    }
  }
}
</style>

