"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SignInFormSchema } from "../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "../../lib/actions";
import { toast } from "sonner";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
        email: "",
        password: "",
        redirect: searchParams?.get('redirect') || '/',
        remember: false,
    }
  });

  async function handleSubmit(values: z.infer<typeof SignInFormSchema>) {
    setIsLoading(true);
    await signIn(values);
    setIsLoading(false);
  }

  return (
    <Card className="w-full sm:max-w-md shadow-xl">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Insira as informações da sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-sign-in" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-sign-in-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-sign-in-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insira o seu email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-sign-in-password">Senha</FieldLabel>
                  <Input
                    {...field}
                    id="form-sign-in-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insira a sua senha"
                    autoComplete="off"
                    type={"password"}
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation='horizontal'>
          <div className="flex flex-col w-full items-center space-y-2">
            <Button className="w-full" type="submit" form="form-sign-in" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Entrar"}
            </Button>
            <Label>
              Ainda não possui conta?<Link href={'/auth/sign-up'} className="text-blue-500 underline hover:text-blue-800">Faça o cadastro</Link>
            </Label>
          </div>
        </Field>
      </CardFooter>
    </Card>
  )
}