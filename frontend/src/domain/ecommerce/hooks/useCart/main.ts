/**
 * @summary
 * Cart hook for shopping cart management.
 * Provides cart operations and calculations.
 */

import { useCartStore } from '../../stores/cartStore';
import { toast } from 'sonner';
import type { Product } from '../../types/models';

export const useCart = () => {
  const {
    items,
    coupon,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setIsOpen,
    getSubtotal,
    getDiscount,
    getTotal,
  } = useCartStore();

  const handleAddItem = (product: Product) => {
    if (product.stock_quantity === 0) {
      toast.error('Produto sem estoque disponível');
      return;
    }

    const existingItem = items.find((item) => item.product.product_id === product.product_id);
    if (existingItem && existingItem.quantity >= 10) {
      toast.error('Máximo 10 unidades por produto');
      return;
    }

    if (existingItem && existingItem.quantity >= product.stock_quantity) {
      toast.error('Quantidade solicitada não disponível');
      return;
    }

    addItem(product);
    setIsOpen(true);
    toast.success('Produto adicionado ao carrinho');
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success('Produto removido do carrinho');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const item = items.find((i) => i.product.product_id === productId);
    if (!item) return;

    if (quantity > item.product.stock_quantity) {
      toast.error('Quantidade solicitada não disponível');
      return;
    }

    if (quantity > 10) {
      toast.error('Máximo 10 unidades por produto');
      return;
    }

    updateQuantity(productId, quantity);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Carrinho limpo');
  };

  return {
    items,
    coupon,
    isOpen,
    itemCount: items.length,
    subtotal: getSubtotal(),
    discount: getDiscount(),
    total: getTotal(),
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    applyCoupon,
    removeCoupon,
    setIsOpen,
  };
};
