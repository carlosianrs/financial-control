"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SignInFormSchema } from "../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { signIn } from "../../lib/actions";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      redirect: searchParams?.get("redirect") || "/",
      remember: false,
    },
  });

  async function handleSubmit(values: z.infer<typeof SignInFormSchema>) {
    setIsLoading(true);
    await signIn(values);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 md:p-8">
            <FieldGroup className="gap-5">
              <div className="flex flex-col items-center text-center gap-1">
                <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
                <p className="text-sm text-gray-400">
                  Entre na sua conta para continuar
                </p>
              </div>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-gray-300">Email</FieldLabel>

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                      <Input
                        {...field}
                        placeholder="Digite seu email"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-gray-300">Senha</FieldLabel>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                      <Input
                        {...field}
                        type="password"
                        placeholder="Digite sua senha"
                        disabled={isLoading}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white font-semibold shadow-lg"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Entrar
              </Button>

              <div className="text-center text-sm text-gray-400">
                Ainda não possui conta?{" "}
                <Link href="/auth/sign-up" className="text-blue-400 hover:text-blue-300 underline">
                  Criar conta
                </Link>
              </div>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}