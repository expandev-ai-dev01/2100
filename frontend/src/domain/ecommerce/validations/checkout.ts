/**
 * @summary
 * Checkout validation schemas.
 */

import { z } from 'zod';

const cepRegex = /^\d{5}-\d{3}$/;
const cardNumberRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
const cardExpiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
const cardCvvRegex = /^\d{3,4}$/;

export const addressSchema = z.object({
  cep: z.string('CEP é obrigatório').regex(cepRegex, 'CEP inválido'),
  street: z.string('Logradouro é obrigatório').min(1, 'Logradouro não pode estar vazio'),
  number: z.string('Número é obrigatório').min(1, 'Número não pode estar vazio'),
  complement: z.string().optional(),
  neighborhood: z.string('Bairro é obrigatório').min(1, 'Bairro não pode estar vazio'),
  city: z.string('Cidade é obrigatória').min(1, 'Cidade não pode estar vazia'),
  state: z.string('Estado é obrigatório').length(2, 'Sigla de 2 letras'),
});

export const paymentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('credit_card'),
    card_number: z
      .string('Número do cartão é obrigatório')
      .regex(cardNumberRegex, 'Número do cartão inválido'),
    card_holder_name: z
      .string('Nome do titular é obrigatório')
      .min(5, 'Nome muito curto')
      .max(50, 'Nome muito longo'),
    card_expiry: z
      .string('Validade é obrigatória')
      .regex(cardExpiryRegex, 'Formato MM/AA inválido'),
    card_cvv: z.string('CVV é obrigatório').regex(cardCvvRegex, 'CVV inválido'),
  }),
  z.object({
    type: z.literal('debit_card'),
    card_number: z
      .string('Número do cartão é obrigatório')
      .regex(cardNumberRegex, 'Número do cartão inválido'),
    card_holder_name: z
      .string('Nome do titular é obrigatório')
      .min(5, 'Nome muito curto')
      .max(50, 'Nome muito longo'),
    card_expiry: z
      .string('Validade é obrigatória')
      .regex(cardExpiryRegex, 'Formato MM/AA inválido'),
    card_cvv: z.string('CVV é obrigatório').regex(cardCvvRegex, 'CVV inválido'),
  }),
  z.object({
    type: z.literal('pix'),
  }),
  z.object({
    type: z.literal('boleto'),
  }),
]);

export type AddressFormInput = z.input<typeof addressSchema>;
export type AddressFormOutput = z.output<typeof addressSchema>;
export type PaymentFormInput = z.input<typeof paymentSchema>;
export type PaymentFormOutput = z.output<typeof paymentSchema>;
