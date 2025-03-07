
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, PhoneCall, MapPin, Mail } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Order, useOrders } from "@/hooks/use-orders";
import { formatDistanceToNow } from "date-fns";

export function OrdersManagement() {
  const { orders, isLoading, error, updateOrderStatus, isUpdatingStatus } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const getStatusColor = (status: Order['status']) => {
    const statusColors = {
      pending: "bg-yellow-500",
      accepted: "bg-blue-500",
      preparing: "bg-indigo-500",
      ready: "bg-purple-500",
      delivering: "bg-cyan-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500"
    };
    return statusColors[status] || "bg-gray-500";
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">Error loading orders: {error.message}</div>;
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
            Orders
          </CardTitle>
          <CardDescription>Manage your customer orders</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-muted-foreground text-center">
            When customers place orders, they will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
          Orders
        </CardTitle>
        <CardDescription>Manage your customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                  <Badge 
                    className={`ml-2 ${getStatusColor(order.status)} text-white`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm">
                  {order.first_name} {order.last_name}
                </span>
                <span className="font-medium">${order.total_amount.toFixed(2)}</span>
              </div>
              
              <div className="flex mt-3 space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                </Button>
                
                <Select 
                  disabled={isUpdatingStatus} 
                  defaultValue={order.status} 
                  onValueChange={(value) => 
                    updateOrderStatus({ 
                      orderId: order.id, 
                      status: value as Order['status'] 
                    })
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivering">Delivering</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {expandedOrderId === order.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{order.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{order.email}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="ghost" className="w-full">View All Orders</Button>
      </CardFooter>
    </Card>
  );
}
