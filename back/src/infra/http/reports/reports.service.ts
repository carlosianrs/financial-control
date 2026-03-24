import { Injectable } from "@nestjs/common";
import { ReportsRepository } from "src/infra/database/firestore/repositories/reports.repository";
import { CreateReportDto, GetReportDto } from "./dto/reports.dto";
import { modelCreateReport } from "src/infra/database/firestore/mappers/reports.mapper";

@Injectable()
export class ReportsService {
  constructor (
    private readonly reportsRepository: ReportsRepository
  ) {}

  async findMany(user_id: string, params: GetReportDto) {
    return await this.reportsRepository.findAll(user_id, params);
  }

  async findById(id: string) {
    return await this.reportsRepository.findById(id);
  }

  async create(params: CreateReportDto) {
    const model = modelCreateReport(params);
    await this.reportsRepository.create(model);
    return { message: 'Relatório criado com sucesso' };
  }

  async update(id: string, params: CreateReportDto) {
    const { created_at, ...model } = modelCreateReport(params);
    await this.reportsRepository.update(id, model);
    return { message: 'Relatório atualizado com sucesso' };
  }
}