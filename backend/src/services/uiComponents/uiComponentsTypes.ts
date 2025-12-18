/**
 * @summary
 * Type definitions for UI Components feature.
 * Defines structures for all interactive UI components.
 *
 * @module services/uiComponents/uiComponentsTypes
 */

/**
 * @interface ModalState
 * @description State management for modal components
 */
export interface ModalState {
  modalPrimaryId: string;
  modalSecondaryId: string;
  zIndexPrimary: number;
  zIndexSecondary: number;
  focusTrapEnabled: boolean;
  primaryOpen: boolean;
  secondaryOpen: boolean;
}

/**
 * @interface TooltipConfig
 * @description Configuration for tooltip component
 */
export interface TooltipConfig {
  tooltipId: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  showDelay: number;
  hideDelay: number;
  elementText: string;
}

/**
 * @interface DropdownState
 * @description State for dropdown menu component
 */
export interface DropdownState {
  dropdownId: string;
  level: number;
  parentDropdownId?: string;
  triggerEvent: 'click' | 'hover';
  menuItems: DropdownMenuItem[];
  isOpen: boolean;
}

/**
 * @interface DropdownMenuItem
 * @description Individual dropdown menu item
 */
export interface DropdownMenuItem {
  id: string;
  label: string;
  action?: string;
  hasSubmenu?: boolean;
  submenu?: DropdownMenuItem[];
}

/**
 * @interface KanbanCard
 * @description Kanban card structure
 */
export interface KanbanCard {
  cardId: string;
  title: string;
  description: string;
  position: number;
  columnId: 'todo' | 'progress' | 'done';
  isDragging: boolean;
}

/**
 * @interface KanbanBoard
 * @description Complete Kanban board state
 */
export interface KanbanBoard {
  boardId: string;
  columns: KanbanColumn[];
  cards: KanbanCard[];
}

/**
 * @interface KanbanColumn
 * @description Kanban column configuration
 */
export interface KanbanColumn {
  columnId: 'todo' | 'progress' | 'done';
  title: string;
}

/**
 * @interface SliderConfig
 * @description Slider component configuration
 */
export interface SliderConfig {
  sliderId: string;
  type: 'single' | 'range';
  minValue: number;
  maxValue: number;
  stepSize: number;
  currentValue?: number;
  rangeMin?: number;
  rangeMax?: number;
  displayUnit: string;
}

/**
 * @interface CalendarState
 * @description Calendar component state
 */
export interface CalendarState {
  calendarId: string;
  selectedStartDate?: string;
  selectedEndDate?: string;
  currentMonth: number;
  currentYear: number;
  disabledDates: string[];
  selectionMode: 'range';
}

/**
 * @interface TabConfig
 * @description Tab component configuration
 */
export interface TabConfig {
  tabContainerId: string;
  tabs: TabItem[];
}

/**
 * @interface TabItem
 * @description Individual tab configuration
 */
export interface TabItem {
  tabId: 'profile' | 'security' | 'history';
  title: string;
  isActive: boolean;
  hasDynamicContent: boolean;
  loadingDelay?: number;
  contentLoaded: boolean;
  content: string;
}

/**
 * @interface AccordionState
 * @description Accordion component state
 */
export interface AccordionState {
  accordionId: string;
  items: AccordionItem[];
}

/**
 * @interface AccordionItem
 * @description Individual accordion item
 */
export interface AccordionItem {
  itemId: string;
  question: string;
  answer: string;
  isExpanded: boolean;
  order: number;
}

/**
 * @interface ToastNotification
 * @description Toast notification structure
 */
export interface ToastNotification {
  notificationId: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  autoDismiss: boolean;
  dismissTimeout?: number;
  isVisible: boolean;
  hasCloseButton: boolean;
  triggerButtonId: string;
  createdAt: string;
}

/**
 * @interface UIComponentsState
 * @description Complete UI components state
 */
export interface UIComponentsState {
  modals: ModalState;
  tooltips: TooltipConfig[];
  dropdowns: DropdownState[];
  kanban: KanbanBoard;
  sliders: SliderConfig[];
  calendar: CalendarState;
  tabs: TabConfig;
  accordion: AccordionState;
  toasts: ToastNotification[];
}
