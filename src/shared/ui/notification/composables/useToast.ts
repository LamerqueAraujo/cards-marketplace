import { useToastStore } from '../stores/toast.store'
import type { ToastCreateInput } from '../types/toast.types'

export function useToast() {
  const store = useToastStore()

  function show(input: ToastCreateInput) {
    return store.push(input)
  }

  function success(message: string, title?: string) {
    return title ? store.push({ variant: 'success', message, title }) : store.push({ variant: 'success', message })
  }

  function error(message: string, title?: string) {
    return title ? store.push({ variant: 'error', message, title }) : store.push({ variant: 'error', message })
  }

  function info(message: string, title?: string) {
    return title ? store.push({ variant: 'info', message, title }) : store.push({ variant: 'info', message })
  }

  function warning(message: string, title?: string) {
    return title ? store.push({ variant: 'warning', message, title }) : store.push({ variant: 'warning', message })
  }

  function remove(id: string) {
    store.remove(id)
  }

  function clear() {
    store.clear()
  }

  return { show, success, error, info, warning, remove, clear }
}
