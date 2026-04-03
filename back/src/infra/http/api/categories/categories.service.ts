import { Injectable } from "@nestjs/common";
import { CreateCategoryDto, GetCategoryDto } from "./dto/categories.dto";
import { CategoriesRepository } from "src/infra/database/firestore/repositories/categories.repository";
import { modelCategory, modelCreateCategory } from "src/infra/database/firestore/mappers/categories.mapper";

@Injectable()
export class CategoriesService {
  constructor (
    private readonly categoriesRepository: CategoriesRepository
  ) {}

  async findMany(params: GetCategoryDto) {
    return await this.categoriesRepository.findAll(params);
  }

  async findById(id: string) {
    return await this.categoriesRepository.findById(id);
  }

  async create(params: CreateCategoryDto) {
    const model = modelCreateCategory(params);
    await this.categoriesRepository.create(model);
    return { message: 'Categoria criada com sucesso' };
  }

  async update(id: string, params: CreateCategoryDto) {
    const model = modelCreateCategory(params);
    await this.categoriesRepository.update(id, model);
    return { message: 'Categoria atualizada com sucesso' };
  }
}