
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit, Trash } from "lucide-react";
import { MenuItem } from "@/types/menu-item";

interface MenuItemsTableProps {
  items: MenuItem[];
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function MenuItemsTable({ 
  items, 
  onToggleAvailability, 
  onEdit, 
  onDelete, 
  isLoading 
}: MenuItemsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 p-4 font-medium bg-muted text-muted-foreground text-sm">
        <div className="col-span-6 md:col-span-3">Name</div>
        <div className="hidden md:block md:col-span-3">Category</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="divide-y">
        {items.map((item) => (
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
                onClick={() => onToggleAvailability(item.id, !item.is_available)}
              >
                {item.is_available ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this item?")) {
                    onDelete(item.id);
                  }
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
