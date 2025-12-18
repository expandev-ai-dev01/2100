import { Checkbox } from '@/core/components/checkbox';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/dropdown-menu';
import { MoreVerticalIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-react';
import { formatDate } from '@/core/utils/date';
import type { User } from '../../types/models';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTableRow({
  user,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const getStatusVariant = (status: User['status']) => {
    switch (status) {
      case 'Ativo':
        return 'default';
      case 'Inativo':
        return 'secondary';
      case 'Pendente':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <tr className="hover:bg-muted/50 border-b transition-colors">
      <td className="p-4">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(user.id)} />
      </td>
      <td className="p-4 font-medium">{user.id}</td>
      <td className="p-4">{user.name}</td>
      <td className="p-4">{user.email}</td>
      <td className="p-4">
        <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
      </td>
      <td className="p-4">{user.type}</td>
      <td className="hidden p-4 lg:table-cell">{formatDate(user.created_at)}</td>
      <td className="hidden p-4 lg:table-cell">
        {user.last_login ? formatDate(user.last_login) : 'Nunca'}
      </td>
      <td className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVerticalIcon className="h-4 w-4" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(user)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(user)}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
