import { Card, CardContent } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { StarIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useNavigation } from '@/core/hooks/useNavigation';
import type { Product } from '../../types/models';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { navigate } = useNavigation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {product.stock_badge_type !== 'available' && (
        <Badge
          variant={product.stock_badge_type === 'unavailable' ? 'destructive' : 'default'}
          className="absolute right-2 top-2 z-10"
        >
          {product.stock_badge_text}
        </Badge>
      )}

      <div
        className="aspect-square cursor-pointer overflow-hidden"
        onClick={() => navigate(`/products/${product.product_id}`)}
      >
        <img
          src={product.main_image_url}
          alt={product.product_name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <h3
            className="hover:text-primary line-clamp-2 cursor-pointer font-semibold"
            onClick={() => navigate(`/products/${product.product_id}`)}
          >
            {product.product_name}
          </h3>
          <p className="text-muted-foreground text-sm">{product.category}</p>
        </div>

        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          <Button
            size="icon"
            onClick={() => addItem(product)}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCartIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
