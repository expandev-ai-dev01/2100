export type PersonType = 'fisica' | 'juridica';
export type UserCategory = 'cliente' | 'fornecedor' | 'parceiro';
export type MaritalStatus = 'solteiro' | 'casado' | 'divorciado' | 'viuvo';
export type SupplierCategory = 'produtos' | 'servicos' | 'ambos';
export type PartnerTerritory = 'norte' | 'nordeste' | 'centro-oeste' | 'sudeste' | 'sul';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface ComplexFormData {
  // Step 1
  person_type: PersonType;
  user_category: UserCategory;

  // Fisica
  full_name?: string;
  cpf?: string;
  rg?: string;
  birth_date?: Date;
  marital_status?: MaritalStatus;

  // Juridica
  company_name?: string;
  trade_name?: string;
  cnpj?: string;
  state_registration?: string;

  // Common
  phone: string;
  preferred_contact_time: string;

  // Specific
  client_credit_limit?: number;
  supplier_category?: SupplierCategory;
  supplier_delivery_time?: number;
  partner_commission_rate?: number;
  partner_territory?: PartnerTerritory;

  // Step 2
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;

  // Step 3
  uploaded_files: FileMetadata[];

  // Step 4
  terms_accepted: boolean;
}

export interface DraftResponse {
  draftId: string;
  step: number;
  data: Partial<ComplexFormData>;
  last_saved: string;
}

export interface AddressResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface ValidationResponse {
  valid: boolean;
  errors?: Record<string, string[]>;
}

export interface SubmissionResponse {
  protocol_number: string;
  status: 'success' | 'error';
  message: string;
}
