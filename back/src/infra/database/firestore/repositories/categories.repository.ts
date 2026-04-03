import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { ResponseFirebase, User } from "../types/users.type";
import { GetCategoryDto } from "src/infra/http/api/categories/dto/categories.dto";
import { Category, UpdateCategory } from "../types/categories.type";
import { modelCategory } from "../mappers/categories.mapper";
import { Timestamp } from "firebase-admin/firestore";

@Injectable()
export class CategoriesRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll({ limit, nextId, nextDate, ...params }: GetCategoryDto): Promise<ResponseFirebase<Category[]>> {
    let query: any = this.firestoreService.categories;

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    const pageLimit = (limit || 10)

    query = query.orderBy("created_at", "desc").orderBy("__name__", "desc").limit(pageLimit + 1);

    if (nextDate && nextId) {
      query = query.startAfter(Timestamp.fromDate(new Date(nextDate)), nextId);
    }

    const categories = await query.get();
    if (categories.empty) return { data: [], results: 0, nextCursor: null };

    const response: Category[] = categories.docs?.map((doc: FirebaseFirestore.DocumentData) => modelCategory(doc))

    const hasNextPage = response.length > pageLimit;
    const docs = hasNextPage ? response.slice(0, pageLimit) : response;
    const lastDoc = docs[docs.length - 1];

    return {
      data: docs,
      results: docs.length,
      nextCursor: hasNextPage ? {
        date: lastDoc.created_at.toISOString(),
        id: lastDoc.id!,
      } : null
    };
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.firestoreService.categories
      .doc(id)
      .get()

    if (!category.exists) return null;

    return modelCategory(category);
  }

  async create(params: Category): Promise<Category> {
    const docRef = this.firestoreService.categories.doc()
    await docRef.create(params)

    return {
      id: docRef.id,
      ...params,
    }
  }

  async update(id: string, params: UpdateCategory): Promise<void> {
    await this.firestoreService.categories
      .doc(id)
      .set(params, { merge: true })
  }

  async delete(id: string) {
    await this.firestoreService.categories
      .doc(id)
      .delete()
  }
}