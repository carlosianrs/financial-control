import { z, ZodNumber } from "zod";

z.config(z.locales.pt())

export const planningsSchema = z.object({
  category: z.string().min(1, 'Deve ser adicionada uma categoria'),
  desc: z.string().optional(),
  value: z.coerce.number().min(0.1, 'Valor deve ser no mínimo 1 centavo') as ZodNumber,
  month: z.string().min(1, 'Deve ser adicionado um mês'),
  year: z.string().min(1, 'Deve ser adicionado um ano'),
})

export type planningsSchemaType = z.infer<typeof planningsSchema>;