'use server'

import { api } from "./api-client";

export type ParamsRequest<T> = {
  data: T;
  results: number;
  nextCursor: {
    date: string;
    id: string;
  } | null;
}

export type ResponseError = {
  success: boolean;
  message: string;
}

export async function fetcher(url: string) {
  return api.get(url)
    .then((res) => res.data)
}