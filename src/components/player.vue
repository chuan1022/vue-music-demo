<template>
  <div v-show="playList.length"  class="player">
    <transition name="full">
      <div v-show="fullScreen" class="full_screen_player">
        <div class="backImg">
          <img :src="currentSong.image" alt="">
        </div>
        <div> 
          <header class="title" ref="title">
            <i class="iconfont back" @click="hideFull">&#xe624;</i>
            <span class="name">
              {{currentSong.name}}
            </span>
            <h2 class="singer">{{currentSong.singer}}</h2>
          </header>
          <div>
             <div class="song-image">
              <img :src="currentSong.image" alt="" :style="cdStyle" ref="cdImage">
            </div> 
            <div class="lyric_list"></div> 
          </div>
         
          <div v-if="fullScreen" class="progress">
            <progress-bar 
            :currentTime="Math.floor(currentTime)" 
            :totalTime="Math.floor(currentSong.duration)"
            @touchMove="touchMove"
            @touchEnd="touchEnd"
            @skip="skip"
            ></progress-bar>
          </div>
          <div class="control">
            <i class="iconfont" v-show="mode==0" @click="changeMode(1)">&#xe66c;</i>
            <i class="iconfont" v-show="mode==1" @click="changeMode(2)">&#xe66d;</i>
            <i class="iconfont" v-show="mode==2" @click="changeMode(0)">&#xe66b;</i>
            <i class="iconfont" @click="preSong">&#xe670;</i>
            <i class="iconfont main" @click="changepPlayState" v-show="!playing">&#xe625;</i>
            <i class="iconfont main" @click="changepPlayState" v-show="playing">&#xe629;</i>
            <i class="iconfont"  @click="nextSong">&#xe674;</i>
            <i class="iconfont">&#xe627;</i>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div v-show="!fullScreen" class="mini_player" @click="showFull">
        <div class="mini_left"> 
          <img :src="currentSong.image" alt="">
          <div class="name">
            <h1>{{currentSong.name}}</h1>
            <h2>{{currentSong.singer}}</h2>
          </div>
        </div>
        <div class="mini_right">
          <progress-circle :radius="30" :percent="percent" @click.native.stop="changepPlayState">
            <i class="iconfont  mini-icon" style="margin-left:-6px"  v-show="!playing">&#xe66a;</i>
            <i class="iconfont  mini-icon"  v-show="playing">&#xe677;</i>
          </progress-circle>
          <i class="iconfont" style="margin:0 20px;" @click="showList">&#xe634;</i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="canPlay" @error="error" @ended="ended" @timeupdate="playingHandle"></audio>
  </div>
</template> 

<script>
import { mapGetters, mapMutations } from "vuex";
import progressBar from "@/assets/vue/progress-bar";
import progressCircle from "@/assets/vue/progress-circle";
import { playMode } from "@/assets/js/player";
import { shuffle } from "@/assets/js/utils";
import { getLyric } from "@/api/index";
import Lyric from "lyric-parser";

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0
    };
  },
  components: {
    progressBar,
    progressCircle
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ]),
    cdStyle() {
      return this.playing
        ? "animation-play-state:running"
        : "animation-play-state:paused";
    },
    totalTime() {
      return this.currentSong.duration;
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    }
  },
  created() {},

  mounted() {
    this.setPlay(true);
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlay: "SET_PLAYING",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setMode: "SET_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    touchMove(percent) {},
    touchEnd(percent) {
      if (!this.songReady) {
        return;
      }
      this.$refs.audio.currentTime = percent * this.totalTime;
    },
    skip(percent) {
      if (!this.songReady) {
        return;
      }
      this.$refs.audio.currentTime = percent * this.totalTime;
    },
    //隐藏全屏播放器
    hideFull() {
      this.setFullScreen(false);
    },
    //显示全屏播放器
    showFull() {
      this.setFullScreen(true);
    },
    //歌曲加载完毕
    canPlay() {
      // if(this.playing){
      //   this.$refs.audio.play();
      // }
      this.songReady = true;
      console.log("歌曲加载完成可以播放");
    },
    //歌曲加载出错
    error() {
      console.log("歌曲加载错误");
    },

    //正在播放 控制进度条
    playingHandle(e) {
      this.currentTime = e.target.currentTime;
    },
    //播放、暂停
    changepPlayState() {
      if (!this.songReady) {
        return;
      }
      this.setPlay(!this.playing);
    },
    //当前播放完毕
    ended() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.nextSong();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    //切换播放模式
    changeMode(mode) {
      this.setMode(mode);
      let list = [];
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList.concat();
      }
      if (this.mode !== playMode.loop) {
        this.resetIndex(list);
      }
      this.setPlayList(list);
    },
    resetIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    //上一首
    preSong() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
    },
    //下一首
    nextSong() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index > this.playList.length - 1) {
        index = 0;
      }
      this.setCurrentIndex(index);
    },
    getLyric() {
      if (this.currentSong.lyric) {
        return;
      }
      getLyric(this.currentSong).then(res => {
        console.log(res)
        this.currentSong.lyric = res.lyric;
        this.formatLyric()
      });
    },
    formatLyric(){
      this.currentLyric = new Lyric(this.currentSong.lyric)
    },
    showList() {}
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }
      // this.$refs.cdImage.style='transform:rotate(0)'
      this.songReady = false;
      this.getLyric();
      this.$nextTick(() => {
        if (this.playing) {
          this.$refs.audio.play();
        }
      });
    },
    playing(newVal) {
      if (newVal) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../assets/styles/variable";
@import "../assets/styles/mixin";
.player {
  width: 100%;
  position: relative;
  .full_screen_player {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: @color-background;
    .backImg {
      position: fixed;
      z-index: -1;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      line-height: 44px;
      height: 44px;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 40;
      text-align: center;
      transition: all 0.3s;
      .back {
        position: absolute;
        left: 20px;
      }
    }
    .singer {
      font-size: @font-size-small;
      line-height: @font-size-medium;
    }
    .song-image {
      width: 70%;
      margin: 0 auto;
      margin-top: 40%;

      img {
        width: 100%;
        .border-radius(50%);
        border: 6px solid @color-text-d;
        animation: rotate 30s linear infinite;
        animation-play-state: paused;
      }
    }
    .progress {
      width: 100%;
      box-sizing: border-box;
      padding: 0 40px;
      text-align: center;
      position: fixed;
      bottom: 120px;
      margin: 0 auto;
    }
    .control {
      position: fixed;
      bottom: 50px;
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      .iconfont {
        flex: 1;
        font-size: @font-size-large-xxl;
        text-align: center;
        transition: all 0.3s;
        &.main {
          font-size: 40px;
        }
      }
    }
  }
  .mini_player {
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 70px;
    background: @color-highlight-background;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding-left: 10px;
    box-sizing: border-box;
    justify-content: space-between;
    .mini_left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 50px;
        .border-radius(50%);
      }
      .name {
        margin-left: 20px;
        h1 {
          font-size: @font-size-medium;
          color: @color-text;
          line-height: 30px;
        }
        h2 {
          font-size: @font-size-small;
          color: @color-text-d;
          line-height: 20px;
        }
      }
    }
    .mini_right {
      position: relative;
      // padding: 0 10px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .iconfont {
        font-size: 25px;
      }
      .mini-icon {
        font-size: 16px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -8px;
        margin-top: -8px;
      }
    }
  }
  .full-enter-active,
  .full-leave-active {
    transition: all 0.3s;
    .title,
    .control,
    .song-image {
      transition: all 0.3s;
    }
  }
  .full-enter,
  .full-leave-to {
    opacity: 0;
    .title {
      transform: translate3d(0, -100px, 0);
    }
    .control {
      transform: translate3d(0, 100px, 0);
    }
    .song-image {
      transform: scale(0.3);
    }
    .iconfont {
      opacity: 0;
    }
  }
  .mini-enter-active,
  .mini-leave-active {
    transition: all 0.3s;
  }
  .mini-enter,
  .mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 70px, 0);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
