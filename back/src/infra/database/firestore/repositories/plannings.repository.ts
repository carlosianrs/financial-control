import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { GetPlanningDto } from "src/infra/http/plannings/dto/plannings.dto";
import { ResponseFirebase } from "../types/users.type";
import { Planning, ResPlanning, UpdatePlanning } from "../types/plannings.type";
import { Timestamp } from "firebase-admin/firestore";
import { modelPlanning } from "../mappers/plannings.mapper";

@Injectable()
export class PlanningsRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll({ limit, nextId, nextDate, ...params }: GetPlanningDto): Promise<ResponseFirebase<ResPlanning[]>> {
    let query: any = this.firestoreService.plannings;

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    const pageLimit = (limit || 10)

    query = query.orderBy("created_at", "desc").orderBy("__name__", "desc").limit(pageLimit + 1);

    if (nextDate && nextId) {
      query = query.startAfter(Timestamp.fromDate(new Date(nextDate)), nextId)
    }

    const plannings = await query.get();
    if (plannings.empty) return { data: [], results: 0, nextCursor: null };

    const categoryIds = plannings.docs?.map(doc => doc.data()?.category_id);
    const categories = await this.firestoreService.categories.where("__name__", "in", categoryIds).get();
    const categoryMap = new Map(categories.docs.map(doc => {
      const data = doc.data();

      return [doc.id, {
        id: doc.id,
        name: data.name,
        icon_name: data.icon_name,
        icon_color: data.icon_color,
      }]
    }))

    const response: ResPlanning[] = plannings.docs?.map((doc: FirebaseFirestore.DocumentData) => {
      return {
        ...modelPlanning(doc),
        category: categoryMap.get(doc.data()?.category_id) || null,
      }
    });

    const hasNextPage = response.length > pageLimit;
    const docs = hasNextPage ? response.slice(0, pageLimit) : response;
    const lastDoc = docs[docs.length - 1];

    return {
      data: docs,
      results: docs.length,
      nextCursor: hasNextPage ? {
        date: lastDoc.created_at.toISOString(),
        id: lastDoc.id!
      } : null
    }
  }
  
  async findById(id: string): Promise<Planning | null> {
    const planning = await this.firestoreService.plannings
      .doc(id)
      .get()

    if (!planning.exists) return null;

    return modelPlanning(planning);
  }

  async create(params: Planning): Promise<Planning> {
    const docRef = this.firestoreService.plannings.doc();
    await docRef.create(params);

    return {
      id: docRef.id,
      ...params
    }
  }

  async update(id: string, params: UpdatePlanning): Promise<void> {
    await this.firestoreService.plannings
      .doc(id)
      .set(params, { merge: true })
  }

  async delete(id: string): Promise<void> {
    await this.firestoreService.plannings
      .doc(id)
      .delete()
  }
}