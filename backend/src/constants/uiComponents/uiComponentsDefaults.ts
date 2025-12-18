/**
 * @summary
 * Default values and constants for UI Components feature.
 * Contains configuration for modals, tooltips, dropdowns, drag-and-drop,
 * sliders, calendar, tabs, accordions, and toast notifications.
 *
 * @module constants/uiComponents/uiComponentsDefaults
 */

/**
 * @interface UIComponentsDefaultsType
 * @description Default configuration values for UI components
 */
export const UI_COMPONENTS_DEFAULTS = {
  /** Modal z-index values */
  MODAL_Z_INDEX_PRIMARY: 1000,
  MODAL_Z_INDEX_SECONDARY: 1100,

  /** Tooltip delays in milliseconds */
  TOOLTIP_SHOW_DELAY: 500,
  TOOLTIP_HIDE_DELAY: 200,
  TOOLTIP_MAX_LENGTH: 200,

  /** Dropdown configuration */
  DROPDOWN_MAX_ITEMS: 10,
  DROPDOWN_MIN_ITEMS: 1,

  /** Kanban board configuration */
  KANBAN_MAX_CARDS: 100,
  KANBAN_INITIAL_CARDS: 3,

  /** Slider configuration */
  SLIDER_TEMP_MIN: -10,
  SLIDER_TEMP_MAX: 40,
  SLIDER_TEMP_STEP: 1,
  SLIDER_PRICE_MIN: 0,
  SLIDER_PRICE_MAX: 1000,
  SLIDER_PRICE_STEP: 10,

  /** Calendar configuration */
  CALENDAR_SELECTION_MODE: 'range' as const,

  /** Tabs configuration */
  TAB_HISTORY_LOADING_DELAY: 3000,
  TAB_TOTAL_TABS: 3,

  /** Accordion configuration */
  ACCORDION_TOTAL_ITEMS: 3,

  /** Toast notification timeouts */
  TOAST_SUCCESS_TIMEOUT: 4000,
  TOAST_WARNING_TIMEOUT: 6000,
  TOAST_ERROR_TIMEOUT: 0, // No auto-dismiss
} as const;

export type UIComponentsDefaultsType = typeof UI_COMPONENTS_DEFAULTS;

/**
 * @interface UIComponentsEnums
 * @description Allowed values for UI component enumerations
 */
export const UI_COMPONENTS_ENUMS = {
  TOOLTIP_POSITIONS: ['top', 'bottom', 'left', 'right'] as const,
  DROPDOWN_TRIGGERS: ['click', 'hover'] as const,
  KANBAN_COLUMNS: ['todo', 'progress', 'done'] as const,
  SLIDER_TYPES: ['single', 'range'] as const,
  TAB_IDS: ['profile', 'security', 'history'] as const,
  TOAST_TYPES: ['success', 'error', 'warning'] as const,
} as const;

/**
 * @interface KanbanCardDefaults
 * @description Default Kanban cards configuration
 */
export const KANBAN_CARD_DEFAULTS = [
  {
    id: 'card-1',
    title: 'Implementar Login',
    description: 'Implementar sistema de autenticação de usuários',
  },
  {
    id: 'card-2',
    title: 'Criar Dashboard',
    description: 'Desenvolver painel principal com métricas',
  },
  {
    id: 'card-3',
    title: 'Testar API',
    description: 'Executar testes automatizados da API REST',
  },
] as const;

/**
 * @interface TooltipDefaults
 * @description Default tooltip configurations
 */
export const TOOLTIP_DEFAULTS = [
  { id: 'tooltip-1', text: 'Botão Superior', position: 'bottom' as const },
  { id: 'tooltip-2', text: 'Botão Inferior', position: 'top' as const },
  { id: 'tooltip-3', text: 'Botão Esquerdo', position: 'right' as const },
  { id: 'tooltip-4', text: 'Botão Direito', position: 'left' as const },
] as const;

/**
 * @interface AccordionDefaults
 * @description Default FAQ accordion items
 */
export const ACCORDION_DEFAULTS = [
  {
    id: 'faq-item-1',
    question: 'Como posso alterar minha senha?',
    answer:
      'Acesse Configurações > Segurança > Alterar Senha. Digite sua senha atual e a nova senha duas vezes para confirmar.',
  },
  {
    id: 'faq-item-2',
    question: 'Como ativar a autenticação de dois fatores?',
    answer:
      'Vá em Configurações > Segurança > Autenticação de Dois Fatores. Escaneie o código QR com seu aplicativo autenticador e digite o código de verificação.',
  },
  {
    id: 'faq-item-3',
    question: 'Como recuperar minha conta bloqueada?',
    answer:
      'Entre em contato com o suporte através do email suporte@exemplo.com informando seu nome de usuário e o motivo do bloqueio.',
  },
] as const;

/**
 * @interface ToastDefaults
 * @description Default toast notification messages
 */
export const TOAST_DEFAULTS = {
  success: 'Operação realizada com sucesso!',
  error: 'Erro crítico: Falha na conexão com o servidor',
  warning: 'Atenção: Sua sessão expirará em 5 minutos',
} as const;
