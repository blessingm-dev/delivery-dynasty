
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ShoppingBag, Truck, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function CustomerDashboard() {
  // Mock data
  const activeOrders = [
    { 
      id: "ORD-1234", 
      restaurant: "Burger Palace", 
      status: "preparing", 
      progress: 40, 
      timeRemaining: "25-30 min"
    }
  ];
  
  const recentOrders = [
    { 
      id: "ORD-1122", 
      restaurant: "Pizza Heaven", 
      date: "Yesterday", 
      status: "delivered",
      items: 3
    },
    { 
      id: "ORD-1089", 
      restaurant: "Sushi Express", 
      date: "2 days ago", 
      status: "delivered",
      items: 2
    }
  ];
  
  const favoriteRestaurants = [
    {
      id: "REST-1",
      name: "Burger Palace",
      cuisine: "Fast Food",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&h=200&auto=format&fit=crop"
    },
    {
      id: "REST-2",
      name: "Pizza Heaven",
      cuisine: "Italian",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&h=200&auto=format&fit=crop"
    },
    {
      id: "REST-3",
      name: "Sushi Express",
      cuisine: "Japanese",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=300&h=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeOrders.length > 0 ? (
              activeOrders.map(order => (
                <div key={order.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{order.restaurant}</span>
                    <span className="text-sm px-2 py-1 bg-amber-100 text-amber-800 rounded">
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Order Progress</span>
                      <span>{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {order.timeRemaining}
                    </span>
                    <Button size="sm" variant="outline">Track Order</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No active orders
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.map(order => (
              <div key={order.id} className="py-2 border-b last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{order.restaurant}</span>
                  <span className="text-xs text-muted-foreground">{order.date}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">{order.items} items</span>
                  <Button size="sm" variant="ghost">Reorder</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-primary" />
              Favorite Restaurants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {favoriteRestaurants.map(restaurant => (
              <div key={restaurant.id} className="flex space-x-3">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{restaurant.name}</h4>
                  <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">⭐ {restaurant.rating}</span>
                    <Button size="sm" variant="ghost">Order</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Discover Restaurants</CardTitle>
            <CardDescription>
              Browse the top-rated restaurants near you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...favoriteRestaurants, ...favoriteRestaurants].slice(0, 4).map((restaurant, index) => (
                <div key={`${restaurant.id}-${index}`} className="rounded-lg overflow-hidden border group">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium">{restaurant.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">{restaurant.cuisine}</span>
                      <span className="text-sm">⭐ {restaurant.rating}</span>
                    </div>
                    <Button size="sm" variant="default" className="w-full mt-3">
                      Order Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
