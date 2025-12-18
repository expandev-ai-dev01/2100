/**
 * @summary
 * In-memory store for Notification System feature.
 * Manages notification state, history, and preferences.
 *
 * @module instances/notification/notificationStore
 */

import {
  NotificationSystemState,
  ToastNotification,
  PushNotification,
  ModalNotification,
  NotificationPreferences,
  NotificationHistory,
  WebSocketState,
} from '@/services/notification/notificationTypes';
import {
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_ENUMS,
  NOTIFICATION_MESSAGES,
} from '@/constants/notification';
import type {
  ToastNotificationInput,
  PushNotificationInput,
  ModalNotificationInput,
} from '@/services/notification/notificationValidation';

class NotificationStore {
  private userStates: Map<number, NotificationSystemState> = new Map();

  private initializeUserState(userId: number): NotificationSystemState {
    const websocket: WebSocketState = {
      id: `ws-${userId}-${Date.now()}`,
      connectionStatus: 'connected',
      messageType: 'notification',
      autoReconnect: true,
      simulationInterval: NOTIFICATION_DEFAULTS.WEBSOCKET_SIMULATION_INTERVAL,
    };

    const preferences: NotificationPreferences = {
      userId,
      toastEnabled: true,
      pushEnabled: false,
      soundEnabled: true,
      defaultPosition: NOTIFICATION_DEFAULTS.DEFAULT_POSITION,
      accessibilityMode: false,
    };

    const history: NotificationHistory = {
      notifications: [],
      badgeCount: 0,
    };

    return {
      activeNotifications: [],
      history,
      preferences,
      websocket,
      loadingIndicators: [],
      buttonStates: [],
    };
  }

  private getUserState(userId: number): NotificationSystemState {
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, this.initializeUserState(userId));
    }
    return this.userStates.get(userId)!;
  }

  /**
   * Get complete state for user
   */
  getState(userId: number): NotificationSystemState {
    return { ...this.getUserState(userId) };
  }

  /**
   * Create toast notification
   */
  createToast(userId: number, data: ToastNotificationInput): ToastNotification {
    const state = this.getUserState(userId);

    // Check max toast limit
    const activeToasts = state.activeNotifications.filter((n) => n.type === 'toast');
    if (activeToasts.length >= NOTIFICATION_DEFAULTS.MAX_TOAST_NOTIFICATIONS) {
      // Remove oldest toast
      const oldestToast = activeToasts.reduce((oldest, current) =>
        new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest
      );
      this.dismissNotification(userId, oldestToast.id);
    }

    const toast: ToastNotification = {
      id: `toast-${data.toastType}-${Date.now()}`,
      type: 'toast',
      toastType: data.toastType,
      message: data.message,
      position: data.position || state.preferences.defaultPosition,
      duration:
        data.toastType === 'success'
          ? NOTIFICATION_DEFAULTS.TOAST_DURATION_SUCCESS
          : data.toastType === 'error'
          ? NOTIFICATION_DEFAULTS.TOAST_DURATION_ERROR
          : data.toastType === 'warning'
          ? NOTIFICATION_DEFAULTS.TOAST_DURATION_WARNING
          : NOTIFICATION_DEFAULTS.TOAST_DURATION_INFO,
      autoClose: data.toastType !== 'error',
      closeButton: true,
      stackPosition: activeToasts.length + 1,
      animationType: 'slide-in-right',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    state.activeNotifications.push(toast);
    this.addToHistory(userId, toast);

    // Auto-dismiss if configured
    if (toast.autoClose && toast.duration > 0) {
      setTimeout(() => {
        this.dismissNotification(userId, toast.id);
      }, toast.duration);
    }

    return toast;
  }

  /**
   * Create push notification
   */
  createPush(userId: number, data: PushNotificationInput): PushNotification {
    const state = this.getUserState(userId);

    const push: PushNotification = {
      id: `push-${Date.now()}`,
      type: 'push',
      title: data.title,
      body: data.body,
      message: data.body,
      icon: data.icon,
      clickAction: data.clickAction,
      permissionStatus: 'granted',
      position: data.position || state.preferences.defaultPosition,
      duration: NOTIFICATION_DEFAULTS.PUSH_DURATION,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    state.activeNotifications.push(push);
    this.addToHistory(userId, push);

    // Auto-dismiss after duration
    setTimeout(() => {
      this.dismissNotification(userId, push.id);
    }, push.duration);

    return push;
  }

  /**
   * Create modal notification
   */
  createModal(userId: number, data: ModalNotificationInput): ModalNotification {
    const state = this.getUserState(userId);

    const modal: ModalNotification = {
      id: `modal-${data.modalType}-${Date.now()}`,
      type: 'modal',
      modalType: data.modalType,
      title: data.title,
      message: data.message,
      confirmButtonText: data.confirmButtonText,
      cancelButtonText: data.cancelButtonText,
      dangerAction: data.dangerAction,
      position: data.position || state.preferences.defaultPosition,
      duration: NOTIFICATION_DEFAULTS.MODAL_DURATION,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    state.activeNotifications.push(modal);
    this.addToHistory(userId, modal);

    return modal;
  }

  /**
   * Add notification to history
   */
  private addToHistory(
    userId: number,
    notification: ToastNotification | PushNotification | ModalNotification
  ): void {
    const state = this.getUserState(userId);

    state.history.notifications.unshift(notification);

    // Keep only last 50 notifications
    if (state.history.notifications.length > NOTIFICATION_DEFAULTS.MAX_HISTORY_NOTIFICATIONS) {
      state.history.notifications = state.history.notifications.slice(
        0,
        NOTIFICATION_DEFAULTS.MAX_HISTORY_NOTIFICATIONS
      );
    }

    // Update badge count
    state.history.badgeCount = state.history.notifications.filter((n) => !n.isRead).length;
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: number, notificationId: string): boolean {
    const state = this.getUserState(userId);

    const notification = state.history.notifications.find((n) => n.id === notificationId);
    if (!notification) return false;

    notification.isRead = true;
    state.history.badgeCount = state.history.notifications.filter((n) => !n.isRead).length;

    return true;
  }

  /**
   * Dismiss notification
   */
  dismissNotification(userId: number, notificationId: string): boolean {
    const state = this.getUserState(userId);

    const index = state.activeNotifications.findIndex((n) => n.id === notificationId);
    if (index === -1) return false;

    state.activeNotifications.splice(index, 1);
    return true;
  }

  /**
   * Get user preferences
   */
  getPreferences(userId: number): NotificationPreferences {
    return { ...this.getUserState(userId).preferences };
  }

  /**
   * Update user preferences
   */
  updatePreferences(
    userId: number,
    preferences: Partial<NotificationPreferences>
  ): NotificationPreferences {
    const state = this.getUserState(userId);
    state.preferences = { ...state.preferences, ...preferences };
    return { ...state.preferences };
  }

  /**
   * Reset preferences to default
   */
  resetPreferences(userId: number): NotificationPreferences {
    const state = this.getUserState(userId);
    state.preferences = {
      userId,
      toastEnabled: true,
      pushEnabled: false,
      soundEnabled: true,
      defaultPosition: NOTIFICATION_DEFAULTS.DEFAULT_POSITION,
      accessibilityMode: false,
    };
    return { ...state.preferences };
  }

  /**
   * Simulate WebSocket notification
   */
  simulateWebSocketNotification(userId: number): ToastNotification {
    const types: Array<'success' | 'info' | 'warning'> = ['success', 'info', 'warning'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    return this.createToast(userId, {
      type: 'toast',
      toastType: randomType,
      message: `Notificação em tempo real via WebSocket (${randomType})`,
      position: NOTIFICATION_DEFAULTS.DEFAULT_POSITION,
    });
  }

  /**
   * Get notification history
   */
  getHistory(userId: number): NotificationHistory {
    return { ...this.getUserState(userId).history };
  }

  /**
   * Clear notification history
   */
  clearHistory(userId: number): void {
    const state = this.getUserState(userId);
    state.history.notifications = [];
    state.history.badgeCount = 0;
  }
}

export const notificationStore = new NotificationStore();
