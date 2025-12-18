import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboardService';
import { useIdle } from '@/core/hooks/useIdle';
import type { DashboardFilters } from '../../types/models';

interface UseDashboardDataOptions {
  filters: DashboardFilters;
  refreshInterval?: number;
}

export const useDashboardData = ({ filters, refreshInterval = 30000 }: UseDashboardDataOptions) => {
  const queryClient = useQueryClient();
  const isIdle = useIdle(300000); // 5 minutes idle timeout

  const queryKey = ['dashboard', filters];

  const { data, isLoading, isError, error, refetch, dataUpdatedAt } = useQuery({
    queryKey,
    queryFn: () => dashboardService.getDashboardData(filters),
    refetchInterval: isIdle ? false : refreshInterval,
    staleTime: 10000,
  });

  const { mutateAsync: updatePreferences } = useMutation({
    mutationFn: dashboardService.updatePreferences,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const { mutateAsync: resetPreferences } = useMutation({
    mutationFn: dashboardService.resetPreferences,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
    isIdle,
    updatePreferences,
    resetPreferences,
  };
};
