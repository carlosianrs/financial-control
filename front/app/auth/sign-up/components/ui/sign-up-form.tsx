'use client'

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SignUpFormSchema } from "../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    }
  });

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setIsLoading(true);
    
    setIsLoading(false);
  }

  return (
    <Card className="w-full sm:max-w-md shadow-xl">
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>
          Insira as informações para criar a sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-sign-up" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState}) => (
                <Field>
                  <FieldLabel htmlFor="form-sign-up-name">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="form-sign-up-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insira o seu nome"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState}) => (
                <Field>
                  <FieldLabel htmlFor="form-sign-up-username">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="form-sign-up-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insira o seu usuário"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-sign-up-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-sign-up-email"
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
                <Field>
                  <FieldLabel htmlFor="form-sign-up-password">Senha</FieldLabel>
                  <Input
                    {...field}
                    id="form-sign-up-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insira a sua senha"
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation={'horizontal'}>
          <Button type="submit" form="">
            Cadastrar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}