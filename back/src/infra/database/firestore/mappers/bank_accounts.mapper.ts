import { CreateBankAccountDto } from "src/infra/http/api/bank_accounts/dto/bank_accounts.dto";
import { BankAccount } from "../types/bank_accounts.type";

export const modelBankAccount = (doc: FirebaseFirestore.DocumentData): BankAccount => ({
  id: doc.id,
  name: doc.data()?.name,
  icon_path: doc.data()?.icon_path || null,
  icon_color: doc.data()?.icon_color || null,
  created_at: doc.data()?.created_at,
  updated_at: doc.data()?.updated_at,
})

export const modelCreateBankAccount = (params: CreateBankAccountDto): BankAccount => ({
  name: params.name,
  icon_path: params?.icon_path || null,
  icon_color: params?.icon_color || null,
  created_at: new Date,
  updated_at: new Date(),
})