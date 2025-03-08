
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, DollarSign, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart as RechartsLineChart, Legend } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VendorDashboard() {
  // Mock data
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Sales Overview
            </CardTitle>
            <CardDescription>Weekly sales performance</CardDescription>
          </CardHeader>
          <CardContent>            
            <div className="h-[200px]">
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
