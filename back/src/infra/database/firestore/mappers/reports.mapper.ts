import { CreateReportDto } from "src/infra/http/reports/dto/reports.dto";
import { Report } from "../types/reports.type";

export const modelReport = (doc: FirebaseFirestore.DocumentData): Report => ({
  id: doc.id,
  user_id: doc.data()?.user_id,
  type: doc.data()?.type,
  value: doc.data()?.value,
  description: doc.data()?.description,
  bank_account_id: doc.data()?.bank_account_id,
  day: doc.data()?.day,
  month_year: doc.data()?.month_year,
  created_at: doc.data()?.created_at?.toDate(),
  updated_at: doc.data()?.updated_at?.toDate(),
})

export const modelCreateReport = (params: CreateReportDto): Report => ({
  type: params.type,
  value: params.value,
  description: params.description || '',
  category_id: params.category_id,
  bank_account_id: params.bank_account_id,
  day: params.day,
  month_year: params.month_year,
  created_at: new Date(),
  updated_at: new Date(),
})