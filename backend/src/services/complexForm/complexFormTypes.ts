/**
 * @summary
 * Type definitions for Complex Form feature.
 * Defines structures for form data, drafts, and submissions.
 *
 * @module services/complexForm/complexFormTypes
 */

/**
 * @interface FileMetadata
 * @description Structure for uploaded file metadata
 */
export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

/**
 * @interface AddressData
 * @description Structure for address step data
 */
export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

/**
 * @interface PersonalData
 * @description Structure for personal data step
 */
export interface PersonalData {
  person_type: 'fisica' | 'juridica';
  user_category: 'cliente' | 'fornecedor' | 'parceiro';
  phone: string;
  preferred_contact_time: string;

  // Pessoa Fisica
  full_name?: string;
  cpf?: string;
  rg?: string;
  birth_date?: string;
  marital_status?: string;

  // Pessoa Juridica
  company_name?: string;
  trade_name?: string;
  cnpj?: string;
  state_registration?: string;

  // Category Specific
  client_credit_limit?: number;
  supplier_category?: string;
  supplier_delivery_time?: number;
  partner_commission_rate?: number;
  partner_territory?: string;
}

/**
 * @interface FormData
 * @description Complete form data structure
 */
export interface FormData {
  personal?: Partial<PersonalData>;
  address?: Partial<AddressData>;
  documents?: FileMetadata[];
  confirmation?: {
    terms_accepted: boolean;
  };
}

/**
 * @interface FormDraft
 * @description Structure for a saved form draft
 */
export interface FormDraft {
  id: string;
  userId: number;
  currentStep: number;
  progressPercentage: number;
  data: FormData;
  lastSaved: string;
  createdAt: string;
}

/**
 * @interface FormSubmission
 * @description Structure for a submitted form
 */
export interface FormSubmission {
  id: string;
  protocolNumber: string;
  userId: number;
  data: FormData;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * @interface CepResponse
 * @description Response structure for CEP lookup
 */
export interface CepResponse {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}
