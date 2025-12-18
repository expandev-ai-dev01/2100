/**
 * @summary
 * API controller for Complex Form feature.
 * Handles form lifecycle endpoints.
 *
 * @module api/internal/complex-form/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  startForm,
  saveDraft,
  validateStep,
  submitForm,
  getAddressByCep,
  uploadFile,
} from '@/services/complexForm';
import {
  saveDraftSchema,
  validateStepSchema,
  submitFormSchema,
} from '@/services/complexForm/complexFormValidation';

/**
 * @api {post} /api/internal/complex-form/start Start Form
 * @apiName StartComplexForm
 * @apiGroup ComplexForm
 */
export async function startHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const draft = await startForm(userId);
    res.json(successResponse(draft));
  } catch (error) {
    next(error);
  }
}

/**
 * @api {post} /api/internal/complex-form/save Save Draft
 * @apiName SaveComplexFormDraft
 * @apiGroup ComplexForm
 */
export async function saveHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const validation = saveDraftSchema.safeParse(req.body);

    if (!validation.success) {
      res
        .status(400)
        .json(errorResponse('Invalid request format', 'VALIDATION_ERROR', validation.error.errors));
      return;
    }

    const { draftId, step, data } = validation.data;
    const draft = await saveDraft(userId, draftId, step, data);
    res.json(successResponse(draft));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/complex-form/validate Validate Step
 * @apiName ValidateComplexFormStep
 * @apiGroup ComplexForm
 */
export async function validateStepHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validation = validateStepSchema.safeParse(req.body);

    if (!validation.success) {
      res
        .status(400)
        .json(errorResponse('Invalid request format', 'VALIDATION_ERROR', validation.error.errors));
      return;
    }

    const { step, data } = validation.data;
    const result = await validateStep(step, data);

    if (result.valid) {
      res.json(successResponse({ valid: true }));
    } else {
      res.status(422).json(errorResponse('Validation failed', 'VALIDATION_ERROR', result.errors));
    }
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/complex-form/submit Submit Form
 * @apiName SubmitComplexForm
 * @apiGroup ComplexForm
 */
export async function submitHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = 1; // Mock user ID
    const validation = submitFormSchema.safeParse(req.body);

    if (!validation.success) {
      res
        .status(400)
        .json(errorResponse('Invalid request format', 'VALIDATION_ERROR', validation.error.errors));
      return;
    }

    const { draftId } = validation.data;
    const submission = await submitForm(userId, draftId);
    res.json(successResponse(submission));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/complex-form/cep/:cep Lookup CEP
 * @apiName LookupCEP
 * @apiGroup ComplexForm
 */
export async function cepHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { cep } = req.params;
    const address = await getAddressByCep(cep);
    res.json(successResponse(address));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/complex-form/upload Upload File
 * @apiName UploadFile
 * @apiGroup ComplexForm
 */
export async function uploadHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const fileMetadata = await uploadFile(req.body);
    res.json(successResponse(fileMetadata));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
