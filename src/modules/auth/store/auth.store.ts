import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  userId: string | null
  userName: string | null
  userEmail: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('userName'),
    userEmail: localStorage.getItem('userEmail')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    setSession(payload: { token: string; userId: string; name?: string; email?: string }) {
      this.token = payload.token
      this.userId = payload.userId
      this.userName = payload.name ?? null
      this.userEmail = payload.email ?? null

      localStorage.setItem('token', payload.token)
      localStorage.setItem('userId', payload.userId)

      if (payload.name) localStorage.setItem('userName', payload.name)
      else localStorage.removeItem('userName')

      if (payload.email) localStorage.setItem('userEmail', payload.email)
      else localStorage.removeItem('userEmail')
    },

    setToken(token: string, userId: string) {
      this.token = token
      this.userId = userId
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
    },

    clearToken() {
      this.token = null
      this.userId = null
      this.userName = null
      this.userEmail = null

      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
    },

    logout() {
      this.clearToken()
    }
  }
})
