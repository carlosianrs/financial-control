import { CreatePlanningDto } from "src/infra/http/api/plannings/dto/plannings.dto"
import { Planning } from "../types/plannings.type"

export const modelPlanning = (doc: FirebaseFirestore.DocumentData): Planning => ({
  id: doc.id,
  user_id: doc.data()?.user_id,
  category_id: doc.data()?.category_id,
  description: doc.data()?.description,
  value: doc.data()?.value || 0,
  month: doc.data()?.month,
  year: doc.data()?.year,
  created_at: doc.data()?.created_at?.toDate(),
  updated_at: doc.data()?.updated_at?.toDate(),
})

export const modelCreatePlanning = (userId: string, params: CreatePlanningDto): Planning => ({
  user_id: userId,
  category_id: params.category_id,
  description: params.description || '',
  value: params?.value || 0,
  month: params.month,
  year: params.year,
  created_at: new Date,
  updated_at: new Date(),
})