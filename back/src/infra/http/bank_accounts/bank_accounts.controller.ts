import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AtGuard } from "src/common/guards/at.guard";
import { BankAccountsService } from "./bank_accounts.service";
import { CreateBankAccountDto, GetBankAccountDto } from "./dto/bank_accounts.dto";

@UseGuards(AtGuard)
@Controller('bank_account')
export class BankAccountsController {
  constructor (
    private readonly bankAccountsService: BankAccountsService,
  ) {}

  @Get()
  async findMany(@Query() params: GetBankAccountDto) {
    return await this.bankAccountsService.findMany(params);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Informar identificador da conta');

    return await this.bankAccountsService.findById(id);
  }

  @Post()
  async create(@Body() params: CreateBankAccountDto) {
    return await this.bankAccountsService.create(params);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() params: CreateBankAccountDto) {
    if (!id) throw new BadRequestException('Informar identificador da conta');

    return await this.bankAccountsService.update(id, params);
  }
}