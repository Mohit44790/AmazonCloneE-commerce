// store/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1, options = {}) => {
        const { items } = get();
        const key = `${product._id}-${JSON.stringify(options)}`;
        const existing = items.find(i => i.key === key);
        if (existing) {
          set({ items: items.map(i => i.key === key ? { ...i, quantity: i.quantity + qty } : i) });
        } else {
          set({ items: [...items, { key, product, quantity: qty, options }] });
        }
      },

      removeItem: (key) => set(s => ({ items: s.items.filter(i => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty < 1) { get().removeItem(key); return; }
        set(s => ({ items: s.items.map(i => i.key === key ? { ...i, quantity: qty } : i) }));
      },

      clearCart: () => set({ items: [] }),

      get total()   { return get().items.reduce((s, i) => s + (i.product.price * i.quantity), 0); },
      get count()   { return get().items.reduce((s, i) => s + i.quantity, 0); },
    }),
    { name: "amazon-cart" }
  )
);