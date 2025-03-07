
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemFormData } from "@/types/menu-item";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRestaurant } from "./use-restaurant";

export function useMenuItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { restaurant } = useRestaurant(user?.id);

  const menuItemsQuery = useQuery({
    queryKey: ['menuItems', restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!restaurant?.id
  });

  const addMenuItemMutation = useMutation({
    mutationFn: async (newItem: MenuItemFormData) => {
      if (!restaurant?.id) {
        throw new Error("No restaurant found");
      }
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert([
          { 
            ...newItem, 
            vendor_id: user?.id,
            restaurant_id: restaurant.id
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Menu item added successfully");
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurant?.id] });
    },
    onError: (error) => {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
    }
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: MenuItemFormData }) => {
      const { data: updatedItem, error } = await supabase
        .from('menu_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedItem;
    },
    onSuccess: () => {
      toast.success("Menu item updated successfully");
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurant?.id] });
    },
    onError: (error) => {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item");
    }
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success("Menu item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurant?.id] });
    },
    onError: (error) => {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string, isAvailable: boolean }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ is_available: isAvailable })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Item ${data.is_available ? 'available' : 'unavailable'}`);
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurant?.id] });
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  });

  return {
    menuItems: menuItemsQuery.data || [],
    isLoading: menuItemsQuery.isLoading,
    error: menuItemsQuery.error,
    addMenuItem: addMenuItemMutation.mutate,
    isAddingMenuItem: addMenuItemMutation.isPending,
    updateMenuItem: updateMenuItemMutation.mutate,
    isUpdatingMenuItem: updateMenuItemMutation.isPending,
    deleteMenuItem: deleteMenuItemMutation.mutate,
    isDeletingMenuItem: deleteMenuItemMutation.isPending,
    toggleAvailability: toggleAvailabilityMutation.mutate,
    isTogglingAvailability: toggleAvailabilityMutation.isPending
  };
}
