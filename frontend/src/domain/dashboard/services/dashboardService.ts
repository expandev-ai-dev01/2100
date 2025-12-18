import { authenticatedClient } from '@/core/lib/api';
import type { DashboardData, WidgetVisibility } from '../types/models';

export const dashboardService = {
  async getDashboardData(filters?: Record<string, any>): Promise<DashboardData> {
    const { data } = await authenticatedClient.get<DashboardData>('/dashboard', {
      params: filters,
    });
    return data;
  },

  async updatePreferences(preferences: Partial<WidgetVisibility>): Promise<WidgetVisibility> {
    const { data } = await authenticatedClient.put<WidgetVisibility>(
      '/dashboard/preferences',
      preferences
    );
    return data;
  },

  async resetPreferences(): Promise<WidgetVisibility> {
    const { data } = await authenticatedClient.post<WidgetVisibility>(
      '/dashboard/preferences/reset'
    );
    return data;
  },
};
