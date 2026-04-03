export type ResPlanning = {
  id?: string;
  category: {
    id: string;
    name: string;
    icon_name: string;
    icon_color: string;
  };
  description: string;
  value: number;
  month: string;
  year: string;
  created_at: Date;
  updated_at: Date;
}

export type Planning = {
  id?: string;
  user_id: string;
  category_id: string;
  description: string;
  value: number;
  month: string;
  year: string;
  created_at: Date;
  updated_at: Date;
}

export type UpdatePlanning = {
  category_id: string;
  description: string;
  value: number;
  month: string;
  year: string;
  updated_at: Date;
}