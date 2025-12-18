/**
 * @summary
 * Registration hook with form handling and validation.
 * Manages registration state and API communication.
 */

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import {
  registerSchema,
  type RegisterFormInput,
  type RegisterFormOutput,
} from '../../validations/register';
import { useNavigation } from '@/core/hooks/useNavigation';

export const useRegister = () => {
  const { navigate } = useNavigation();

  const form = useForm<RegisterFormInput, unknown, RegisterFormOutput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const { mutateAsync: register, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Cadastro realizado com sucesso! Faça login para continuar');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao realizar cadastro');
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await register({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  });

  return {
    form,
    onSubmit,
    isPending,
  };
};
