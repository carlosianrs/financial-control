'use server'

import { serverConfig } from "@/lib/settings";
import axios from "axios";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: `${serverConfig.host}:${serverConfig.port}`,
  timeout: 30000,
})

api.interceptors.request.use(async config => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(serverConfig.TOKEN)?.value;
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
})

api.interceptors.response.use(
  response => response,
  (error) => {
    let message = '';
    if (error.code === 'ECONNABORTED') {
      message = `Timeout ao realizar requisição: ${error?.config?.url}`
    } else if (error.message === 'Network Error') {
      message = 'Conexão instável, verifique a sua internet'
    } else if (!error.response) {
      message = `Erro desconhecido: ${error.message}`
    }

    if (message) error.message = message;
    else if (error.response?.data?.message) error.message = error.response.data.message

    return Promise.reject(error)
  }
)
