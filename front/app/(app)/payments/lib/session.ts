'use server'

import { api } from "@/http/api/api-client";
import { ParamsRequest, ResponseError } from "@/http/api/session";
import { StatusPayment } from "../utils/status.util";

export type Payment = {
  id: string;
  name: string;
  user_id: string;
  type: string;
  value: number;
  description: string;
  bank_account_id: string;
  status: keyof typeof StatusPayment;
  category: {
    id: string;
    name: string;
    icon_name: string;
    icon_color: string;
  }
  report_date: Date;
  created_at: Date;
  updated_at: Date;
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
  return await api.get('/category')
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}