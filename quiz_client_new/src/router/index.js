import { createRouter, createWebHistory } from 'vue-router'
// import Home from '@/views/Home.vue'
import LoginPage from '../pages/LoginPage.vue';
import GeneralPage from '../pages/GeneralPage.vue';
import RepoPage from '../pages/RepoPage.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path:'/repo',
    name: 'repo',
    component:RepoPage
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

// router.beforeEach(async (to,from,next)=>{
//   const token = localStorage.getItem('token');
//   if (!token && to.name !== 'login') {
//     return next('/login')
//   }
//   next();
// })

export default router
