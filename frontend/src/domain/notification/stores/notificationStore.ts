/**
 * @summary
 * Global notification state store.
 * Manages active notifications, preferences, and WebSocket state.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, NotificationPreferences } from '../types/models';

interface NotificationStore {
  activeNotifications: Notification[];
  preferences: NotificationPreferences | null;

  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  setPreferences: (preferences: NotificationPreferences) => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      activeNotifications: [],
      preferences: null,

      addNotification: (notification) => {
        set((state) => {
          const filtered = state.activeNotifications.filter(
            (n) =>
              n.type !== 'toast' ||
              state.activeNotifications.filter((t) => t.type === 'toast').length < 5
          );
          return {
            activeNotifications: [...filtered, notification],
          };
        });
      },

      removeNotification: (id) => {
        set((state) => ({
          activeNotifications: state.activeNotifications.filter((n) => n.id !== id),
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          activeNotifications: state.activeNotifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      clearAll: () => {
        set({ activeNotifications: [] });
      },

      setPreferences: (preferences) => {
        set({ preferences });
      },

      getUnreadCount: () => {
        return get().activeNotifications.filter((n) => !n.isRead).length;
      },
    }),
    { name: 'notification-store' }
  )
);
