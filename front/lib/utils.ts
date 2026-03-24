import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(num?: number) {
  if (!num) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
    style: 'currency', currency: 'BRL'
  }).format(num);
}