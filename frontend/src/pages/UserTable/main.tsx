import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/core/components/pagination';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';
import { Alert, AlertTitle, AlertDescription } from '@/core/components/alert';
import { RefreshCwIcon, DownloadIcon, AlertCircleIcon, DatabaseIcon } from 'lucide-react';
import { useUserTable } from '@/domain/userTable/hooks/useUserTable';
import {
  UserTableFilters,
  UserTableHeader,
  UserTableRow,
  BulkActionsBar,
  UserViewDialog,
  UserEditDialog,
  UserDeleteDialog,
  BulkDeleteDialog,
} from '@/domain/userTable/components';
import type { User } from '@/domain/userTable/types/models';

function UserTablePage() {
  const {
    users,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    itemsPerPageOptions,
    sortBy,
    sortOrder,
    handleSort,
    search,
    handleSearchChange,
    clearSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    clearDateFilters,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    selectedIds,
    toggleSelectAll,
    toggleSelectOne,
    isAllSelected,
    isSomeSelected,
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
  } = useUserTable();

  // Dialog states
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserDialog, setDeleteUserDialog] = useState<User | null>(null);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

  // Pagination helpers
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setPage(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Sistema avançado de tabelas com paginação, ordenação e filtros
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button
            onClick={() =>
              exportData({
                format: 'csv',
                scope: 'all_filtered',
              })
            }
            variant="outline"
            size="sm"
            disabled={isExporting || isLoading}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTableFilters
            search={search}
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onClearDateFilters={clearDateFilters}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onDelete={() => setBulkDeleteDialog(true)}
        onActivate={() => bulkActivate(selectedIds)}
        onDeactivate={() => bulkDeactivate(selectedIds)}
        onExport={() =>
          exportData({
            format: 'csv',
            scope: 'selected',
            selected_ids: selectedIds,
          })
        }
        isDeleting={isBulkDeleting}
        isActivating={isBulkActivating}
        isDeactivating={isBulkDeactivating}
        isExporting={isExporting}
      />

      {/* Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Usuários ({total} {total === 1 ? 'registro' : 'registros'})
          </CardTitle>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="flex h-[400px] items-center justify-center">
              <LoadingSpinner className="h-8 w-8" />
            </div>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Erro ao carregar dados</AlertTitle>
              <AlertDescription>
                {error?.message || 'Ocorreu um erro ao carregar os dados. Tente novamente.'}
                <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4">
                  Tentar Novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !isError && users.length === 0 && (
            <Empty className="min-h-[400px]">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <DatabaseIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {search || dateFrom || dateTo
                    ? 'Nenhum registro encontrado'
                    : 'Nenhum usuário cadastrado'}
                </EmptyTitle>
                <EmptyDescription>
                  {search || dateFrom || dateTo
                    ? `Não encontramos resultados para os filtros aplicados. Tente ajustar os critérios de busca.`
                    : 'Comece adicionando usuários ao sistema.'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {/* Table */}
          {!isLoading && !isError && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <UserTableHeader
                  isAllSelected={isAllSelected}
                  isSomeSelected={isSomeSelected}
                  onToggleSelectAll={toggleSelectAll}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <tbody>
                  {users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      isSelected={selectedIds.includes(user.id)}
                      onToggleSelect={toggleSelectOne}
                      onView={setViewUser}
                      onEdit={setEditUser}
                      onDelete={setDeleteUserDialog}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && users.length > 0 && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Página {page} de {totalPages}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className={
                        page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UserViewDialog
        user={viewUser}
        open={!!viewUser}
        onOpenChange={(open) => !open && setViewUser(null)}
      />
      <UserEditDialog
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        onSave={async (id, data) => {
          await updateUser({ id, data });
        }}
      />
      <UserDeleteDialog
        user={deleteUserDialog}
        open={!!deleteUserDialog}
        onOpenChange={(open) => !open && setDeleteUserDialog(null)}
        onConfirm={deleteUser}
      />
      <BulkDeleteDialog
        count={selectedIds.length}
        open={bulkDeleteDialog}
        onOpenChange={setBulkDeleteDialog}
        onConfirm={async () => {
          await bulkDelete(selectedIds);
        }}
      />
    </div>
  );
}

export { UserTablePage };
