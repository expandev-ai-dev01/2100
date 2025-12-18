/**
 * @summary
 * Validation schemas for Complex Form feature.
 * Uses Zod for runtime validation of form steps.
 *
 * @module services/complexForm/complexFormValidation
 */

import { z } from 'zod';
import { COMPLEX_FORM_DEFAULTS, COMPLEX_FORM_ENUMS } from '@/constants/complexForm';
import { zDateString } from '@/utils/validation';

// --- Shared Validators ---
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const cepRegex = /^\d{5}-\d{3}$/;

// --- Step 1: Personal Data ---

const basePersonalSchema = z.object({
  person_type: z.enum(COMPLEX_FORM_ENUMS.PERSON_TYPES),
  user_category: z.enum(COMPLEX_FORM_ENUMS.USER_CATEGORIES),
  phone: z.string().regex(phoneRegex, 'Invalid phone format'),
  preferred_contact_time: z
    .string()
    .regex(timeRegex, 'Invalid time format')
    .refine((val) => {
      const [hours] = val.split(':').map(Number);
      return hours >= 8 && hours <= 18;
    }, 'Time must be between 08:00 and 18:00'),
});

const fisicaSchema = z.object({
  person_type: z.literal('fisica'),
  full_name: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces'),
  cpf: z.string().regex(cpfRegex, 'Invalid CPF format'),
  rg: z.string().min(7).max(12),
  birth_date: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return date < now && age >= 18;
  }, 'Must be at least 18 years old'),
  marital_status: z.enum(COMPLEX_FORM_ENUMS.MARITAL_STATUS),
});

const juridicaSchema = z.object({
  person_type: z.literal('juridica'),
  company_name: z.string().min(2).max(150),
  trade_name: z.string().max(100).optional(),
  cnpj: z.string().regex(cnpjRegex, 'Invalid CNPJ format'),
  state_registration: z.string().max(20).optional(),
});

const clientSchema = z.object({
  user_category: z.literal('cliente'),
  client_credit_limit: z.number().min(1000).max(100000),
});

const supplierSchema = z.object({
  user_category: z.literal('fornecedor'),
  supplier_category: z.enum(COMPLEX_FORM_ENUMS.SUPPLIER_CATEGORIES),
  supplier_delivery_time: z.number().int().min(1).max(365),
});

const partnerSchema = z.object({
  user_category: z.literal('parceiro'),
  partner_commission_rate: z.number().min(0.01).max(15.0),
  partner_territory: z.enum(COMPLEX_FORM_ENUMS.PARTNER_TERRITORIES),
});

// Intersection for Step 1
export const step1Schema = z
  .intersection(
    basePersonalSchema,
    z.discriminatedUnion('person_type', [fisicaSchema, juridicaSchema])
  )
  .and(z.discriminatedUnion('user_category', [clientSchema, supplierSchema, partnerSchema]));

// --- Step 2: Address ---
export const step2Schema = z.object({
  cep: z.string().regex(cepRegex, 'Invalid CEP format'),
  street: z.string().min(1),
  number: z.string().max(10),
  complement: z.string().max(50).optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
});

// --- Step 3: Documents ---
export const fileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().max(COMPLEX_FORM_DEFAULTS.MAX_FILE_SIZE),
  type: z.enum(COMPLEX_FORM_ENUMS.ALLOWED_FILE_TYPES),
  url: z.string(),
  uploadedAt: z.string(),
});

export const step3Schema = z.object({
  documents: z
    .array(fileSchema)
    .min(COMPLEX_FORM_DEFAULTS.MIN_FILES, 'At least one file is required')
    .max(COMPLEX_FORM_DEFAULTS.MAX_FILES, 'Too many files'),
});

// --- Step 4: Confirmation ---
export const step4Schema = z.object({
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: 'Terms must be accepted' }),
  }),
});

// --- Full Form Schema (for final validation) ---
export const fullFormSchema = z.object({
  personal: step1Schema,
  address: step2Schema,
  documents: step3Schema.shape.documents,
  confirmation: step4Schema,
});

// --- API Request Schemas ---
export const saveDraftSchema = z.object({
  draftId: z.string().optional(),
  step: z.number().int().min(1).max(4),
  data: z.record(z.any()), // Partial data allowed for saving
});

export const validateStepSchema = z.object({
  step: z.number().int().min(1).max(4),
  data: z.record(z.any()),
});

export const submitFormSchema = z.object({
  draftId: z.string(),
});

export const uploadFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  content: z.string(), // Base64 content
});
