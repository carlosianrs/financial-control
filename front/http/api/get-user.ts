'use server'

import { api, ResponseError } from "./api-client";

export type User = {
  id: string;
  name: string;
  username: string;
  user_id: string;
  refresh_token: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function getUser(): Promise<User & ResponseError> {
  return await api.get('/auth/user')
    .then(({ data }) => ({ ...data }))
    .catch(err => ({ success: false, message: err.message }))
}