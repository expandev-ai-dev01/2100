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
import * as uiComponentsController from '@/api/internal/ui-components/controller';
import * as notificationController from '@/api/internal/notification/controller';

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

/**
 * @rule {be-route-configuration}
 * UI Components routes - /api/internal/ui-components
 */
router.get('/ui-components', uiComponentsController.getStateHandler);
router.post('/ui-components/modal', uiComponentsController.modalActionHandler);
router.post('/ui-components/tooltip', uiComponentsController.tooltipActionHandler);
router.post('/ui-components/dropdown', uiComponentsController.dropdownActionHandler);
router.post('/ui-components/kanban/move', uiComponentsController.moveKanbanCardHandler);
router.post('/ui-components/slider', uiComponentsController.updateSliderHandler);
router.post('/ui-components/calendar', uiComponentsController.selectCalendarDatesHandler);
router.post('/ui-components/tab', uiComponentsController.switchTabHandler);
router.post('/ui-components/accordion', uiComponentsController.toggleAccordionHandler);
router.post('/ui-components/toast', uiComponentsController.createToastHandler);
router.delete('/ui-components/toast/:id', uiComponentsController.dismissToastHandler);

/**
 * @rule {be-route-configuration}
 * Notification routes - /api/internal/notification
 */
router.get('/notification', notificationController.getStateHandler);
router.post('/notification/toast', notificationController.createToastHandler);
router.post('/notification/push', notificationController.createPushHandler);
router.post('/notification/modal', notificationController.createModalHandler);
router.patch('/notification/:id/read', notificationController.markAsReadHandler);
router.delete('/notification/:id', notificationController.dismissHandler);
router.get('/notification/preferences', notificationController.getPreferencesHandler);
router.put('/notification/preferences', notificationController.updatePreferencesHandler);
router.post('/notification/preferences/reset', notificationController.resetPreferencesHandler);
router.post('/notification/websocket/simulate', notificationController.simulateWebSocketHandler);
router.get('/notification/history', notificationController.getHistoryHandler);
router.delete('/notification/history', notificationController.clearHistoryHandler);

export default router;
