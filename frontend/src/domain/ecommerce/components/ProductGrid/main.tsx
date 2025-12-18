import { ProductCard } from '../ProductCard';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';
import { PackageIcon } from 'lucide-react';
import type { Product } from '../../types/models';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageIcon />
          </EmptyMedia>
          <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
          <EmptyDescription>
            Não encontramos produtos que correspondam aos seus critérios de busca.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}
