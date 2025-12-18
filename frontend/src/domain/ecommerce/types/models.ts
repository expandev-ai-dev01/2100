/**
 * @summary
 * E-commerce domain type definitions.
 */

export type ProductCategory = 'Eletrônicos' | 'Roupas' | 'Casa & Jardim' | 'Livros' | 'Esportes';
export type StockBadgeType = 'available' | 'limited' | 'unavailable';
export type OrderStatus =
  | 'Aguardando Pagamento'
  | 'Pago'
  | 'Preparando'
  | 'Enviado'
  | 'Entregue'
  | 'Cancelado';
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'pix' | 'boleto';

export interface Product {
  product_id: string;
  product_name: string;
  price: number;
  category: ProductCategory;
  rating: number;
  stock_quantity: number;
  main_image_url: string;
  product_images: string[];
  stock_badge_type: StockBadgeType;
  stock_badge_text: string;
  stock_badge_color: string;
  product_description?: string;
  technical_specifications?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Coupon {
  coupon_code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_value?: number;
  expiry_date: string;
  usage_limit?: number;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PaymentMethod {
  type: PaymentMethodType;
  card_number?: string;
  card_holder_name?: string;
  card_expiry?: string;
  card_cvv?: string;
}

export interface Order {
  order_id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  delivery_address: Address;
  payment_method: PaymentMethodType;
  created_at: string;
  estimated_delivery?: string;
  tracking_code?: string;
}

export interface Review {
  review_id: string;
  product_id: string;
  user_name: string;
  rating_stars: number;
  review_comment?: string;
  review_date: string;
}

export interface ProductFilters {
  search?: string;
  category?: ProductCategory;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
}
