
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { SidebarNav } from "./sidebar-nav";
import { DashboardHeader } from "./header";
import { SidebarProvider } from "@/components/ui/sidebar";

export function DashboardLayout() {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
