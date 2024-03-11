import { createRouter, createWebHistory } from 'vue-router'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/Page1.vue')
  },
  {
    path: '/light',
    component: () => import('@/Page2.vue'),
    hidden: true
  }
]

let routes = [...constantRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
