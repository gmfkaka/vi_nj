<template>
  <div class="wrapper flexBox flexBetween flexAlign" @click="goList">
    <div class="title" :class="{'w':type === 1}">{{title}}</div>
    <i class="moreIcon" v-if="data"></i>
  </div>
</template>
<script>
export default {
  name: 'homeTitle',
  props: ['title', 'type', 'data'],
  methods: {
    goList () {
      const id = this.data.id
      this.data.css_id === 9901 &&
        this.$router.push({ path: '/liststyle1', query: { id } })
      this.data.css_id === 9903 &&
        this.$router.push({ path: '/liststyle3', query: { id } })
      this.data.css_id === 9909 &&
        this.$router.push({ path: '/liststyle2', query: { id } })
      this.data.css_id === 9905 &&
        this.$router.push({ path: '/liststyle5', query: { id } });
      (this.data.css_id === 9906 || this.data.css_id === 9907 || this.data.css_id === 9908 || this.data.css_id === 9910) &&
        this.$router.push({ path: '/liststyle6', query: { id } })
      this.title === '摄影之家' && this.$router.push('/photographerlist')
      this.title === '活动摄影' && this.$router.push({ path: '/liststyle3', query: { id: 26 } })
    }
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  padding: 0 0.15rem;
  margin-bottom: 0.15rem;
  .title {
    color: #3d3d3d;
    font-size: 0.18rem;
    font-weight: 500;
    &.w {
      color: #fff;
    }
  }
}
</style>
