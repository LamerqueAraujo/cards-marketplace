export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastCreateInput {
  variant: ToastVariant
  message: string
  title?: string
  duration?: number
}

export interface Toast extends ToastCreateInput {
  id: string
  createdAt: number
  duration: number
}
