import { Category } from "../types/categories.type";

export const modelCategory = (doc: FirebaseFirestore.DocumentData): Category => ({
  id: doc.id,
  name: doc.data()?.name,
  created_at: doc.data()?.created_at,
  updated_at: doc.data()?.updated_at,
})