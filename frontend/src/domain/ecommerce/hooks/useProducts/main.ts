/**
 * @summary
 * Products hook for catalog management.
 * Handles product listing, search, and filters.
 */

import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { ProductFilters } from '../../types/models';

export const useProducts = (filters?: ProductFilters) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.list(filters),
    staleTime: 60000,
  });

  return {
    products: data || [],
    isLoading,
    isError,
    error,
  };
};

export const useProductDetails = (productId: string) => {
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getById(productId),
    enabled: !!productId,
  });

  const { data: related, isLoading: relatedLoading } = useQuery({
    queryKey: ['related-products', productId],
    queryFn: () => productService.getRelated(productId),
    enabled: !!productId,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productService.getReviews(productId),
    enabled: !!productId,
  });

  return {
    product,
    relatedProducts: related || [],
    reviews: reviews || [],
    isLoading: productLoading || relatedLoading || reviewsLoading,
  };
};
