/**
 * @summary
 * Business logic for Notification System feature.
 * Handles notification creation, management, and WebSocket simulation.
 *
 * @module services/notification/notificationService
 */

import { notificationStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  NotificationSystemState,
  ToastNotification,
  PushNotification,
  ModalNotification,
  NotificationPreferences,
} from './notificationTypes';
import {
  toastNotificationSchema,
  pushNotificationSchema,
  modalNotificationSchema,
  notificationPreferencesSchema,
} from './notificationValidation';
import { NOTIFICATION_DEFAULTS } from '@/constants/notification';

/**
 * @summary
 * Gets complete notification system state
 */
export async function getNotificationSystemState(userId: number): Promise<NotificationSystemState> {
  return notificationStore.getState(userId);
}

/**
 * @summary
 * Creates a toast notification
 */
export async function createToastNotification(
  userId: number,
  data: unknown
): Promise<ToastNotification> {
  const validation = toastNotificationSchema.safeParse(data);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid toast notification data',
      400,
      validation.error.errors
    );
  }

  const toast = notificationStore.createToast(userId, validation.data);
  return toast;
}

/**
 * @summary
 * Creates a push notification
 */
export async function createPushNotification(
  userId: number,
  data: unknown
): Promise<PushNotification> {
  const validation = pushNotificationSchema.safeParse(data);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid push notification data',
      400,
      validation.error.errors
    );
  }

  const push = notificationStore.createPush(userId, validation.data);
  return push;
}

/**
 * @summary
 * Creates a modal notification
 */
export async function createModalNotification(
  userId: number,
  data: unknown
): Promise<ModalNotification> {
  const validation = modalNotificationSchema.safeParse(data);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid modal notification data',
      400,
      validation.error.errors
    );
  }

  const modal = notificationStore.createModal(userId, validation.data);
  return modal;
}

/**
 * @summary
 * Marks notification as read
 */
export async function markNotificationAsRead(
  userId: number,
  notificationId: string
): Promise<{ success: boolean }> {
  const marked = notificationStore.markAsRead(userId, notificationId);

  if (!marked) {
    throw new ServiceError('NOT_FOUND', 'Notification not found', 404);
  }

  return { success: true };
}

/**
 * @summary
 * Dismisses a notification
 */
export async function dismissNotification(
  userId: number,
  notificationId: string
): Promise<{ success: boolean }> {
  const dismissed = notificationStore.dismissNotification(userId, notificationId);

  if (!dismissed) {
    throw new ServiceError('NOT_FOUND', 'Notification not found', 404);
  }

  return { success: true };
}

/**
 * @summary
 * Gets user notification preferences
 */
export async function getNotificationPreferences(userId: number): Promise<NotificationPreferences> {
  return notificationStore.getPreferences(userId);
}

/**
 * @summary
 * Updates user notification preferences
 */
export async function updateNotificationPreferences(
  userId: number,
  data: unknown
): Promise<NotificationPreferences> {
  const validation = notificationPreferencesSchema.safeParse(data);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid preferences data',
      400,
      validation.error.errors
    );
  }

  return notificationStore.updatePreferences(userId, validation.data);
}

/**
 * @summary
 * Resets user notification preferences to default
 */
export async function resetNotificationPreferences(
  userId: number
): Promise<NotificationPreferences> {
  return notificationStore.resetPreferences(userId);
}

/**
 * @summary
 * Simulates WebSocket notification (for testing)
 */
export async function simulateWebSocketNotification(userId: number): Promise<ToastNotification> {
  return notificationStore.simulateWebSocketNotification(userId);
}

/**
 * @summary
 * Gets notification history
 */
export async function getNotificationHistory(userId: number): Promise<{
  notifications: any[];
  badgeCount: number;
}> {
  return notificationStore.getHistory(userId);
}

/**
 * @summary
 * Clears notification history
 */
export async function clearNotificationHistory(userId: number): Promise<{ success: boolean }> {
  notificationStore.clearHistory(userId);
  return { success: true };
}
