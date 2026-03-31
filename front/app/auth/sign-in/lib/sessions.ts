'use server'

import z from "zod";
import { SignInFormSchema } from "./schemas";
import { signIn } from "@/http/api/login";
import { cookies } from "next/headers";
import { serverConfig } from "@/lib/settings";

export async function login(values: z.infer<typeof SignInFormSchema>) {
  const user = await signIn(values);

  if (user.access_token) {
    const cookiesAuth = await cookies();
    cookiesAuth.set(serverConfig.TOKEN, user.access_token, {
        expires: values.remember ? new Date(user.expires_in) : undefined,
        path: '/',
    })

    return { status: user.status, message: null };
  }

  return { status: user.status, message: user.message };
}