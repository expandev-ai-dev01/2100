/**
 * @summary
 * Orders hook for order history and tracking.
 */

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';

export const useOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.list,
    staleTime: 30000,
  });

  return {
    orders: data || [],
    isLoading,
    isError,
    error,
  };
};

export const useOrderTracking = (orderId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: () => orderService.getTracking(orderId),
    enabled: !!orderId,
  });

  return {
    tracking: data,
    isLoading,
  };
};
