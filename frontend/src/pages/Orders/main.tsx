import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { Button } from '@/core/components/button';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';
import { PackageIcon } from 'lucide-react';
import { useOrders } from '@/domain/ecommerce/hooks/useOrders';
import { useNavigation } from '@/core/hooks/useNavigation';
import { formatDate } from '@/core/utils/date';

function OrdersPage() {
  const { navigate } = useNavigation();
  const { orders, isLoading } = useOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Entregue':
        return 'default';
      case 'Enviado':
      case 'Preparando':
        return 'secondary';
      case 'Cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
        <p className="text-muted-foreground">Acompanhe o status dos seus pedidos</p>
      </div>

      {orders.length === 0 ? (
        <Empty className="min-h-[50vh]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum pedido encontrado</EmptyTitle>
            <EmptyDescription>
              Você ainda não fez nenhum pedido. Comece a comprar agora!
            </EmptyDescription>
            <Button onClick={() => navigate('/products')}>Ir para o catálogo</Button>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.order_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pedido #{order.order_id}</CardTitle>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  Realizado em {formatDate(order.created_at, 'dd/MM/yyyy HH:mm')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.product.product_id} className="flex gap-4">
                      <img
                        src={item.product.main_image_url}
                        alt={item.product.product_name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="line-clamp-1 font-medium">{item.product.product_name}</h4>
                        <p className="text-muted-foreground text-sm">Quantidade: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-muted-foreground text-sm">
                      +{order.items.length - 2} {order.items.length - 2 === 1 ? 'item' : 'itens'}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/orders/${order.order_id}`)}>
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export { OrdersPage };
