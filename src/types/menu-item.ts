
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  created_at: string;
  restaurant_id: string | null;
}

export type MenuItemFormData = Omit<MenuItem, 'id' | 'created_at'>;

export const MENU_CATEGORIES = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Sides",
  "Specials"
];
