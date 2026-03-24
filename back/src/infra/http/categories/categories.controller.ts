import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateCategoryDto, GetCategoryDto } from "./dto/categories.dto";
import { CategoriesService } from "./categories.service";
import { AtGuard } from "src/common/guards/at.guard";

@UseGuards(AtGuard)
@Controller('category')
export class CategoriesController {
  constructor (
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async findMany(@Query() params: GetCategoryDto) {
    return await this.categoriesService.findMany(params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador da categoria');

    return await this.categoriesService.findById(id);
  }

  @Post()
  async create(@Body() params: CreateCategoryDto) {
    return await this.categoriesService.create(params);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() params: CreateCategoryDto) {
    if (!id) throw new BadRequestException('Informar identificador da categoria');

    return await this.categoriesService.update(id, params);
  }
}