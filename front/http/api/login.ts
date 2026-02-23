'use server'

import { api, ResponseError } from "@/http/api/api-client";
import { User } from "./get-user";

type ResponseSign = {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  status: number;
}

type Sign = {
  name?: string,
  email?: string,
  username?: string,
  password?: string,
}

export async function signIn(params: Sign): Promise<ResponseSign & ResponseError> {
  return await api.post('/auth/sign-in', {
    email: params.email,
    password: params.password
  })
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ status: err?.status, success: false, message: err.message }))
}

export async function signUp(params: Sign): Promise<User & ResponseError> {
  return await api.post('/auth/sign-up', {
    name: params.name,
    email: params.email,
    username: params.username,
    password: params.password,
  })
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ status: err?.status, success: false, message: err.message }))
}