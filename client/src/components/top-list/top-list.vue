<template>
    <transition name="slide">
        <MusicList :songs="songs" :title="title" :bgImage="bgImage" :rank="rank">
        </MusicList>
    </transition>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'
    import {
        getMusicList
    } from 'api/rank'
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
        name: 'top-list',
        data: function() {
            return {
                songs: [],
                rank: true
            }
        },
        components: {
            MusicList
        },
        computed: {
            ...mapGetters([
                'topList'
            ]),
            title() {
                return this.topList.topTitle
            },
            bgImage() {
                if (this.songs.length) {
                    return this.songs[0].image
                }
                return this.topList.picUrl
            }
        },
        methods: {
            _getRankSongs() {
                if (!this.topList.id) {
                    this.$router.push('/rank')
                    return
                }
                getMusicList(this.topList.id).then(res => {
                    if (res.code === ERR_OK) {
                        var songs = this._normalizeSongList(res.songlist)
                        return getVkey(songs)
                    }
                }).then((songs) => {
                    this.songs = songs
                })
            },
            _normalizeSongList(list) {
                let ret = []
                list.forEach(item => {
                    let musicData = item.data
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        created() {
            this._getRankSongs()
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
