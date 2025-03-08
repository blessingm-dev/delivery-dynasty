
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BanknoteIcon, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  
  // Mock data
  const activeDelivery = {
    id: "DEL-1234",
    customer: "John Doe",
    restaurant: "Burger Palace",
    pickupAddress: "123 Main St",
    deliveryAddress: "456 Oak St",
    distance: "3.2 miles",
    earnings: "R145.00",
    status: "on the way",
    estimatedTime: "15 min"
  };
  
  const upcomingDeliveries = [
    {
      id: "DEL-1235",
      restaurant: "Pizza Heaven",
      distance: "1.8 miles",
      earnings: "R120.00",
      pickupTime: "In 30 min",
    },
    {
      id: "DEL-1236",
      restaurant: "Thai Spice",
      distance: "2.5 miles",
      earnings: "R135.00",
      pickupTime: "In 45 min",
    }
  ];
  
  const earningsSummary = {
    today: "R750.00",
    week: "R5,200.00",
    month: "R20,500.00",
    deliveries: 16
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="hover-lift">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              Driver Status
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className={isOnline ? "text-green-600" : "text-gray-500"}>
                {isOnline ? "Online" : "Offline"}
              </span>
              <Switch 
                checked={isOnline} 
                onCheckedChange={setIsOnline} 
              />
            </div>
          </div>
          <CardDescription>
            {isOnline 
              ? "You're active and receiving delivery requests" 
              : "You're currently offline and won't receive delivery requests"}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              Active Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeDelivery ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{activeDelivery.restaurant}</span>
                  <Badge variant="outline">{activeDelivery.status}</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-muted-foreground">{activeDelivery.pickupAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Deliver to</p>
                      <p className="text-sm text-muted-foreground">{activeDelivery.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-medium">{activeDelivery.distance}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium">{activeDelivery.estimatedTime}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Earnings</p>
                    <p className="font-medium">{activeDelivery.earnings}</p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline">Contact Customer</Button>
                  <Button>Complete Delivery</Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <p className="text-muted-foreground">No active deliveries</p>
                {isOnline ? (
                  <p className="text-sm">Waiting for new delivery requests...</p>
                ) : (
                  <Button onClick={() => setIsOnline(true)}>Go Online</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Upcoming Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeliveries.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeliveries.map(delivery => (
                  <div key={delivery.id} className="border rounded-md p-3 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{delivery.restaurant}</span>
                      <span className="text-sm text-muted-foreground">{delivery.pickupTime}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">{delivery.distance}</span>
                      <span className="text-sm font-medium">{delivery.earnings}</span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No upcoming deliveries
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BanknoteIcon className="h-5 w-5 mr-2 text-primary" />
            Earnings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-semibold">{earningsSummary.today}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-semibold">{earningsSummary.week}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-semibold">{earningsSummary.month}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Deliveries</p>
              <p className="text-2xl font-semibold">{earningsSummary.deliveries}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
