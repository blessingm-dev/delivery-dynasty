
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorProfileForm } from "@/components/vendor/vendor-profile-form";
import { Loader2, Store } from "lucide-react";
import { useVendorProfile } from "@/hooks/use-vendor-profile";
import { useRestaurant } from "@/hooks/use-restaurant";
import { RestaurantForm } from "@/components/vendor/restaurant-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VendorSettings() {
  const { user } = useAuth();
  const { profile, isLoading: isLoadingProfile } = useVendorProfile(user?.id);
  const { restaurant, isLoading: isLoadingRestaurant } = useRestaurant(user?.id);
  const [activeTab, setActiveTab] = useState("profile");

  if (isLoadingProfile || isLoadingRestaurant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant Setup</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Profile Settings</CardTitle>
              <CardDescription>
                Manage your business information visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VendorProfileForm initialData={profile} userId={user?.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="restaurant" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Setup</CardTitle>
              <CardDescription>
                Manage your restaurant information that will be visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RestaurantForm initialData={restaurant} userId={user?.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
