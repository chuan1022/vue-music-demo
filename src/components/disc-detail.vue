<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :title="disc.dissname " :songs="songs" :bg-img="disc.imgurl"></music-list>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getDiscSongList } from "@/api/index";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/assets/js/song";
import musicList from "@/components/music-list";

export default {
  data() {
    return {
      songs: [],
    };
  },
  components: {
    musicList
  },
  computed: {
    ...mapGetters(['disc'])
  },
  created() {
    this.getDiscSongList()
  },
  methods: {
    getDiscSongList() {
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getDiscSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.songs = this.formatSongList(res.cdlist[0].songlist);
        }
      });
    },
    formatSongList(list) {
      let arr = [];
      
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          arr.push(createSong(musicData));
        }
      });
      return arr;
    }
  }
};
</script>


<style lang="less" scoped>
@import "../assets/styles/variable";
.singer-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: @color-background;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>

