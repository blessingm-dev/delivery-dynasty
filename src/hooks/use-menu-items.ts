
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemFormData } from "@/types/menu-item";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRestaurant } from "./use-restaurant";
import { v4 as uuidv4 } from 'uuid';

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

  // Function to upload an image to Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${restaurant?.id}/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const addMenuItemMutation = useMutation({
    mutationFn: async ({ data: newItem, imageFile }: { data: MenuItemFormData, imageFile?: File }) => {
      if (!restaurant?.id) {
        throw new Error("No restaurant found");
      }
      
      let itemData = { ...newItem, restaurant_id: restaurant.id, vendor_id: user?.id };
      
      // If there's an image file, upload it
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          itemData.image_url = imageUrl;
        } catch (error) {
          toast.error("Failed to upload image");
          throw error;
        }
      }
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert([itemData])
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
    mutationFn: async ({ id, data, imageFile }: { id: string, data: MenuItemFormData, imageFile?: File }) => {
      let itemData = { ...data };
      
      // If there's an image file, upload it
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          itemData.image_url = imageUrl;
        } catch (error) {
          toast.error("Failed to upload image");
          throw error;
        }
      }
      
      const { data: updatedItem, error } = await supabase
        .from('menu_items')
        .update(itemData)
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
      // Get the item to find the image URL
      const { data: item } = await supabase
        .from('menu_items')
        .select('image_url')
        .eq('id', id)
        .single();
      
      // Delete the menu item
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // If there's an image, try to delete it from storage
      if (item?.image_url) {
        try {
          // Extract the file path from the URL
          const url = new URL(item.image_url);
          const pathParts = url.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          const filePath = `${restaurant?.id}/${fileName}`;
          
          await supabase.storage
            .from('menu-images')
            .remove([filePath]);
        } catch (error) {
          console.error("Error deleting image file:", error);
          // Continue with the deletion even if image deletion fails
        }
      }
      
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
