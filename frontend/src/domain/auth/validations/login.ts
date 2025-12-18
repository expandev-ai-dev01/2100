/**
 * @summary
 * Login form validation schema.
 * Validates email and password fields for authentication.
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string('Email é obrigatório')
    .min(1, 'Email não pode estar vazio')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z.string('Senha é obrigatória').min(1, 'Senha não pode estar vazia'),
  remember_me: z.boolean().default(false),
});

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormOutput = z.output<typeof loginSchema>;
