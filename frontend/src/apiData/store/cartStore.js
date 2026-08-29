// src/apiData/store/cartStore.js
//
// ⚠️  IMPORTANT — Both ProductDetail and Cart MUST import from the EXACT
//     same path. Example:
//       import { useCartStore } from "../../apiData/store/cartStore";
//     If one uses "../store/cartStore" and another uses "../../store/cartStore"
//     React creates TWO separate store instances → cart always looks empty.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],   // [{ key, product: {...}, quantity, options }]

      /* ── ADD ── */
      addItem: (product, qty = 1, options = {}) => {
        const size  = options?.size  || "";
        const color = options?.color || "";
        const key   = `${product._id}__${size}__${color}`;

        const prev = get().items;
        const idx  = prev.findIndex(i => i.key === key);

        if (idx !== -1) {
          // already in cart → bump quantity
          const next = prev.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity + qty } : item
          );
          set({ items: next });
        } else {
          // new entry — store only plain-serialisable fields
          const entry = {
            key,
            quantity: qty,
            options: { size, color },
            product: {
              _id:      product._id,
              name:     product.name,
              slug:     product.slug     || "",
              price:    Number(product.price) || 0,
              images:   Array.isArray(product.images) ? product.images : [],
              shipping: product.shipping || {},
              stock:    product.stock    || 0,
              brand:    product.brand    || "",
            },
          };
          set({ items: [...prev, entry] });
        }
      },

      /* ── REMOVE ── */
      removeItem: (key) =>
        set({ items: get().items.filter(i => i.key !== key) }),

      /* ── UPDATE QTY ── */
      updateQty: (key, qty) => {
        if (qty < 1) { get().removeItem(key); return; }
        set({
          items: get().items.map(i =>
            i.key === key ? { ...i, quantity: qty } : i
          ),
        });
      },

      /* ── CLEAR ── */
      clearCart: () => set({ items: [] }),
    }),
    {
      name:    "amazon-cart-v2",          // bump version clears stale data
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/* ── Selector helpers (use these in components) ── */
export const selectItems    = s => s.items;
export const selectAddItem  = s => s.addItem;
export const selectRemoveItem = s => s.removeItem;
export const selectUpdateQty  = s => s.updateQty;
export const selectClearCart  = s => s.clearCart;
export const selectItemCount  = s => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal   = s => s.items.reduce((n, i) => n + i.product.price * i.quantity, 0);