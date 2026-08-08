import { createStore, createLogger } from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import base from './modules/base'
import setting from './modules/setting'

const debug = import.meta.env.DEV

const store = createStore({
  actions,
  getters,
  modules: {
    base,
    setting
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
