/**
 * @summary
 * Dashboard page component.
 * Main authenticated page with logout functionality.
 */

import { Button } from '@/core/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useLogout } from '@/domain/auth/hooks/useLogout';
import { useAuthStore } from '@/domain/auth/stores/authStore';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { LogOutIcon } from 'lucide-react';

function DashboardPage() {
  const { logout, isPending } = useLogout();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={() => logout()} disabled={isPending}>
          {isPending ? (
            <>
              <LoadingSpinner />
              Saindo...
            </>
          ) : (
            <>
              <LogOutIcon />
              Sair
            </>
          )}
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Detalhes do seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">Nome</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <p className="font-medium capitalize">{user?.status}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { DashboardPage };
