import dayjs from 'dayjs'
import * as types from '../mutation-types'

const state = {}

const mutations = {
  [types.SET_SETTING] (state, setting) {
    let localCurrTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    let serverCurrTime = setting.serverTime || localCurrTime
    Object.assign(state, setting, {
      serverLocalDiffTime: dayjs(serverCurrTime).diff(dayjs(localCurrTime))
    })
  }
}

export default {
  state,
  mutations
}
