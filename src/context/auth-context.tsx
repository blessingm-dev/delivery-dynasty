
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=admin"
  },
  {
    id: "2",
    email: "vendor@example.com",
    name: "Restaurant Owner",
    role: "vendor",
    avatar: "https://i.pravatar.cc/150?u=vendor"
  },
  {
    id: "3",
    email: "driver@example.com",
    name: "Delivery Partner",
    role: "driver",
    avatar: "https://i.pravatar.cc/150?u=driver"
  },
  {
    id: "4",
    email: "customer@example.com",
    name: "John Customer",
    role: "customer",
    avatar: "https://i.pravatar.cc/150?u=customer"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("foodDeliveryUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("foodDeliveryUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole = "customer") => {
    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find matching user
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Save to state and localStorage
      setUser(foundUser);
      localStorage.setItem("foodDeliveryUser", JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = "customer") => {
    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
      };
      
      // In a real app, we would add to database
      // For demo, we'll just set it in memory
      
      setUser(newUser);
      localStorage.setItem("foodDeliveryUser", JSON.stringify(newUser));
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("foodDeliveryUser");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
