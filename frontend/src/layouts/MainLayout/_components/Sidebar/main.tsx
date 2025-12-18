import { cn } from '@/core/lib/utils';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Button } from '@/core/components/button';
import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  FileSpreadsheetIcon,
  TableIcon,
  ComponentIcon,
  ShoppingBagIcon,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const { navigate, isCurrentPath } = useNavigation();

  const items = [
    { label: 'Dashboard', icon: LayoutDashboardIcon, path: '/dashboard' },
    { label: 'Formulário Complexo', icon: FileSpreadsheetIcon, path: '/complex-form' },
    { label: 'Tabela Avançada', icon: TableIcon, path: '/users' },
    { label: 'Componentes UI', icon: ComponentIcon, path: '/ui-components' },
    { label: 'Produtos', icon: PackageIcon, path: '/products' },
    { label: 'Pedidos', icon: ShoppingBagIcon, path: '/orders' },
    { label: 'Carrinho', icon: ShoppingCartIcon, path: '/checkout' },
  ];

  return (
    <div className={cn('bg-sidebar flex h-full flex-col border-r', className)}>
      <div className="flex h-14 items-center border-b px-6">
        <span className="text-lg font-bold">Laboratório QA</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {items.map((item) => (
            <Button
              key={item.path}
              variant={isCurrentPath(item.path) ? 'secondary' : 'ghost'}
              className="justify-start"
              onClick={() => {
                navigate(item.path);
                onItemClick?.();
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
