import { create } from 'zustand'

type Toast = { id: number; message: string }

type UiState = {
  locked: boolean
  cartOpen: boolean
  aimedProductId: string | null
  toast: Toast | null
  lock: () => void
  unlock: () => void
  openCart: () => void
  setAimed: (id: string | null) => void
  notify: (message: string) => void
  clearToast: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  locked: false,
  cartOpen: false,
  aimedProductId: null,
  toast: null,

  lock: () => set({ locked: true, cartOpen: false }),
  unlock: () => set({ locked: false, aimedProductId: null }),
  openCart: () => set({ cartOpen: true }),
  setAimed: (id) => set({ aimedProductId: id }),
  notify: (message) => set({ toast: { id: Date.now(), message } }),
  clearToast: () => set({ toast: null }),
}))