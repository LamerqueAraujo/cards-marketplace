import { defineStore } from 'pinia'
import type { Toast, ToastCreateInput, ToastVariant } from '../types/toast.types'

const MAX_TOASTS = 3

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4200,
  error: 6200,
  info: 4200,
  warning: 5200,
}

function createId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
    timers: {} as Record<string, number>,
  }),

  actions: {
    push(input: ToastCreateInput) {
      const id = createId()
      const now = Date.now()

      const toast: Toast = {
        id,
        variant: input.variant,
        message: input.message,
        duration: input.duration ?? DEFAULT_DURATION[input.variant],
        createdAt: now,
        ...(input.title ? { title: input.title } : {}),
      }

      if (this.toasts.length >= MAX_TOASTS) {
        const oldest = this.toasts[0]
        if (oldest) this.remove(oldest.id)
      }

      this.toasts.push(toast)

      const timer = window.setTimeout(() => {
        this.remove(id)
      }, toast.duration)

      this.timers[id] = timer
      return id
    },

    remove(id: string) {
      const timer = this.timers[id]
      if (timer) {
        clearTimeout(timer)
        delete this.timers[id]
      }

      this.toasts = this.toasts.filter(t => t.id !== id)
    },

    clear() {
      Object.values(this.timers).forEach(t => clearTimeout(t))
      this.timers = {}
      this.toasts = []
    },
  },
})
