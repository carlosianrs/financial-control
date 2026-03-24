'use server'

import 'server-only'
import { getUser } from "@/http/api/get-user";
import { serverConfig } from "@/lib/settings";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getTokenAuthenticated() {
  const cookiesAuth = await cookies()
  return cookiesAuth.get(serverConfig.TOKEN)?.value
}

export async function deleteToken() {
  const cookiesAuth = await cookies()
  return cookiesAuth.delete(serverConfig.TOKEN)
}

export async function auth() {
  const cookiesAuth = await cookies()
  const token = cookiesAuth.get(serverConfig.TOKEN)?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const user = await getUser()
    return user;
  } catch (err) {
    console.log('Login', err)
  }

  redirect('api/auth/sign-out')
}

export async function logout() {
  await deleteToken()
  redirect('/')
}