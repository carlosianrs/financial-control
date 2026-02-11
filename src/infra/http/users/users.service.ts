import { Injectable } from "@nestjs/common";
import { UsersRepository } from "src/infra/database/firestore/repositories/users.repository";
import { GetUserDto } from "./dto/users.dto";

@Injectable()
export class UsersService {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}

  async findMany(params: GetUserDto) {
    await this.usersRepository.findAll(params);
  }

  async findById(id: string) {
    await this.usersRepository.findById(id);
  }
}