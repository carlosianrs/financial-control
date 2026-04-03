import { Module } from "@nestjs/common";
import { CategoriesModule } from "./api/categories/categories.module";
import { TransactionsModule } from "./api/transactions/transactions.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { BankAccountsModule } from "./api/bank_accounts/bank_accounts.module";
import { PlanningsModule } from "./api/plannings/plannings.module";

@Module({
  imports: [
    CategoriesModule,
    TransactionsModule,
    UsersModule,
    AuthModule,
    BankAccountsModule,
    PlanningsModule,
  ]
})
export class HttpModule {}