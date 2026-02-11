import { BadRequestException, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { GetReportDto } from "./dto/reports.dto";
import { ReportsService } from "./reports.service";
import { AtGuard } from "src/common/guards/at.guard";

@UseGuards(AtGuard)
@Controller('report')
export class ReportsController {
  constructor (
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  async findMany(@Query() params: GetReportDto) {
    return await this.reportsService.findMany(params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador do relatório');

    return await this.reportsService.findById(id);
  }
}