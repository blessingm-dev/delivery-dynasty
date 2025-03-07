
export interface Restaurant {
  id?: string;
  user_id: string;
  name: string;
  image: string;
  cuisine_type: string;
  rating: number;
  delivery_time: string;
  delivery_fee: string;
  address: string;
  featured?: boolean;
}

export type RestaurantFormData = Omit<Restaurant, "id" | "user_id" | "rating">;
