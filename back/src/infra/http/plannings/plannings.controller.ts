import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreatePlanningDto, GetPlanningDto } from "./dto/plannings.dto";
import { PlanningsService } from "./plannings.service";
import { AtGuard } from "src/common/guards/at.guard";

@UseGuards(AtGuard)
@Controller('planning')
export class PlanningsController {
  constructor (
    private readonly planningsService: PlanningsService,
  ) {}

  @Get()
  async findMany(@Query() params: GetPlanningDto) {
    return await this.planningsService.findMany(params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador do planejamento');

    return await this.planningsService.findById(id);
  }

  @Post()
  async create(@Body() params: CreatePlanningDto) {
    return await this.planningsService.create(params);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() params: CreatePlanningDto) {
    if (!id) throw new BadRequestException('Informar identificador do planejamento');

    return await this.planningsService.update(id, params);
  }
}