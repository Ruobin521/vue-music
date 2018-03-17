import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import lazylaod from 'vue-lazyload'
import store from './store'

/* eslint-disable no-unused-vars */
// import VConsole from 'vconsole'
// var v = new VConsole()

// hack for global nextTick
// function noop() {}
// window.MessageChannel = noop
// window.setImmediate = noop

fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(lazylaod, {
  loading: require('common/images/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
