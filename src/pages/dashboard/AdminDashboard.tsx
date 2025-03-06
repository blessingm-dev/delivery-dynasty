
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, ShoppingBag, Truck, User, Utensils, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  // Mock data
  const platformStats = {
    users: 1250,
    restaurants: 85,
    drivers: 120,
    orders: 3850
  };
  
  const recentUsers = [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      role: "customer",
      joined: "2 hours ago",
      avatar: "https://i.pravatar.cc/150?u=john"
    },
    {
      id: "user-2",
      name: "Restaurant ABC",
      email: "abc@example.com",
      role: "vendor",
      joined: "1 day ago",
      avatar: "https://i.pravatar.cc/150?u=restaurant"
    },
    {
      id: "user-3",
      name: "Driver XYZ",
      email: "driver@example.com",
      role: "driver",
      joined: "3 days ago",
      avatar: "https://i.pravatar.cc/150?u=driver"
    }
  ];
  
  const transactionData = [
    { name: "Mon", value: 2400 },
    { name: "Tue", value: 1398 },
    { name: "Wed", value: 9800 },
    { name: "Thu", value: 3908 },
    { name: "Fri", value: 4800 },
    { name: "Sat", value: 3800 },
    { name: "Sun", value: 4300 }
  ];
  
  const userTypeData = [
    { name: "Customers", value: 75 },
    { name: "Restaurants", value: 15 },
    { name: "Drivers", value: 10 }
  ];
  
  const colors = ["#0088FE", "#00C49F", "#FFBB28"];
  
  const orderStatusData = [
    { name: "Pending", value: 15 },
    { name: "Preparing", value: 30 },
    { name: "Delivering", value: 25 },
    { name: "Completed", value: 30 }
  ];
  
  const topRestaurants = [
    { id: 1, name: "Burger Palace", orders: 356, revenue: "$8,240", rating: 4.8 },
    { id: 2, name: "Pizza Heaven", orders: 290, revenue: "$6,430", rating: 4.6 },
    { id: 3, name: "Sushi Express", orders: 245, revenue: "$5,870", rating: 4.7 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformStats.users}</div>
            <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
            <Progress className="h-1 mt-3" value={75} />
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-primary" />
              Restaurants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformStats.restaurants}</div>
            <p className="text-sm text-muted-foreground mt-1">+5% from last month</p>
            <Progress className="h-1 mt-3" value={65} />
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformStats.drivers}</div>
            <p className="text-sm text-muted-foreground mt-1">+8% from last month</p>
            <Progress className="h-1 mt-3" value={45} />
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformStats.orders}</div>
            <p className="text-sm text-muted-foreground mt-1">+20% from last month</p>
            <Progress className="h-1 mt-3" value={85} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Platform Performance
            </CardTitle>
            <CardDescription>Overview of key metrics across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="users">User Growth</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transactionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="users">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transactionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Recent Users
            </CardTitle>
            <CardDescription>Latest members who joined the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{user.name}</p>
                      <Badge 
                        variant="outline" 
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.joined}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">View All Users</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of user types on the platform</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current state of orders in the system</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Top Restaurants</CardTitle>
            <CardDescription>Best performing restaurants on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div key={restaurant.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">
                        {index + 1}
                      </span>
                      <span className="font-medium">{restaurant.name}</span>
                    </div>
                    <span className="text-sm">⭐ {restaurant.rating}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{restaurant.orders} orders</span>
                    <span>{restaurant.revenue}</span>
                  </div>
                  <Progress value={(restaurant.orders / topRestaurants[0].orders) * 100} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
