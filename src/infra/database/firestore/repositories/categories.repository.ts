import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { User } from "../types/users.type";
import { modelUser } from "../mappers/users.mapper";
import { GetCategoryDto } from "src/infra/http/categories/dto/categories.dto";
import { Category, UpdateCategory } from "../types/categories.type";

@Injectable()
export class CategoriesRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll(params: GetCategoryDto): Promise<{ data: Category[], results: number }> {
    let query: any = this.firestoreService.categories;

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    const categories = await query.get();
    if (categories.empty) return { data: [], results: 0 }

    const response: Category[] = categories.map((doc: FirebaseFirestore.DocumentData) => modelUser(doc))

    return { data: response, results: response.length };
  }

  async findById(id: string): Promise<User | null> {
    const category = await this.firestoreService.categories
      .doc(id)
      .get()

    if (!category.exists) return null;

    return modelUser(category);
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