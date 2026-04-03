import { CreateCategoryDto } from "src/infra/http/api/categories/dto/categories.dto";
import { Category } from "../types/categories.type";

export const modelCategory = (doc: FirebaseFirestore.DocumentData): Category => ({
  id: doc.id,
  name: doc.data()?.name,
  description: doc.data()?.description,
  icon_name: doc.data()?.icon_name || null,
  icon_color: doc.data()?.icon_color || null,
  created_at: doc.data()?.created_at?.toDate(),
  updated_at: doc.data()?.updated_at?.toDate(),
})

export const modelCreateCategory = (params: CreateCategoryDto): Category => ({
  name: params.name,
  description: params.description || '',
  icon_name: params?.icon_name || null,
  icon_color: params?.icon_color || null,
  created_at: new Date,
  updated_at: new Date(),
})