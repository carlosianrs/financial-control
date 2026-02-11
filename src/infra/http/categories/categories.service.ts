import { Injectable } from "@nestjs/common";
import { GetCategoryDto } from "./dto/categories.dto";
import { CategoriesRepository } from "src/infra/database/firestore/repositories/categories.repository";

@Injectable()
export class CategoriesService {
  constructor (
    private readonly categoriesRepository: CategoriesRepository
  ) {}

  async findMany(params: GetCategoryDto) {
    await this.categoriesRepository.findAll(params);
  }

  async findById(id: string) {
    await this.categoriesRepository.findById(id);
  }
}