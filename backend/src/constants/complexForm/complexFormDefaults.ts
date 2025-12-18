/**
 * @summary
 * Default values and constants for Complex Form feature.
 * Contains validation limits, allowed values, and configuration constants.
 *
 * @module constants/complexForm/complexFormDefaults
 */

/**
 * @interface ComplexFormDefaultsType
 * @description Default configuration values for complex forms
 */
export const COMPLEX_FORM_DEFAULTS = {
  /** Maximum file size in bytes (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** Maximum number of files allowed */
  MAX_FILES: 10,
  /** Minimum number of files required */
  MIN_FILES: 1,
  /** Draft expiration in days */
  DRAFT_EXPIRATION_DAYS: 30,
  /** Total number of steps */
  TOTAL_STEPS: 4,
} as const;

/**
 * @interface ComplexFormEnums
 * @description Allowed values for enumerations
 */
export const COMPLEX_FORM_ENUMS = {
  PERSON_TYPES: ['fisica', 'juridica'] as const,
  USER_CATEGORIES: ['cliente', 'fornecedor', 'parceiro'] as const,
  MARITAL_STATUS: ['solteiro', 'casado', 'divorciado', 'viuvo'] as const,
  SUPPLIER_CATEGORIES: ['produtos', 'servicos', 'ambos'] as const,
  PARTNER_TERRITORIES: ['norte', 'nordeste', 'centro-oeste', 'sudeste', 'sul'] as const,
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ] as const,
} as const;

export type ComplexFormDefaultsType = typeof COMPLEX_FORM_DEFAULTS;
