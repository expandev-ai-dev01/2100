import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { Label } from '@/core/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { DatePicker } from '@/core/components/date-picker';
import { XIcon, SearchIcon } from 'lucide-react';
import type { User } from '../../types/models';

interface UserTableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onClearDateFilters: () => void;
  statusFilter: User['status'][];
  onStatusFilterChange: (status: User['status'][]) => void;
  typeFilter: User['type'][];
  onTypeFilterChange: (type: User['type'][]) => void;
}

export function UserTableFilters({
  search,
  onSearchChange,
  onClearSearch,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearDateFilters,
}: UserTableFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar (Nome, Email, ID)</Label>
          <div className="relative">
            <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="search"
              placeholder="Mínimo 3 caracteres..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={onClearSearch}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          {search.length > 0 && search.length < 3 && (
            <p className="text-muted-foreground text-xs">Digite pelo menos 3 caracteres</p>
          )}
        </div>

        {/* Period Filter */}
        <div className="space-y-2">
          <Label>Período de Cadastro</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="thismonth">Este Mês</SelectItem>
              <SelectItem value="lastmonth">Mês Passado</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label>Data Inicial</Label>
          <DatePicker
            date={dateFrom}
            onDateChange={onDateFromChange}
            placeholder="Selecione a data"
            className="w-full"
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label>Data Final</Label>
          <div className="flex gap-2">
            <DatePicker
              date={dateTo}
              onDateChange={onDateToChange}
              placeholder="Selecione a data"
              className="flex-1"
            />
            {(dateFrom || dateTo) && (
              <Button
                variant="outline"
                size="icon"
                onClick={onClearDateFilters}
                title="Limpar datas"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
