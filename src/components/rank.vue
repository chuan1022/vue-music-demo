<template>
  <div class="wrapper">
    <scroll-view class="scroll">
      <ul>   
        <li class="item" v-for="(item,index) in ranks" :key="index" @click="selectItem(item)">
          <div class="item_left">
            <img width="100px" height="100px" :src="item.picUrl" alt="">
          </div>
          <ul class="item_right">
            <li class="item_song" v-for="(song,i) in item.songList" :key="i">{{i+1}}.{{song.songname}}-{{song.singername}}</li>
          </ul>
        </li>
      </ul>
    </scroll-view>
    <router-view></router-view>
  </div>
</template>
<script>
import { getRanks } from "@/api/index";
import { ERR_OK } from "@/api/config";
import scrollView from "@/assets/vue/scroll-view";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      ranks: []
    };
  },
  components: {
    scrollView
  },
  created() {
    this.getRanks();
  },
  methods: {
    getRanks() {
      getRanks().then(res => {
        if (res.code === ERR_OK) {
          this.ranks = res.data.topList;
        }
      });
    },
    selectItem(item) {
      this.setTop(item)
      this.$router.push({
        path:`/rank/${item.id}`
      });
    },
    ...mapMutations({
      setTop:'SET_TOP'
    })
  }
};
</script>

<style lang="less" scoped>
@import "../assets/styles/variable";
@import "../assets/styles/mixin";
.wrapper {
  height: calc(100vh - 88px);
  .scroll {
    padding: 0 15px;
    // box-sizing: border-box;
    height: 100%;
    overflow: hidden;
  }
  .item {
    display: flex;

    // margin-bottom: 15px;
    padding: 10px 0;
    // box-sizing: border-box;
    .item_left {
      width: 100px;
      height: 100px;
      flex: 0 0 100px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .item_right {
      background: @color-background-d;
      padding: 10px;
      color: @color-text-d;
      font-size: @font-size-small;
      line-height: 25px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      .item_song {
        line-height: 20px;
        .noWrap();
      }
    }
  }
}
</style>
