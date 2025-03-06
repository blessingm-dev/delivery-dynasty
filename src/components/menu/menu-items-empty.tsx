
import { Button } from "@/components/ui/button";
import { Utensils, Plus } from "lucide-react";

interface MenuItemsEmptyProps {
  onAddItem: () => void;
}

export function MenuItemsEmpty({ onAddItem }: MenuItemsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No menu items yet</h3>
      <p className="text-muted-foreground mb-4">
        Add your first menu item to get started
      </p>
      <Button onClick={onAddItem}>
        <Plus className="h-4 w-4 mr-2" /> Add Menu Item
      </Button>
    </div>
  );
}
