import { Injectable } from "@nestjs/common";
import { FirestoreService } from "../firestore.service";
import { UpdateUser, User } from "../types/users.type";
import { modelUser } from "../mappers/users.mapper";
import { GetUserDto } from "src/infra/http/users/dto/users.dto";
import { SignUpDto } from "src/infra/http/auth/dto/auth.dto";

@Injectable()
export class UsersRepository {
  constructor (
    private readonly firestoreService: FirestoreService
  ) {}

  async findAll(params: GetUserDto) {
    let query: any = this.firestoreService.users;

    Object.keys(params).forEach(key => {
      if (params[key]) {
        query = query.where(key, '==', params[key])
      }
    })

    const users = await query.get();
    if (users.empty) return { data: [], results: 0 }

    const response: User[] = users?.docs?.map((doc: FirebaseFirestore.DocumentData) => modelUser(doc))

    return { data: response, results: response.length };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.firestoreService.users
      .doc(id)
      .get()

    if (!user.exists) return null;

    return modelUser(user);
  }

  async create(params: User) {
    const docRef = this.firestoreService.users.doc();
    await docRef.create(params);

    return {
      id: docRef.id,
      ...params
    }
  }

  async updateUser(id: string, params: UpdateUser): Promise<void> {
    await this.firestoreService.users
      .doc(id)
      .set(params, { merge: true })
  }

  async delete(id: string) {
    await this.firestoreService.users
      .doc(id)
      .delete()
  }
}