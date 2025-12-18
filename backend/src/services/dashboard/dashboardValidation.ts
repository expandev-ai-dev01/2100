/**
 * @summary
 * Validation schemas for Dashboard feature.
 * Uses Zod for runtime validation of preferences and parameters.
 *
 * @module services/dashboard/dashboardValidation
 */

import { z } from 'zod';

/**
 * Schema for validating widget preferences update
 */
export const preferencesSchema = z.object({
  metrics: z.object({
    totalUsers: z.boolean(),
    monthlySales: z.boolean(),
    registeredProducts: z.boolean(),
    pendingOrders: z.boolean(),
  }),
  charts: z.object({
    sales: z.boolean(),
    categories: z.boolean(),
    users: z.boolean(),
  }),
  sections: z.object({
    activities: z.boolean(),
    notifications: z.boolean(),
    quickAccess: z.boolean(),
  }),
});

/**
 * Schema for dashboard filter parameters
 */
export const filterSchema = z.object({
  period: z.enum(['last_month', 'last_3_months', 'last_year', 'custom']).optional(),
  category: z.string().optional(),
  status: z.string().optional(),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type FilterInput = z.infer<typeof filterSchema>;
