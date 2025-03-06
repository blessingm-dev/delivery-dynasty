
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit, Trash, Check, X, Image, Utensils, DollarSign, FileText, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  created_at: string;
}

type MenuItemFormData = Omit<MenuItem, 'id' | 'created_at'>;

const categories = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Sides",
  "Specials"
];

export default function MenuItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category: "",
    is_available: true
  });

  // Fetch menu items
  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('vendor_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!user?.id
  });

  // Add menu item mutation
  const addMenuItem = useMutation({
    mutationFn: async (newItem: MenuItemFormData) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([
          { ...newItem, vendor_id: user?.id }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Menu item added successfully");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (error) => {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
    }
  });

  // Delete menu item mutation
  const deleteMenuItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast.success("Menu item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (error) => {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  });

  // Toggle availability mutation
  const toggleAvailability = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      toast.error("Name and valid price are required");
      return;
    }
    addMenuItem.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image_url: "",
      category: "",
      is_available: true
    });
    setIsAddingItem(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, price: isNaN(value) ? 0 : value }));
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_available: checked }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  if (!user || user.role !== "vendor") {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-muted-foreground">Only vendors can access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Menu Items</h1>
        {!isAddingItem && (
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add New Item
          </Button>
        )}
      </div>

      {isAddingItem && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add New Menu Item</CardTitle>
            <CardDescription>Enter the details for your new menu item</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Utensils className="h-4 w-4" /> Item Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Chicken Burger"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Price *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Category
                  </Label>
                  <Select value={formData.category || ""} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="flex items-center gap-2">
                    <Image className="h-4 w-4" /> Image URL
                  </Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    placeholder="Describe your menu item..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={handleAvailabilityChange}
                  />
                  <Label htmlFor="is_available" className="cursor-pointer">
                    Available for ordering
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMenuItem.isPending}>
                  {addMenuItem.isPending ? "Adding..." : "Add Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading menu items...</p>
        </div>
      ) : error ? (
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
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 font-medium bg-muted text-muted-foreground text-sm">
                  <div className="col-span-6 md:col-span-3">Name</div>
                  <div className="hidden md:block md:col-span-3">Category</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {menuItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 p-4 items-center">
                      <div className="col-span-6 md:col-span-3 font-medium">{item.name}</div>
                      <div className="hidden md:block md:col-span-3 text-muted-foreground">
                        {item.category || "Uncategorized"}
                      </div>
                      <div className="col-span-2">${parseFloat(item.price.toString()).toFixed(2)}</div>
                      <div className="col-span-2">
                        <Badge variant={item.is_available ? "default" : "outline"}>
                          {item.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleAvailability.mutate({ 
                            id: item.id, 
                            isAvailable: !item.is_available 
                          })}
                          disabled={toggleAvailability.isPending}
                        >
                          {item.is_available ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          // Edit functionality would be added here
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this item?")) {
                              deleteMenuItem.mutate(item.id);
                            }
                          }}
                          disabled={deleteMenuItem.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No menu items yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first menu item to get started
                </p>
                {!isAddingItem && (
                  <Button onClick={() => setIsAddingItem(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Menu Item
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
