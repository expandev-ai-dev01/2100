import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/dialog';
import { Badge } from '@/core/components/badge';
import { Separator } from '@/core/components/separator';
import { formatDate } from '@/core/utils/date';
import type { User } from '../../types/models';

interface UserViewDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserViewDialog({ user, open, onOpenChange }: UserViewDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">ID</p>
              <p className="font-medium">{user.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <Badge>{user.status}</Badge>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-sm">Nome</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Tipo</p>
              <p className="font-medium">{user.type}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Data de Cadastro</p>
              <p className="font-medium">{formatDate(user.created_at, 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Último Login</p>
              <p className="font-medium">
                {user.last_login ? formatDate(user.last_login, 'dd/MM/yyyy HH:mm') : 'Nunca'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-sm">Última Atualização</p>
              <p className="font-medium">{formatDate(user.last_updated, 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
