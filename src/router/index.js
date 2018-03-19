import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const recommend = () => import('components/recommend/recommend.vue')
const singer = () => import('components/singer/singer.vue')
const rank = () => import('components/rank/rank.vue')
const search = () => import('components/search/search.vue')
const SingerDetail = () => import('components/singer-detail/singer-detail.vue')
const Disc = () => import('components/disc/disc.vue')
const TopList = () => import('components/top-list/top-list.vue')
const User = () => import('components/user-center/user-center.vue')
export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/recommend'
    }, {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
