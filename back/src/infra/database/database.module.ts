import { Module } from "@nestjs/common";
import { FirebaseAdminModule } from "./firebase-admin/firebase-admin.module";
import { FirebaseAdminService } from "./firebase-admin/firebase-admin.service";
import { FirestoreService } from "./firestore/firestore.service";
import { ReportsRepository } from "./firestore/repositories/reports.repository";
import { UsersRepository } from "./firestore/repositories/users.repository";
import { CategoriesRepository } from "./firestore/repositories/categories.repository";
import { BankAccountsRepository } from "./firestore/repositories/bank_accounts.repository";

@Module({
  imports: [FirebaseAdminModule],
  providers: [
    FirebaseAdminService,
    FirestoreService,
    ReportsRepository,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
  ],
  exports: [
    FirebaseAdminService,
    FirestoreService,
    ReportsRepository,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
  ]
})
export class DatabaseModule {}