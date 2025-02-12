import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue')
  },
    {
    path: '/wellcome',
    name: 'Wellcome',
    component: () => import('../views/WellCome.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginRegister.vue')
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
    {
    path: '/chat-any',
    name: 'ChatAny',
    component: () => import('../views/ChatAny.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFount',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
