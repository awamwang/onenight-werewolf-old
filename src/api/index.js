import Throttle from './throttle'
let throttle = new Throttle()

let apiPrefix = '/api'
/**
 * 开发环境
 * ----------------------------------------------------------------------------
 */
export const postLogin = (config) => {
  return throttle.call('post', `${apiPrefix}/login`, config)
}

export const postLogout = (config) => {
  return throttle.call('post', `${apiPrefix}/logout`, config)
}

/**
 * 基础
 * ----------------------------------------------------------------------------
 */
export const getSetting = (config) => {
  return throttle.call('get', `${apiPrefix}/setting`, config)
}

export default {
  postLogin,
  postLogout,
  getSetting
}
