<template>
    <div class="m-header">
        <div class="icon"></div>
        <div class="text">Dang Music</div>
        <router-link to="/user" class="mine" tag="div">
        <i class="icon-mine"></i>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'm-header',
        data: function() {
            return {}
        }
    }
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin'
@import '~common/stylus/variable'
.m-header
    position relative
    height 44px
    text-align center
    color $color-theme
    font-size 0
    .icon
        display inline-block
        vertical-align top
        width 30px
        height 32px
        margin-right 9px
        bg-image('logo')
        background-size 30px 32px
        margin-top 5px
    .text
        display inline-block
        vertical-align top
        font-size $font-size-large
        line-height 44px
    .mine
        position absolute
        top 0
        right 0
        .icon-mine
            display block
            padding 12px
            font-size 20px
            color $color-theme
</style>
