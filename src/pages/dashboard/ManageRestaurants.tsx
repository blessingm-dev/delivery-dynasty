
import { useState } from "react";
import { useAdminRestaurants, RestaurantWithAnalytics } from "@/hooks/use-admin-restaurants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowUpDown, Package, TrendingUp, Store } from "lucide-react";
import { SalesOverviewCard } from "@/components/dashboard/sales-overview-card";
import { BusinessAnalyticsCard } from "@/components/dashboard/business-analytics-card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ManageRestaurants() {
  const { restaurants, isLoading, error, searchQuery, setSearchQuery } = useAdminRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantWithAnalytics | null>(null);
  
  // Weekly mock data for selected restaurant
  const getSalesData = (restaurantId: string) => [
    { name: "Mon", sales: Math.floor(Math.random() * 2000) + 500 },
    { name: "Tue", sales: Math.floor(Math.random() * 2000) + 500 },
    { name: "Wed", sales: Math.floor(Math.random() * 2000) + 500 },
    { name: "Thu", sales: Math.floor(Math.random() * 2000) + 500 },
    { name: "Fri", sales: Math.floor(Math.random() * 2000) + 500 },
    { name: "Sat", sales: Math.floor(Math.random() * 2000) + 500 },
    { name: "Sun", sales: Math.floor(Math.random() * 2000) + 500 },
  ];
  
  const getRevenueData = (restaurantId: string) => [
    { name: "Week 1", revenue: Math.floor(Math.random() * 10000) + 1000, orders: Math.floor(Math.random() * 100) + 20 },
    { name: "Week 2", revenue: Math.floor(Math.random() * 10000) + 1000, orders: Math.floor(Math.random() * 100) + 20 },
    { name: "Week 3", revenue: Math.floor(Math.random() * 10000) + 1000, orders: Math.floor(Math.random() * 100) + 20 },
    { name: "Week 4", revenue: Math.floor(Math.random() * 10000) + 1000, orders: Math.floor(Math.random() * 100) + 20 },
  ];
  
  const getDeliveryData = (restaurantId: string) => [
    { status: "Pending", count: Math.floor(Math.random() * 20) + 5 },
    { status: "Preparing", count: Math.floor(Math.random() * 30) + 10 },
    { status: "Delivering", count: Math.floor(Math.random() * 25) + 5 },
    { status: "Completed", count: Math.floor(Math.random() * 100) + 50 },
    { status: "Cancelled", count: Math.floor(Math.random() * 10) + 2 },
  ];

  const handleSelectRestaurant = (restaurant: RestaurantWithAnalytics) => {
    setSelectedRestaurant(restaurant);
  };

  if (isLoading) {
    return <div className="min-h-[500px] flex items-center justify-center">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="min-h-[500px] flex items-center justify-center text-red-500">Error loading restaurants</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Restaurant Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {!selectedRestaurant ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                All Restaurants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Cuisine Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Rating
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Total Sales
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {restaurant.image && (
                            <img 
                              src={restaurant.image} 
                              alt={restaurant.name} 
                              className="h-8 w-8 rounded-md object-cover"
                            />
                          )}
                          <span>{restaurant.name}</span>
                          {restaurant.featured && (
                            <Badge variant="secondary" className="ml-2">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.cuisine_type}</TableCell>
                      <TableCell>{restaurant.address}</TableCell>
                      <TableCell>⭐ {restaurant.rating.toFixed(1)}</TableCell>
                      <TableCell>R{restaurant.totalSales?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>{restaurant.totalOrders || 0}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSelectRestaurant(restaurant)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {selectedRestaurant.image && (
                  <img 
                    src={selectedRestaurant.image} 
                    alt={selectedRestaurant.name} 
                    className="h-12 w-12 rounded-md object-cover"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    {selectedRestaurant.name}
                    {selectedRestaurant.featured && (
                      <Badge variant="secondary" className="ml-2">Featured</Badge>
                    )}
                  </h2>
                  <p className="text-muted-foreground">{selectedRestaurant.cuisine_type} • {selectedRestaurant.address}</p>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => setSelectedRestaurant(null)}
              >
                Back to All Restaurants
              </Button>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sales</span>
                      <span className="font-medium">R{selectedRestaurant.totalSales?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{selectedRestaurant.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Order</span>
                      <span className="font-medium">R{selectedRestaurant.averageOrderValue?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium">⭐ {selectedRestaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    Delivery Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getDeliveryData(selectedRestaurant.id || "").map((item) => (
                      <div key={item.status} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{item.status}</span>
                        <Badge variant={item.status === "Cancelled" ? "destructive" : "outline"}>
                          {item.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Store className="h-5 w-5 mr-2 text-primary" />
                    Restaurant Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-medium">{selectedRestaurant.delivery_fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Time</span>
                      <span className="font-medium">{selectedRestaurant.delivery_time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Featured</span>
                      <Badge variant={selectedRestaurant.featured ? "default" : "outline"}>
                        {selectedRestaurant.featured ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="sales">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                <TabsTrigger value="business">Business Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="sales" className="pt-4">
                <SalesOverviewCard salesData={getSalesData(selectedRestaurant.id || "")} />
              </TabsContent>
              <TabsContent value="business" className="pt-4">
                <BusinessAnalyticsCard revenueData={getRevenueData(selectedRestaurant.id || "")} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
