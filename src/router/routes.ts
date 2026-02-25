import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('src/modules/auth/pages/LoginPage.vue'),
        meta: { title: 'Login' }
      }
    ]
  },

  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('src/modules/auth/pages/RegisterPage.vue'),
        meta: { title: 'Cadastro' }
      }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'marketplace',
        component: () => import('src/modules/trades/pages/TradesPage.vue'),
        meta: { title: 'Marketplace' }
      }
    ]
  },

  {
    path: '/my-cards',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'my-cards',
        component: () => import('src/modules/cards/pages/MyCardsPage.vue'),
        meta: { title: 'Meus Cards' }
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    name: 'error-404',
    component: () => import('src/modules/core/pages/ErrorPage.vue'),
    meta: { title: 'Página não encontrada' }
  }
]

export default routes
