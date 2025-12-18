/**
 * @summary
 * Registration form validation schema.
 * Validates user registration data with password strength requirements.
 */

import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string('Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome muito longo')
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
    email: z
      .string('Email é obrigatório')
      .min(1, 'Email não pode estar vazio')
      .email('Email inválido')
      .max(255, 'Email muito longo'),
    password: z
      .string('Senha é obrigatória')
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
      .regex(/[!@#$%^&*]/, 'Senha deve conter pelo menos um caractere especial (!@#$%^&*)'),
    confirm_password: z.string('Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  });

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormOutput = z.output<typeof registerSchema>;
