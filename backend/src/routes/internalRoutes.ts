/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as dashboardController from '@/api/internal/dashboard/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Dashboard routes - /api/internal/dashboard
 */
router.get('/dashboard', dashboardController.getDataHandler);
router.put('/dashboard/preferences', dashboardController.updatePreferencesHandler);
router.post('/dashboard/preferences/reset', dashboardController.resetPreferencesHandler);

export default router;
