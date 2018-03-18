<template>
    <scroll ref="suggest" class="suggest" :data="result" :pullUp="pullUp" @scrollToEnd="searchMore" :beforeScroll="befroeScroll" @beforeScroll="onBeforeScroll">
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <NoResult title="抱歉，暂无搜索结果"></NoResult>
        </div>
    </scroll>
</template>

<script>
    import {
        search
    } from 'api/search'
    import {
        ERR_OK
    } from 'api/config'
    import {
        createSong
    } from 'common/js/song'
    import {
        getVkey
    } from 'api/vkey'
    import Scroll from 'base/scroll/scroll'
    import loading from 'base/loading/loading'
    import Singer from 'common/js/singer'
    import NoResult from 'base/no-result/no-result'
    import {
        mapMutations,
        mapActions
    } from 'vuex'
    const TYPE_SINGER = 'singer'
    const perpage = 50
    export default {
        name: 'suggest',
        props: {
            query: {
                type: String,
                default: ''
            },
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        components: {
            Scroll,
            loading,
            search,
            NoResult
        },
        data: function() {
            return {
                page: 1,
                hasMore: true,
                result: [],
                pullUp: true,
                loading: false,
                befroeScroll: true
            }
        },
        methods: {
            search() {
                this.hasMore = true
                this.page = 1
                this.$refs.suggest.scrollTo(0, 0)
                search(this.query, this.page, this.showSinger, perpage).then(res => {
                    if (res.code === ERR_OK) {
                        this._genResult(res.data).then(songs => {
                            this.result = songs
                            this.checkMore(res.data)
                        })
                    }
                })
                this.$emit('search', this.query)
            },
            searchMore() {
                if (!this.hasMore || this.loading) {
                    return
                }
                this.loading = true
                this.page++
                    search(this.query, this.page, false, perpage).then(res => {
                        if (res.code === ERR_OK) {
                            this._genResult(res.data).then(songs => {
                                this.result = this.result.concat(songs)
                                this.checkMore(res.data)
                            })
                        }
                        this.loading = false
                    })
            },
            checkMore(data) {
                const song = data.song
                if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalmnum) {
                    this.hasMore = false
                }
            },
            _genResult(data) {
                let ret = []
                if (data.zhida && data.zhida.singerid) {
                    ret.push({
                        ...data.zhida,
                        type: TYPE_SINGER
                    })
                }
                return new Promise((resolve, reject) => {
                    if (data.song) {
                        this._normalizeList(data.song.list).then(songs => {
                            ret = ret.concat(songs)
                            resolve(ret)
                        })
                    }
                })
            },
            getIconCls(item) {
                if (item.type === TYPE_SINGER) {
                    return 'icon-mine'
                } else {
                    return 'icon-music'
                }
            },
            getDisplayName(item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername
                } else {
                    return `${item.name}-${item.singer}`
                }
            },
            _normalizeList(list) {
                let ret = []
                list.forEach((musicData) => {
                    if (musicData.songid && musicData.albumid) {
                        ret.push(createSong(musicData))
                    }
                })
                return getVkey(ret)
            },
            selectItem(item) {
                if (item.type === TYPE_SINGER) {
                    const singer = new Singer(item.singermid, item.singername)
                    this.$router.push({
                        path: `/search/${singer.id}`
                    })
                    this.setSinger(singer)
                } else {
                    this.insertSong(item)
                }
                this.$emit('select')
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            ...mapActions(['insertSong']),
            onBeforeScroll() {
                this.$emit('listScroll')
            },
            refresh() {
                this.$refs.suggest.refresh()
            }
        },
        watch: {
            query(newVal, oldValue) {
                if (newVal) {
                    this.search()
                }
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
