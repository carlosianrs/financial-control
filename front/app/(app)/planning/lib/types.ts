export type Planning = {
  id: string;
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