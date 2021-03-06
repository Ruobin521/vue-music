<template>
    <scroll class="listview" :data="data" ref="listview" @scroll="onScroll" :listenScroll="listenScroll" :probeType="probeType">
        <ul>
            <li class="list-group" v-for="(group,index) in data" :key="index" ref="listgroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" class="list-group-item" v-for="(item,index) in group.items" :key="index">
                        <img v-lazy="item.avatar" class="avatar" alt="">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li class="item" :class="{'current':currentIndex===index}" v-for="(item,index) in shortcutlist" :key="index" :data-index="index">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
    </scroll>
</template>

<script>
    import scroll from 'base/scroll/scroll'
    import {
        getData
    } from 'common/js/dom'
    const SHORTCUT_HEIGHT = 18
    const TITLE_HEIGHT = 30
    export default {
        name: 'listview',
        components: {
            scroll
        },
        created() {
            this.probeType = 3
            this.touch = {}
            this.listenScroll = true
            this.listHeight = []
        },
        props: {
            data: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data: function() {
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1
            }
        },
        computed: {
            shortcutlist() {
                return this.data.map((group) => {
                    return group.title.substr(0, 1)
                })
            },
            fixedTitle() {
                if (this.scrollY >= 0) {
                    return false
                } else {
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
                }
            }
        },
        methods: {
            onShortcutTouchStart(e) {
                let index = parseInt(getData(e.target, 'index'))
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = index
                this.scrollTo(index)
            },
            onShortcutTouchMove(e) {
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = (this.touch.y2 - this.touch.y1) / SHORTCUT_HEIGHT | 0
                let anchorIndex = this.touch.anchorIndex + delta
                this.scrollTo(anchorIndex)
            },
            scrollTo(index) {
                if (!index && index !== 0) {
                    return
                }
                if (index < 0) {
                    index = 0
                } else if (index > this.listHeight.length - 2) {
                    index = this.listHeight.length - 2
                }
                this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
                this.currentIndex = index
            },
            onScroll(pos) {
                this.scrollY = pos.y
            },
            _calculateHeight() {
                this.listHeight = []
                const list = this.$refs.listgroup
                let height = 0
                this.listHeight.push(height)
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            selectItem(item) {
                this.$emit('select', item)
            },
            refresh() {
                this.$refs.listview.refresh()
            }
        },
        watch: {
            data() {
                setTimeout(() => {
                    this._calculateHeight()
                }, 20)
            },
            scrollY(newY) {
                // 当滚动到顶部，newY>0
                if (newY > 0) {
                    this.currentIndex = 0
                    return
                }
                // 在中间部分滚动
                const listHeight = this.listHeight
                // 在中间部分滚动
                for (let i = 0; i < listHeight.length - 1; i++) {
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    if (-newY >= height1 && -newY < height2) {
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                // 当滚动到底部，且-newY大于最后一个元素的上限
                this.currentIndex = listHeight.length - 2
            },
            diff(newVal) {
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
                if (this.fixedTop === fixedTop) {
                    return
                }
                this.fixedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
