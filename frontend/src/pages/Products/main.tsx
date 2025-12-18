import { useState } from 'react';
import { Button } from '@/core/components/button';
import { ShoppingCartIcon } from 'lucide-react';
import { useProducts } from '@/domain/ecommerce/hooks/useProducts';
import { useCart } from '@/domain/ecommerce/hooks/useCart';
import { ProductGrid, ProductFilters, CartDrawer } from '@/domain/ecommerce/components';
import type { ProductFilters as Filters } from '@/domain/ecommerce/types/models';

function ProductsPage() {
  const { setIsOpen, itemCount } = useCart();
  const [filters, setFilters] = useState<Filters>({});
  const { products, isLoading } = useProducts(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Produtos</h1>
          <p className="text-muted-foreground">
            {products.length}{' '}
            {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="relative">
          <ShoppingCartIcon className="mr-2 h-4 w-4" />
          Carrinho
          {itemCount > 0 && (
            <span className="bg-destructive absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
              {itemCount}
            </span>
          )}
        </Button>
      </div>

      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      <ProductGrid products={products} isLoading={isLoading} />

      <CartDrawer />
    </div>
  );
}

export { ProductsPage };
