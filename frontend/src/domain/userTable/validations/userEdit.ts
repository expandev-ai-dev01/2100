/**
 * @summary
 * User edit form validation schema.
 */

import { z } from 'zod';

const userStatuses = ['Ativo', 'Inativo', 'Pendente'] as const;
const userTypes = ['Cliente', 'Fornecedor', 'Parceiro', 'Admin'] as const;

export const userEditSchema = z.object({
  name: z
    .string('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string('Email é obrigatório')
    .min(1, 'Email não pode estar vazio')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  status: z.enum(userStatuses, 'Selecione um status válido'),
  type: z.enum(userTypes, 'Selecione um tipo válido'),
});

export type UserEditFormInput = z.input<typeof userEditSchema>;
export type UserEditFormOutput = z.output<typeof userEditSchema>;
