"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SignInFormSchema } from "../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bem-vindo</h1>
                <p className="text-muted-foreground">
                  Entre na sua conta
                </p>
              </div>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Digite seu email"
                      aria-invalid={fieldState.invalid}
                    />
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
                    <FieldLabel>Senha</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Digite sua senha"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Ainda não possui conta?{" "}
                <Link href="/auth/sign-up" className="underline">
                  Criar conta
                </Link>
              </div>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/welcome.png"
              alt="Login"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}