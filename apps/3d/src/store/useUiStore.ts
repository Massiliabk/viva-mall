import { create } from 'zustand'

type Toast = { id: number; message: string }

type UiState = {
  locked: boolean
  cartOpen: boolean
  aimedProductId: string | null
  aimedCheckout: boolean
  toast: Toast | null
  lock: () => void
  unlock: () => void
  openCart: () => void
  setAimed: (id: string | null) => void
  setAimedCheckout: (aimed: boolean) => void
  notify: (message: string) => void
  clearToast: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  locked: false,
  cartOpen: false,
  aimedProductId: null,
  aimedCheckout: false,
  toast: null,

  lock: () => set({ locked: true, cartOpen: false }),
  unlock: () => set({ locked: false, aimedProductId: null, aimedCheckout: false }),
  openCart: () => set({ cartOpen: true }),
  setAimed: (id) => set({ aimedProductId: id }),
  setAimedCheckout: (aimed) => set({ aimedCheckout: aimed }),
  notify: (message) => set({ toast: { id: Date.now(), message } }),
  clearToast: () => set({ toast: null }),
}))