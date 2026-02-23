'use client'

import z from "zod";
import { SignInFormSchema } from "./schemas";
import { redirect } from "next/navigation";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { login } from "./sessions";

export async function signIn(values: z.infer<typeof SignInFormSchema>) {
  const user = await login(values);

  if (!user.message) {
    redirect(values.redirect);
  }

  toast.warning(user.message, {
    description: user.status == HttpStatusCode.Unauthorized
      ? 'Credênciais incorretas' : 'Não foi possível realizar login'
  })  
}