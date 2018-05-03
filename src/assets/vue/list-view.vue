<template>
  <div class="wrapper">
    <scroll-view class="listView" :data="data" v-if="data.length" ref="scroll" :listenScroll="true" @scroll="scroll" :probeType="3">
      <ul>
        <li v-for="(item,index) in data" :key="index" ref="listItem" >
          <h5 class="title">{{item.title}}</h5>
          <ul>
            <li class="item" v-for="(i,ind) in item.items" :key="ind" @click="selectItem(i)">
              <img class="avatar" v-lazy="i.avatar"  alt="">
              <p class="name">{{i.name}}</p> 
            </li>
          </ul>
        </li>
      </ul>
    </scroll-view>
    <ul class="navList" @touchstart="touchStart" @touchmove.stop.prevent="touchMove" @touchend="touchEnd" ref="navList">
      <li v-for="(item, index) in navList" :key="index" :data-index="index" :class="{'active':index===currentIndex}">
        {{item===hotName?'热': item}}
      </li>
    </ul>
    <div class="fixedTitle" v-show="showFixedTitle"><h5>{{fixedTitle}}</h5></div>
    <div class="current" v-show="showTitle">{{navList[currentIndex]}}</div>
  </div>
</template>
<style lang="less" scoped>
@import "../styles/variable";
@import "../styles/mixin";
.wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  top: 88px;
  width: 100%;
  .listView{
    height: 100%; 
    overflow: hidden;
  }   
  .title {
    color: @color-text-d;
    line-height: 30px;
    font-size: @font-size-medium;
    padding-left: 20px;
    background: @color-highlight-background;
  }
  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0;
    img {
      width: 60px;
      height: 60px;
      .border-radius(50%);
      margin: 0 20px;
    }
    .name {
      flex: 1;
      font-size: @font-size-medium;
      color: @color-text-l;
    }
  }
  .navList {
    position: fixed;
    right: 0;
    top: 17%;
    background: @color-background-d;
    li {
      padding: 2px;
      box-sizing: border-box;
      color: @color-text-l;
      text-align: center;
      font-size: @font-size-small;
      line-height: 20px;
      height: 20px;
      &.active {
        color: @color-theme;
      }
    }
  }
  .current {
    position: fixed;
    top: 40%;
    left: 50%;
    margin-left: -50px;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: @color-background-d;
    font-size: @font-size-large-x;
    .border-radius(10px);
  }
  .fixedTitle {
    position: fixed;
    top: 88px;
    color: @color-theme;
    line-height: 30px;
    font-size: @font-size-medium;
    padding-left: 20px;
    background: @color-highlight-background;
    width: 100%;
  }
}
</style>
<script>
import scrollView from "@/assets/vue/scroll-view";

const HOT_NAME = "热门";

export default {
  data() {
    return {
      hotName: HOT_NAME,
      currentIndex: 0,
      showTitle: false,
      scrollY: 0,
      listHeight: []
    };
  },
  computed: {
    navList() {
      return this.data.map(el => {
        return el.title;
      });
    },
    fixedTitle() {
      return this.navList[this.currentIndex];
    },
    showFixedTitle(){
      return this.scrollY>0?false:true
    }
  },
  created() {
    this.touch = {};
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    scrollView
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.getListHeight();
      });
    }
  },

  methods: {
    selectItem(i){
      this.$emit('select',i)
    },
    touchStart(e) {
      let index = e.target.dataset.index;
      this.touch.firstIndex = index;
      this.touch.firstY = e.touches[0].pageY;
      this.scrollTo(index);
    },
    touchMove(e) {
      this.touch.secondY = e.touches[0].pageY;
      let index =
        (((this.touch.secondY - this.touch.firstY) / 20) | 0) +
        parseInt(this.touch.firstIndex);
      if (index > this.navList.length - 1) index = this.navList.length - 1;
      if (index < 0) index = 0;
      this.scrollTo(index);
    },
    touchEnd() {
      this.showTitle = false;
    },
    scrollTo(index) {
      this.showTitle = true;
      if (!this.navList[index]) {
        this.showTitle = false;
      }
      this.currentIndex = parseInt(index);
      this.$refs.scroll.scrollToElement(this.$refs.listItem[index], 0);
    },
    scroll(pos) {
      this.scrollY = pos.y;
      this.getCurrentIndex(this.scrollY);
    },
    getCurrentIndex(height) {
      if(height>0) height=0;
      if (-height > this.listHeight[this.listHeight.length - 1])
        height = this.listHeight[this.listHeight.length - 1];
      let a = this.listHeight.find(el => {
        return el > -height;
      });
      
      this.currentIndex = this.listHeight.indexOf(a);
    },
    getListHeight() {
      let height = 0;
      this.$refs.listItem.forEach(element => {
        let h = element.clientHeight;
        height += h;
        this.listHeight.push(height);
      });
    }
  }
};
</script>
