'use server'

import { api } from "@/http/api/api-client";
import { ParamsRequest, ResponseError } from "@/http/api/session";

export type CreatePlanning = {
  category_id: string;
  description?: string;
  value: number;
  month: string;
  year: string;
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

export async function createPlanning(params: CreatePlanning): Promise<ParamsRequest<CreatePlanning[]> & ResponseError> {
  return await api.post('/planning', params)
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}

export async function updatePlanning(id: string, params: CreatePlanning): Promise<ParamsRequest<CreatePlanning[]> & ResponseError> {
  return await api.put(`/planning/${id}`, params)
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}

export async function deletePlanning(id: string): Promise<ParamsRequest<CreatePlanning[]> & ResponseError> {
  return await api.delete(`/planning/${id}`)
    .then(({ data, status }) => ({ ...data, status }))
    .catch(err => ({ success: false, message: err.message, status: err.response?.status }))
}