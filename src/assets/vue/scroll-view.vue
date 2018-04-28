<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.scroll) {
        return;
      }
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click
      });
      if(this.listenScroll){
        this.scroll.on('scroll',(pos) => {
          this.$emit('scroll', pos)
        })
      }
    },
    enbale() {
      this.scroll && this.scroll.enbale();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  }
};
</script>
<style lang="less" scoped>

</style>
