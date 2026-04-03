import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/infra/database/database.module";
import { BankAccountsController } from "./bank_accounts.controller";
import { BankAccountsService } from "./bank_accounts.service";

@Module({
  imports: [DatabaseModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}