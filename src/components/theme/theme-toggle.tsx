
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={theme === "dark"} 
        onCheckedChange={toggleTheme} 
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
