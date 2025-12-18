/**
 * @summary
 * Notifications management hook.
 * Handles notification creation, dismissal, and preferences.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationService } from '../../services/notificationService';
import { useNotificationStore } from '../../stores/notificationStore';
import { useEffect } from 'react';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const queryKey = ['notifications'];

  const {
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    setPreferences,
    getUnreadCount,
  } = useNotificationStore();

  const { data: state, isLoading } = useQuery({
    queryKey,
    queryFn: notificationService.getState,
    staleTime: Infinity,
  });

  // Sync preferences with store
  useEffect(() => {
    if (state?.preferences) {
      setPreferences(state.preferences);
    }
  }, [state?.preferences, setPreferences]);

  const { mutateAsync: createToast } = useMutation({
    mutationFn: (type: 'success' | 'error' | 'warning' | 'info') => {
      const messages = {
        success: 'Operação realizada com sucesso!',
        error: 'Erro ao processar operação',
        warning: 'Atenção: Verifique os dados informados',
        info: 'Informação importante',
      };
      return notificationService.createToast({
        toastType: type,
        message: messages[type],
      });
    },
    onSuccess: (data) => {
      addNotification(data);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar notificação');
    },
  });

  const { mutateAsync: createPush } = useMutation({
    mutationFn: notificationService.createPush,
    onSuccess: (data) => {
      addNotification(data);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar notificação push');
    },
  });

  const { mutateAsync: createModal } = useMutation({
    mutationFn: notificationService.createModal,
    onSuccess: (data) => {
      addNotification(data);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar modal');
    },
  });

  const { mutateAsync: dismissNotification } = useMutation({
    mutationFn: notificationService.dismiss,
    onSuccess: (_data, id) => {
      removeNotification(id);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao dispensar notificação');
    },
  });

  const { mutateAsync: markNotificationAsRead } = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (_data, id) => {
      markAsRead(id);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: updatePreferences } = useMutation({
    mutationFn: notificationService.updatePreferences,
    onSuccess: (data) => {
      setPreferences(data);
      queryClient.invalidateQueries({ queryKey });
      toast.success('Preferências atualizadas');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar preferências');
    },
  });

  const { mutateAsync: resetPreferences } = useMutation({
    mutationFn: notificationService.resetPreferences,
    onSuccess: (data) => {
      setPreferences(data);
      queryClient.invalidateQueries({ queryKey });
      toast.success('Preferências restauradas');
    },
  });

  const { mutateAsync: clearHistory } = useMutation({
    mutationFn: notificationService.clearHistory,
    onSuccess: () => {
      clearAll();
      queryClient.invalidateQueries({ queryKey });
      toast.success('Histórico limpo');
    },
  });

  return {
    state,
    isLoading,
    unreadCount: getUnreadCount(),
    createToast,
    createPush,
    createModal,
    dismissNotification,
    markNotificationAsRead,
    updatePreferences,
    resetPreferences,
    clearHistory,
  };
};
