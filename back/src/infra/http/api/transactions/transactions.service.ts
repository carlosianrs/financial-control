import { Injectable } from "@nestjs/common";
import { TransactionsRepository } from "src/infra/database/firestore/repositories/transactions.repository";
import { CreateTransactionDto, GetTransactionDto } from "./dto/transactions.dto";
import { modelCreateTransaction } from "src/infra/database/firestore/mappers/transactions.mapper";

@Injectable()
export class TransactionsService {
  constructor (
    private readonly transactionsRepository: TransactionsRepository
  ) {}

  async findMany(user_id: string, params: GetTransactionDto) {
    return await this.transactionsRepository.findAll(user_id, params);
  }

  async findById(id: string) {
    return await this.transactionsRepository.findById(id);
  }

  async create(userId: string, params: CreateTransactionDto) {
    const model = modelCreateTransaction(userId, params);
    await this.transactionsRepository.create(model);
    return { message: 'Relatório criado com sucesso' };
  }

  async update(userId: string, id: string, params: CreateTransactionDto) {
    const { created_at, ...model } = modelCreateTransaction(userId, params);
    await this.transactionsRepository.update(id, model);
    return { message: 'Relatório atualizado com sucesso' };
  }
}