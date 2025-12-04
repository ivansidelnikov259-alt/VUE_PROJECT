import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/generator',
    name: 'Generator',
    component: () => import('../views/GeneratorView.vue')
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/LibraryView.vue')
  },
  {
    path: '/export',
    name: 'Export',
    component: () => import('../views/ExportView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router