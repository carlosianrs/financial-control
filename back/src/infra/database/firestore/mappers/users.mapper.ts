import { SignUpDto } from "src/infra/http/auth/dto/auth.dto";
import { User } from "../types/users.type";

export const modelUser = (doc: FirebaseFirestore.DocumentData): User => ({
  id: doc.id,
  user_id: doc.data()?.user_id,
  name: doc.data()?.name,
  username: doc.data()?.username,
  refresh_token: doc.data()?.refresh_token,
  created_at: doc.data().created_at?.toDate(),
  updated_at: doc.data().updated_at?.toDate(),
})

export const modelCreateUser = (params: SignUpDto, uid: string): User => ({
  user_id: uid,
  name: params.name,
  username: params.username,
  refresh_token: null,
  created_at: new Date,
  updated_at: new Date(),
})