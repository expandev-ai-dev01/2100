/**
 * @summary
 * UI Components service for interactive demonstrations.
 * Handles API communication for component state management.
 *
 * @service uiComponentsService
 * @domain uiComponents
 */

import { authenticatedClient } from '@/core/lib/api';
import type { UIComponentsState, KanbanCard } from '../types/models';

export const uiComponentsService = {
  /**
   * Get initial UI components state.
   */
  async getState(): Promise<UIComponentsState> {
    const { data } = await authenticatedClient.get<UIComponentsState>('/ui-components');
    return data;
  },

  /**
   * Handle modal actions.
   */
  async modalAction(
    action: 'open_primary' | 'open_secondary' | 'close_primary' | 'close_secondary'
  ): Promise<void> {
    await authenticatedClient.post('/ui-components/modal', { action });
  },

  /**
   * Handle tooltip actions.
   */
  async tooltipAction(tooltipId: string, action: 'show' | 'hide'): Promise<void> {
    await authenticatedClient.post('/ui-components/tooltip', { tooltipId, action });
  },

  /**
   * Handle dropdown actions.
   */
  async dropdownAction(dropdownId: string, action: 'open' | 'close' | 'toggle'): Promise<void> {
    await authenticatedClient.post('/ui-components/dropdown', { dropdownId, action });
  },

  /**
   * Move Kanban card.
   */
  async moveKanbanCard(
    cardId: string,
    targetColumnId: 'todo' | 'progress' | 'done',
    targetPosition: number
  ): Promise<KanbanCard> {
    const { data } = await authenticatedClient.post<KanbanCard>('/ui-components/kanban/move', {
      cardId,
      targetColumnId,
      targetPosition,
    });
    return data;
  },

  /**
   * Update slider value.
   */
  async updateSlider(
    sliderId: string,
    value?: number,
    rangeMin?: number,
    rangeMax?: number
  ): Promise<void> {
    await authenticatedClient.post('/ui-components/slider', {
      sliderId,
      value,
      rangeMin,
      rangeMax,
    });
  },

  /**
   * Select calendar dates.
   */
  async selectCalendarDates(startDate?: string, endDate?: string): Promise<void> {
    await authenticatedClient.post('/ui-components/calendar', {
      startDate,
      endDate,
    });
  },

  /**
   * Switch tab.
   */
  async switchTab(tabId: string): Promise<void> {
    await authenticatedClient.post('/ui-components/tab', { tabId });
  },

  /**
   * Toggle accordion item.
   */
  async toggleAccordion(itemId: string): Promise<void> {
    await authenticatedClient.post('/ui-components/accordion', { itemId });
  },

  /**
   * Create toast notification.
   */
  async createToast(type: 'success' | 'error' | 'warning'): Promise<void> {
    await authenticatedClient.post('/ui-components/toast', { type });
  },

  /**
   * Dismiss toast notification.
   */
  async dismissToast(notificationId: string): Promise<void> {
    await authenticatedClient.delete(`/ui-components/toast/${notificationId}`);
  },
};
