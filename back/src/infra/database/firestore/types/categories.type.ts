export type Category = {
  id?: string;
  name: string;
  description: string;
  icon_name: string | null;
  icon_color: string | null;
  created_at: Date;
  updated_at: Date;
}

export type UpdateCategory = {
  name: string;
  icon_name: string | null;
  icon_color: string | null;
  updated_at: Date;
}