/**
 * @summary
 * Authentication service for user login, registration, and logout.
 * Handles API communication for authentication operations.
 *
 * @service authService
 * @domain auth
 */

import { publicClient } from '@/core/lib/api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/models';

export const authService = {
  /**
   * Authenticate user with email and password.
   * Stores auth token in localStorage on success.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await publicClient.post<AuthResponse>('/security/login', credentials);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  /**
   * Register new user account.
   * Returns authentication response with token.
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await publicClient.post<AuthResponse>('/security/register', credentials);
    return data;
  },

  /**
   * Logout current user.
   * Removes auth token from localStorage.
   */
  async logout(): Promise<void> {
    try {
      await publicClient.post('/security/logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * Check if user is authenticated.
   * Validates token existence in localStorage.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};
