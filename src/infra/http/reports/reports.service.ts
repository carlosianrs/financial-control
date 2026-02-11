import { Injectable } from "@nestjs/common";
import { ReportsRepository } from "src/infra/database/firestore/repositories/reports.repository";
import { GetReportDto } from "./dto/reports.dto";

@Injectable()
export class ReportsService {
  constructor (
    private readonly reportsRepository: ReportsRepository
  ) {}

  async findMany(params: GetReportDto) {
    await this.reportsRepository.findAll(params);
  }

  async findById(id: string) {
    await this.reportsRepository.findById(id);
  }
}