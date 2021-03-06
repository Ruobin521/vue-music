<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length" ref="play" @click="random">
          <li class="icon-play">
          </li>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" class="list" ref="scroll" :probeType="probeType" :listenScroll="true" @scroll="onScroll">
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="onItemSelect" :rank="rank"></SongList>
      </div>
    </scroll>
    <div class="loading-container" v-show="!songs.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'
  import {
    prefixStyle
  } from 'common/js/dom'
  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-fliter')
  export default {
    name: 'music-list',
    mixins: [playlistMixin],
    props: {
      bgImage: {
        typoe: String,
        default: ''
      },
      songs: {
        type: Array,
        default: () => {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Scroll,
      SongList,
      loading
    },
    data: function() {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted() {
      this.$refs.scroll.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    },
    methods: {
      back() {
        this.$router.back()
      },
      onScroll(pos) {
        this.scrollY = pos.y
      },
      onItemSelect(song, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      handlePlayList(playlist) {
          const bottom = playlist.length > 0 ? '60px' : ''
          this.$refs.scroll.$el.style.bottom = bottom
          this.$refs.scroll.refresh()
        }
    },
    created() {
      this.probeType = 3
    },
    watch: {
      scrollY(newY) {
        let zindex = 0
        let scale = 1
        let blur = 0
        let translateY = Math.max(this.minTranslateY, newY)
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          zindex = 10
          scale = 1 + percent
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}`
        if (newY < this.minTranslateY) {
          zindex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.play.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.play.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zindex
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      padding-top: 70%
      transform-origin: top
      background-size: cover
      // z-index 50
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      // overflow hidden
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
  .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>