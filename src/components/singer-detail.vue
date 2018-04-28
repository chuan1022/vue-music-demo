<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :title="singer.name" :songs="songs" :bg-img="singer.avatar"></music-list>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "@/api/index";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/assets/js/song";
import musicList from "@/components/music-list";

export default {
  data() {
    return {
      songs: []
    };
  },
  components: {
    musicList
  },
  computed: {
    ...mapGetters({
      singer: "singer"
    })
  },
  created() {
    this.getSingerDetail();
  },
  methods: {
    getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this.formatSongList(res.data.list);
        }
      });
    },
    formatSongList(list) {
      let arr = [];
      list.forEach(element => {
        let musicData = element.musicData;
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

