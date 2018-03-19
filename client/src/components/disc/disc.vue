<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from 'components/music-list/music-list'
    import {
        createSong
    } from 'common/js/song'
    import {
        getSongList
    } from 'api/recommend'
    import {
        mapGetters
    } from 'vuex'
    import {
        getVkey
    } from 'api/vkey'
    export default {
        name: 'disc',
        components: {
            MusicList
        },
        computed: {
            title() {
                return this.disc.dissname
            },
            bgImage() {
                return this.disc.imgurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        data: function() {
            return {
                songs: []
            }
        },
        methods: {
            getSongList() {
                if (!this.disc.dissid) {
                    this.$router.push({
                        path: '/recommend'
                    })
                    return
                }
                getSongList(this.disc.dissid).then((res) => {
                    var songs = this._normalizeSongs(res.cdlist[0].songlist)
                    return getVkey(songs)
                }).then((songs) => {
                 this.songs = songs
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach(musicData => {
                    if (musicData.songid && musicData.albumid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        mounted() {
            this.getSongList()
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
