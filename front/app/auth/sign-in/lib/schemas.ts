import z from "zod";

export const SignInFormSchema = z.object({
  email: z.email({ error: 'Informe um email válido '})?.trim(),
  password: z.string().min(8, { error: 'Senha deve conter no mínimo 8 caracteres' }).max(30, { error: 'Senha deve conter no máximo 30 caracteres'})?.trim(),
  remember: z.boolean().default(false).optional(),
  redirect: z.string().trim(),
})
