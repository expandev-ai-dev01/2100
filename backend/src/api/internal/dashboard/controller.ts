/**
 * @summary
 * API controller for Dashboard feature.
 * Handles requests for dashboard data and preference management.
 *
 * @module api/internal/dashboard/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  getDashboardData,
  updateWidgetPreferences,
  resetWidgetPreferences,
} from '@/services/dashboard';

/**
 * @api {get} /api/internal/dashboard Get Dashboard Data
 * @apiName GetDashboardData
 * @apiGroup Dashboard
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Dashboard data object
 * @apiSuccess {Object} data.metrics Key metrics
 * @apiSuccess {Object} data.charts Chart data
 * @apiSuccess {Object} data.activities Recent activities
 * @apiSuccess {Object} data.preferences User preferences
 */
export async function getDataHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Assuming auth middleware populates req.user (mocked for now if not present)
    // In a real scenario: const userId = (req as any).user?.id;
    const userId = 1; // Default to ID 1 for QA Lab simulation

    const data = await getDashboardData(userId);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/dashboard/preferences Update Preferences
 * @apiName UpdateDashboardPreferences
 * @apiGroup Dashboard
 *
 * @apiBody {Object} metrics Metrics visibility
 * @apiBody {Object} charts Charts visibility
 * @apiBody {Object} sections Sections visibility
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Updated preferences
 */
export async function updatePreferencesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Default to ID 1 for QA Lab simulation

    const data = await updateWidgetPreferences(userId, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/dashboard/preferences/reset Reset Preferences
 * @apiName ResetDashboardPreferences
 * @apiGroup Dashboard
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Default preferences
 */
export async function resetPreferencesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Default to ID 1 for QA Lab simulation

    const data = await resetWidgetPreferences(userId);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
