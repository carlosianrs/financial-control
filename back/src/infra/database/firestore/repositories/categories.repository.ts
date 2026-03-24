import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { ResponseFirebase, User } from "../types/users.type";
import { GetCategoryDto } from "src/infra/http/categories/dto/categories.dto";
import { Category, UpdateCategory } from "../types/categories.type";
import { modelCategory } from "../mappers/categories.mapper";
import { Timestamp } from "firebase-admin/firestore";

@Injectable()
export class CategoriesRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll({ limit, nextId, nextCreatedAt, ...params }: GetCategoryDto): Promise<ResponseFirebase<Category[]>> {
    let query: any = this.firestoreService.categories;

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    query = query.orderBy("created_at", "desc").orderBy("__name__", "desc").limit(limit || 10);

    if (nextCreatedAt && nextId) {
      query = query.startAfter(Timestamp.fromDate(new Date(nextCreatedAt)), nextId);
    }

    const categories = await query.get();
    if (categories.empty) return { data: [], results: 0, nextCursor: null };

    const response: Category[] = categories.docs?.map((doc: FirebaseFirestore.DocumentData) => modelCategory(doc))

    const lastDoc = categories.docs[categories.docs.length - 1];

    return {
      data: response,
      results: response.length,
      nextCursor: {
        created_at: lastDoc?.data()?.created_at?.toDate() || null,
        id: lastDoc.id,
      }
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