import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () =>
          import('src/modules/auth/pages/LoginPage.vue')
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
        component: () =>
          import('src/modules/home/pages/HomePage.vue')
      }
    ]
  },

  {
    path: '/register',
    name: 'register',
    component: () =>
      import('src/modules/auth/pages/RegisterPage.vue')
  },

  {
    path: '/:catchAll(.*)*',
    name: 'error-404',
    component: () =>
      import('src/modules/core/pages/ErrorPage.vue')
  }
]

export default routes
