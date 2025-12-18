/**
 * @summary
 * Notification service for managing all notification types.
 * Handles API communication for notifications, preferences, and WebSocket simulation.
 *
 * @service notificationService
 * @domain notification
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  NotificationSystemState,
  ToastNotification,
  PushNotification,
  ModalNotification,
  NotificationPreferences,
  NotificationHistory,
} from '../types/models';

export const notificationService = {
  /**
   * Get complete notification system state.
   */
  async getState(): Promise<NotificationSystemState> {
    const { data } = await authenticatedClient.get<NotificationSystemState>('/notification');
    return data;
  },

  /**
   * Create toast notification.
   */
  async createToast(payload: {
    toastType: 'success' | 'error' | 'warning' | 'info';
    message: string;
    position?: string;
  }): Promise<ToastNotification> {
    const { data } = await authenticatedClient.post<ToastNotification>(
      '/notification/toast',
      payload
    );
    return data;
  },

  /**
   * Create push notification.
   */
  async createPush(payload: {
    title: string;
    body: string;
    icon?: string;
    clickAction?: string;
    position?: string;
  }): Promise<PushNotification> {
    const { data } = await authenticatedClient.post<PushNotification>(
      '/notification/push',
      payload
    );
    return data;
  },

  /**
   * Create modal notification.
   */
  async createModal(payload: {
    modalType: string;
    title: string;
    message: string;
    confirmButtonText: string;
    cancelButtonText?: string;
    dangerAction?: boolean;
  }): Promise<ModalNotification> {
    const { data } = await authenticatedClient.post<ModalNotification>(
      '/notification/modal',
      payload
    );
    return data;
  },

  /**
   * Mark notification as read.
   */
  async markAsRead(id: string): Promise<void> {
    await authenticatedClient.patch(`/notification/${id}/read`);
  },

  /**
   * Dismiss notification.
   */
  async dismiss(id: string): Promise<void> {
    await authenticatedClient.delete(`/notification/${id}`);
  },

  /**
   * Get notification preferences.
   */
  async getPreferences(): Promise<NotificationPreferences> {
    const { data } = await authenticatedClient.get<NotificationPreferences>(
      '/notification/preferences'
    );
    return data;
  },

  /**
   * Update notification preferences.
   */
  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const { data } = await authenticatedClient.put<NotificationPreferences>(
      '/notification/preferences',
      preferences
    );
    return data;
  },

  /**
   * Reset notification preferences to defaults.
   */
  async resetPreferences(): Promise<NotificationPreferences> {
    const { data } = await authenticatedClient.post<NotificationPreferences>(
      '/notification/preferences/reset'
    );
    return data;
  },

  /**
   * Simulate WebSocket notification.
   */
  async simulateWebSocket(): Promise<void> {
    await authenticatedClient.post('/notification/websocket/simulate');
  },

  /**
   * Get notification history.
   */
  async getHistory(): Promise<NotificationHistory> {
    const { data } = await authenticatedClient.get<NotificationHistory>('/notification/history');
    return data;
  },

  /**
   * Clear notification history.
   */
  async clearHistory(): Promise<void> {
    await authenticatedClient.delete('/notification/history');
  },
};
