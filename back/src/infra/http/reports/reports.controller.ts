import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateReportDto, GetReportDto } from "./dto/reports.dto";
import { ReportsService } from "./reports.service";
import { AtGuard } from "src/common/guards/at.guard";
import { GetCurrentUser } from "src/common/decorators/getUser.decorator";

@UseGuards(AtGuard)
@Controller('report')
export class ReportsController {
  constructor (
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  async findMany(@GetCurrentUser('user_id') user_id: string, @Query() params: GetReportDto) {
    return await this.reportsService.findMany(user_id, params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador do relatório');

    return await this.reportsService.findById(id);
  }

  @Post()
  async create(@Body() params: CreateReportDto) {
    return await this.reportsService.create(params);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() params: CreateReportDto) {
    if (!id) throw new BadRequestException('Informar identificador do relatório');
    
    return await this.reportsService.update(id, params);
  }
}