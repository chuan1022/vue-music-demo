<template>
  <div class="wrapper">
    <search-box @change='change' :data="key"></search-box>
    <div class="hot" v-show="!searchRes||!key">
      <h1 class="title">热门搜索</h1>
      <ul>
        <li class="hotkey" v-for=" (item,index) in hotKeyList" :key="index" @click="selectKey(item)">{{item.k}}</li>
      </ul>
    </div>
    <div class="search_list" v-show="key&&searchRes">
      <ul>
        <li v-if="singer" @click="toSinger()">
          <div class="singer_item">
            <img class="avatar" :src="singer.avatar" alt="">
            <p class="name">{{singer.name}}</p>
          </div>
        </li>
        <li v-if="song.albumname" @click="toSong()">
          <div class="singer_item">
            <img class="avatar" :src="singer.avatar" alt="">
            <p class="name">{{song.albumname}} - {{song.singername}}</p>
          </div>
          
        </li>
        <li v-if="songList" v-for="(item,index) in songList" :key="index"  @click="toSong()"> 
          {{item.songname}} - {{formatSinger(item.singer)}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import searchBox from "@/assets/vue/search-box";
import { getHotKey, search } from "@/api/index";
import { ERR_OK } from "@/api/config";
import Singer from "@/assets/js/singer";
import Song from "@/assets/js/song";

import { mapMutations } from "vuex";

export default {
  data() {
    return {
      hotKeyList: [],
      key: "",
      searchRes: {}
    };
  },
  computed: {
    songList() {
      return this.searchRes.song ? this.searchRes.song.list : [];
    },
    singer() {
      //歌手直达 2
      if (this.searchRes.zhida && this.searchRes.zhida.type === 2) {
        return new Singer({
          id: this.searchRes.zhida.singermid,
          name: this.searchRes.zhida.singername
        });
        // return this.searchRes.zhida;
      } else {
        return {};
      }
    },
    song() {
      //歌曲直达
      if (this.searchRes.zhida && this.searchRes.zhida.type === 3) {
        // return new Song({
        //   mid: this.searchRes.zhida.albummid,
        //   id: this.searchRes.zhida.albumid,
        //   name: this.searchRes.zhida.albumname,
        //   singer: this.searchRes.zhida.singername
        // });
        return this.searchRes.zhida;
      } else {
        return {};
      }
    }
  },
  components: {
    searchBox
  },
  created() {
    this.getHotKey();
  },
  methods: {
    change(newVal, oldVal) {
      this.key = newVal;
      console.log(newVal, oldVal);
    },

    getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeyList = res.data.hotkey.slice(0, 10);
        }
      });
    },
    selectKey(item) {
      this.key = item.k;
    },
    search() {
      search(this.key).then(res => {
        console.log(res);
        this.searchRes = res.data;
        if (res.code === ERR_OK) {
          this.searchRes = res.data;
        }
      });
    },
    toSinger() {
      this.setSinger(this.singer);
      this.$router.push({
        path: `singer/${this.singer.id}`
      });
    },
    toSong() {},
    formatSinger(list) {
      if (!list) {
        return "";
      }
      let arr = [];
      list.forEach(element => {
        arr.push(element.name);
      });
      return arr.join("/");
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  watch: {
    key(newVal, oldVal) {
      console.log(newVal);
      if (newVal) {
        this.search();
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/styles/variable";
@import "../assets/styles/mixin";
.wrapper {
  margin: 0 10px;
  .hot {
    margin: 10px;
    font-size: @font-size-medium;
    .title {
      color: @color-text-l;
      line-height: 30px;
    }
    .hotkey {
      color: @color-text-d;
      font-size: @font-size-medium;
      display: inline-block;
      padding: 5px 10px;
      .border-radius(5px);
      background: @color-highlight-background;
      margin: 5px 10px 5px 0;
    }
  }
  .search_list {
    margin: 10px;
    color: @color-text-d;
    .singer_item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0;
      // border-bottom: 1px solid @color-text-l;
      .avatar {
        width: 40px;
        height: 40px;
        .border-radius(50%);
        margin: 0 20px;
      }
      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-l;
      }
    }
  }
}
</style>
