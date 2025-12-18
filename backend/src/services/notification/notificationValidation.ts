/**
 * @summary
 * Validation schemas for Notification System feature.
 * Uses Zod for runtime validation of notification data.
 *
 * @module services/notification/notificationValidation
 */

import { z } from 'zod';
import { NOTIFICATION_ENUMS, NOTIFICATION_DEFAULTS } from '@/constants/notification';

/**
 * Base notification schema
 */
export const baseNotificationSchema = z.object({
  message: z.string().min(1).max(200),
  position: z.enum(NOTIFICATION_ENUMS.POSITIONS).default(NOTIFICATION_DEFAULTS.DEFAULT_POSITION),
});

/**
 * Toast notification schema
 */
export const toastNotificationSchema = baseNotificationSchema.extend({
  type: z.literal('toast'),
  toastType: z.enum(NOTIFICATION_ENUMS.TOAST_TYPES),
});

/**
 * Push notification schema
 */
export const pushNotificationSchema = baseNotificationSchema.extend({
  type: z.literal('push'),
  title: z.string().min(1).max(50),
  body: z.string().min(1).max(150),
  icon: z.string().optional(),
  clickAction: z.string().optional(),
});

/**
 * Modal notification schema
 */
export const modalNotificationSchema = baseNotificationSchema.extend({
  type: z.literal('modal'),
  modalType: z.enum([
    'confirm_delete',
    'confirm_logout',
    'confirm_cancel',
    'confirm_action',
  ] as const),
  title: z.string().min(1).max(60),
  confirmButtonText: z.string().min(1).max(30),
  cancelButtonText: z.string().min(1).max(30).default('Cancelar'),
  dangerAction: z.boolean().default(false),
});

/**
 * Inline validation schema
 */
export const inlineValidationSchema = baseNotificationSchema.extend({
  type: z.literal('inline'),
  fieldId: z.string(),
  validationType: z.enum(['required', 'email', 'password', 'length', 'pattern', 'custom'] as const),
  validationState: z.enum(['error', 'success', 'warning', 'info'] as const),
  realTime: z.boolean().default(true),
});

/**
 * System notification schema
 */
export const systemNotificationSchema = z.object({
  systemEvent: z.enum(NOTIFICATION_ENUMS.SYSTEM_EVENTS),
  priority: z.enum(NOTIFICATION_ENUMS.PRIORITIES),
});

/**
 * Contextual notification schema
 */
export const contextualNotificationSchema = z.object({
  contextAction: z.enum(NOTIFICATION_ENUMS.CONTEXTUAL_ACTIONS),
  relatedEntity: z.string().optional(),
  actionButtons: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        action: z.string(),
      })
    )
    .optional(),
});

/**
 * Reminder notification schema
 */
export const reminderNotificationSchema = z.object({
  reminderType: z.enum(NOTIFICATION_ENUMS.REMINDER_TYPES),
  dueDate: z.string().datetime(),
  urgencyLevel: z.enum(NOTIFICATION_ENUMS.URGENCY_LEVELS),
  snoozeOptions: z.array(z.number()).optional(),
});

/**
 * Security alert schema
 */
export const securityAlertSchema = z.object({
  securityEvent: z.enum(NOTIFICATION_ENUMS.SECURITY_EVENTS),
  threatLevel: z.enum(NOTIFICATION_ENUMS.THREAT_LEVELS),
  locationInfo: z.string().optional(),
  recommendedActions: z.array(z.string()),
});

/**
 * Error scenario schema
 */
export const errorScenarioSchema = z.object({
  errorCategory: z.enum(NOTIFICATION_ENUMS.ERROR_CATEGORIES),
  errorCode: z.string(),
  errorMessage: z.string(),
  technicalDetails: z.string().optional(),
  suggestedActions: z.array(z.string()),
  retryAvailable: z.boolean().default(false),
});

/**
 * Loading indicator schema
 */
export const loadingIndicatorSchema = z.object({
  loaderType: z.enum(NOTIFICATION_ENUMS.LOADER_TYPES),
  progressPercentage: z.number().min(0).max(100).optional(),
  loadingText: z.string().optional(),
  size: z.enum(NOTIFICATION_ENUMS.LOADER_SIZES).default('medium'),
  overlay: z.boolean().default(false),
});

/**
 * Button state schema
 */
export const buttonStateSchema = z.object({
  buttonId: z.string(),
  currentState: z.enum(NOTIFICATION_ENUMS.BUTTON_STATES),
  loadingText: z.string().optional(),
  successText: z.string().optional(),
  errorText: z.string().optional(),
  autoReset: z.boolean().default(true),
});

/**
 * Notification preferences schema
 */
export const notificationPreferencesSchema = z.object({
  toastEnabled: z.boolean().default(true),
  pushEnabled: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),
  defaultPosition: z.enum(NOTIFICATION_ENUMS.POSITIONS).default('top-right'),
  animationPreferences: z
    .object({
      speed: z.enum(['slow', 'normal', 'fast'] as const).default('normal'),
      type: z.string(),
      reduceMotion: z.boolean().default(false),
    })
    .optional(),
  accessibilityMode: z.boolean().default(false),
});

/**
 * Type exports
 */
export type ToastNotificationInput = z.infer<typeof toastNotificationSchema>;
export type PushNotificationInput = z.infer<typeof pushNotificationSchema>;
export type ModalNotificationInput = z.infer<typeof modalNotificationSchema>;
export type InlineValidationInput = z.infer<typeof inlineValidationSchema>;
export type SystemNotificationInput = z.infer<typeof systemNotificationSchema>;
export type ContextualNotificationInput = z.infer<typeof contextualNotificationSchema>;
export type ReminderNotificationInput = z.infer<typeof reminderNotificationSchema>;
export type SecurityAlertInput = z.infer<typeof securityAlertSchema>;
export type ErrorScenarioInput = z.infer<typeof errorScenarioSchema>;
export type LoadingIndicatorInput = z.infer<typeof loadingIndicatorSchema>;
export type ButtonStateInput = z.infer<typeof buttonStateSchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
