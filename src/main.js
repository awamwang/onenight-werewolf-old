import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import './assets/postcss/index.css'

import vueExtend from './vue-extend'

const app = createApp(App)

vueExtend(app)
app.use(store)
app.use(router)
app.mount('#app')
