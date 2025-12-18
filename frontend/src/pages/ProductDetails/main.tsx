import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/core/components/button';
import { Card, CardContent } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { Separator } from '@/core/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/tabs';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { StarIcon, ShoppingCartIcon, ChevronLeftIcon } from 'lucide-react';
import { useProductDetails } from '@/domain/ecommerce/hooks/useProducts';
import { useCart } from '@/domain/ecommerce/hooks/useCart';
import { useNavigation } from '@/core/hooks/useNavigation';
import { ProductCard, CartDrawer } from '@/domain/ecommerce/components';
import { formatDate } from '@/core/utils/date';

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { navigate } = useNavigation();
  const { product, relatedProducts, reviews, isLoading } = useProductDetails(id!);
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Produto não encontrado</h2>
        <Button onClick={() => navigate('/products')}>Voltar ao catálogo</Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating_stars, 0) / reviews.length
      : product.rating;

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate('/products')}>
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Voltar ao catálogo
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.product_images[selectedImage]}
              alt={product.product_name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.product_images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                  selectedImage === idx ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.product_name} ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>{product.category}</Badge>
              {product.stock_badge_type !== 'available' && (
                <Badge
                  variant={product.stock_badge_type === 'unavailable' ? 'destructive' : 'default'}
                >
                  {product.stock_badge_text}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground text-sm">({reviews.length} avaliações)</span>
          </div>

          <div className="text-4xl font-bold">{formatPrice(product.price)}</div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => addItem(product)}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            {product.stock_quantity === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
          </Button>

          <Separator />

          <div>
            <h3 className="mb-2 font-semibold">Descrição</h3>
            <p className="text-muted-foreground">{product.product_description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specs">Especificações</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações ({reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="specs" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                {product.technical_specifications &&
                  Object.entries(product.technical_specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-muted-foreground text-sm">{key}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.review_id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.user_name}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating_stars
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.review_comment && (
                    <p className="text-muted-foreground text-sm">{review.review_comment}</p>
                  )}
                  <p className="text-muted-foreground text-xs">{formatDate(review.review_date)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </div>
      )}

      <CartDrawer />
    </div>
  );
}

export { ProductDetailsPage };
