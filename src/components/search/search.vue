<template>
  <div class="search" ref="search">
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="onQueryChange"></SearchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll ref="shortcut" class="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                            <i class="icon-clear"></i>
                          </span>
            </h1>
            <SearchList @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></SearchList>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="resultlist" class="search-result" v-show="query">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @search="saveSearch"></suggest>
    </div>
    <Confirm ref="confirm" @confirm="deleteAllSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></Confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import {
    playlistMixin,
    searchMixin
  } from 'common/js/mixin'
  import {
    getHotKey
  } from 'api/search'
  import {
    ERR_OK
  } from 'api/config'
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'search',
    mixins: [playlistMixin, searchMixin],
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Scroll,
      Confirm
    },
    data: function() {
      return {
        hotKey: []
      }
    },
    methods: {
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.resultlist.style.bottom = bottom
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.suggest.refresh()
        this.$refs.shortcut.refresh()
      },
      ...mapActions(['deleteAllSearchHistory']),
      showConfirm() {
        this.$refs.confirm.show()
      }
    },
    created() {
      this._getHotKey()
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 15px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
