/**
 * @summary
 * Notification trigger buttons for testing.
 * Provides buttons to trigger different notification types.
 */

import { Button } from '@/core/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNotifications } from '../../hooks/useNotifications';

export function NotificationTriggers() {
  const { createToast, createPush, createModal } = useNotifications();

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações Toast</CardTitle>
          <CardDescription>Notificações temporárias que aparecem no canto da tela</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => createToast('success')} variant="default">
              Toast de Sucesso (4s)
            </Button>
            <Button onClick={() => createToast('error')} variant="destructive">
              Toast de Erro (Manual)
            </Button>
            <Button onClick={() => createToast('warning')} variant="outline">
              Toast de Aviso (6s)
            </Button>
            <Button onClick={() => createToast('info')} variant="secondary">
              Toast de Info (5s)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações Push</CardTitle>
          <CardDescription>Notificações do sistema que aparecem fora do navegador</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() =>
              createPush({
                title: 'Nova Mensagem',
                body: 'Você recebeu uma nova mensagem importante',
              })
            }
          >
            Enviar Notificação Push
          </Button>
        </CardContent>
      </Card>

      {/* Modal Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Modais</CardTitle>
          <CardDescription>Modais de confirmação que bloqueiam a interação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() =>
                createModal({
                  modalType: 'confirm_delete',
                  title: 'Confirmar Exclusão',
                  message: 'Tem certeza que deseja excluir este item?',
                  confirmButtonText: 'Excluir',
                  dangerAction: true,
                })
              }
              variant="destructive"
            >
              Modal de Exclusão
            </Button>
            <Button
              onClick={() =>
                createModal({
                  modalType: 'confirm_logout',
                  title: 'Confirmar Logout',
                  message: 'Deseja realmente sair do sistema?',
                  confirmButtonText: 'Sair',
                })
              }
              variant="outline"
            >
              Modal de Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
