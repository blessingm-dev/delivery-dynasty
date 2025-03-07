
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantForm } from "@/components/vendor/restaurant-form";
import { Loader2, Store } from "lucide-react";
import { useRestaurant } from "@/hooks/use-restaurant";

export default function RestaurantSetup() {
  const { user } = useAuth();
  const { restaurant, isLoading } = useRestaurant(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Store className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Restaurant Setup</h1>
      </div>
      <p className="text-muted-foreground">
        Manage your restaurant information that will be visible to customers.
      </p>
      
      <RestaurantForm initialData={restaurant} userId={user?.id} />
    </div>
  );
}
