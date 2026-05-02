import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  sku: string
  name: string
  price: number
  quantity: number
  taxRate: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: any) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Computed values
  subtotal: () => number
  taxTotal: () => number
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id)
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        }
        return {
          items: [
            ...state.items,
            {
              id: product.id,
              sku: product.sku,
              name: product.name,
              price: product.price,
              quantity: 1,
              taxRate: 0.15, // Default enterprise tax rate
            },
          ],
        }
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0),
      })),

      clearCart: () => set({ items: [] }),

      subtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },

      taxTotal: () => {
        return get().items.reduce((acc, item) => acc + (item.price * item.taxRate) * item.quantity, 0)
      },

      total: () => {
        return get().subtotal() + get().taxTotal()
      },
    }),
    {
      name: 'supernova-active-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
