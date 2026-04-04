import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateTransactionDto, GetTransactionDto } from "./dto/transactions.dto";
import { TransactionsService } from "./transactions.service";
import { AtGuard } from "src/common/guards/at.guard";
import { GetCurrentUser } from "src/common/decorators/getUser.decorator";

@UseGuards(AtGuard)
@Controller('transaction')
export class TransactionsController {
  constructor (
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  async findMany(@GetCurrentUser('user_id') user_id: string, @Query() params: GetTransactionDto) {
    return await this.transactionsService.findMany(user_id, params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador da transação');

    return await this.transactionsService.findById(id);
  }

  @Post()
  async create(@Body() params: CreateTransactionDto, @GetCurrentUser('user_id') userId: string) {
    return await this.transactionsService.create(userId, params);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() params: CreateTransactionDto, @GetCurrentUser('user_id') userId: string) {
    if (!id) throw new BadRequestException('Informar identificador da transação');
    
    return await this.transactionsService.update(userId, id, params);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador da transação')

    return await this.transactionsService.delete(id);
  }
}