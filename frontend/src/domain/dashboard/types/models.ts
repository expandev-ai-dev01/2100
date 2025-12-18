export interface DashboardMetrics {
  total_users: number;
  monthly_sales: number;
  registered_products: number;
  pending_orders: number;
}

export interface SalesChartData {
  month: string;
  value: number;
}

export interface CategoryChartData {
  name: string;
  value: number;
}

export interface UserEvolutionData {
  month: string;
  users: number;
}

export interface DashboardCharts {
  sales: SalesChartData[];
  categories: CategoryChartData[];
  users_evolution: UserEvolutionData[];
}

export interface ActivityItem {
  id: string;
  type: 'login' | 'registration' | 'order';
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardActivities {
  recent_logins: ActivityItem[];
  new_registrations: ActivityItem[];
  recent_orders: ActivityItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardNotifications {
  count: number;
  list: NotificationItem[];
}

export interface WidgetVisibility {
  metrics: {
    total_users: boolean;
    monthly_sales: boolean;
    registered_products: boolean;
    pending_orders: boolean;
  };
  charts: {
    sales: boolean;
    categories: boolean;
    users_evolution: boolean;
  };
  sections: {
    activities: boolean;
    notifications: boolean;
    quick_access: boolean;
  };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  charts: DashboardCharts;
  activities: DashboardActivities;
  notifications: DashboardNotifications;
  preferences: WidgetVisibility;
}

export interface DashboardFilters {
  period: string;
  category?: string;
  order_status?: string;
  custom_date_start?: Date;
  custom_date_end?: Date;
}
