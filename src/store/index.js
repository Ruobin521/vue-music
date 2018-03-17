import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './gettters'
import * as actions from './actions'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'PRODUCTION'

export default new Vuex.Store({
getters,
actions,
state,
mutations,
strict: debug,
plugins: debug ? [createLogger()] : []
})