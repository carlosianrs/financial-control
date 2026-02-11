import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { GetUserDto } from "./dto/users.dto";
import { UsersService } from "./users.service";
import { AtGuard } from "src/common/guards/at.guard";

@UseGuards(AtGuard)
@Controller('user')
export class UsersController {
  constructor (
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findMany(@Query() params: GetUserDto) {
    return await this.usersService.findMany(params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador do relatório');

    return await this.usersService.findById(id);
  }
}