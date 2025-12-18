/**
 * @summary
 * Shopping cart global state store.
 * Manages cart items, quantities, and totals.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, Coupon } from '../types/models';

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  isOpen: boolean;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setIsOpen: (isOpen: boolean) => void;

  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.product_id === product.product_id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.product_id === product.product_id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + 1, 10, product.stock_quantity),
                    subtotal:
                      item.product.price * Math.min(item.quantity + 1, 10, product.stock_quantity),
                  }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                product,
                quantity: 1,
                subtotal: product.price,
              },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.product_id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.product.product_id === productId
              ? {
                  ...item,
                  quantity: Math.max(1, Math.min(quantity, 10, item.product.stock_quantity)),
                  subtotal:
                    item.product.price *
                    Math.max(1, Math.min(quantity, 10, item.product.stock_quantity)),
                }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.subtotal, 0);
      },

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;

        const subtotal = get().getSubtotal();
        if (coupon.minimum_order_value && subtotal < coupon.minimum_order_value) return 0;

        if (coupon.discount_type === 'percentage') {
          return (subtotal * coupon.discount_value) / 100;
        }
        return Math.min(coupon.discount_value, subtotal);
      },

      getTotal: () => {
        return Math.max(0, get().getSubtotal() - get().getDiscount());
      },
    }),
    { name: 'cart-store' }
  )
);
