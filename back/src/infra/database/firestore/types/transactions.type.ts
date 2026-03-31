export enum TransactionType {
  DESPESA = 'expenses',
  RECEITA = 'income',
}

export type Transaction = {
  id?: string;
  user_id?: string;
  type: string;
  value: number;
  description: string;
  status: string;
  category_id?: string;
  bank_account_id?: string;
  payment_date: Date;
  created_at: Date;
  updated_at: Date;
}

export type UpdateTransaction = {
  type?: string;
  value?: number;
  description?: string;
  category_id?: string;
  payment_date?: Date;
}

export enum Month {
  janeiro = 1,
  fevereiro = 2,
  março = 3,
  abril = 4,
  maio = 5,
  junho = 6,
  julho = 7,
  agosto = 8,
  setembro = 9,
  outubro = 10,
  novembro = 11,
  dezembro = 12,
}