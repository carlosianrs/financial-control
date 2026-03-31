import { z, ZodNumber } from "zod";

z.config(z.locales.pt())

export const transactionsSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  value: z.coerce.number().min(0.1, 'Valor deve ser no mínimo 1 centavo') as ZodNumber,
  desc: z.string().optional(),
  status: z.string().min(1, 'Deve ser adicionado um status'),
  category: z.string().min(1, 'Deve ser adicionada uma categoria'),
  bank: z.string().min(1, 'Deve ser adicionado um banco'),
  date: z.date(),
})

export type transactionsSchemaType = z.infer<typeof transactionsSchema>;