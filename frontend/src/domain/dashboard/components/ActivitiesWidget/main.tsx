import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/tabs';
import { UserIcon, ShoppingCartIcon, LogInIcon } from 'lucide-react';
import { formatRelativeTime } from '@/core/utils/date';
import type { DashboardActivities } from '../../types/models';

interface ActivitiesWidgetProps {
  activities: DashboardActivities;
}

export function ActivitiesWidget({ activities }: ActivitiesWidgetProps) {
  const renderList = (items: typeof activities.recent_logins, Icon: React.ElementType) => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 rounded-md border p-3">
          <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-full">
            {Icon && <Icon className="text-muted-foreground h-5 w-5" />}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
          <div className="text-muted-foreground text-xs">
            {formatRelativeTime(new Date(item.timestamp))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logins" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="logins">Logins</TabsTrigger>
            <TabsTrigger value="registrations">Cadastros</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>
          <TabsContent value="logins" className="mt-4">
            {renderList(activities.recent_logins, LogInIcon)}
          </TabsContent>
          <TabsContent value="registrations" className="mt-4">
            {renderList(activities.new_registrations, UserIcon)}
          </TabsContent>
          <TabsContent value="orders" className="mt-4">
            {renderList(activities.recent_orders, ShoppingCartIcon)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
