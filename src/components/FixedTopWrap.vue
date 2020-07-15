<template lang="html">
  <!--置顶条目父布局-->
  <div id="fix-scroll-watch" ref="fixScrollWatch" class="fixScrollWatch" :style="fixStyle"> <!--用于监听滚动位置-->
    <div ref="topFixBarFixed" :class="topFixBarFixed ? 'topFixBarFixed' : ''" class="fix-index"> <!--用于固定位置-->
      <slot/> <!--实际内容-->
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        topFixBarFixed: false,
        isMounted: false,
        juli:150
      };
    },
    computed: {
      fixStyle() {
        if (this.isMounted) {
          const h = this.$refs.topFixBarFixed.offsetHeight;
          return { height: `${h}px` };
        }
        return {};
      },
    },
    methods: {
      handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        // const fix = document.querySelector('#fix-scroll-watch');
        const fix = this.$refs.fixScrollWatch;
        const offsetTop = fix ? fix.offsetTop : 0;
        this.topFixBarFixed = scrollTop-this.juli > offsetTop;
      },
    },
    mounted() {
      this.isMounted = true;
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    },
  };
</script>

<style scoped lang="postcss">
  .fixScrollWatch {
  }
  .fix-index {
      z-index: 99;
      background-color: white;
    }
   .topFixBarFixed {
      width: 100%;
      position: fixed;
      top: 0;
    }

</style>
