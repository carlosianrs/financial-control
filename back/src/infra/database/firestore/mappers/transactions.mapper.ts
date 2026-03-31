import { CreateTransactionDto } from "src/infra/http/transactions/dto/transactions.dto";
import { Transaction } from "../types/transactions.type";

export const modelTransaction = (doc: FirebaseFirestore.DocumentData): Transaction => ({
  id: doc.id,
  user_id: doc.data()?.user_id,
  type: doc.data()?.type,
  value: doc.data()?.value,
  description: doc.data()?.description,
  status: doc.data()?.status,
  payment_date: doc.data()?.payment_date?.toDate(),
  created_at: doc.data()?.created_at?.toDate(),
  updated_at: doc.data()?.updated_at?.toDate(),
})

export const modelCreateTransaction = (userId: string, params: CreateTransactionDto): Transaction => ({
  user_id: userId,
  type: params.type,
  value: params.value,
  description: params.description || '',
  status: params.status,
  category_id: params.category_id,
  bank_account_id: params.bank_account_id,
  payment_date: new Date(params.payment_date),
  created_at: new Date(),
  updated_at: new Date(),
})