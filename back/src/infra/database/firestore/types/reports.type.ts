export enum ReportType {
  DESPESA = 'expenses',
  RECEITA = 'income',
}

export type Report = {
  id?: string;
  user_id?: string;
  type: string;
  value: number;
  description: string;
  status: string;
  category_id?: string;
  bank_account_id: string;
  day: number;
  month_year: string;
  created_at: Date;
  updated_at: Date;
}

export type UpdateReport = {
  type?: string;
  value?: number;
  description?: string;
  category_id?: string;
  report_date?: Date;
}