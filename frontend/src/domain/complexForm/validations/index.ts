import { z } from 'zod';

// Helper regex
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cepRegex = /^\d{5}-\d{3}$/;

// Step 1 Schemas
const baseStep1 = z.object({
  person_type: z.enum(['fisica', 'juridica'], { message: 'Selecione o tipo de pessoa' }),
  user_category: z.enum(['cliente', 'fornecedor', 'parceiro'], {
    message: 'Selecione a categoria',
  }),
  phone: z.string({ message: 'Telefone é obrigatório' }).regex(phoneRegex, 'Formato inválido'),
  preferred_contact_time: z
    .string({ message: 'Horário é obrigatório' })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM inválido')
    .refine((val) => {
      const [hours] = val.split(':').map(Number);
      return hours >= 8 && hours <= 18;
    }, 'Horário deve ser entre 08:00 e 18:00'),
});

const fisicaFields = z.object({
  person_type: z.literal('fisica'),
  full_name: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'Apenas letras e espaços'),
  cpf: z.string().min(14, 'CPF incompleto'), // Simple length check, real validation would be more complex
  rg: z.string().min(7, 'Mínimo 7 caracteres').max(12, 'Máximo 12 caracteres'),
  birth_date: z
    .date({ message: 'Data de nascimento obrigatória' })
    .max(new Date(), 'Data não pode ser futura')
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18;
    }, 'Idade mínima 18 anos'),
  marital_status: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo'], {
    message: 'Selecione o estado civil',
  }),
});

const juridicaFields = z.object({
  person_type: z.literal('juridica'),
  company_name: z.string().min(2, 'Mínimo 2 caracteres').max(150, 'Máximo 150 caracteres'),
  trade_name: z.string().max(100, 'Máximo 100 caracteres').optional(),
  cnpj: z.string().min(18, 'CNPJ incompleto'),
  state_registration: z.string().max(20, 'Máximo 20 caracteres').optional(),
});

const clientFields = z.object({
  user_category: z.literal('cliente'),
  client_credit_limit: z
    .number({ message: 'Valor inválido' })
    .min(1000, 'Mínimo R$ 1.000,00')
    .max(100000, 'Máximo R$ 100.000,00'),
});

const supplierFields = z.object({
  user_category: z.literal('fornecedor'),
  supplier_category: z.enum(['produtos', 'servicos', 'ambos'], {
    message: 'Selecione a categoria',
  }),
  supplier_delivery_time: z
    .number({ message: 'Valor inválido' })
    .int()
    .min(1, 'Mínimo 1 dia')
    .max(365, 'Máximo 365 dias'),
});

const partnerFields = z.object({
  user_category: z.literal('parceiro'),
  partner_commission_rate: z
    .number({ message: 'Valor inválido' })
    .min(0.01, 'Mínimo 0.01%')
    .max(15, 'Máximo 15%'),
  partner_territory: z.enum(['norte', 'nordeste', 'centro-oeste', 'sudeste', 'sul'], {
    message: 'Selecione o território',
  }),
});

// Discriminated Unions for Step 1
export const step1Schema = z.intersection(
  baseStep1,
  z.intersection(
    z.discriminatedUnion('person_type', [fisicaFields, juridicaFields]),
    z.discriminatedUnion('user_category', [clientFields, supplierFields, partnerFields])
  )
);

// Step 2 Schema
export const step2Schema = z.object({
  cep: z.string().regex(cepRegex, 'CEP inválido'),
  street: z.string().min(1, 'Logradouro obrigatório'),
  number: z.string().min(1, 'Número obrigatório').max(10, 'Máximo 10 caracteres'),
  complement: z.string().max(50, 'Máximo 50 caracteres').optional(),
  neighborhood: z.string().min(1, 'Bairro obrigatório'),
  city: z.string().min(1, 'Cidade obrigatória'),
  state: z.string().length(2, 'Sigla de 2 letras'),
});

// Step 3 Schema
export const step3Schema = z.object({
  uploaded_files: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        size: z.number(),
        type: z.string(),
        url: z.string(),
      })
    )
    .min(1, 'Envie pelo menos um arquivo')
    .max(10, 'Máximo 10 arquivos'),
});

// Step 4 Schema
export const step4Schema = z.object({
  terms_accepted: z.literal(true, {
    message: 'Você deve aceitar os termos e condições',
  }),
});

// Combined Schema for Types
export const complexFormSchema = z.intersection(
  step1Schema,
  z.intersection(step2Schema, z.intersection(step3Schema, step4Schema))
);

export type ComplexFormInput = z.input<typeof complexFormSchema>;
export type ComplexFormOutput = z.output<typeof complexFormSchema>;
