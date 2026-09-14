import { create } from 'zustand'

const STORAGE_KEY = 'webmind_sidebar_collapsed'

interface SidebarState {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: localStorage.getItem(STORAGE_KEY) === 'true',
  toggle: () =>
    set((state) => {
      const next = !state.collapsed
      localStorage.setItem(STORAGE_KEY, String(next))
      return { collapsed: next }
    }),
  setCollapsed: (collapsed) => {
    localStorage.setItem(STORAGE_KEY, String(collapsed))
    set({ collapsed })
  },
}))
