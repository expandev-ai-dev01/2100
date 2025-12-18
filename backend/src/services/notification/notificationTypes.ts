/**
 * @summary
 * Type definitions for Notification System feature.
 * Defines structures for all notification types and states.
 *
 * @module services/notification/notificationTypes
 */

/**
 * @interface BaseNotification
 * @description Base notification structure
 */
export interface BaseNotification {
  id: string;
  type: 'toast' | 'push' | 'modal' | 'inline';
  message: string;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration: number;
  isRead: boolean;
  createdAt: string;
}

/**
 * @interface ToastNotification
 * @description Toast notification structure
 */
export interface ToastNotification extends BaseNotification {
  type: 'toast';
  toastType: 'success' | 'error' | 'warning' | 'info';
  autoClose: boolean;
  closeButton: boolean;
  stackPosition: number;
  animationType: 'slide-in-right' | 'slide-in-left' | 'fade-in' | 'bounce-in';
}

/**
 * @interface PushNotification
 * @description Push notification structure
 */
export interface PushNotification extends BaseNotification {
  type: 'push';
  title: string;
  body: string;
  icon?: string;
  clickAction?: string;
  permissionStatus: 'granted' | 'denied' | 'default';
}

/**
 * @interface ModalNotification
 * @description Modal notification structure
 */
export interface ModalNotification extends BaseNotification {
  type: 'modal';
  modalType: 'confirm_delete' | 'confirm_logout' | 'confirm_cancel' | 'confirm_action';
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  dangerAction: boolean;
}

/**
 * @interface InlineValidation
 * @description Inline validation message structure
 */
export interface InlineValidation extends BaseNotification {
  type: 'inline';
  fieldId: string;
  validationType: 'required' | 'email' | 'password' | 'length' | 'pattern' | 'custom';
  validationState: 'error' | 'success' | 'warning' | 'info';
  realTime: boolean;
}

/**
 * @interface SystemNotification
 * @description System event notification
 */
export interface SystemNotification {
  id: string;
  systemEvent:
    | 'login_success'
    | 'login_failed'
    | 'logout'
    | 'session_expired'
    | 'connection_error'
    | 'data_saved'
    | 'data_error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  autoDismiss: boolean;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * @interface ContextualNotification
 * @description Contextual action notification
 */
export interface ContextualNotification {
  id: string;
  contextAction:
    | 'product_added_cart'
    | 'order_confirmed'
    | 'payment_processed'
    | 'item_removed'
    | 'wishlist_added';
  relatedEntity?: string;
  actionButtons?: Array<{
    id: string;
    label: string;
    action: string;
  }>;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * @interface ReminderNotification
 * @description Reminder notification structure
 */
export interface ReminderNotification {
  id: string;
  reminderType: 'deadline_approaching' | 'task_pending' | 'payment_due' | 'subscription_expiring';
  dueDate: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  snoozeOptions?: number[];
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * @interface SecurityAlert
 * @description Security alert notification
 */
export interface SecurityAlert {
  id: string;
  securityEvent:
    | 'suspicious_login'
    | 'password_changed'
    | 'multiple_failed_attempts'
    | 'new_device_login';
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  locationInfo?: string;
  recommendedActions: string[];
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * @interface ErrorScenario
 * @description Error scenario notification
 */
export interface ErrorScenario {
  id: string;
  errorCategory:
    | 'network'
    | 'validation'
    | 'authentication'
    | 'authorization'
    | 'server'
    | 'client';
  errorCode: string;
  errorMessage: string;
  technicalDetails?: string;
  suggestedActions: string[];
  retryAvailable: boolean;
  isRead: boolean;
  createdAt: string;
}

/**
 * @interface LoadingIndicator
 * @description Loading indicator state
 */
export interface LoadingIndicator {
  id: string;
  loaderType: 'spinner' | 'progress-bar' | 'skeleton' | 'dots' | 'pulse';
  progressPercentage?: number;
  loadingText?: string;
  size: 'small' | 'medium' | 'large';
  overlay: boolean;
}

/**
 * @interface ButtonState
 * @description Button state configuration
 */
export interface ButtonState {
  id: string;
  buttonId: string;
  currentState: 'normal' | 'hover' | 'loading' | 'disabled' | 'success' | 'error';
  loadingText?: string;
  successText?: string;
  errorText?: string;
  autoReset: boolean;
}

/**
 * @interface WebSocketState
 * @description WebSocket connection state
 */
export interface WebSocketState {
  id: string;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  messageType: 'notification' | 'update' | 'alert' | 'heartbeat';
  autoReconnect: boolean;
  simulationInterval: number;
}

/**
 * @interface NotificationPreferences
 * @description User notification preferences
 */
export interface NotificationPreferences {
  userId: number;
  toastEnabled: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
  defaultPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  animationPreferences?: {
    speed: 'slow' | 'normal' | 'fast';
    type: string;
    reduceMotion: boolean;
  };
  accessibilityMode: boolean;
}

/**
 * @interface NotificationHistory
 * @description Notification history entry
 */
export interface NotificationHistory {
  notifications: Array<
    | ToastNotification
    | PushNotification
    | ModalNotification
    | InlineValidation
    | SystemNotification
    | ContextualNotification
    | ReminderNotification
    | SecurityAlert
    | ErrorScenario
  >;
  badgeCount: number;
}

/**
 * @interface NotificationSystemState
 * @description Complete notification system state
 */
export interface NotificationSystemState {
  activeNotifications: Array<ToastNotification | PushNotification | ModalNotification>;
  history: NotificationHistory;
  preferences: NotificationPreferences;
  websocket: WebSocketState;
  loadingIndicators: LoadingIndicator[];
  buttonStates: ButtonState[];
}
