/**
 * @summary
 * Coupon service with mock data.
 * Validates and applies discount coupons.
 *
 * @service couponService
 * @domain ecommerce
 */

import type { Coupon } from '../types/models';

const mockCoupons: Coupon[] = [
  {
    coupon_code: 'DESCONTO10',
    discount_type: 'percentage',
    discount_value: 10,
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    coupon_code: 'FRETE15',
    discount_type: 'fixed',
    discount_value: 15,
    minimum_order_value: 100,
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    coupon_code: 'BEMVINDO20',
    discount_type: 'percentage',
    discount_value: 20,
    minimum_order_value: 200,
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usage_limit: 1,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const couponService = {
  async validate(code: string, orderValue: number): Promise<Coupon> {
    await delay(500);

    const coupon = mockCoupons.find((c) => c.coupon_code.toLowerCase() === code.toLowerCase());

    if (!coupon) {
      throw new Error('Cupom inexistente ou inválido');
    }

    if (new Date(coupon.expiry_date) < new Date()) {
      throw new Error('Cupom expirado');
    }

    if (coupon.minimum_order_value && orderValue < coupon.minimum_order_value) {
      throw new Error(`Valor mínimo de R$ ${coupon.minimum_order_value.toFixed(2)} não atingido`);
    }

    return coupon;
  },
};
