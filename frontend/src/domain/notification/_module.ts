/**
 * @summary
 * Notification System domain module exports.
 * Handles all notification types, preferences, and real-time updates.
 *
 * @module domain/notification
 */

export * from './components';
export * from './services';
export * from './hooks';
export * from './stores';
export * from './validations';

export type {
  Notification,
  ToastNotification,
  PushNotification,
  ModalNotification,
  NotificationPreferences,
  NotificationHistory,
  WebSocketState,
} from './types';
