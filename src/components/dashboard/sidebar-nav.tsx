
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { 
  Home, Package, ShoppingBag, Truck, Users, Settings, LogOut, 
  ChefHat, Utensils, Map, Clock, LineChart, Bell, List, Store
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

export function SidebarNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Navigation items based on user role
  const navItems: NavItem[] = [
    { 
      title: "Dashboard", 
      href: "/dashboard", 
      icon: Home, 
      roles: ["customer", "driver", "vendor", "admin"] 
    },
    { 
      title: "My Orders", 
      href: "/dashboard/orders", 
      icon: Package, 
      roles: ["customer"] 
    },
    { 
      title: "Browse Restaurants", 
      href: "/dashboard/restaurants", 
      icon: Utensils, 
      roles: ["customer"] 
    },
    { 
      title: "Active Deliveries", 
      href: "/dashboard/deliveries", 
      icon: Truck, 
      roles: ["driver"] 
    },
    { 
      title: "Delivery History", 
      href: "/dashboard/history", 
      icon: Clock, 
      roles: ["driver"] 
    },
    { 
      title: "Navigation", 
      href: "/dashboard/map", 
      icon: Map, 
      roles: ["driver"] 
    },
    { 
      title: "Restaurant Setup", 
      href: "/dashboard/restaurant-setup", 
      icon: Store, 
      roles: ["vendor"] 
    },
    { 
      title: "Menu Items", 
      href: "/dashboard/menu", 
      icon: ChefHat, 
      roles: ["vendor"] 
    },
    { 
      title: "Orders", 
      href: "/dashboard/orders", 
      icon: ShoppingBag, 
      roles: ["vendor"] 
    },
    { 
      title: "Restaurant Analytics", 
      href: "/dashboard/analytics", 
      icon: LineChart, 
      roles: ["vendor"] 
    },
    { 
      title: "Users", 
      href: "/dashboard/users", 
      icon: Users, 
      roles: ["admin"] 
    },
    { 
      title: "Restaurants", 
      href: "/dashboard/manage-restaurants", 
      icon: Utensils, 
      roles: ["admin"] 
    },
    { 
      title: "Drivers", 
      href: "/dashboard/manage-drivers", 
      icon: Truck, 
      roles: ["admin"] 
    },
    { 
      title: "Settings", 
      href: "/dashboard/settings", 
      icon: Settings, 
      roles: ["customer", "driver", "vendor", "admin"] 
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar className={cn(
      "border-r h-screen transition-all duration-300 ease-in-out",
      collapsed ? "w-[70px]" : "w-[250px]"
    )}>
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-semibold">FoodConnect</span>
          </div>
        ) : (
          <ShoppingBag className="h-5 w-5 text-primary mx-auto" />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={() => setCollapsed(!collapsed)}
        >
          <List className="h-4 w-4" />
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <div className="flex flex-col gap-1">
          {filteredNavItems.map((item) => (
            <Button
              key={item.href}
              variant={location.pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>{item.title}</span>}
            </Button>
          ))}
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t mt-auto">
        {!collapsed ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
              </div>
            </div>
            <Separator />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
