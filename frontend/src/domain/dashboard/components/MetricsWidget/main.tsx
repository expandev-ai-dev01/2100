import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { UsersIcon, DollarSignIcon, PackageIcon, ClockIcon } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import type { DashboardMetrics, WidgetVisibility } from '../../types/models';

interface MetricsWidgetProps {
  metrics: DashboardMetrics;
  visibility: WidgetVisibility['metrics'];
}

export function MetricsWidget({ metrics, visibility }: MetricsWidgetProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const items = [
    {
      id: 'total_users',
      label: 'Total de Usuários',
      value: metrics.total_users,
      icon: UsersIcon,
      color: 'text-blue-500',
      visible: visibility.total_users,
    },
    {
      id: 'monthly_sales',
      label: 'Vendas do Mês',
      value: formatCurrency(metrics.monthly_sales),
      icon: DollarSignIcon,
      color: 'text-green-500',
      visible: visibility.monthly_sales,
    },
    {
      id: 'registered_products',
      label: 'Produtos Ativos',
      value: metrics.registered_products,
      icon: PackageIcon,
      color: 'text-purple-500',
      visible: visibility.registered_products,
    },
    {
      id: 'pending_orders',
      label: 'Pedidos Pendentes',
      value: metrics.pending_orders,
      icon: ClockIcon,
      color: 'text-orange-500',
      visible: visibility.pending_orders,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map(
        (item) =>
          item.visible && (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                <item.icon className={cn('h-4 w-4', item.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          )
      )}
    </div>
  );
}
