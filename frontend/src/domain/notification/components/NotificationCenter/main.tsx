/**
 * @summary
 * Notification Center component.
 * Displays notification history and badge counter.
 */

import { useState } from 'react';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/core/components/sheet';
import { BellIcon, TrashIcon } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '@/core/utils/date';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';

export function NotificationCenter() {
  const { state, unreadCount, markNotificationAsRead, dismissNotification, clearHistory } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const notifications = state?.history?.notifications || [];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notificações ({notifications.length})</SheetTitle>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => clearHistory()}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </SheetHeader>

        {notifications.length === 0 ? (
          <Empty className="flex-1">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BellIcon />
              </EmptyMedia>
              <EmptyTitle>Nenhuma notificação</EmptyTitle>
              <EmptyDescription>Você não tem notificações no momento.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-4 transition-colors ${
                  notification.isRead ? 'bg-background' : 'bg-primary/5'
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    markNotificationAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatRelativeTime(new Date(notification.createdAt))}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
