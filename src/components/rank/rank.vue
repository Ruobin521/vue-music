<template>
    <div class="rank" ref="rank">
        <scroll :data="topList" class="toplist" ref="scroll">
            <ul>
                <li @click="selectItem(item)" class="item" v-for="(item,index) in topList" :key="index">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl" alt="">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index2) in item.songList" :key="index2">
                            <span>{{index2 + 1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import {
        getTopList
    } from 'api/rank'
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    import {playlistMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'
    const ERROR_OK = 0
    export default {
        name: 'rank',
        mixins: [playlistMixin],
        components: {
            Scroll,
            Loading
        },
        data: function() {
            return {
                topList: []
            }
        },
        methods: {
            getTopListData() {
                getTopList().then(res => {
                    if (res.code === ERROR_OK) {
                        this.topList = res.data.topList
                    }
                })
            },
            selectItem(item) {
               this.$router.push({
                   path: `/rank/${item.id}`
               })
               this.setTopList(item)
            },
            handlePlayList(playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.rank.style.bottom = bottom
                this.$refs.scroll.refresh()
            },
            ...mapMutations({
                setTopList: 'SET_TOP_LIST'
            })
        },
        mounted() {
            this.getTopListData()
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
