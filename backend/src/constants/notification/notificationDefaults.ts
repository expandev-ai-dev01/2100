/**
 * @summary
 * Default values and constants for Notification System feature.
 * Contains configuration for notification types, durations, limits, and WebSocket settings.
 *
 * @module constants/notification/notificationDefaults
 */

/**
 * @interface NotificationDefaultsType
 * @description Default configuration values for notification system
 */
export const NOTIFICATION_DEFAULTS = {
  /** Maximum simultaneous toast notifications */
  MAX_TOAST_NOTIFICATIONS: 5,
  /** Maximum notifications in history */
  MAX_HISTORY_NOTIFICATIONS: 50,
  /** Toast durations in milliseconds */
  TOAST_DURATION_SUCCESS: 4000,
  TOAST_DURATION_ERROR: 0, // Permanent
  TOAST_DURATION_WARNING: 6000,
  TOAST_DURATION_INFO: 5000,
  /** Push notification duration */
  PUSH_DURATION: 8000,
  /** Modal duration (permanent) */
  MODAL_DURATION: 0,
  /** Inline validation duration (permanent) */
  INLINE_DURATION: 0,
  /** WebSocket simulation interval */
  WEBSOCKET_SIMULATION_INTERVAL: 10000,
  /** Heartbeat interval */
  WEBSOCKET_HEARTBEAT_INTERVAL: 30000,
  /** Default position */
  DEFAULT_POSITION: 'top-right' as const,
  /** Badge counter maximum */
  MAX_BADGE_COUNT: 99,
  /** Animation durations */
  ANIMATION_DURATION_FAST: 150,
  ANIMATION_DURATION_NORMAL: 200,
  ANIMATION_DURATION_SLOW: 300,
  /** Validation debounce */
  VALIDATION_DEBOUNCE: 300,
} as const;

export type NotificationDefaultsType = typeof NOTIFICATION_DEFAULTS;

/**
 * @interface NotificationEnums
 * @description Allowed values for notification enumerations
 */
export const NOTIFICATION_ENUMS = {
  NOTIFICATION_TYPES: ['toast', 'push', 'modal', 'inline'] as const,
  TOAST_TYPES: ['success', 'error', 'warning', 'info'] as const,
  POSITIONS: ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const,
  SYSTEM_EVENTS: [
    'login_success',
    'login_failed',
    'logout',
    'session_expired',
    'connection_error',
    'data_saved',
    'data_error',
  ] as const,
  PRIORITIES: ['low', 'medium', 'high', 'critical'] as const,
  SECURITY_EVENTS: [
    'suspicious_login',
    'password_changed',
    'multiple_failed_attempts',
    'new_device_login',
  ] as const,
  THREAT_LEVELS: ['low', 'medium', 'high', 'critical'] as const,
  CONTEXTUAL_ACTIONS: [
    'product_added_cart',
    'order_confirmed',
    'payment_processed',
    'item_removed',
    'wishlist_added',
  ] as const,
  REMINDER_TYPES: [
    'deadline_approaching',
    'task_pending',
    'payment_due',
    'subscription_expiring',
  ] as const,
  URGENCY_LEVELS: ['low', 'medium', 'high', 'urgent'] as const,
  ERROR_CATEGORIES: [
    'network',
    'validation',
    'authentication',
    'authorization',
    'server',
    'client',
  ] as const,
  BUTTON_STATES: ['normal', 'hover', 'loading', 'disabled', 'success', 'error'] as const,
  LOADER_TYPES: ['spinner', 'progress-bar', 'skeleton', 'dots', 'pulse'] as const,
  LOADER_SIZES: ['small', 'medium', 'large'] as const,
  WEBSOCKET_STATUS: ['connecting', 'connected', 'disconnected', 'error'] as const,
  WEBSOCKET_MESSAGE_TYPES: ['notification', 'update', 'alert', 'heartbeat'] as const,
} as const;

/**
 * @interface NotificationMessages
 * @description Default notification messages
 */
export const NOTIFICATION_MESSAGES = {
  TOAST_SUCCESS: 'Operação realizada com sucesso!',
  TOAST_ERROR: 'Erro crítico: Falha na conexão com o servidor',
  TOAST_WARNING: 'Atenção: Sua sessão expirará em 5 minutos',
  TOAST_INFO: 'Informação importante para o usuário',
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
  CONNECTION_ERROR: 'Erro de conexão. Tentando reconectar...',
  DATA_SAVED: 'Dados salvos com sucesso',
  PRODUCT_ADDED: 'Produto adicionado ao carrinho',
  ORDER_CONFIRMED: 'Pedido confirmado com sucesso',
  PAYMENT_PROCESSED: 'Pagamento processado',
} as const;
