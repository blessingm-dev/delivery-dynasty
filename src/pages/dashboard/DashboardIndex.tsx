
import { useAuth } from "@/context/auth-context";
import CustomerDashboard from "./CustomerDashboard";
import DriverDashboard from "./DriverDashboard";
import VendorDashboard from "./VendorDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardIndex() {
  const { user } = useAuth();

  // Render dashboard based on user role
  if (user?.role === "customer") {
    return <CustomerDashboard />;
  }
  
  if (user?.role === "driver") {
    return <DriverDashboard />;
  }
  
  if (user?.role === "vendor") {
    return <VendorDashboard />;
  }
  
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }
  
  // Fallback
  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <p>Loading dashboard...</p>
    </div>
  );
}
