/**
 * @summary
 * E-commerce domain module exports.
 * Handles product catalog, cart, checkout, orders, and reviews.
 *
 * @module domain/ecommerce
 */

export * from './components';
export * from './services';
export * from './hooks';
export * from './validations';
export * from './stores';

export type { Product, CartItem, Order, Review, Coupon, Address, PaymentMethod } from './types';
