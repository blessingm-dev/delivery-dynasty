
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Store } from "lucide-react";
import { MenuItemForm } from "@/components/menu/menu-item-form";
import { MenuItemsTable } from "@/components/menu/menu-items-table";
import { MenuItemsEmpty } from "@/components/menu/menu-items-empty";
import { useMenuItems } from "@/hooks/use-menu-items";
import { MenuItem, MenuItemFormData } from "@/types/menu-item";
import { useRestaurant } from "@/hooks/use-restaurant";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MenuItems() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { restaurant, isLoading: isLoadingRestaurant } = useRestaurant(user?.id);

  const {
    menuItems,
    isLoading,
    error,
    addMenuItem,
    isAddingMenuItem,
    updateMenuItem,
    isUpdatingMenuItem,
    deleteMenuItem,
    toggleAvailability
  } = useMenuItems();

  const emptyFormData: MenuItemFormData = {
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category: "",
    is_available: true,
    restaurant_id: restaurant?.id || null
  };

  const handleSubmit = (formData: MenuItemFormData, imageFile?: File) => {
    if (editingItem) {
      updateMenuItem({ id: editingItem.id, data: formData, imageFile });
      setEditingItem(null);
    } else {
      addMenuItem({ data: formData, imageFile });
      setIsAddingItem(false);
    }
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingItem(false);
  };

  const handleCancelForm = () => {
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const isSubmitting = isAddingMenuItem || isUpdatingMenuItem;
  const showForm = isAddingItem || editingItem !== null;

  if (!user || user.role !== "vendor") {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-muted-foreground">Only vendors can access this page.</p>
      </div>
    );
  }

  if (isLoadingRestaurant) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-muted-foreground">Loading restaurant information...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Store className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground text-center">
          You need to set up your restaurant before adding menu items.
        </p>
        <Button 
          onClick={() => {
            navigate('/dashboard/restaurant-setup');
            toast.info("Please set up your restaurant first");
          }}
        >
          Set Up Restaurant
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Menu Items</h1>
        {!showForm && (
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add New Item
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </CardTitle>
            <CardDescription>
              {editingItem ? "Update the details for this menu item" : "Enter the details for your new menu item"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MenuItemForm
              initialData={editingItem || emptyFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      )}

      {error ? (
        <div className="flex justify-center p-8">
          <p className="text-destructive">Error loading menu items</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Menu Items</CardTitle>
            <CardDescription>
              Manage your restaurant's offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {menuItems && menuItems.length > 0 ? (
              <MenuItemsTable
                items={menuItems}
                onToggleAvailability={(id, isAvailable) => toggleAvailability({ id, isAvailable })}
                onEdit={handleStartEdit}
                onDelete={deleteMenuItem}
                isLoading={isLoading}
              />
            ) : !isLoading ? (
              <MenuItemsEmpty onAddItem={() => setIsAddingItem(true)} />
            ) : (
              <div className="flex justify-center p-8">
                <p>Loading menu items...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
