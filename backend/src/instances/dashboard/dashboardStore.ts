/**
 * @summary
 * In-memory store for Dashboard data simulation.
 * Manages simulated state for metrics, charts, and user preferences.
 * Acts as a mock database for the QA Lab environment.
 *
 * @module instances/dashboard/dashboardStore
 */

import {
  DashboardMetrics,
  DashboardCharts,
  DashboardActivities,
  NotificationItem,
  WidgetPreferences,
  ActivityItem,
} from '@/services/dashboard/dashboardTypes';
import { DASHBOARD_DEFAULTS, DASHBOARD_CATEGORIES } from '@/constants/dashboard';

class DashboardStore {
  private preferences: Map<number, WidgetPreferences> = new Map();
  private metrics: DashboardMetrics;
  private notifications: Map<number, NotificationItem[]> = new Map();

  constructor() {
    // Initialize with some baseline simulated data
    this.metrics = {
      totalUsers: 1250,
      monthlySales: 45230.5,
      registeredProducts: 342,
      pendingOrders: 15,
    };
  }

  /**
   * Get user preferences or default if not set
   */
  getPreferences(userId: number): WidgetPreferences {
    return this.preferences.get(userId) || DASHBOARD_DEFAULTS.VISIBILITY;
  }

  /**
   * Save user preferences
   */
  savePreferences(userId: number, prefs: WidgetPreferences): WidgetPreferences {
    this.preferences.set(userId, prefs);
    return prefs;
  }

  /**
   * Get simulated metrics (slightly randomized to show "live" updates)
   */
  getMetrics(): DashboardMetrics {
    // Simulate small changes
    const randomChange = () => Math.floor(Math.random() * 3) - 1; // -1, 0, or 1

    this.metrics.totalUsers += Math.max(0, randomChange());
    this.metrics.pendingOrders = Math.max(0, this.metrics.pendingOrders + randomChange());

    // Simulate sales increase occasionally
    if (Math.random() > 0.7) {
      this.metrics.monthlySales += Math.random() * 100;
    }

    return { ...this.metrics };
  }

  /**
   * Get simulated chart data
   */
  getCharts(): DashboardCharts {
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    // Sales Chart (Last 12 months)
    const sales = months.map((month) => ({
      label: month,
      value: Math.floor(Math.random() * 50000) + 10000,
    }));

    // Categories Chart
    const categories = DASHBOARD_CATEGORIES.map((cat) => ({
      label: cat,
      value: Math.floor(Math.random() * 30) + 5,
    }));
    // Normalize to 100%
    const total = categories.reduce((acc, curr) => acc + curr.value, 0);
    categories.forEach((c) => (c.value = Number(((c.value / total) * 100).toFixed(1))));

    // Users Evolution
    let currentUserCount = 800;
    const users = months.slice(6).map((month) => {
      currentUserCount += Math.floor(Math.random() * 50) + 10;
      return {
        label: month,
        value: currentUserCount,
      };
    });

    return { sales, categories, users };
  }

  /**
   * Get simulated activities
   */
  getActivities(): DashboardActivities {
    const generateActivity = (type: ActivityItem['type'], prefix: string): ActivityItem => ({
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: `${prefix} ${Math.floor(Math.random() * 1000)}`,
      description: 'Activity description details',
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
    });

    return {
      recentLogins: Array(5)
        .fill(null)
        .map(() => generateActivity('login', 'User Login')),
      newRegistrations: Array(5)
        .fill(null)
        .map(() => generateActivity('registration', 'New User')),
      recentOrders: Array(5)
        .fill(null)
        .map(() => generateActivity('order', 'Order #')),
    };
  }

  /**
   * Get notifications for user
   */
  getNotifications(userId: number): NotificationItem[] {
    if (!this.notifications.has(userId)) {
      // Generate default notifications for new users
      const defaults: NotificationItem[] = [
        {
          id: '1',
          title: 'Bem-vindo ao Laboratório QA',
          message: 'Explore as funcionalidades do dashboard.',
          type: 'info',
          read: false,
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Backup Realizado',
          message: 'O backup do sistema foi concluído com sucesso.',
          type: 'success',
          read: false,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      this.notifications.set(userId, defaults);
    }
    return this.notifications.get(userId) || [];
  }
}

export const dashboardStore = new DashboardStore();
