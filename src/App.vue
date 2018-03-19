<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 内容区域 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHeader from './components/m-header/m-header'
  import Player from './components/player/player'
  import Tab from './components/tab/tab'
  export default {
    name: 'App',
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import 'common/stylus/variable'
</style>
