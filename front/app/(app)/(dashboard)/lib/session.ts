'use server'

import { api } from "@/http/api/api-client";

export type Payment = {
  id: string;
  name: string;
  user_id: string;
  type: string;
  value: number;
  description: string;
  bank_account_id: string;
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
