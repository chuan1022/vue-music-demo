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
      <scroll-view class="scroll" ref="scroll">
        <ul>
          <li v-if="singer.id" @click="toSinger()">
            <div class="singer_item">
              <img class="avatar" :src="singer.avatar" alt="">
              <p class="name">{{singer.name}}</p>
            </div>
          </li>
          <li v-if="song.mid" @click="toSong()">
            <div class="singer_item">
              <img class="avatar" :src="song.image" alt="">
              <p class="name">{{song.name}} - {{song.singer}}</p>
            </div>
            
          </li>
          <li v-if="songList.length" class="song_list">
            <ul>  
              <li class="name"  v-for="(item,index) in songList" :key="index"  @click="toSong(songList,index)"> 
                <i class="iconfont">&#xe634;</i>
                {{item.name}} - {{item.singer}}
              </li>
            </ul>
          </li>
        </ul>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import searchBox from "@/assets/vue/search-box";
import { getHotKey, search } from "@/api/index";
import { ERR_OK } from "@/api/config";
import Singer from "@/assets/js/singer";
import { Song, createSong } from "@/assets/js/song";
import scrollView from '@/assets/vue/scroll-view'
import { mapMutations, mapActions } from "vuex";
import index from '../../node_modules/._vue@2.5.16@vue';

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
      return this.searchRes.song ? this.formatSongList(this.searchRes.song.list) : [];
    },
    singer() {
      //歌手直达 2
      if (this.searchRes.zhida && this.searchRes.zhida.type === 2) {
        return new Singer({
          id: this.searchRes.zhida.singermid,
          name: this.searchRes.zhida.singername
        });
      } else {
        return {};
      }
    },
    song() {
      let data = this.searchRes.zhida;
      //歌曲直达
      if (this.searchRes.zhida && this.searchRes.zhida.type === 3) {
        let musicdata = {
          songmid: this.searchRes.zhida.albummid,
          songid: this.searchRes.zhida.albumid,
          songname: this.searchRes.zhida.albumname,
          albumname: this.searchRes.zhida.albumname,
          singer: [{ name: this.searchRes.zhida.singername }],
          albummid: this.searchRes.zhida.albummid,
          albumid: this.searchRes.zhida.albumid
        };
        return createSong(musicdata);
        // return this.searchRes.zhida;
      } else {
        return {};
      }
    }
  },
  components: {
    searchBox,
    scrollView
  },
  created() {
    this.getHotKey();
  },
  methods: {
    formatSongList(list) {
      let arr = [];
      list.forEach(element => {
        let musicData = element;
        console.log(musicData)
        if (musicData.songid && musicData.albummid) {
          arr.push(createSong(musicData));
        }
      });
      return arr;
    },
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
    toSong(songList,index) {
      this.setPlay({
        songs:songList,
        index:index
      })
    },
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
    ...mapActions({
      setPlay:'setPlay',
      setRandomPlay:'setRandomPlay'
    }),
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
    },
    searchRes(){
      this.$refs.scroll.refresh()
    }
  },

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
    margin: 0 10px;
    color: @color-text-d;
    position: fixed;
    top: 140px;
    bottom: 0;
    // height: calc(100vh - 130px);
    .scroll {
      height: 100%;
      overflow: hidden;
    }
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
        margin-right: 20px;
      }
      .name {
        flex:  1 0 60px;
        font-size: @font-size-medium;
      }
    }
    .song_list{
      font-size: @font-size-medium;
      line-height: 40px;
    }
    .name{
      .noWrap();
    }
  }
}
</style>
