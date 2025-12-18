import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/core/components/sheet';
import { Button } from '@/core/components/button';
import { Separator } from '@/core/components/separator';
import { useCart } from '../../hooks/useCart';
import { CartItem } from '../CartItem';
import { CouponInput } from '../CouponInput';
import { useNavigation } from '@/core/hooks/useNavigation';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';
import { ShoppingCartIcon } from 'lucide-react';

export function CartDrawer() {
  const { navigate } = useNavigation();
  const { items, isOpen, setIsOpen, subtotal, discount, total, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrinho ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <Empty className="flex-1">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingCartIcon />
              </EmptyMedia>
              <EmptyTitle>Seu carrinho está vazio</EmptyTitle>
              <EmptyDescription>
                Adicione produtos ao carrinho para continuar comprando.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <CartItem key={item.product.product_id} item={item} />
              ))}
            </div>

            <div className="space-y-4">
              <CouponInput />

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCart} className="flex-1">
                  Limpar
                </Button>
                <Button onClick={handleCheckout} className="flex-1">
                  Finalizar Compra
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
