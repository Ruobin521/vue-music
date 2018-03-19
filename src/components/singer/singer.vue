<template>
    <div class="singer" ref="singer">
        <ListView :data="singers" @select="selectedSinger" ref="list"></ListView>
        <router-view></router-view>
        <div class="loading-container" v-show="!singers.length">
            <loading></loading>
        </div>
    </div>
</template>

<script>
    import {
        getSingerList
    } from 'api/singer'
    import {
        ERR_OK
    } from 'api/config'
    import Slider from 'base/slider/slider'
    import Scroll from 'base/scroll/scroll'
    import loading from 'base/loading/loading'
    import Singer from 'common/js/singer'
    import {playlistMixin} from 'common/js/mixin'
    import ListView from 'base/listview/listview'
    import {
        mapMutations
    } from 'vuex'
    const HOT_NAME = '热门'
    const HOT_SINGER_LENGTH = 10
    export default {
        mixins: [playlistMixin],
        name: 'singer',
        components: {
            Slider,
            Scroll,
            loading,
            ListView
        },
        data: function() {
            return {
                singers: []
            }
        },
        methods: {
            _getSingerList() {
                getSingerList().then(res => {
                    if (res.code === ERR_OK) {
                        this.singers = res.data.list
                        this.singers = this._normallizeSinger(this.singers)
                    }
                })
            },
            _normallizeSinger(list) {
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                list.forEach((element, index) => {
                    if (index < HOT_SINGER_LENGTH) {
                        map.hot.items.push(new Singer(element.Fsinger_mid, element.Fsinger_name))
                    }
                    let key = element.Findex
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    map[key].items.push(new Singer(element.Fsinger_mid, element.Fsinger_name))
                })
                let hot = []
                let ret = []
                let orther = []
                for (let item in map) {
                    let val = map[item]
                    if (val.title.match(/[a-zA-z]/)) {
                        ret.push(val)
                    } else if (val.title === HOT_NAME) {
                        hot.push(val)
                    } else {
                        orther.push(val)
                    }
                    ret.sort((a, b) => {
                        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                    })
                    orther.sort((a, b) => {
                        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                    })
                }
                let result = hot.concat(ret).concat(orther)
                return result
            },
            selectedSinger(singer) {
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            handlePlayList(playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.list.refresh()
            }
        },
        created() {
            this._getSingerList()
        }
    }
</script>

<style lang="stylus" scoped>
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
