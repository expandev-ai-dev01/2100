import { Checkbox } from '@/core/components/checkbox';
import { Button } from '@/core/components/button';
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from 'lucide-react';
import type { User } from '../../types/models';

interface UserTableHeaderProps {
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onToggleSelectAll: () => void;
  sortBy: keyof User;
  sortOrder: 'asc' | 'desc';
  onSort: (column: keyof User) => void;
}

export function UserTableHeader({
  isAllSelected,
  isSomeSelected,
  onToggleSelectAll,
  sortBy,
  sortOrder,
  onSort,
}: UserTableHeaderProps) {
  const SortIcon = ({ column }: { column: keyof User }) => {
    if (sortBy !== column) return <ArrowUpDownIcon className="ml-2 h-4 w-4" />;
    return sortOrder === 'asc' ? (
      <ArrowUpIcon className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-2 h-4 w-4" />
    );
  };

  return (
    <thead className="bg-muted/50">
      <tr>
        <th className="p-4 text-left">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onToggleSelectAll}
            aria-label="Selecionar todos"
            className={isSomeSelected && !isAllSelected ? 'data-[state=checked]:bg-primary/50' : ''}
          />
        </th>
        <th className="p-4 text-left">
          <Button variant="ghost" size="sm" onClick={() => onSort('id')} className="-ml-3">
            ID
            <SortIcon column="id" />
          </Button>
        </th>
        <th className="p-4 text-left">
          <Button variant="ghost" size="sm" onClick={() => onSort('name')} className="-ml-3">
            Nome
            <SortIcon column="name" />
          </Button>
        </th>
        <th className="p-4 text-left">
          <Button variant="ghost" size="sm" onClick={() => onSort('email')} className="-ml-3">
            Email
            <SortIcon column="email" />
          </Button>
        </th>
        <th className="p-4 text-left">
          <Button variant="ghost" size="sm" onClick={() => onSort('status')} className="-ml-3">
            Status
            <SortIcon column="status" />
          </Button>
        </th>
        <th className="p-4 text-left">
          <Button variant="ghost" size="sm" onClick={() => onSort('type')} className="-ml-3">
            Tipo
            <SortIcon column="type" />
          </Button>
        </th>
        <th className="hidden p-4 text-left lg:table-cell">
          <Button variant="ghost" size="sm" onClick={() => onSort('created_at')} className="-ml-3">
            Data Cadastro
            <SortIcon column="created_at" />
          </Button>
        </th>
        <th className="hidden p-4 text-left lg:table-cell">
          <Button variant="ghost" size="sm" onClick={() => onSort('last_login')} className="-ml-3">
            Último Login
            <SortIcon column="last_login" />
          </Button>
        </th>
        <th className="p-4 text-left">Ações</th>
      </tr>
    </thead>
  );
}
