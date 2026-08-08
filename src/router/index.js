import { createRouter, createWebHashHistory } from 'vue-router'
import Index from 'views/Index.vue'
import Hello from 'components/Hello.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/hello',
    name: 'Hello',
    component: Hello
  },
  {
    path: '/user',
    name: 'User',
    component: Hello
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
