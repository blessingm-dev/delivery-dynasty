
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Restaurant } from "@/types/restaurant";
import { Order } from "@/hooks/use-orders";

export interface RestaurantWithAnalytics extends Restaurant {
  totalSales?: number;
  totalOrders?: number;
  averageOrderValue?: number;
}

export function useAdminRestaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const restaurantsQuery = useQuery({
    queryKey: ["admin-restaurants", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("restaurants")
        .select("*");

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Fetch orders for each restaurant to calculate analytics
      const restaurantsWithAnalytics: RestaurantWithAnalytics[] = [];
      
      for (const restaurant of data as Restaurant[]) {
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("restaurant_id", restaurant.id);
          
        if (ordersError) throw ordersError;
        
        const totalSales = orders?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;
        const totalOrders = orders?.length || 0;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        restaurantsWithAnalytics.push({
          ...restaurant,
          totalSales,
          totalOrders,
          averageOrderValue
        });
      }
      
      return restaurantsWithAnalytics;
    }
  });

  return {
    restaurants: restaurantsQuery.data || [],
    isLoading: restaurantsQuery.isLoading,
    error: restaurantsQuery.error,
    searchQuery,
    setSearchQuery
  };
}
