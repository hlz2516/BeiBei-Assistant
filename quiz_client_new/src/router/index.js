import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    //路由懒加载
    //当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。
    //通过路由懒加载方式，当路由被访问的时候才加载对应组件，这样就会更加高效。
    component: ()=>import('@/pages/LoginPage.vue')
  },
  {
    path:'/repo',
    name: 'repo',
    component:()=>import('@/pages/RepoPage.vue')
  },
  {
    path:'/newquiz',
    name:'newquiz',
    component:()=>import('@/pages/NewQuizPage.vue')
  },
  {
    path:'/remquiz',
    name:'remquiz',
    component:()=>import('@/pages/RemQuizPage.vue')
  },
  {
    path:'/general',
    name:'general',
    component:()=>import('@/pages/GeneralPage.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to,from,next)=>{
  const token = localStorage.getItem('token');
  if (!token && to.name !== 'login') {
    return next('/login')
  }
  next();
})

export default router
