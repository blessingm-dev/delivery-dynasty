
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import NotFound from "./pages/NotFound";
import { AuthPage } from "./components/auth/auth-page";
import { DashboardLayout } from "./components/dashboard/dashboard-layout";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import MenuItems from "./pages/dashboard/MenuItems";
import VendorSettings from "./pages/dashboard/VendorSettings";
import OrdersPage from "./pages/dashboard/OrdersPage";
import UsersPage from "./pages/dashboard/UsersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton theme="light" />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/" element={<AuthPage />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardIndex />} />
                {/* Add more dashboard routes here */}
                <Route path="orders" element={<OrdersPage />} />
                <Route path="restaurants" element={<div className="min-h-[500px] flex items-center justify-center">Restaurants Page</div>} />
                <Route path="deliveries" element={<div className="min-h-[500px] flex items-center justify-center">Deliveries Page</div>} />
                <Route path="history" element={<div className="min-h-[500px] flex items-center justify-center">Delivery History Page</div>} />
                <Route path="map" element={<div className="min-h-[500px] flex items-center justify-center">Map Page</div>} />
                <Route path="menu" element={<MenuItems />} />
                <Route path="settings" element={<VendorSettings />} />
                {/* Restaurant-setup route redirects to settings */}
                <Route path="restaurant-setup" element={<VendorSettings />} />
                <Route path="analytics" element={<div className="min-h-[500px] flex items-center justify-center">Analytics Page</div>} />
                <Route path="users" element={<UsersPage />} />
                <Route path="manage-restaurants" element={<div className="min-h-[500px] flex items-center justify-center">Restaurant Management Page</div>} />
                <Route path="manage-drivers" element={<div className="min-h-[500px] flex items-center justify-center">Driver Management Page</div>} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
