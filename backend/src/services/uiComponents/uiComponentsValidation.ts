/**
 * @summary
 * Validation schemas for UI Components feature.
 * Uses Zod for runtime validation of component states and actions.
 *
 * @module services/uiComponents/uiComponentsValidation
 */

import { z } from 'zod';
import { UI_COMPONENTS_ENUMS } from '@/constants/uiComponents';

/**
 * Modal validation schemas
 */
export const modalActionSchema = z.object({
  action: z.enum(['open_primary', 'open_secondary', 'close_primary', 'close_secondary']),
});

/**
 * Tooltip validation schemas
 */
export const tooltipActionSchema = z.object({
  tooltipId: z.string(),
  action: z.enum(['show', 'hide']),
});

/**
 * Dropdown validation schemas
 */
export const dropdownActionSchema = z.object({
  dropdownId: z.string(),
  action: z.enum(['open', 'close', 'toggle']),
});

/**
 * Kanban validation schemas
 */
export const kanbanMoveCardSchema = z.object({
  cardId: z.string(),
  targetColumnId: z.enum(UI_COMPONENTS_ENUMS.KANBAN_COLUMNS),
  targetPosition: z.number().int().min(0),
});

/**
 * Slider validation schemas
 */
export const sliderUpdateSchema = z.object({
  sliderId: z.string(),
  value: z.number().optional(),
  rangeMin: z.number().optional(),
  rangeMax: z.number().optional(),
});

/**
 * Calendar validation schemas
 */
export const calendarSelectSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

/**
 * Tab validation schemas
 */
export const tabSwitchSchema = z.object({
  tabId: z.enum(UI_COMPONENTS_ENUMS.TAB_IDS),
});

/**
 * Accordion validation schemas
 */
export const accordionToggleSchema = z.object({
  itemId: z.string(),
});

/**
 * Toast validation schemas
 */
export const toastCreateSchema = z.object({
  type: z.enum(UI_COMPONENTS_ENUMS.TOAST_TYPES),
});

export const toastDismissSchema = z.object({
  notificationId: z.string(),
});

/**
 * Type exports
 */
export type ModalActionInput = z.infer<typeof modalActionSchema>;
export type TooltipActionInput = z.infer<typeof tooltipActionSchema>;
export type DropdownActionInput = z.infer<typeof dropdownActionSchema>;
export type KanbanMoveCardInput = z.infer<typeof kanbanMoveCardSchema>;
export type SliderUpdateInput = z.infer<typeof sliderUpdateSchema>;
export type CalendarSelectInput = z.infer<typeof calendarSelectSchema>;
export type TabSwitchInput = z.infer<typeof tabSwitchSchema>;
export type AccordionToggleInput = z.infer<typeof accordionToggleSchema>;
export type ToastCreateInput = z.infer<typeof toastCreateSchema>;
export type ToastDismissInput = z.infer<typeof toastDismissSchema>;
