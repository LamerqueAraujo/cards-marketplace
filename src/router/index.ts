import { defineRouter } from '#q-app/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'

import routes from './routes'
import { useAuthStore } from 'src/modules/auth/store/auth.store'
import { getActivePinia } from 'pinia'

const PUBLIC_ROUTES = ['login', 'register']

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to) => {
    const pinia = getActivePinia()

    if (!pinia) return true

    const authStore = useAuthStore(pinia)

    if (!authStore.isAuthenticated && !PUBLIC_ROUTES.includes(String(to.name))) {
      return { name: 'login' }
    }

    if (authStore.isAuthenticated && PUBLIC_ROUTES.includes(String(to.name))) {
      return { name: 'home' }
    }
  })

  Router.afterEach((to) => {
    const APP_NAME = 'Duel Market'
    const pageTitle = to.meta.title as string | undefined

    document.title = pageTitle
      ? `${APP_NAME} | ${pageTitle}`
      : APP_NAME
  })

  return Router
})
