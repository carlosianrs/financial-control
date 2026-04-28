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
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleSignUp } from "../../lib/actions";
import { AtSign, Loader2, Lock, Mail, User } from "lucide-react";

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
    await handleSignUp(values);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Insira as informações para criar a sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-sign-up" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState}) => (
                  <Field>
                    <FieldLabel htmlFor="form-sign-up-name">Nome</FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        id="form-sign-up-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Insira o seu nome"
                        autoComplete="off"
                        disabled={isLoading}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                  </Field>
                )}
              />
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState}) => (
                  <Field>
                    <FieldLabel htmlFor="form-sign-up-username">Usuário</FieldLabel>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                      <Input
                        {...field}
                        id="form-sign-up-username"
                        aria-invalid={fieldState.invalid}
                        placeholder="Insira o seu usuário"
                        autoComplete="off"
                        disabled={isLoading}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                      <Input
                        {...field}
                        id="form-sign-up-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="Insira o seu email"
                        autoComplete="off"
                        disabled={isLoading}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                      <Input
                        {...field}
                        id="form-sign-up-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Insira a sua senha"
                        autoComplete="off"
                        type={"password"}
                        disabled={isLoading}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </Field>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white font-semibold shadow-lg"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Cadastrar
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Já possui cadastro?{" "}
                <Link href="/auth/sign-in" className="text-blue-400 hover:text-blue-300 underline">
                  Fazer Login
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}