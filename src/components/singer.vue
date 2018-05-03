<template>
  <div class="wrapper">
    <vue-loading v-show="showLoading"></vue-loading>
    <list-view v-show="currentSingerList.length>1" :data="currentSingerList" @select="selectItem"></list-view>
    <router-view></router-view>
  </div>
</template>
<style lang="less" scoped>
// @import "../assets/styles/variable";
// @import "../assets/styles/mixin";
.wrapper {
  position: fixed;
  top: 88px;
  bottom: 0;  
  overflow: hidden; 
}
</style>
<script>
import { getSingerList } from "@/api/index";
import { ERR_OK } from "@/api/config";
import Singer from "@/assets/js/singer";
import listView from "@/assets/vue/list-view";
import vueLoading from "@/assets/vue/vue-loading";
import { mapMutations } from "vuex";

const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  data() {
    return {
      singerList: [],
      showLoading: true
    };
  },
  components: {
    listView,
    vueLoading
  },
  computed: {
    currentSingerList() {
      return this.formatSingerList(this.singerList);
    }
  },
  created() {
    this.getSingerList();
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    selectItem(singer) {
      this.$router.push(`/singer/${singer.id}`);
      this.setSinger(singer);
    },
    getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = res.data.list;
          this.showLoading = false;
          this.formatSingerList(this.singerList);
        }
      });
    },
    formatSingerList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      //格式化列表
      list.forEach((el, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: el.Fsinger_mid,
              name: el.Fsinger_name
            })
          );
        }
        const key = el.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: el.Fsinger_mid,
            name: el.Fsinger_name
          })
        );
      });
      let ret = [];
      let hot = [];
      for (let key in map) {
        if (key == "hot") {
          hot.push(map[key]);
        } else {
          ret.push(map[key]);
        }
      }
      //生成有序列表
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      let arr = hot.concat(ret);

      return arr;
    }
  }
};
</script>
