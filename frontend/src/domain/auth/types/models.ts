/**
 * @summary
 * Authentication domain type definitions.
 * Defines core authentication entities and DTOs.
 */

export interface User {
  id: number;
  email: string;
  name: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string;
  last_activity: string;
  remember_me: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  session: Session;
}
