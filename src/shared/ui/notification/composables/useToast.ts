import { useToastStore } from '../stores/toast.store'
import type { ToastCreateInput } from '../types/toast.types'

export function useToast() {
  const store = useToastStore()

  function show(input: ToastCreateInput) {
    return store.push(input)
  }

  function success(message: string, title?: string) {
    return store.push({
      variant: 'success',
      message,
      ...(title ? { title } : {})
    })
  }

  function error(message: string, title?: string) {
    return store.push({ variant: 'error', message, ...(title ? { title } : {}) })
  }

  function info(message: string, title?: string) {
    return store.push({ variant: 'info', message, ...(title ? { title } : {}) })
  }

  function warning(message: string, title?: string) {
    return store.push({ variant: 'warning', message, ...(title ? { title } : {}) })
  }

  function remove(id: string) {
    store.remove(id)
  }

  function clear() {
    store.clear()
  }

  return { show, success, error, info, warning, remove, clear }
}
