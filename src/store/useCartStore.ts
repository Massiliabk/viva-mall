import { create } from 'zustand'
import { PRODUCTS_BY_ID } from '../data/products'

type CartState = {
  items: Record<string, number> // id du produit -> quantité
  addItem: (id: string) => void
  removeOne: (id: string) => void
  removeItem: (id: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()((set) => ({
  items: {},

  addItem: (id) =>
    set((state) => ({
      items: { ...state.items, [id]: (state.items[id] ?? 0) + 1 },
    })),

  removeOne: (id) =>
    set((state) => {
      const items = { ...state.items }
      const quantity = (items[id] ?? 0) - 1
      if (quantity > 0) items[id] = quantity
      else delete items[id]
      return { items }
    }),

  removeItem: (id) =>
    set((state) => {
      const items = { ...state.items }
      delete items[id]
      return { items }
    }),

  clear: () => set({ items: {} }),
}))

export const selectCount = (state: CartState) =>
  Object.values(state.items).reduce((sum, quantity) => sum + quantity, 0)

export const selectTotal = (state: CartState) =>
  Object.entries(state.items).reduce(
    (sum, [id, quantity]) => sum + (PRODUCTS_BY_ID[id]?.price ?? 0) * quantity,
    0,
  )