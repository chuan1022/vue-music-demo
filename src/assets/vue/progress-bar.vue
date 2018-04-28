<template>
  <div class="wraper">
    <span class="time">{{formatTime(currentTime)}}</span>
    <div class="bar" @click="skip" ref="bar">
      <div class="handle" 
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove" 
        @touchend.prevent="touchEnd" 
        ref="handle"></div>
      <div class="inner"  ref="inner"></div>
    </div>
    <span class="time">{{formatTime(totalTime)}}</span>
  </div>
</template>

<script>
export default {
  props: {
    currentTime: {
      default: 0,
      type: Number
    },
    totalTime: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      touch: {},
    };
  },
  mounted() {
    setTimeout(() => {
      this.barWidth = this.$refs.bar.clientWidth;
    }, 20);
  },
  computed: {
    percent() {
      return (this.currentTime / this.totalTime).toFixed(2);
    }
  },
  watch:{
    percent(newVal){
      if(newVal&&!this.touch.initiated){
         this.setWidth(newVal*this.barWidth)
      }
    }
  },
  methods: {

    touchStart(ev) {
      this.touch.initiated = true;
      this.touch.startX = ev.touches[0].pageX;
      this.touch.startWidth = this.$refs.inner.clientWidth;
    },
    touchMove(ev) {
      this.setTouchPosition(ev.touches[0].pageX);
      this.$emit('touchMove',this.touch.percent);
    },
    touchEnd(ev) {
      this.setTouchPosition(ev.changedTouches[0].pageX);
      this.$emit('touchEnd',this.touch.percent);
      this.touch.initiated = false;
    },
    skip(ev){
      
      this.setTouchPosition(ev.pageX-this.$refs.bar.offsetLeft,true);
      this.$emit('skip',this.touch.percent);
    },
    setTouchPosition(endX,skip = false) {
      this.touch.endX =endX;  
      let width = skip?endX:this.touch.startWidth + (this.touch.endX - this.touch.startX);
      if (width < 0) {
        width = 0;
      }
      if (width > this.$refs.bar.clientWidth) {
        width = this.$refs.bar.clientWidth;
      }
      this.touch.endWidth = width;
      this.touch.percent = (this.touch.endWidth/this.$refs.bar.clientWidth).toFixed(2)
      this.setWidth(width)
    },
    setWidth(width){
      this.$refs.inner.style.width = width + "px";
      this.$refs.handle.style.left = width -  this.$refs.handle.offsetWidth/2 + "px"; 
    },
    formatTime(time) {
      time = time | 0;
      let m = (time / 60) | 0;
      let s = time % 60;
      return `${m}:${this._pad(s)}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../styles/variable";
@import "../styles/mixin";
.wraper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .time {
    padding: 0 10px;
    font-size: @font-size-medium;
  }
  .bar {
    position: relative;
    height: 4px;
    background: @color-text-d;
    min-width: 70%;
    .inner {
      background: @color-theme;
      width: 0;
      height: 100%;
    }
    .handle {
      position: absolute;
      width: 6px;
      height: 6px;
      top: -4px;
      left: -6px;
      .border-radius(50%);
      background: @color-theme;
      border: 3px solid #fff;
    }
  }
}
</style>
