import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { BankAccountsModule } from "./bank_accounts/bank_accounts.module";

@Module({
  imports: [
    CategoriesModule,
    TransactionsModule,
    UsersModule,
    AuthModule,
    BankAccountsModule
  ]
})
export class HttpModule {}