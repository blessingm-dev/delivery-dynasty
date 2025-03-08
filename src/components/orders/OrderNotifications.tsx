
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { useRestaurant } from "@/hooks/use-restaurant";
import { ShoppingBag } from "lucide-react";
import { Order } from "@/hooks/use-orders";

export function OrderNotifications() {
  const { user } = useAuth();
  const { restaurant } = useRestaurant(user?.id);

  useEffect(() => {
    // Only set up the listener if we have a restaurant
    if (!restaurant?.id) return;
    
    console.log("Setting up order notifications for restaurant:", restaurant.id);

    // Set up a channel to listen for new orders for this restaurant
    const channel = supabase
      .channel('order-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurant.id}`
        },
        (payload) => {
          const newOrder = payload.new as Order;
          console.log("New order received:", newOrder);
          
          // Show a toast notification for the new order
          toast.message("New Order Received!", {
            description: `Order #${newOrder.id.slice(0, 8)} - R${newOrder.total_amount.toFixed(2)}`,
            icon: <ShoppingBag className="h-5 w-5" />,
            action: {
              label: "View",
              onClick: () => {
                // Navigate to the orders page
                window.location.href = "/dashboard/orders";
              },
            },
          });
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      console.log("Cleaning up order notifications");
      supabase.removeChannel(channel);
    };
  }, [restaurant?.id]);

  // This is a "headless" component - it doesn't render anything
  return null;
}
