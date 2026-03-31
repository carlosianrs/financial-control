'use server'

import { api } from "@/http/api/api-client";
import { ParamsRequest, ResponseError } from "@/http/api/session";

export type Transaction = {
  id: string;
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

export async function getTransactions({ month, year }: { month: string, year: string }): Promise<ParamsRequest<Transaction[]> & ResponseError> {
  return await api.get('/transaction', { params: { month, year, limit: 150 }})
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}