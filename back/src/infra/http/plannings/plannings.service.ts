import { BadRequestException, Injectable } from "@nestjs/common";
import { PlanningsRepository } from "src/infra/database/firestore/repositories/plannings.repository";
import { CreatePlanningDto, GetPlanningDto } from "./dto/plannings.dto";
import { modelCreatePlanning } from "src/infra/database/firestore/mappers/plannings.mapper";

@Injectable()
export class PlanningsService {
  constructor (
    private readonly planningsRepository: PlanningsRepository
  ) {}

  async findMany(params: GetPlanningDto) {
    return await this.planningsRepository.findAll(params);
  }

  async findById(id: string) {
    return await this.planningsRepository.findById(id);
  }

  async create(params: CreatePlanningDto) {
    const model = modelCreatePlanning(params);

    const planningWithCategoryExists = await this.planningsRepository.findAll({
      category_id: model.category_id,
      month: params.month,
      year: params.year
    })
    
    if (planningWithCategoryExists.results) {
      throw new BadRequestException(`Já existe um planejamento com a categoria ${planningWithCategoryExists.data.at(0)?.category.name}`)
    }

    await this.planningsRepository.create(model);
    return { message: 'Categoria criada com sucesso' };
  }

  async update(id: string, params: CreatePlanningDto) {
    const model = modelCreatePlanning(params);
    await this.planningsRepository.update(id, model);
    return { message: 'Categoria atualizada com sucesso' };
  }
}