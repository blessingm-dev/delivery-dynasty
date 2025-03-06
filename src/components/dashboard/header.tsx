
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  const { user } = useAuth();
  
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">
          Welcome, {user?.name}
        </h1>
        <Badge variant="outline" className="ml-2 capitalize">
          {user?.role}
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10" 
            placeholder="Search..." 
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
            2
          </span>
        </Button>
      </div>
    </header>
  );
}
