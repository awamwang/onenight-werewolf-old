import Mixins from './mixins'

export default (app) => {
  Object.keys(Mixins).forEach(k => {
    app.mixin(Mixins[k])
  })
}
