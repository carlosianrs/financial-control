import { z } from "zod";

export const transactionsSchema = z.object({
  type: z.string().min(1),
  value: z.number().min(0.1, 'Valor deve ser no mínimo 1 centavo'),
  desc: z.string().optional(),
  status: z.string().min(1),
  category: z.string().min(1),
  bank: z.string().min(1),
  date: z.date(),
})

export type transactionsSchemaType = z.infer<typeof transactionsSchema>;