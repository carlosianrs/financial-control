export enum ReportType {
  DESPESA = 'despesa',
  RECEITA = 'receita',
}

export type Report = {
  id?: string;
  user_id: string;
  type: string;
  value: number;
  description: string;
  category_id: string;
  report_date: Date;
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