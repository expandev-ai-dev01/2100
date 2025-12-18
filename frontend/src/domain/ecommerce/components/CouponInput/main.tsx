import { useState } from 'react';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../hooks/useCart';
import { couponService } from '../../services/couponService';

export function CouponInput() {
  const { coupon, subtotal, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    setIsValidating(true);
    try {
      const validatedCoupon = await couponService.validate(code.trim(), subtotal);
      applyCoupon(validatedCoupon);
      setCode('');
      toast.success('Cupom aplicado com sucesso!');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsValidating(false);
    }
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Badge variant="default">{coupon.coupon_code}</Badge>
          <span className="text-sm">
            {coupon.discount_type === 'percentage'
              ? `${coupon.discount_value}% de desconto`
              : `R$ ${coupon.discount_value.toFixed(2)} de desconto`}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={removeCoupon}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Código do cupom"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        disabled={isValidating}
      />
      <Button onClick={handleApply} disabled={isValidating}>
        Aplicar
      </Button>
    </div>
  );
}
