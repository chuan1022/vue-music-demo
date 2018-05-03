<template>
  <div class="wrapper">
    <scroll-view ref="scroll" class="scroll" 
    :data="discList" 
    :pullUpLoad="true"
    @pullingUp="pullingUp"
    >
      <div>
        <slider v-if="recommentList.length">
          <div v-for="(item, index) in recommentList" :key="index">
            <a :href="item.linkUrl">
              <img class="needsclick" :src="item.picUrl" @load="loadImg" alt="">
            </a>
          </div>
        </slider>
        <div class="recommend-list">
          <h3 class="title">热门歌单推荐</h3>
          <vue-loading v-show="!discList.length"></vue-loading>
          <ul>
            <li v-for="(item,index) in discList" class="item" :key="index" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
    <router-view></router-view>
  </div>
</template>
<style lang="less" scoped>
@import "../assets/styles/variable";
@import "../assets/styles/mixin";

.wrapper {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .scroll {
    height: 100%;
    overflow: hidden;
  }
  .recommend-list {
    .title {
      text-align: center;
      font-size: @font-size-medium;
      line-height: 60px;
    }
    .item {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      padding: 0 20px 20px;
    }
    .icon {
      flex: 0 0 60px;
      width: 60px;
      padding-right: 20px;
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      font-size: @font-size-medium;
      .name {
        margin-bottom: 10px;
        color: @color-text;
        .noWrap();
      }
      .desc {
        color: @color-text-d;
        .noWrap();
      }
    }
  }
}
</style>
<script>
import { getRecommentList, getDiscList } from "@/api/index";
import { ERR_OK } from "@/api/config";
import slider from "@/assets/vue/slider";
import scrollView from "@/assets/vue/scroll-view";
import vueLoading from "@/assets/vue/vue-loading";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      recommentList: [],
      discList: [],
      hasLoad: false,
      page: 1
    };
  },
  components: {
    slider,
    scrollView,
    vueLoading
  },
  created() {
    this.getRecommentList();
    this.getDiscList(this.page);
  },
  methods: {
    ...mapMutations({
      setDisc: "SET_DISC"
    }),
    getRecommentList() {
      getRecommentList().then(res => {
        if (res.code === ERR_OK) {
          this.recommentList = res.data.slider;
        }
      });
    },
    getDiscList(page) {
      getDiscList(page).then(res => {
        this.discList = this.discList.concat(res.data.list);
      });
    },
    loadImg() {
      if (this.hasLoad) {
        return;
      }
      this.hasLoad = true;
      this.$refs.scroll.refresh();
    },
    selectItem(item) {
      this.setDisc(item);
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
    },
    pullingUp() {
      console.log(11);
      this.$refs.scroll.finishPullUp();
    }
  }
};
</script>


