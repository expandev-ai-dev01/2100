/**
 * @summary
 * Business logic for UI Components feature.
 * Manages state and interactions for all UI components.
 *
 * @module services/uiComponents/uiComponentsService
 */

import { uiComponentsStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  UIComponentsState,
  KanbanCard,
  ToastNotification,
  TabItem,
  AccordionItem,
} from './uiComponentsTypes';
import {
  modalActionSchema,
  tooltipActionSchema,
  dropdownActionSchema,
  kanbanMoveCardSchema,
  sliderUpdateSchema,
  calendarSelectSchema,
  tabSwitchSchema,
  accordionToggleSchema,
  toastCreateSchema,
  toastDismissSchema,
} from './uiComponentsValidation';

/**
 * @summary
 * Gets complete UI components state
 */
export async function getUIComponentsState(): Promise<UIComponentsState> {
  return uiComponentsStore.getState();
}

/**
 * @summary
 * Handles modal actions (open/close)
 */
export async function handleModalAction(action: unknown): Promise<{ success: boolean }> {
  const validation = modalActionSchema.safeParse(action);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid modal action',
      400,
      validation.error.errors
    );
  }

  const { action: modalAction } = validation.data;
  uiComponentsStore.updateModalState(modalAction);

  return { success: true };
}

/**
 * @summary
 * Handles tooltip actions (show/hide)
 */
export async function handleTooltipAction(action: unknown): Promise<{ success: boolean }> {
  const validation = tooltipActionSchema.safeParse(action);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid tooltip action',
      400,
      validation.error.errors
    );
  }

  // Tooltip state is managed client-side, this endpoint validates the action
  return { success: true };
}

/**
 * @summary
 * Handles dropdown actions (open/close/toggle)
 */
export async function handleDropdownAction(action: unknown): Promise<{ success: boolean }> {
  const validation = dropdownActionSchema.safeParse(action);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid dropdown action',
      400,
      validation.error.errors
    );
  }

  const { dropdownId, action: dropdownAction } = validation.data;
  uiComponentsStore.updateDropdownState(dropdownId, dropdownAction);

  return { success: true };
}

/**
 * @summary
 * Moves a Kanban card to a new column/position
 */
export async function moveKanbanCard(moveData: unknown): Promise<KanbanCard> {
  const validation = kanbanMoveCardSchema.safeParse(moveData);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid move data', 400, validation.error.errors);
  }

  const { cardId, targetColumnId, targetPosition } = validation.data;
  const updatedCard = uiComponentsStore.moveKanbanCard(cardId, targetColumnId, targetPosition);

  if (!updatedCard) {
    throw new ServiceError('NOT_FOUND', 'Card not found', 404);
  }

  return updatedCard;
}

/**
 * @summary
 * Updates slider value(s)
 */
export async function updateSlider(updateData: unknown): Promise<{ success: boolean }> {
  const validation = sliderUpdateSchema.safeParse(updateData);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid slider data', 400, validation.error.errors);
  }

  const { sliderId, value, rangeMin, rangeMax } = validation.data;
  uiComponentsStore.updateSlider(sliderId, { value, rangeMin, rangeMax });

  return { success: true };
}

/**
 * @summary
 * Selects date range in calendar
 */
export async function selectCalendarDates(dateData: unknown): Promise<{ success: boolean }> {
  const validation = calendarSelectSchema.safeParse(dateData);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid date selection',
      400,
      validation.error.errors
    );
  }

  const { startDate, endDate } = validation.data;

  // Validate date order if both provided
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new ServiceError('VALIDATION_ERROR', 'Start date must be before end date', 400);
  }

  uiComponentsStore.updateCalendar({ startDate, endDate });

  return { success: true };
}

/**
 * @summary
 * Switches active tab
 */
export async function switchTab(tabData: unknown): Promise<TabItem> {
  const validation = tabSwitchSchema.safeParse(tabData);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid tab ID', 400, validation.error.errors);
  }

  const { tabId } = validation.data;
  const activeTab = uiComponentsStore.switchTab(tabId);

  return activeTab;
}

/**
 * @summary
 * Toggles accordion item
 */
export async function toggleAccordionItem(itemData: unknown): Promise<AccordionItem> {
  const validation = accordionToggleSchema.safeParse(itemData);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid item ID', 400, validation.error.errors);
  }

  const { itemId } = validation.data;
  const item = uiComponentsStore.toggleAccordionItem(itemId);

  if (!item) {
    throw new ServiceError('NOT_FOUND', 'Accordion item not found', 404);
  }

  return item;
}

/**
 * @summary
 * Creates a toast notification
 */
export async function createToast(toastData: unknown): Promise<ToastNotification> {
  const validation = toastCreateSchema.safeParse(toastData);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid toast type', 400, validation.error.errors);
  }

  const { type } = validation.data;
  const toast = uiComponentsStore.createToast(type);

  return toast;
}

/**
 * @summary
 * Dismisses a toast notification
 */
export async function dismissToast(dismissData: unknown): Promise<{ success: boolean }> {
  const validation = toastDismissSchema.safeParse(dismissData);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid notification ID',
      400,
      validation.error.errors
    );
  }

  const { notificationId } = validation.data;
  const dismissed = uiComponentsStore.dismissToast(notificationId);

  if (!dismissed) {
    throw new ServiceError('NOT_FOUND', 'Toast notification not found', 404);
  }

  return { success: true };
}
