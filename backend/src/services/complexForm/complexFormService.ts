/**
 * @summary
 * Business logic for Complex Form feature.
 * Handles form lifecycle, validation, and submission.
 *
 * @module services/complexForm/complexFormService
 */

import { complexFormStore } from '@/instances';
import { ServiceError } from '@/utils';
import { FormDraft, FormData, FormSubmission, CepResponse, FileMetadata } from './complexFormTypes';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  fullFormSchema,
  uploadFileSchema,
} from './complexFormValidation';
import { COMPLEX_FORM_DEFAULTS } from '@/constants/complexForm';
import { z } from 'zod';

/**
 * @summary
 * Starts a new form or retrieves existing draft for user.
 */
export async function startForm(userId: number): Promise<FormDraft> {
  // Check for existing draft
  const existingDraft = complexFormStore.getDraftByUserId(userId);
  if (existingDraft) {
    return existingDraft;
  }

  // Create new draft
  const newDraft: FormDraft = {
    id: Math.random().toString(36).substring(2, 15),
    userId,
    currentStep: 1,
    progressPercentage: 0,
    data: {},
    lastSaved: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  return complexFormStore.saveDraft(newDraft);
}

/**
 * @summary
 * Saves draft progress (auto-save).
 * Merges new data with existing data.
 */
export async function saveDraft(
  userId: number,
  draftId: string | undefined,
  step: number,
  data: any
): Promise<FormDraft> {
  let draft: FormDraft | undefined;

  if (draftId) {
    draft = complexFormStore.getDraft(draftId);
  }

  if (!draft) {
    // If no draft ID provided or not found, try finding by user or create new
    draft = await startForm(userId);
  }

  if (draft.userId !== userId) {
    throw new ServiceError('FORBIDDEN', 'Access denied to this draft', 403);
  }

  // Update data based on step
  const updatedData = { ...draft.data };
  switch (step) {
    case 1:
      updatedData.personal = { ...updatedData.personal, ...data };
      break;
    case 2:
      updatedData.address = { ...updatedData.address, ...data };
      break;
    case 3:
      updatedData.documents = data.documents;
      break;
    case 4:
      updatedData.confirmation = { ...updatedData.confirmation, ...data };
      break;
  }

  // Update draft
  draft.data = updatedData;
  draft.currentStep = step;
  draft.progressPercentage = Math.round(((step - 1) / COMPLEX_FORM_DEFAULTS.TOTAL_STEPS) * 100);
  draft.lastSaved = new Date().toISOString();

  return complexFormStore.saveDraft(draft);
}

/**
 * @summary
 * Validates data for a specific step.
 */
export async function validateStep(
  step: number,
  data: any
): Promise<{ valid: boolean; errors?: any }> {
  let schema: z.ZodSchema<any>;

  switch (step) {
    case 1:
      schema = step1Schema;
      break;
    case 2:
      schema = step2Schema;
      break;
    case 3:
      schema = step3Schema;
      break;
    case 4:
      schema = step4Schema;
      break;
    default:
      throw new ServiceError('BAD_REQUEST', 'Invalid step', 400);
  }

  const result = schema.safeParse(data);

  if (!result.success) {
    return { valid: false, errors: result.error.format() };
  }

  return { valid: true };
}

/**
 * @summary
 * Submits the final form.
 * Validates all steps and generates protocol.
 */
export async function submitForm(userId: number, draftId: string): Promise<FormSubmission> {
  const draft = complexFormStore.getDraft(draftId);

  if (!draft) {
    throw new ServiceError('NOT_FOUND', 'Draft not found', 404);
  }

  if (draft.userId !== userId) {
    throw new ServiceError('FORBIDDEN', 'Access denied', 403);
  }

  // Full validation
  const validation = fullFormSchema.safeParse(draft.data);

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Form has invalid data',
      400,
      validation.error.format()
    );
  }

  // Generate protocol
  const protocolNumber = Math.random().toString(36).substring(2, 14).toUpperCase();

  const submission: FormSubmission = {
    id: Math.random().toString(36).substring(2, 15),
    protocolNumber,
    userId,
    data: draft.data,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };

  // Save submission and delete draft
  complexFormStore.saveSubmission(submission);
  complexFormStore.deleteDraft(draftId);

  return submission;
}

/**
 * @summary
 * Mocks CEP lookup.
 */
export async function getAddressByCep(cep: string): Promise<CepResponse> {
  // Simple mock database
  const mockAddresses: Record<string, CepResponse> = {
    '01001-000': {
      cep: '01001-000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    },
    '20040-002': {
      cep: '20040-002',
      street: 'Rua da Assembleia',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ',
    },
    '70040-010': {
      cep: '70040-010',
      street: 'SBN Quadra 1',
      neighborhood: 'Asa Norte',
      city: 'Brasília',
      state: 'DF',
    },
  };

  const normalizedCep = cep.replace(/\D/g, '');
  // Try to find exact match or return a generic one for testing if valid format
  const found = Object.values(mockAddresses).find(
    (a) => a.cep.replace(/\D/g, '') === normalizedCep
  );

  if (found) return found;

  // If valid format but not in mock list, return generic for testing purposes
  if (normalizedCep.length === 8) {
    return {
      cep: cep,
      street: 'Rua Exemplo (Mock)',
      neighborhood: 'Bairro Exemplo',
      city: 'Cidade Exemplo',
      state: 'EX',
    };
  }

  throw new ServiceError('NOT_FOUND', 'CEP not found', 404);
}

/**
 * @summary
 * Handles file upload (mock).
 */
export async function uploadFile(fileData: unknown): Promise<FileMetadata> {
  const validation = uploadFileSchema.safeParse(fileData);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid file data', 400, validation.error.errors);
  }

  const { name, size, type } = validation.data;

  // Validate constraints
  if (size > COMPLEX_FORM_DEFAULTS.MAX_FILE_SIZE) {
    throw new ServiceError('VALIDATION_ERROR', 'File too large', 400);
  }

  // Mock storage
  const fileId = Math.random().toString(36).substring(2, 10);

  return {
    id: fileId,
    name,
    size,
    type,
    url: `https://storage.mock.com/files/${fileId}/${name}`,
    uploadedAt: new Date().toISOString(),
  };
}
