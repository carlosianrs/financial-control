import z from "zod";

export const SignUpFormSchema = z.object({
  name: z.string().min(5, { error: 'Informa o nome completo '})?.trim(),
  email: z.email({ error: 'Informe um email válido '})?.trim(),
  username: z.string().min(2, { error: 'Informe o nome de usuário '})?.trim(),
  password: z.string().min(8, { error: 'Senha deve conter no mínimo 8 caracteres' }).max(30, { error: 'Senha deve conter no máximo 30 caracteres'})?.trim(),
})