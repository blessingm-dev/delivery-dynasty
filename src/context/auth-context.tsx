
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if there's an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setIsLoading(false);
          return;
        }
        
        if (!session) {
          // No active session
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Fetch user profile data from our profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // If there's an error fetching the profile, try to sign out to clear any bad state
          await supabase.auth.signOut();
          setUser(null);
        } else if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role as UserRole,
            avatar: profile.avatar
          });
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        // Reset the user state if there's an error
        setUser(null);
      } finally {
        // Always set loading to false to avoid getting stuck
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          try {
            // Fetch user profile data
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching profile:", error);
              setUser(null);
            } else if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role as UserRole,
                avatar: profile.avatar
              });
            }
          } catch (error) {
            console.error("Error during auth state change:", error);
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = "customer") => {
    setIsLoading(true);
    
    try {
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
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
