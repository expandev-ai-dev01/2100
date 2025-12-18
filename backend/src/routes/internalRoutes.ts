/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as dashboardController from '@/api/internal/dashboard/controller';
import * as complexFormController from '@/api/internal/complex-form/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Dashboard routes - /api/internal/dashboard
 */
router.get('/dashboard', dashboardController.getDataHandler);
router.put('/dashboard/preferences', dashboardController.updatePreferencesHandler);
router.post('/dashboard/preferences/reset', dashboardController.resetPreferencesHandler);

/**
 * @rule {be-route-configuration}
 * Complex Form routes - /api/internal/complex-form
 */
router.post('/complex-form/start', complexFormController.startHandler);
router.post('/complex-form/save', complexFormController.saveHandler);
router.post('/complex-form/validate', complexFormController.validateStepHandler);
router.post('/complex-form/submit', complexFormController.submitHandler);
router.get('/complex-form/cep/:cep', complexFormController.cepHandler);
router.post('/complex-form/upload', complexFormController.uploadHandler);

export default router;
