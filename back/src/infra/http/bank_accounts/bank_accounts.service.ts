import { Injectable } from "@nestjs/common";
import { CreateBankAccountDto, GetBankAccountDto } from "./dto/bank_accounts.dto";
import { modelCreateBankAccount } from "src/infra/database/firestore/mappers/bank_accounts.mapper";
import { BankAccountsRepository } from "src/infra/database/firestore/repositories/bank_accounts.repository";

@Injectable()
export class BankAccountsService {
  constructor (
    private readonly bankAccountsRepository: BankAccountsRepository
  ) {}

  async findMany(params: GetBankAccountDto) {
    return await this.bankAccountsRepository.findAll(params);
  }

  async findById(id: string) {
    return await this.bankAccountsRepository.findById(id);
  }

  async create(params: CreateBankAccountDto) {
    const model = modelCreateBankAccount(params);
    await this.bankAccountsRepository.create(model);
    return { message: 'Conta criada com sucesso' }
  }

  async update(id: string, params: CreateBankAccountDto) {
    const { created_at, ...model } = modelCreateBankAccount(params);
    await this.bankAccountsRepository.update(id, model);
    return { message: 'Conta atualizada com sucesso' }
  }
}