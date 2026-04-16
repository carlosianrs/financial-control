import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { Month, Transaction, UpdateTransaction } from "../types/transactions.type";
import { modelTransaction } from "../mappers/transactions.mapper";
import { Timestamp } from "firebase-admin/firestore";
import { ResponseFirebase } from "../types/users.type";
import { GetTransactionDto } from "src/infra/http/api/transactions/dto/transactions.dto";

@Injectable()
export class TransactionsRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll(user_id: string, { limit, nextDate, nextId, ...params }: GetTransactionDto): Promise<ResponseFirebase<Transaction[]>> {
    let query: any = this.firestoreService.transactions.where("user_id", "==", user_id);

    Object.keys(params).forEach(key => {
      if (params[key]) {
        if (key == 'month' || key == 'year') return;
        query = query.where(key, '==', params[key])
      }
    })

    const monthNum = Number(Month[params.month]);
    const yearNum = Number(params.year);

    if (!monthNum || !yearNum) {
      throw new Error("Mês/ano inválidos");
    }

    const start = new Date(yearNum, monthNum - 1, 1);
    const end = new Date(yearNum, monthNum, 1);

    query = query
      .where("payment_date", ">=", start)
      .where("payment_date", "<", end)
      .orderBy("payment_date", "desc")
      .orderBy("__name__", "desc").limit(limit || 10);

    if (nextDate && nextId) {
      query = query.startAfter(Timestamp.fromDate(new Date(nextDate)), nextId);
    }

    const transactions = await query.get();
    if (transactions.empty) return { data: [], results: 0, nextCursor: null }

    const categoryIds = new Set<string>();
    const bankAccountIds = new Set<string>();
    for (const doc of transactions.docs) {
      if (doc.data()?.category_id) categoryIds.add(doc.data().category_id)
      if (doc.data()?.bank_account_id) bankAccountIds.add(doc.data().bank_account_id)
    }

    const categories = await this.firestoreService.categories.where("__name__", "in", Array.from(categoryIds)).get();
    const categoryMap = new Map(categories.docs.map(doc => {
      const data = doc.data();

      return [doc.id, {
        id: doc.id,
        name: data.name,
        icon_name: data.icon_name,
        icon_color: data.icon_color,
      }]
    }));

    const bankAccounts = await this.firestoreService.bank_accounts.where("__name__", "in", Array.from(bankAccountIds)).get();
    const bankAccountMap = new Map(bankAccounts.docs.map(doc => {
      const data = doc.data();

      return [doc.id, {
        id: doc.id,
        name: data.name,
        icon_path: data.icon_path,
        icon_color: data.icon_color,
      }]
    }));

    const response: Transaction[] = transactions?.docs?.map((doc: FirebaseFirestore.DocumentData) => {
      return {
        ...modelTransaction(doc),
        category: categoryMap.get(doc.data()?.category_id) || null,
        bank_account: bankAccountMap.get(doc.data()?.bank_account_id) || null,
      }
    })

    const lastDoc = transactions.docs[transactions.docs.length - 1];

    return {
      data: response,
      results: response.length,
      nextCursor: {
        date: lastDoc?.data()?.payment_date?.toDate() || null,
        id: lastDoc.id,
      }
    };
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.firestoreService.transactions
      .doc(id)
      .get()

    if (!transaction.exists) return null;

    return modelTransaction(transaction);
  }

  async create(params: Transaction): Promise<Transaction> {
    const docRef = this.firestoreService.transactions.doc();
    await docRef.create(params);

    return {
      id: docRef.id,
      ...params
    }
  }

  async update(id: string, params: UpdateTransaction): Promise<void> {
    await this.firestoreService.transactions
      .doc(id)
      .set(params, { merge: true })
  }

  async delete(id: string): Promise<void> {
    await this.firestoreService.transactions
      .doc(id)
      .delete()
  }
}