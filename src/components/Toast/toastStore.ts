import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastItem[]
  dismiss: (id: string) => void
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function toast(item: Omit<ToastItem, 'id'>): void {
  const id = Math.random().toString(36).slice(2)
  useToastStore.setState((state) => ({ toasts: [...state.toasts, { ...item, id }] }))
}

export { useToastStore }
