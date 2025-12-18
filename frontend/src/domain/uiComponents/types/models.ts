/**
 * @summary
 * UI Components domain type definitions.
 * Defines entities for interactive component demonstrations.
 */

export interface ModalState {
  primaryOpen: boolean;
  secondaryOpen: boolean;
  primaryId: string;
  secondaryId: string;
  zIndexPrimary: number;
  zIndexSecondary: number;
}

export interface TooltipConfig {
  id: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  elementText: string;
  showDelay: number;
  hideDelay: number;
}

export interface DropdownState {
  id: string;
  level: number;
  parentId?: string;
  isOpen: boolean;
  items: Array<{
    id: string;
    label: string;
    hasSubmenu: boolean;
  }>;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  position: number;
  columnId: 'todo' | 'progress' | 'done';
  isDragging: boolean;
}

export interface KanbanBoard {
  id: string;
  columns: Array<{
    id: 'todo' | 'progress' | 'done';
    title: string;
    cards: KanbanCard[];
  }>;
}

export interface SliderConfig {
  id: string;
  type: 'single' | 'range';
  min: number;
  max: number;
  step: number;
  value?: number;
  rangeMin?: number;
  rangeMax?: number;
  unit: string;
}

export interface CalendarState {
  id: string;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  currentMonth: number;
  currentYear: number;
  disabledDates: Date[];
  selectionMode: 'range';
}

export interface TabConfig {
  id: string;
  title: string;
  isActive: boolean;
  hasDynamicContent: boolean;
  loadingDelay?: number;
  contentLoaded: boolean;
  content: string;
}

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
  order: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  autoDismiss: boolean;
  dismissTimeout?: number;
  isVisible: boolean;
  hasCloseButton: boolean;
  createdAt: string;
}

export interface UIComponentsState {
  modals: ModalState;
  tooltips: TooltipConfig[];
  dropdowns: DropdownState[];
  kanban: KanbanBoard;
  sliders: SliderConfig[];
  calendar: CalendarState;
  tabs: TabConfig[];
  accordion: AccordionItem[];
  toasts: ToastNotification[];
}
