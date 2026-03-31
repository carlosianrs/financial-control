import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service";

@Injectable()
export class FirestoreService {
  constructor (firebaseService: FirebaseAdminService) {
    this.firestore = firebaseService.firestore();
    this.users = this.firestore.collection('users');
    this.transactions = this.firestore.collection('transactions');
    this.categories = this.firestore.collection('categories');
    this.bank_accounts = this.firestore.collection('bank_accounts');
  }
  
  private firestore: FirebaseFirestore.Firestore;
  public users: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  public transactions: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  public categories: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  public bank_accounts: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
}