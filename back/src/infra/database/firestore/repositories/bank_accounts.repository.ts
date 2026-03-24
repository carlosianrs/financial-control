import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { GetBankAccountDto } from "src/infra/http/bank_accounts/dto/bank_accounts.dto";
import { BankAccount, UpdateBankAccount } from "../types/bank_accounts.type";
import { modelBankAccount } from "../mappers/bank_accounts.mapper";

@Injectable()
export class BankAccountsRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll(params: GetBankAccountDto): Promise<{ data: BankAccount[], results: number }> {
    let query: any = this.firestoreService.bank_accounts;

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    const bank_accounts = await query.get();
    if (bank_accounts.empty) return { data: [], results: 0 }

    const response: BankAccount[] = bank_accounts.map((doc: FirebaseFirestore.DocumentData) => modelBankAccount(doc))

    return { data: response, results: response.length };
  }

  async findById(id: string): Promise<BankAccount | null> {
    const bank_account = await this.firestoreService.bank_accounts
      .doc(id)
      .get()

    if (!bank_account.exists) return null;

    return modelBankAccount(bank_account);
  }

  async create(params: BankAccount): Promise<BankAccount> {
    const docRef = this.firestoreService.bank_accounts.doc()
    await docRef.create(params)

    return {
      id: docRef.id,
      ...params,
    }
  }

  async update(id: string, params: UpdateBankAccount): Promise<void> {
    await this.firestoreService.bank_accounts
      .doc(id)
      .set(params, { merge: true })
  }

  async delete(id: string) {
    await this.firestoreService.bank_accounts
      .doc(id)
      .delete()
  }
}