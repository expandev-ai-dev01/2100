/**
 * @summary
 * Notification System domain type definitions.
 * Defines all notification entities and configurations.
 */

export type NotificationType = 'toast' | 'push' | 'modal' | 'inline';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type ModalType = 'confirm_delete' | 'confirm_logout' | 'confirm_cancel' | 'confirm_action';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface BaseNotification {
  id: string;
  type: NotificationType;
  message: string;
  position: NotificationPosition;
  duration: number;
  isRead: boolean;
  createdAt: string;
}

export interface ToastNotification extends BaseNotification {
  type: 'toast';
  toastType: ToastType;
  autoClose: boolean;
  closeButton: boolean;
  stackPosition: number;
  animationType: 'slide-in-right' | 'slide-in-left' | 'fade-in' | 'bounce-in';
}

export interface PushNotification extends BaseNotification {
  type: 'push';
  title: string;
  body: string;
  icon?: string;
  clickAction?: string;
  permissionStatus: 'granted' | 'denied' | 'default';
}

export interface ModalNotification extends BaseNotification {
  type: 'modal';
  modalType: ModalType;
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  dangerAction: boolean;
}

export type Notification = ToastNotification | PushNotification | ModalNotification;

export interface NotificationPreferences {
  toastEnabled: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
  defaultPosition: NotificationPosition;
  accessibilityMode: boolean;
  animationPreferences?: {
    speed: 'slow' | 'normal' | 'fast';
    type: string;
    reduceMotion: boolean;
  };
}

export interface NotificationHistory {
  notifications: Notification[];
  badgeCount: number;
}

export interface WebSocketState {
  id: string;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  autoReconnect: boolean;
  simulationInterval: number;
}

export interface NotificationSystemState {
  activeNotifications: Notification[];
  history: NotificationHistory;
  preferences: NotificationPreferences;
  websocket: WebSocketState;
}
