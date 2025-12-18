/**
 * @summary
 * Logout hook for user session termination.
 * Handles logout API call and state cleanup.
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useNavigation } from '@/core/hooks/useNavigation';

export const useLogout = () => {
  const { navigate } = useNavigation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { mutateAsync: logout, isPending } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    },
    onError: () => {
      clearAuth();
      navigate('/login');
    },
  });

  return {
    logout,
    isPending,
  };
};
