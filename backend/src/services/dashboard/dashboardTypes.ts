/**
 * @summary
 * Type definitions for Dashboard feature.
 * Defines structures for metrics, charts, activities, and preferences.
 *
 * @module services/dashboard/dashboardTypes
 */

/**
 * @interface DashboardMetrics
 * @description Key performance indicators for the dashboard
 */
export interface DashboardMetrics {
  totalUsers: number;
  monthlySales: number;
  registeredProducts: number;
  pendingOrders: number;
}

/**
 * @interface ChartDataPoint
 * @description Generic data point for charts
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  extra?: any;
}

/**
 * @interface DashboardCharts
 * @description Data for dashboard charts
 */
export interface DashboardCharts {
  sales: ChartDataPoint[];
  categories: ChartDataPoint[];
  users: ChartDataPoint[];
}

/**
 * @interface ActivityItem
 * @description Represents a single activity event
 */
export interface ActivityItem {
  id: string;
  type: 'login' | 'registration' | 'order';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

/**
 * @interface DashboardActivities
 * @description Recent activities grouped by type
 */
export interface DashboardActivities {
  recentLogins: ActivityItem[];
  newRegistrations: ActivityItem[];
  recentOrders: ActivityItem[];
}

/**
 * @interface NotificationItem
 * @description User notification structure
 */
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

/**
 * @interface QuickLinkItem
 * @description Quick access link structure
 */
export interface QuickLinkItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

/**
 * @interface WidgetPreferences
 * @description User preferences for widget visibility
 */
export interface WidgetPreferences {
  metrics: {
    totalUsers: boolean;
    monthlySales: boolean;
    registeredProducts: boolean;
    pendingOrders: boolean;
  };
  charts: {
    sales: boolean;
    categories: boolean;
    users: boolean;
  };
  sections: {
    activities: boolean;
    notifications: boolean;
    quickAccess: boolean;
  };
}

/**
 * @interface DashboardDataResponse
 * @description Complete dashboard data payload
 */
export interface DashboardDataResponse {
  metrics: DashboardMetrics;
  charts: DashboardCharts;
  activities: DashboardActivities;
  notifications: {
    count: number;
    list: NotificationItem[];
  };
  quickLinks: QuickLinkItem[];
  preferences: WidgetPreferences;
  lastUpdate: string;
}
