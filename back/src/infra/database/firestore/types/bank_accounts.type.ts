export type BankAccount = {
  id?: string;
  name: string;
  icon_path: string | null;
  icon_color: string | null;
  created_at: Date;
  updated_at: Date;
}

export type UpdateBankAccount = {
  name: string;
  icon_path: string | null;
  icon_color: string | null;
  updated_at: Date;
}