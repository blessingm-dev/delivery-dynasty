
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorProfileForm } from "@/components/vendor/vendor-profile-form";
import { Loader2 } from "lucide-react";
import { useVendorProfile } from "@/hooks/use-vendor-profile";

export default function VendorSettings() {
  const { user } = useAuth();
  const { profile, isLoading } = useVendorProfile(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
}
