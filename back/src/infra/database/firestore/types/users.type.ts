export type ResponseFirebase<T> = {
  data: T;
  results: number;
  nextCursor: {
    created_at: string;
    id: string;
  } | null;
}

export type User = {
  id?: string;
  name: string;
  username: string;
  user_id: string;
  refresh_token: string | null;
  created_at: Date;
  updated_at: Date;
}

export type UpdateUser = {
  name?: string;
  username?: string;
  refresh_token?: string | null;
}