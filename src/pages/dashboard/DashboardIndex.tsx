
import { useAuth } from "@/context/auth-context";
import CustomerDashboard from "./CustomerDashboard";
import DriverDashboard from "./DriverDashboard";
import VendorDashboard from "./VendorDashboard";
import AdminDashboard from "./AdminDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardIndex() {
  const { user, isLoading } = useAuth();

  // Show loading state while auth status is being determined
  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // If no user or role, show a message (this should not happen if auth redirects work properly)
  if (!user || !user.role) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-muted-foreground">Unable to determine user role. Please try logging in again.</p>
      </div>
    );
  }

  // Render dashboard based on user role
  if (user.role === "customer") {
    return <CustomerDashboard />;
  }
  
  if (user.role === "driver") {
    return <DriverDashboard />;
  }
  
  if (user.role === "vendor") {
    return <VendorDashboard />;
  }
  
  if (user.role === "admin") {
    return <AdminDashboard />;
  }
  
  // Fallback - should never reach here if our user roles are correctly set
  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <p className="text-muted-foreground">Unknown user role: {user.role}</p>
    </div>
  );
}
