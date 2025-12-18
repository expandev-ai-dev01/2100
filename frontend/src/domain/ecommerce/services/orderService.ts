/**
 * @summary
 * Order service with mock data.
 * Handles order creation, tracking, and history.
 *
 * @service orderService
 * @domain ecommerce
 */

import type { Order, CartItem, Address, PaymentMethodType } from '../types/models';

const mockOrders: Order[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderService = {
  async create(
    items: CartItem[],
    address: Address,
    paymentMethod: PaymentMethodType,
    discount: number,
    shipping: number
  ): Promise<Order> {
    await delay(1000);

    // Simulate payment processing
    const isApproved = Math.random() > 0.2; // 80% success rate

    if (!isApproved) {
      throw new Error('Transação não autorizada pelo banco');
    }

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal - discount + shipping;

    const order: Order = {
      order_id: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(
        Math.random() * 100000
      )
        .toString()
        .padStart(5, '0')}`,
      items,
      subtotal,
      discount,
      shipping,
      total,
      status: 'Pago',
      delivery_address: address,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    mockOrders.unshift(order);
    return order;
  },

  async list(): Promise<Order[]> {
    await delay(500);
    return mockOrders;
  },

  async getById(orderId: string): Promise<Order | null> {
    await delay(300);
    return mockOrders.find((o) => o.order_id === orderId) || null;
  },

  async getTracking(orderId: string): Promise<{
    status: Order['status'];
    timeline: Array<{ status: string; date: string; description: string }>;
  }> {
    await delay(400);
    const order = mockOrders.find((o) => o.order_id === orderId);
    if (!order) throw new Error('Pedido não encontrado');

    const timeline = [
      {
        status: 'Pago',
        date: order.created_at,
        description: 'Pagamento confirmado',
      },
      {
        status: 'Preparando',
        date: new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        description: 'Pedido em preparação',
      },
    ];

    return { status: order.status, timeline };
  },
};
