/**
 * @summary
 * In-memory store for UI Components feature.
 * Manages state for all interactive UI components.
 *
 * @module instances/uiComponents/uiComponentsStore
 */

import {
  UIComponentsState,
  ModalState,
  TooltipConfig,
  DropdownState,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  SliderConfig,
  CalendarState,
  TabConfig,
  TabItem,
  AccordionState,
  AccordionItem,
  ToastNotification,
} from '@/services/uiComponents/uiComponentsTypes';
import {
  UI_COMPONENTS_DEFAULTS,
  KANBAN_CARD_DEFAULTS,
  TOOLTIP_DEFAULTS,
  ACCORDION_DEFAULTS,
  TOAST_DEFAULTS,
} from '@/constants/uiComponents';

class UIComponentsStore {
  private state: UIComponentsState;

  constructor() {
    this.state = this.initializeState();
  }

  private initializeState(): UIComponentsState {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Initialize modals
    const modals: ModalState = {
      modalPrimaryId: `modal-primary-${Date.now()}`,
      modalSecondaryId: `modal-secondary-${Date.now()}`,
      zIndexPrimary: UI_COMPONENTS_DEFAULTS.MODAL_Z_INDEX_PRIMARY,
      zIndexSecondary: UI_COMPONENTS_DEFAULTS.MODAL_Z_INDEX_SECONDARY,
      focusTrapEnabled: true,
      primaryOpen: false,
      secondaryOpen: false,
    };

    // Initialize tooltips
    const tooltips: TooltipConfig[] = TOOLTIP_DEFAULTS.map((t) => ({
      tooltipId: t.id,
      content: `Tooltip para ${t.text}`,
      position: t.position,
      showDelay: UI_COMPONENTS_DEFAULTS.TOOLTIP_SHOW_DELAY,
      hideDelay: UI_COMPONENTS_DEFAULTS.TOOLTIP_HIDE_DELAY,
      elementText: t.text,
    }));

    // Initialize dropdowns
    const dropdowns: DropdownState[] = [
      {
        dropdownId: 'dropdown-1-1',
        level: 1,
        triggerEvent: 'click',
        menuItems: [
          { id: 'item-1', label: 'Item 1', hasSubmenu: true },
          { id: 'item-2', label: 'Item 2', hasSubmenu: true },
          { id: 'item-3', label: 'Item 3' },
        ],
        isOpen: false,
      },
    ];

    // Initialize Kanban board
    const kanbanColumns: KanbanColumn[] = [
      { columnId: 'todo', title: 'A Fazer' },
      { columnId: 'progress', title: 'Em Progresso' },
      { columnId: 'done', title: 'Concluído' },
    ];

    const kanbanCards: KanbanCard[] = KANBAN_CARD_DEFAULTS.map((card, index) => ({
      cardId: card.id,
      title: card.title,
      description: card.description,
      position: index,
      columnId: 'todo',
      isDragging: false,
    }));

    const kanban: KanbanBoard = {
      boardId: 'kanban-board-001',
      columns: kanbanColumns,
      cards: kanbanCards,
    };

    // Initialize sliders
    const sliders: SliderConfig[] = [
      {
        sliderId: 'slider-temperature',
        type: 'single',
        minValue: UI_COMPONENTS_DEFAULTS.SLIDER_TEMP_MIN,
        maxValue: UI_COMPONENTS_DEFAULTS.SLIDER_TEMP_MAX,
        stepSize: UI_COMPONENTS_DEFAULTS.SLIDER_TEMP_STEP,
        currentValue: 20,
        displayUnit: '°C',
      },
      {
        sliderId: 'slider-price',
        type: 'range',
        minValue: UI_COMPONENTS_DEFAULTS.SLIDER_PRICE_MIN,
        maxValue: UI_COMPONENTS_DEFAULTS.SLIDER_PRICE_MAX,
        stepSize: UI_COMPONENTS_DEFAULTS.SLIDER_PRICE_STEP,
        rangeMin: 100,
        rangeMax: 500,
        displayUnit: 'R$',
      },
    ];

    // Initialize calendar
    const calendar: CalendarState = {
      calendarId: 'meeting-room-calendar',
      currentMonth,
      currentYear,
      disabledDates: this.calculateDisabledDates(currentYear, currentMonth),
      selectionMode: 'range',
    };

    // Initialize tabs
    const tabs: TabConfig = {
      tabContainerId: 'user-profile-tabs',
      tabs: [
        {
          tabId: 'profile',
          title: 'Perfil',
          isActive: true,
          hasDynamicContent: false,
          contentLoaded: true,
          content: 'Formulário com nome, email e telefone',
        },
        {
          tabId: 'security',
          title: 'Segurança',
          isActive: false,
          hasDynamicContent: false,
          contentLoaded: true,
          content: 'Opções de alteração de senha e 2FA',
        },
        {
          tabId: 'history',
          title: 'Histórico',
          isActive: false,
          hasDynamicContent: true,
          loadingDelay: UI_COMPONENTS_DEFAULTS.TAB_HISTORY_LOADING_DELAY,
          contentLoaded: false,
          content: 'Lista de atividades recentes do usuário',
        },
      ],
    };

    // Initialize accordion
    const accordion: AccordionState = {
      accordionId: 'faq-accordion',
      items: ACCORDION_DEFAULTS.map((item, index) => ({
        itemId: item.id,
        question: item.question,
        answer: item.answer,
        isExpanded: false,
        order: index + 1,
      })),
    };

    // Initialize toasts (empty initially)
    const toasts: ToastNotification[] = [];

    return {
      modals,
      tooltips,
      dropdowns,
      kanban,
      sliders,
      calendar,
      tabs,
      accordion,
      toasts,
    };
  }

  private calculateDisabledDates(year: number, month: number): string[] {
    const disabled: string[] = [];
    const now = new Date();
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();

      // Disable past dates and weekends
      if (date < now || dayOfWeek === 0 || dayOfWeek === 6) {
        disabled.push(date.toISOString().split('T')[0]);
      }
    }

    return disabled;
  }

  /**
   * Get complete state
   */
  getState(): UIComponentsState {
    return { ...this.state };
  }

  /**
   * Update modal state
   */
  updateModalState(
    action: 'open_primary' | 'open_secondary' | 'close_primary' | 'close_secondary'
  ): void {
    switch (action) {
      case 'open_primary':
        this.state.modals.primaryOpen = true;
        break;
      case 'open_secondary':
        this.state.modals.secondaryOpen = true;
        break;
      case 'close_primary':
        this.state.modals.primaryOpen = false;
        this.state.modals.secondaryOpen = false; // Close secondary too
        break;
      case 'close_secondary':
        this.state.modals.secondaryOpen = false;
        break;
    }
  }

  /**
   * Update dropdown state
   */
  updateDropdownState(dropdownId: string, action: 'open' | 'close' | 'toggle'): void {
    const dropdown = this.state.dropdowns.find((d) => d.dropdownId === dropdownId);
    if (!dropdown) return;

    switch (action) {
      case 'open':
        dropdown.isOpen = true;
        break;
      case 'close':
        dropdown.isOpen = false;
        break;
      case 'toggle':
        dropdown.isOpen = !dropdown.isOpen;
        break;
    }
  }

  /**
   * Move Kanban card
   */
  moveKanbanCard(
    cardId: string,
    targetColumnId: 'todo' | 'progress' | 'done',
    targetPosition: number
  ): KanbanCard | undefined {
    const card = this.state.kanban.cards.find((c) => c.cardId === cardId);
    if (!card) return undefined;

    // Update card
    card.columnId = targetColumnId;
    card.position = targetPosition;

    // Recalculate positions in target column
    const cardsInColumn = this.state.kanban.cards
      .filter((c) => c.columnId === targetColumnId)
      .sort((a, b) => a.position - b.position);

    cardsInColumn.forEach((c, index) => {
      c.position = index;
    });

    return card;
  }

  /**
   * Update slider
   */
  updateSlider(
    sliderId: string,
    values: { value?: number; rangeMin?: number; rangeMax?: number }
  ): void {
    const slider = this.state.sliders.find((s) => s.sliderId === sliderId);
    if (!slider) return;

    if (values.value !== undefined) slider.currentValue = values.value;
    if (values.rangeMin !== undefined) slider.rangeMin = values.rangeMin;
    if (values.rangeMax !== undefined) slider.rangeMax = values.rangeMax;
  }

  /**
   * Update calendar
   */
  updateCalendar(dates: { startDate?: string; endDate?: string }): void {
    if (dates.startDate) this.state.calendar.selectedStartDate = dates.startDate;
    if (dates.endDate) this.state.calendar.selectedEndDate = dates.endDate;
  }

  /**
   * Switch tab
   */
  switchTab(tabId: 'profile' | 'security' | 'history'): TabItem {
    // Deactivate all tabs
    this.state.tabs.tabs.forEach((t) => (t.isActive = false));

    // Activate target tab
    const tab = this.state.tabs.tabs.find((t) => t.tabId === tabId);
    if (tab) {
      tab.isActive = true;

      // Simulate loading for history tab
      if (tab.tabId === 'history' && !tab.contentLoaded) {
        setTimeout(() => {
          tab.contentLoaded = true;
        }, tab.loadingDelay || 0);
      }
    }

    return tab!;
  }

  /**
   * Toggle accordion item
   */
  toggleAccordionItem(itemId: string): AccordionItem | undefined {
    const item = this.state.accordion.items.find((i) => i.itemId === itemId);
    if (!item) return undefined;

    // Close all other items
    this.state.accordion.items.forEach((i) => {
      if (i.itemId !== itemId) i.isExpanded = false;
    });

    // Toggle target item
    item.isExpanded = !item.isExpanded;

    return item;
  }

  /**
   * Create toast notification
   */
  createToast(type: 'success' | 'error' | 'warning'): ToastNotification {
    const toast: ToastNotification = {
      notificationId: `toast-${type}-${Date.now()}`,
      type,
      message: TOAST_DEFAULTS[type],
      autoDismiss: type !== 'error',
      dismissTimeout:
        type === 'success'
          ? UI_COMPONENTS_DEFAULTS.TOAST_SUCCESS_TIMEOUT
          : type === 'warning'
          ? UI_COMPONENTS_DEFAULTS.TOAST_WARNING_TIMEOUT
          : 0,
      isVisible: true,
      hasCloseButton: type === 'error' || type === 'warning',
      triggerButtonId: `btn-toast-${type}`,
      createdAt: new Date().toISOString(),
    };

    this.state.toasts.push(toast);

    // Auto-dismiss if configured
    if (toast.autoDismiss && toast.dismissTimeout) {
      setTimeout(() => {
        this.dismissToast(toast.notificationId);
      }, toast.dismissTimeout);
    }

    return toast;
  }

  /**
   * Dismiss toast notification
   */
  dismissToast(notificationId: string): boolean {
    const index = this.state.toasts.findIndex((t) => t.notificationId === notificationId);
    if (index === -1) return false;

    this.state.toasts.splice(index, 1);
    return true;
  }
}

export const uiComponentsStore = new UIComponentsStore();
