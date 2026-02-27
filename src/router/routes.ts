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
        name: 'home',
        component: () => import('src/modules/home/pages/HomePage.vue'),
        meta: { title: 'Início' }
      },
      {
        path: 'trades',
        name: 'trades',
        component: () => import('src/modules/trades/pages/TradesPage.vue'),
        meta: { title: 'Trocas' }
      },
      {
        path: 'my-cards',
        name: 'my-cards',
        component: () => import('src/modules/cards/pages/MyCardsPage.vue'),
        meta: { title: 'Minhas cartas' }
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
