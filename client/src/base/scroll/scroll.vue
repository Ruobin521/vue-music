<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    const DIRECTION_H = 'horizontal'
    const DIRECTION_V = 'vertical'
    export default {
        name: 'scroll',
        props: {
            probeType: {
                type: Number,
                defualt: 1
            },
            click: {
                type: Boolean,
                defualt: true
            },
            data: {
                type: Array,
                defualt: null
            },
            listenScroll: {
                tyoe: Boolean,
                defualt: false
            },
            pullUp: {
                tyoe: Boolean,
                defualt: false
            },
            beforeScroll: {
                type: Boolean,
                defualt: false
            },
            refreshDelay: {
                type: Number,
                defualt: 20
            },
            direction: {
                type: String,
                default: DIRECTION_V
            }
        },
        data: function() {
            return {}
        },
        methods: {
            _initScroll() {
                if (!this.$refs.wrapper) {
                    return
                }
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click,
                    eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
                })
                if (this.listenScroll) {
                    let me = this
                    this.scroll.on('scroll', (pos) => {
                        me.$emit('scroll', pos)
                    })
                }
                if (this.pullUp) {
                    this.scroll.on('scrollEnd', () => {
                        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                            this.$emit('scrollToEnd')
                        }
                    })
                }
                if (this.beforeScroll) {
                    this.scroll.on('beforeScrollStart', () => {
                        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                            this.$emit('beforeScroll')
                        }
                    })
                }
            },
            enable() {
                this.scroll && this.scroll.enable()
            },
            disable() {
                this.scroll && this.scroll.disable()
            },
            refresh() {
                this.scroll && this.scroll.refresh()
            },
            scrollTo() {
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
            },
            scrollToElement() {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
            }
        },
        mounted() {
            setTimeout(() => {
                this._initScroll()
            }, this.refreshDelay)
        },
        watch: {
            data() {
                setTimeout(() => {
                    this.refresh()
                }, this.refreshDelay)
            }
        }
    }
</script>

<style lang="stylus" scoped>
</style>
