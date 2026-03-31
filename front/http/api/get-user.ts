'use server'

import { serverConfig } from "@/lib/settings";
import { api } from "./api-client";
import { ResponseError } from "./session";
import { importSPKI, jwtVerify } from 'jose';
import { cookies } from "next/headers";

export type User = {
  id: string;
  name: string;
  username: string;
  user_id: string;
  refresh_token: string | null;
  email?: string;
  status?: number | string;
  created_at: Date;
  updated_at: Date;
}

export async function getUser(): Promise<User & ResponseError> {
  return await api.get('/auth/user')
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}

export async function refreshToken(): Promise<User & ResponseError> {
  return await api.get('/auth/refresh')
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}

export async function middleware() {
  const cookiesAuth = await cookies()
  const token = cookiesAuth.get(serverConfig.TOKEN)?.value

  if (!token) throw new Error('Token inválido')

  const public_key = await importSPKI(serverConfig.rt_token!, 'RS256')
  const { payload } = await jwtVerify(token, public_key);

  return payload;
}