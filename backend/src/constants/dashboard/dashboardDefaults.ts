/**
 * @summary
 * Default values and constants for Dashboard feature.
 * Contains default widget visibility configurations and simulation constants.
 *
 * @module constants/dashboard/dashboardDefaults
 */

/**
 * @interface DashboardDefaultsType
 * @description Default configuration values for dashboard widgets
 */
export const DASHBOARD_DEFAULTS = {
  /** Default visibility settings for widgets */
  VISIBILITY: {
    metrics: {
      totalUsers: true,
      monthlySales: true,
      registeredProducts: true,
      pendingOrders: true,
    },
    charts: {
      sales: true,
      categories: true,
      users: true,
    },
    sections: {
      activities: true,
      notifications: true,
      quickAccess: true,
    },
  },
  /** Refresh interval in seconds */
  REFRESH_INTERVAL: 30,
  /** Inactivity timeout in minutes */
  INACTIVITY_TIMEOUT: 5,
} as const;

/** Type representing the DASHBOARD_DEFAULTS constant */
export type DashboardDefaultsType = typeof DASHBOARD_DEFAULTS;

/**
 * @interface DashboardCategories
 * @description Product categories used in charts
 */
export const DASHBOARD_CATEGORIES = [
  'Eletrônicos',
  'Roupas',
  'Casa & Jardim',
  'Livros',
  'Esportes',
] as const;
