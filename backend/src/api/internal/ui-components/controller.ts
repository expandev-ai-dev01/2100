/**
 * @summary
 * API controller for UI Components feature.
 * Handles all interactive UI component endpoints.
 *
 * @module api/internal/ui-components/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  getUIComponentsState,
  handleModalAction,
  handleTooltipAction,
  handleDropdownAction,
  moveKanbanCard,
  updateSlider,
  selectCalendarDates,
  switchTab,
  toggleAccordionItem,
  createToast,
  dismissToast,
} from '@/services/uiComponents';

/**
 * @api {get} /api/internal/ui-components Get UI Components State
 * @apiName GetUIComponentsState
 * @apiGroup UIComponents
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Complete UI components state
 * @apiSuccess {Object} data.modals Modal state
 * @apiSuccess {Array} data.tooltips Tooltip configurations
 * @apiSuccess {Array} data.dropdowns Dropdown states
 * @apiSuccess {Object} data.kanban Kanban board state
 * @apiSuccess {Array} data.sliders Slider configurations
 * @apiSuccess {Object} data.calendar Calendar state
 * @apiSuccess {Object} data.tabs Tab configuration
 * @apiSuccess {Object} data.accordion Accordion state
 * @apiSuccess {Array} data.toasts Active toast notifications
 */
export async function getStateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await getUIComponentsState();
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
 * @api {post} /api/internal/ui-components/modal Modal Action
 * @apiName ModalAction
 * @apiGroup UIComponents
 *
 * @apiBody {String} action Action type (open_primary | open_secondary | close_primary | close_secondary)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Action result
 */
export async function modalActionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await handleModalAction(req.body);
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
 * @api {post} /api/internal/ui-components/tooltip Tooltip Action
 * @apiName TooltipAction
 * @apiGroup UIComponents
 *
 * @apiBody {String} tooltipId Tooltip identifier
 * @apiBody {String} action Action type (show | hide)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Action result
 */
export async function tooltipActionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await handleTooltipAction(req.body);
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
 * @api {post} /api/internal/ui-components/dropdown Dropdown Action
 * @apiName DropdownAction
 * @apiGroup UIComponents
 *
 * @apiBody {String} dropdownId Dropdown identifier
 * @apiBody {String} action Action type (open | close | toggle)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Action result
 */
export async function dropdownActionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await handleDropdownAction(req.body);
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
 * @api {post} /api/internal/ui-components/kanban/move Move Kanban Card
 * @apiName MoveKanbanCard
 * @apiGroup UIComponents
 *
 * @apiBody {String} cardId Card identifier
 * @apiBody {String} targetColumnId Target column (todo | progress | done)
 * @apiBody {Number} targetPosition Target position in column
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Updated card
 * @apiSuccess {String} data.cardId Card identifier
 * @apiSuccess {String} data.title Card title
 * @apiSuccess {String} data.description Card description
 * @apiSuccess {Number} data.position Card position
 * @apiSuccess {String} data.columnId Column identifier
 * @apiSuccess {Boolean} data.isDragging Dragging state
 */
export async function moveKanbanCardHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await moveKanbanCard(req.body);
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
 * @api {post} /api/internal/ui-components/slider Update Slider
 * @apiName UpdateSlider
 * @apiGroup UIComponents
 *
 * @apiBody {String} sliderId Slider identifier
 * @apiBody {Number} [value] Single value (for single slider)
 * @apiBody {Number} [rangeMin] Range minimum (for range slider)
 * @apiBody {Number} [rangeMax] Range maximum (for range slider)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Action result
 */
export async function updateSliderHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await updateSlider(req.body);
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
 * @api {post} /api/internal/ui-components/calendar Select Calendar Dates
 * @apiName SelectCalendarDates
 * @apiGroup UIComponents
 *
 * @apiBody {String} [startDate] Start date (ISO 8601)
 * @apiBody {String} [endDate] End date (ISO 8601)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Action result
 */
export async function selectCalendarDatesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await selectCalendarDates(req.body);
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
 * @api {post} /api/internal/ui-components/tab Switch Tab
 * @apiName SwitchTab
 * @apiGroup UIComponents
 *
 * @apiBody {String} tabId Tab identifier (profile | security | history)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Active tab
 * @apiSuccess {String} data.tabId Tab identifier
 * @apiSuccess {String} data.title Tab title
 * @apiSuccess {Boolean} data.isActive Active state
 * @apiSuccess {Boolean} data.hasDynamicContent Dynamic content flag
 * @apiSuccess {Boolean} data.contentLoaded Content loaded flag
 * @apiSuccess {String} data.content Tab content
 */
export async function switchTabHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await switchTab(req.body);
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
 * @api {post} /api/internal/ui-components/accordion Toggle Accordion Item
 * @apiName ToggleAccordionItem
 * @apiGroup UIComponents
 *
 * @apiBody {String} itemId Item identifier
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Accordion item
 * @apiSuccess {String} data.itemId Item identifier
 * @apiSuccess {String} data.question Question text
 * @apiSuccess {String} data.answer Answer text
 * @apiSuccess {Boolean} data.isExpanded Expanded state
 * @apiSuccess {Number} data.order Display order
 */
export async function toggleAccordionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await toggleAccordionItem(req.body);
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
 * @api {post} /api/internal/ui-components/toast Create Toast
 * @apiName CreateToast
 * @apiGroup UIComponents
 *
 * @apiBody {String} type Toast type (success | error | warning)
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Toast notification
 * @apiSuccess {String} data.notificationId Notification identifier
 * @apiSuccess {String} data.type Toast type
 * @apiSuccess {String} data.message Toast message
 * @apiSuccess {Boolean} data.autoDismiss Auto-dismiss flag
 * @apiSuccess {Number} [data.dismissTimeout] Dismiss timeout in ms
 * @apiSuccess {Boolean} data.isVisible Visibility state
 * @apiSuccess {Boolean} data.hasCloseButton Close button flag
 * @apiSuccess {String} data.createdAt Creation timestamp
 */
export async function createToastHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await createToast(req.body);
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
 * @api {delete} /api/internal/ui-components/toast/:id Dismiss Toast
 * @apiName DismissToast
 * @apiGroup UIComponents
 *
 * @apiParam {String} id Notification identifier
 *
 * @apiSuccess {Boolean} success Success flag
 * @apiSuccess {Object} data Action result
 */
export async function dismissToastHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await dismissToast({ notificationId: req.params.id });
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
