/**
 * @summary
 * Business logic for Dashboard feature.
 * Handles data aggregation, simulation, and preference management.
 *
 * @module services/dashboard/dashboardService
 */

import { dashboardStore } from '@/instances';
import { ServiceError } from '@/utils';
import { DashboardDataResponse, WidgetPreferences, QuickLinkItem } from './dashboardTypes';
import { preferencesSchema } from './dashboardValidation';

/**
 * @summary
 * Retrieves complete dashboard data for a user.
 * Aggregates metrics, charts, activities, and applies user preferences.
 *
 * @function getDashboardData
 * @module services/dashboard
 *
 * @param {number} userId - The ID of the requesting user
 * @returns {Promise<DashboardDataResponse>} Aggregated dashboard data
 */
export async function getDashboardData(userId: number): Promise<DashboardDataResponse> {
  // In a real app, userId would be used to fetch specific data from DB
  // Here we use the store to get simulated/cached data

  const preferences = dashboardStore.getPreferences(userId);
  const metrics = dashboardStore.getMetrics();
  const charts = dashboardStore.getCharts();
  const activities = dashboardStore.getActivities();
  const notifications = dashboardStore.getNotifications(userId);

  // Quick links configuration (static for now, could be dynamic)
  const quickLinks: QuickLinkItem[] = [
    { id: 'prod', label: 'Cadastrar Produto', path: '/products/new', icon: 'plus-circle' },
    { id: 'orders', label: 'Ver Pedidos', path: '/orders', icon: 'shopping-cart' },
    { id: 'reports', label: 'Relatórios', path: '/reports', icon: 'bar-chart' },
    { id: 'settings', label: 'Configurações', path: '/settings', icon: 'settings' },
  ];

  return {
    metrics,
    charts,
    activities,
    notifications: {
      count: notifications.filter((n) => !n.read).length,
      list: notifications,
    },
    quickLinks,
    preferences,
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * @summary
 * Updates user's dashboard widget preferences.
 *
 * @function updateWidgetPreferences
 * @module services/dashboard
 *
 * @param {number} userId - The ID of the user
 * @param {unknown} newPreferences - The new preferences object
 * @returns {Promise<WidgetPreferences>} Updated preferences
 *
 * @throws {ServiceError} VALIDATION_ERROR if preferences format is invalid
 */
export async function updateWidgetPreferences(
  userId: number,
  newPreferences: unknown
): Promise<WidgetPreferences> {
  const validation = preferencesSchema.safeParse(newPreferences);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid preferences format',
      400,
      validation.error.errors
    );
  }

  const updated = dashboardStore.savePreferences(userId, validation.data);
  return updated;
}

/**
 * @summary
 * Resets user's dashboard preferences to default.
 *
 * @function resetWidgetPreferences
 * @module services/dashboard
 *
 * @param {number} userId - The ID of the user
 * @returns {Promise<WidgetPreferences>} Default preferences
 */
export async function resetWidgetPreferences(userId: number): Promise<WidgetPreferences> {
  // We can import defaults here to avoid circular dependency issues if any
  const { DASHBOARD_DEFAULTS } = await import('@/constants/dashboard');
  const defaults = DASHBOARD_DEFAULTS.VISIBILITY;

  const updated = dashboardStore.savePreferences(userId, defaults);
  return updated;
}
