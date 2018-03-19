<template>
    <transition name="slide">
        <MusicList :songs="songs" :title="title" :bgImage="bgImage">
        </MusicList>
    </transition>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'
    import {
        getSingerDetail
    } from 'api/singer'
    import {
        ERR_OK
    } from 'api/config'
    import {
        createSong
    } from 'common/js/song'
    import {
        getVkey
    } from 'api/vkey'
    import MusicList from 'components/music-list/music-list'
    export default {
        name: 'singer-detail',
        data: function() {
            return {
                songs: []
            }
        },
        components: {
            MusicList
        },
        computed: {
            ...mapGetters([
                'singer'
            ]),
            title() {
              return this.singer.name
            },
            bgImage() {
              return this.singer.avatar
            }
        },
        methods: {
            _getSingerDetail() {
                if (!this.singer.id) {
                    // this.$router.push({
                    //     path: '/singer'
                    // })
                    this.$router.back()
                    return
                }
                getSingerDetail(this.singer.id).then(res => {
                    if (res.code === ERR_OK) {
                        var songs = this._normalizeSongList(res.data.list)
                        return getVkey(songs)
                    }
                }).then((songs) => {
                 this.songs = songs
                })
            },
            _normalizeSongList(list) {
                let ret = []
                list.forEach(item => {
                    let {
                        musicData
                    } = item
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        created() {
            this._getSingerDetail()
        }
    }
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.slide-enter-active, .slide-leave-active
    transition all .3s
.slide-enter, .slide-leave-to
    transform translate3d(100%,0,0)
</style>
