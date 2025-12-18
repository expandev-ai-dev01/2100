/**
 * @summary
 * Login hook with form handling and authentication logic.
 * Manages login state, validation, and API communication.
 */

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { loginSchema, type LoginFormInput, type LoginFormOutput } from '../../validations/login';
import { useNavigation } from '@/core/hooks/useNavigation';

export const useLogin = () => {
  const { navigate } = useNavigation();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginFormInput, unknown, LoginFormOutput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Login realizado com sucesso');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Email ou senha incorretos');
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await login(data);
  });

  return {
    form,
    onSubmit,
    isPending,
  };
};
