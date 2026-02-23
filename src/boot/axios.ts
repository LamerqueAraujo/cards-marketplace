import { boot } from 'quasar/wrappers'
import axios from 'axios'
import type { AxiosError } from 'axios'
import type { Router } from 'vue-router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
})

export default boot(({ app, router }) => {

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {

      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        redirectToLogin(router)
      }

      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$api = api
})

function redirectToLogin(router: Router) {
  void router.push('/login')
}

export { api }
