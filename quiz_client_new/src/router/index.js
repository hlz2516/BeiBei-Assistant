import { createRouter, createWebHistory } from 'vue-router'
// import Home from '@/views/Home.vue'
import LoginPage from '../pages/LoginPage.vue';
import GeneralPage from '../pages/GeneralPage.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path:'/general',
    name:'general',
    component:GeneralPage
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
