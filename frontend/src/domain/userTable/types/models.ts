/**
 * @summary
 * User table domain type definitions.
 * Defines entities for advanced table system.
 */

export type UserStatus = 'Ativo' | 'Inativo' | 'Pendente';
export type UserType = 'Cliente' | 'Fornecedor' | 'Parceiro' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  type: UserType;
  created_at: string;
  last_login: string | null;
  last_updated: string;
}

export interface UserListParams {
  page: number;
  items_per_page: number;
  sort_by?: keyof User;
  sort_order?: 'asc' | 'desc';
  search?: string;
  status_filter?: UserStatus[];
  type_filter?: UserType[];
  date_from?: string;
  date_to?: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  total_pages: number;
  items_per_page: number;
}

export interface BulkActionResult {
  success: number;
  failed: number;
  message: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  scope: 'current_page' | 'all_filtered' | 'selected';
  selected_ids?: number[];
}
