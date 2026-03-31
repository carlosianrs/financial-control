'use server'

import { api } from "@/http/api/api-client";
import { ParamsRequest, ResponseError } from "@/http/api/session";
import { StatusTransaction } from "./types";

export type Transaction = {
  id: string;
  name: string;
  user_id: string;
  type: string;
  value: number;
  description: string;
  bank_account: {
    id: string;
    name: string;
    icon_path: string;
    icon_color: string;
  };
  status: keyof typeof StatusTransaction;
  category: {
    id: string;
    name: string;
    icon_name: string;
    icon_color: string;
  }
  payment_date: Date;
  created_at: Date;
  updated_at: Date;
}

export type CreateTransaction = {
  type: string;
  value: number;
  description?: string;
  status: string;
  category_id: string;
  bank_account_id: string;
  payment_date: string;
}

export type Category = {
  id: string;
  name: string;
  icon_name: string;
  icon_color: string;
  created_at: string;
  updated_at: string;
}

export async function getCategories(): Promise<ParamsRequest<Category[]> & ResponseError> {
  return await api.get('/category', { params: { limit: 30 }})
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}

export async function getBanksAccount(): Promise<ParamsRequest<Category[]> & ResponseError> {
  return await api.get('/bank_account')
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}

export async function createTransaction(params: CreateTransaction): Promise<ParamsRequest<CreateTransaction[]> & ResponseError> {
  return await api.post('/transaction', params)
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}

export async function updateTransaction(id: string, params: CreateTransaction): Promise<ParamsRequest<CreateTransaction[]> & ResponseError> {
  return await api.put(`/transaction/${id}`, params)
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}