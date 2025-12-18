import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { PlusCircleIcon, FileTextIcon, SettingsIcon, ShoppingBagIcon } from 'lucide-react';
import { useNavigation } from '@/core/hooks/useNavigation';

export function QuickAccessWidget() {
  const { navigate } = useNavigation();

  const links = [
    {
      label: 'Cadastrar Produto',
      icon: PlusCircleIcon,
      action: () => navigate('/products/new'),
      variant: 'default' as const,
    },
    {
      label: 'Ver Pedidos',
      icon: ShoppingBagIcon,
      action: () => navigate('/orders'),
      variant: 'outline' as const,
    },
    {
      label: 'Relatórios',
      icon: FileTextIcon,
      action: () => navigate('/reports'),
      variant: 'outline' as const,
    },
    {
      label: 'Configurações',
      icon: SettingsIcon,
      action: () => navigate('/settings'),
      variant: 'ghost' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso Rápido</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {links.map((link, index) => (
          <Button
            key={index}
            variant={link.variant}
            className="w-full justify-start"
            onClick={link.action}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
