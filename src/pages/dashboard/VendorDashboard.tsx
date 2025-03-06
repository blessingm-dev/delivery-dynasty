
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bell, ChefHat, Clock, DollarSign, LineChart, ShoppingBag, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart as RechartsLineChart, Legend } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VendorDashboard() {
  // Mock data
  const incomingOrders = [
    {
      id: "ORD-1234",
      customer: "John D.",
      items: 3,
      total: "$32.50",
      time: "5 min ago",
      status: "new"
    },
    {
      id: "ORD-1235",
      customer: "Sarah M.",
      items: 2,
      total: "$24.00",
      time: "12 min ago",
      status: "preparing"
    }
  ];
  
  const popularItems = [
    {
      id: 1,
      name: "Chicken Burger",
      price: "$8.99",
      orders: 48,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Veggie Pizza",
      price: "$12.99",
      orders: 36,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "French Fries",
      price: "$3.99",
      orders: 52,
      image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=80&h=80&auto=format&fit=crop"
    },
  ];
  
  const orderStats = {
    today: 24,
    yesterday: 18,
    week: 125,
    avgPreparationTime: "18 min"
  };
  
  const salesData = [
    { name: "Mon", sales: 1200 },
    { name: "Tue", sales: 1800 },
    { name: "Wed", sales: 1600 },
    { name: "Thu", sales: 2200 },
    { name: "Fri", sales: 2800 },
    { name: "Sat", sales: 3200 },
    { name: "Sun", sales: 2400 },
  ];
  
  const revenueData = [
    { name: "Jan", revenue: 12000, orders: 420 },
    { name: "Feb", revenue: 14000, orders: 460 },
    { name: "Mar", revenue: 16000, orders: 500 },
    { name: "Apr", revenue: 18000, orders: 550 },
    { name: "May", revenue: 17000, orders: 520 },
    { name: "Jun", revenue: 19000, orders: 580 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              Incoming Orders
            </CardTitle>
            <CardDescription>Manage your new and active orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomingOrders.map(order => (
                <div key={order.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order #{order.id}</span>
                    <Badge 
                      variant={order.status === "new" ? "default" : "outline"}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{order.customer[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{order.customer}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{order.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">{order.items} items</span>
                    <span className="font-medium">{order.total}</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">Details</Button>
                    <Button size="sm" className="flex-1">Accept</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="ghost" className="w-full">View All Orders</Button>
          </CardFooter>
        </Card>
        
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
              {popularItems.map(item => (
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
        
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Order Statistics
            </CardTitle>
            <CardDescription>Overview of your restaurant activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-2xl font-semibold">{orderStats.today}</p>
                <p className="text-xs text-muted-foreground">orders</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Yesterday</p>
                <p className="text-2xl font-semibold">{orderStats.yesterday}</p>
                <p className="text-xs text-muted-foreground">orders</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-2xl font-semibold">{orderStats.week}</p>
                <p className="text-xs text-muted-foreground">orders</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Avg. Prep Time</p>
                <p className="text-2xl font-semibold">{orderStats.avgPreparationTime}</p>
              </div>
            </div>
            
            <div className="mt-4 h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-primary" />
            Business Analytics
          </CardTitle>
          <CardDescription>Monitor your restaurant performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
