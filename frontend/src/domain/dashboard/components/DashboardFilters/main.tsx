import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Button } from '@/core/components/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/core/components/sheet';
import { FilterIcon } from 'lucide-react';
import type { DashboardFilters as FilterType } from '../../types/models';

interface DashboardFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

export function DashboardFilters({ filters, onFilterChange }: DashboardFiltersProps) {
  const handlePeriodChange = (value: string) => {
    onFilterChange({ ...filters, period: value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category: value === 'all' ? undefined : value });
  };

  const FilterControls = () => (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Select value={filters.period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last_month">Último Mês</SelectItem>
          <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
          <SelectItem value="last_year">Último Ano</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          <SelectItem value="electronics">Eletrônicos</SelectItem>
          <SelectItem value="clothing">Roupas</SelectItem>
          <SelectItem value="home">Casa & Jardim</SelectItem>
          <SelectItem value="books">Livros</SelectItem>
          <SelectItem value="sports">Esportes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <FilterControls />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader className="mb-4">
              <SheetTitle>Filtros do Dashboard</SheetTitle>
            </SheetHeader>
            <FilterControls />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
