import { Button } from '@/core/components/button';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import type { CartItem as CartItemType } from '../../types/models';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="flex gap-4 rounded-lg border p-3">
      <img
        src={item.product.main_image_url}
        alt={item.product.product_name}
        className="h-20 w-20 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="line-clamp-1 font-medium">{item.product.product_name}</h4>
          <p className="text-muted-foreground text-sm">{formatPrice(item.product.price)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <MinusIcon className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
              disabled={item.quantity >= 10 || item.quantity >= item.product.stock_quantity}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => removeItem(item.product.product_id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
