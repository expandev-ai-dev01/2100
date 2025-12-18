/**
 * @summary
 * Global authentication state store.
 * Manages user session and authentication status.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/models';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' }
  )
);
