
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopularItem {
  id: number;
  name: string;
  price: string;
  orders: number;
  image: string;
}

interface PopularItemsCardProps {
  items: PopularItem[];
}

export function PopularItemsCard({ items }: PopularItemsCardProps) {
  return (
    <Card className="hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ChefHat className="h-5 w-5 mr-2 text-primary" />
          Popular Items
        </CardTitle>
        <CardDescription>Your most ordered menu items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-accent/50 rounded-md transition-colors">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">{item.price}</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {item.orders} orders
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="ghost" className="w-full">Manage Menu</Button>
      </CardFooter>
    </Card>
  );
}
