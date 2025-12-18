import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { SearchIcon } from 'lucide-react';
import type { ProductFilters as Filters } from '../../types/models';

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            id="search"
            placeholder="Nome ou categoria..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, category: value === 'all' ? undefined : (value as any) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
            <SelectItem value="Roupas">Roupas</SelectItem>
            <SelectItem value="Casa & Jardim">Casa & Jardim</SelectItem>
            <SelectItem value="Livros">Livros</SelectItem>
            <SelectItem value="Esportes">Esportes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="min-price">Preço Mínimo</Label>
        <Input
          id="min-price"
          type="number"
          placeholder="R$ 0"
          value={filters.min_price || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              min_price: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-price">Preço Máximo</Label>
        <Input
          id="max-price"
          type="number"
          placeholder="R$ 10000"
          value={filters.max_price || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              max_price: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
    </div>
  );
}
