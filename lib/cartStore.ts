// lib/cartStore.ts
import { create } from 'zustand'

export interface CartItem {
  id:       string
  name:     string
  price:    number
  image:    string
  quantity: number
}

interface CartStore {
  items:       CartItem[]
  storeSlug:   string
  addItem:     (item: Omit<CartItem, 'quantity'>) => void
  removeItem:  (id: string) => void
  updateQty:   (id: string, qty: number) => void
  clearCart:   () => void
  totalPrice:  () => number
  totalCount:  () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items:     [],
  storeSlug: '',

  addItem: (item) => set(state => {
    const existing = state.items.find(i => i.id === item.id)
    if (existing) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
    }
    return { items: [...state.items, { ...item, quantity: 1 }] }
  }),

  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id)
  })),

  updateQty: (id, qty) => set(state => ({
    items: qty <= 0
      ? state.items.filter(i => i.id !== id)
      : state.items.map(i => i.id === id ? { ...i, quantity: qty } : i)
  })),

  clearCart: () => set({ items: [] }),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))