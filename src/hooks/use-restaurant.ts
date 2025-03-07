
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Restaurant, RestaurantFormData } from "@/types/restaurant";
import { toast } from "sonner";

export function useRestaurant(userId: string | undefined) {
  const queryClient = useQueryClient();

  const fetchRestaurant = async (id: string) => {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found - this is fine for new vendors
        return null;
      }
      throw error;
    }

    return data as Restaurant;
  };

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurant", userId],
    queryFn: () => (userId ? fetchRestaurant(userId) : null),
    enabled: !!userId,
  });

  return {
    restaurant,
    isLoading,
    error,
  };
}

export function useRestaurantMutation() {
  const queryClient = useQueryClient();

  const createRestaurant = async (restaurant: Restaurant) => {
    const { data, error } = await supabase.from("restaurants").insert(restaurant);

    if (error) {
      console.error("Error creating restaurant:", error);
      throw error;
    }

    return data;
  };

  const updateRestaurant = async (restaurant: Restaurant) => {
    const { data, error } = await supabase
      .from("restaurants")
      .update(restaurant)
      .eq("user_id", restaurant.user_id);

    if (error) {
      console.error("Error updating restaurant:", error);
      throw error;
    }

    return data;
  };

  const createRestaurantMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
  });

  const updateRestaurantMutation = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
  });

  return {
    createRestaurant: createRestaurantMutation.mutate,
    updateRestaurant: updateRestaurantMutation.mutate,
    isCreating: createRestaurantMutation.isPending,
    isUpdating: updateRestaurantMutation.isPending,
  };
}
