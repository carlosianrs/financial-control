import { Report } from "../types/reports.type";

export const modelReport = (doc: FirebaseFirestore.DocumentData): Report => ({
  id: doc.id,
  user_id: doc.data()?.user_id,
  type: doc.data()?.type,
  value: doc.data()?.value,
  description: doc.data()?.description,
  category_id: doc.data()?.category_id,
  report_date: doc.data()?.report_date?.toDate(),
  created_at: doc.data()?.created_at?.toDate(),
  updated_at: doc.data()?.updated_at?.toDate(),
})