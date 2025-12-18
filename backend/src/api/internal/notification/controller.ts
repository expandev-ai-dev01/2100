/**
 * @summary
 * API controller for Notification System feature.
 * Handles all notification-related endpoints.
 *
 * @module api/internal/notification/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  getNotificationSystemState,
  createToastNotification,
  createPushNotification,
  createModalNotification,
  markNotificationAsRead,
  dismissNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  resetNotificationPreferences,
  simulateWebSocketNotification,
  getNotificationHistory,
  clearNotificationHistory,
} from '@/services/notification';

/**
 * @api {get} /api/internal/notification Get Notification System State
 * @apiName GetNotificationSystemState
 * @apiGroup Notification
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Complete notification system state
 * @apiSuccess {Array} data.activeNotifications Active notifications
 * @apiSuccess {Object} data.history Notification history
 * @apiSuccess {Object} data.preferences User preferences
 * @apiSuccess {Object} data.websocket WebSocket state
 */
export async function getStateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await getNotificationSystemState(userId);
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
 * @api {post} /api/internal/notification/toast Create Toast Notification
 * @apiName CreateToastNotification
 * @apiGroup Notification
 *
 * @apiBody {String} toastType Toast type (success | error | warning | info)
 * @apiBody {String} message Notification message
 * @apiBody {String} [position] Position (top-right | top-left | bottom-right | bottom-left)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Toast notification
 * @apiSuccess {String} data.id Notification ID
 * @apiSuccess {String} data.type Notification type (toast)
 * @apiSuccess {String} data.toastType Toast type
 * @apiSuccess {String} data.message Message
 * @apiSuccess {String} data.position Position
 * @apiSuccess {Number} data.duration Duration in ms
 * @apiSuccess {Boolean} data.autoClose Auto-close flag
 * @apiSuccess {Boolean} data.closeButton Close button flag
 * @apiSuccess {Number} data.stackPosition Stack position
 * @apiSuccess {String} data.animationType Animation type
 * @apiSuccess {Boolean} data.isRead Read status
 * @apiSuccess {String} data.createdAt Creation timestamp
 */
export async function createToastHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await createToastNotification(userId, req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/notification/push Create Push Notification
 * @apiName CreatePushNotification
 * @apiGroup Notification
 *
 * @apiBody {String} title Notification title
 * @apiBody {String} body Notification body
 * @apiBody {String} [icon] Icon URL
 * @apiBody {String} [clickAction] Click action URL
 * @apiBody {String} [position] Position
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Push notification
 */
export async function createPushHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await createPushNotification(userId, req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/notification/modal Create Modal Notification
 * @apiName CreateModalNotification
 * @apiGroup Notification
 *
 * @apiBody {String} modalType Modal type
 * @apiBody {String} title Modal title
 * @apiBody {String} message Modal message
 * @apiBody {String} confirmButtonText Confirm button text
 * @apiBody {String} [cancelButtonText] Cancel button text
 * @apiBody {Boolean} [dangerAction] Danger action flag
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Modal notification
 */
export async function createModalHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await createModalNotification(userId, req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {patch} /api/internal/notification/:id/read Mark Notification as Read
 * @apiName MarkNotificationAsRead
 * @apiGroup Notification
 *
 * @apiParam {String} id Notification ID
 *
 * @apiSuccess {Boolean} success Success flag
 */
export async function markAsReadHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await markNotificationAsRead(userId, req.params.id);
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
 * @api {delete} /api/internal/notification/:id Dismiss Notification
 * @apiName DismissNotification
 * @apiGroup Notification
 *
 * @apiParam {String} id Notification ID
 *
 * @apiSuccess {Boolean} success Success flag
 */
export async function dismissHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await dismissNotification(userId, req.params.id);
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
 * @api {get} /api/internal/notification/preferences Get Notification Preferences
 * @apiName GetNotificationPreferences
 * @apiGroup Notification
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data User preferences
 */
export async function getPreferencesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await getNotificationPreferences(userId);
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
 * @api {put} /api/internal/notification/preferences Update Notification Preferences
 * @apiName UpdateNotificationPreferences
 * @apiGroup Notification
 *
 * @apiBody {Boolean} [toastEnabled] Toast enabled
 * @apiBody {Boolean} [pushEnabled] Push enabled
 * @apiBody {Boolean} [soundEnabled] Sound enabled
 * @apiBody {String} [defaultPosition] Default position
 * @apiBody {Boolean} [accessibilityMode] Accessibility mode
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
    const userId = 1; // Mock user ID
    const data = await updateNotificationPreferences(userId, req.body);
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
 * @api {post} /api/internal/notification/preferences/reset Reset Notification Preferences
 * @apiName ResetNotificationPreferences
 * @apiGroup Notification
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
    const userId = 1; // Mock user ID
    const data = await resetNotificationPreferences(userId);
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
 * @api {post} /api/internal/notification/websocket/simulate Simulate WebSocket Notification
 * @apiName SimulateWebSocketNotification
 * @apiGroup Notification
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Simulated notification
 */
export async function simulateWebSocketHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await simulateWebSocketNotification(userId);
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
 * @api {get} /api/internal/notification/history Get Notification History
 * @apiName GetNotificationHistory
 * @apiGroup Notification
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Notification history
 * @apiSuccess {Array} data.notifications Notification list
 * @apiSuccess {Number} data.badgeCount Unread count
 */
export async function getHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await getNotificationHistory(userId);
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
 * @api {delete} /api/internal/notification/history Clear Notification History
 * @apiName ClearNotificationHistory
 * @apiGroup Notification
 *
 * @apiSuccess {Boolean} success Success flag
 */
export async function clearHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const data = await clearNotificationHistory(userId);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
