import z from "zod";
import { SignUpFormSchema } from "./schemas";
import { signUp } from "@/http/api/login";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export async function handleSignUp(values: z.infer<typeof SignUpFormSchema>) {
  const user = await signUp(values);

  if (user.id) {
    toast.error('Login', { description: 'Cadastro realizado com sucesso'});
    redirect('/auth/sign-in');
  }

  toast.error(user.message, { description: 'Não foi possível realizar cadastro'});
}