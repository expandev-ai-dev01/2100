/**
 * @summary
 * Notifications demonstration page.
 * Showcases all notification types and configuration options.
 */

import {
  NotificationCenter,
  NotificationTriggers,
  NotificationPreferences,
} from '@/domain/notification/components';

function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Notificações</h1>
          <p className="text-muted-foreground">
            Demonstração completa de alertas, mensagens e feedback visual
          </p>
        </div>
        <NotificationCenter />
      </div>

      <NotificationTriggers />

      <NotificationPreferences />
    </div>
  );
}

export { NotificationsPage };
