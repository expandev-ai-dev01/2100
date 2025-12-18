/**
 * @summary
 * User table management hook.
 * Handles data fetching, pagination, sorting, filtering, and bulk operations.
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userTableService } from '../../services/userTableService';
import type { UserListParams, User } from '../../types/models';

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const useUserTable = () => {
  const queryClient = useQueryClient();

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<keyof User>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<User['status'][]>([]);
  const [typeFilter, setTypeFilter] = useState<User['type'][]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Debounce search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Build query params
  const queryParams = useMemo<UserListParams>(
    () => ({
      page,
      items_per_page: itemsPerPage,
      sort_by: sortBy,
      sort_order: sortOrder,
      search: debouncedSearch.length >= 3 ? debouncedSearch : undefined,
      status_filter: statusFilter.length > 0 ? statusFilter : undefined,
      type_filter: typeFilter.length > 0 ? typeFilter : undefined,
      date_from: dateFrom?.toISOString(),
      date_to: dateTo?.toISOString(),
    }),
    [
      page,
      itemsPerPage,
      sortBy,
      sortOrder,
      debouncedSearch,
      statusFilter,
      typeFilter,
      dateFrom,
      dateTo,
    ]
  );

  const queryKey = ['users', queryParams];

  // Fetch users
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => userTableService.list(queryParams),
    staleTime: 30000,
  });

  // Update user mutation
  const { mutateAsync: updateUser } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      userTableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar usuário');
    },
  });

  // Delete user mutation
  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: (id: number) => userTableService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário excluído com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir usuário');
    },
  });

  // Bulk delete mutation
  const { mutateAsync: bulkDelete, isPending: isBulkDeleting } = useMutation({
    mutationFn: (ids: number[]) => userTableService.bulkDelete(ids),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedIds([]);
      toast.success(result.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir usuários');
    },
  });

  // Bulk activate mutation
  const { mutateAsync: bulkActivate, isPending: isBulkActivating } = useMutation({
    mutationFn: (ids: number[]) => userTableService.bulkActivate(ids),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedIds([]);
      toast.success(result.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao ativar usuários');
    },
  });

  // Bulk deactivate mutation
  const { mutateAsync: bulkDeactivate, isPending: isBulkDeactivating } = useMutation({
    mutationFn: (ids: number[]) => userTableService.bulkDeactivate(ids),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedIds([]);
      toast.success(result.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao desativar usuários');
    },
  });

  // Export mutation
  const { mutateAsync: exportData, isPending: isExporting } = useMutation({
    mutationFn: (options: Parameters<typeof userTableService.export>[0]) =>
      userTableService.export(options, queryParams),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios_${new Date().toISOString().split('T')[0]}.${
        variables.format === 'excel' ? 'xlsx' : variables.format
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Exportação concluída');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao exportar dados');
    },
  });

  // Sorting handler
  const handleSort = useCallback(
    (column: keyof User) => {
      if (sortBy === column) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortOrder('asc');
      }
    },
    [sortBy]
  );

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    if (!data?.data) return;
    if (selectedIds.length === data.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.data.map((user) => user.id));
    }
  }, [data?.data, selectedIds.length]);

  const toggleSelectOne = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  }, []);

  // Clear date filters
  const clearDateFilters = useCallback(() => {
    setDateFrom(undefined);
    setDateTo(undefined);
  }, []);

  return {
    // Data
    users: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.total_pages || 0,
    isLoading,
    isError,
    error,
    refetch,

    // Pagination
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage: (value: number) => {
      setItemsPerPage(value);
      setPage(1);
    },
    itemsPerPageOptions: ITEMS_PER_PAGE_OPTIONS,

    // Sorting
    sortBy,
    sortOrder,
    handleSort,

    // Filters
    search,
    handleSearchChange,
    clearSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    clearDateFilters,

    // Selection
    selectedIds,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    isAllSelected: data?.data ? selectedIds.length === data.data.length : false,
    isSomeSelected:
      selectedIds.length > 0 && data?.data ? selectedIds.length < data.data.length : false,

    // Mutations
    updateUser,
    deleteUser,
    bulkDelete,
    bulkActivate,
    bulkDeactivate,
    exportData,
    isBulkDeleting,
    isBulkActivating,
    isBulkDeactivating,
    isExporting,
  };
};
