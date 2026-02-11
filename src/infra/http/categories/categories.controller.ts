import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { GetCategoryDto } from "./dto/categories.dto";
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
    if (!id) throw new BadRequestException('Informar identificador do relatório');

    return await this.categoriesService.findById(id);
  }
}