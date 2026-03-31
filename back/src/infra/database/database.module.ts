import { Module } from "@nestjs/common";
import { FirebaseAdminModule } from "./firebase-admin/firebase-admin.module";
import { FirebaseAdminService } from "./firebase-admin/firebase-admin.service";
import { FirestoreService } from "./firestore/firestore.service";
import { TransactionsRepository } from "./firestore/repositories/transactions.repository";
import { UsersRepository } from "./firestore/repositories/users.repository";
import { CategoriesRepository } from "./firestore/repositories/categories.repository";
import { BankAccountsRepository } from "./firestore/repositories/bank_accounts.repository";

@Module({
  imports: [FirebaseAdminModule],
  providers: [
    FirebaseAdminService,
    FirestoreService,
    TransactionsRepository,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
  ],
  exports: [
    FirebaseAdminService,
    FirestoreService,
    TransactionsRepository,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
  ]
})
export class DatabaseModule {}