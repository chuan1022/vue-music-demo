<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(i,index) in dots" :class="{active:currentIndex===index}" :key="index"></span>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { addClass } from "../js/utils";
export default {
  data() {
    return {
      dots: 0,
      currentIndex: 0
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  methods: {
    _setWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
      this._inidDots();
    },
    _initSlider() {
      //初始化
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: true,
          threshold: 1,
          easing: {
            style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fn: function(t) {
              return t * (2 - t);
            }
          }
        }
      });
      //dot
      this.slider.on("scrollEnd", () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.currentIndex = pageIndex;
      });
      if (this.autoPlay) {
        this.timer = setInterval(() => {
          this.slider.next();
        }, this.interval);
      }
    },
    _inidDots() {
      this.dots = this.children.length;
    }
  },
  mounted() {
    setTimeout(() => {
      this._setWidth();
      this._initSlider();
    }, 20);
    window.addEventListener("resize", () => {
      this._setWidth(true);
    });
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="less">
@import "../styles/variable.less";

.slider {
  position: relative;
  overflow: hidden;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: @color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: @color-text-ll;
      }
    }
  }
}
</style>
