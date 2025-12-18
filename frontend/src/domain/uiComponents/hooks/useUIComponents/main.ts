/**
 * @summary
 * UI Components management hook.
 * Handles state and interactions for all UI component demonstrations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uiComponentsService } from '../../services/uiComponentsService';

export const useUIComponents = () => {
  const queryClient = useQueryClient();
  const queryKey = ['ui-components'];

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: uiComponentsService.getState,
    staleTime: Infinity,
  });

  const { mutateAsync: modalAction } = useMutation({
    mutationFn: uiComponentsService.modalAction,
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao executar ação do modal');
    },
  });

  const { mutateAsync: moveCard } = useMutation({
    mutationFn: (params: Parameters<typeof uiComponentsService.moveKanbanCard>) =>
      uiComponentsService.moveKanbanCard(...params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao mover cartão');
    },
  });

  const { mutateAsync: updateSlider } = useMutation({
    mutationFn: (params: Parameters<typeof uiComponentsService.updateSlider>) =>
      uiComponentsService.updateSlider(...params),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar slider');
    },
  });

  const { mutateAsync: selectDates } = useMutation({
    mutationFn: (params: Parameters<typeof uiComponentsService.selectCalendarDates>) =>
      uiComponentsService.selectCalendarDates(...params),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao selecionar datas');
    },
  });

  const { mutateAsync: switchTab } = useMutation({
    mutationFn: uiComponentsService.switchTab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao trocar aba');
    },
  });

  const { mutateAsync: toggleAccordion } = useMutation({
    mutationFn: uiComponentsService.toggleAccordion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alternar acordeão');
    },
  });

  const { mutateAsync: createToast } = useMutation({
    mutationFn: uiComponentsService.createToast,
    onSuccess: (_data, variables) => {
      const messages = {
        success: 'Operação realizada com sucesso!',
        error: 'Erro crítico: Falha na conexão com o servidor',
        warning: 'Atenção: Sua sessão expirará em 5 minutos',
      };

      if (variables === 'success') {
        toast.success(messages.success);
      } else if (variables === 'error') {
        toast.error(messages.error);
      } else if (variables === 'warning') {
        toast.warning(messages.warning);
      }
    },
  });

  return {
    state: data,
    isLoading,
    isError,
    error,
    modalAction,
    moveCard,
    updateSlider,
    selectDates,
    switchTab,
    toggleAccordion,
    createToast,
  };
};
