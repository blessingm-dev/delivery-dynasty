
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define a session type to store in localStorage
interface AuthSession {
  user: User | null;
  accessToken: string | null;
  expiresAt: number | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'foodconnect_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper functions for localStorage
  const saveSession = (session: AuthSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const getSession = (): AuthSession | null => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr) as AuthSession;
    } catch (e) {
      console.error("Error parsing session from localStorage:", e);
      return null;
    }
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
  };

  // Initialize auth state from localStorage and sync with Supabase
  useEffect(() => {
    console.log("Auth provider initializing...");
    
    // Set up auth state listener FIRST
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
              clearSession();
              setUser(null);
            } else if (profile) {
              const userData: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role as UserRole,
                avatar: profile.avatar
              };
              
              // Save to localStorage
              saveSession({
                user: userData,
                accessToken: session.access_token,
                expiresAt: new Date(session.expires_at || 0).getTime()
              });
              
              setUser(userData);
            }
          } catch (error) {
            console.error("Error during auth state change:", error);
            clearSession();
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          clearSession();
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // First check local storage for a session
        const localSession = getSession();
        
        // If we have a valid, non-expired local session, use it
        if (localSession && localSession.user && localSession.expiresAt && localSession.expiresAt > Date.now()) {
          console.log("Using cached session from localStorage");
          setUser(localSession.user);
          setIsLoading(false);
          return;
        }
        
        console.log("Checking Supabase for session");
        // If no valid local session, check Supabase for an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          clearSession();
          setIsLoading(false);
          return;
        }
        
        if (!session) {
          // No active session in Supabase either
          console.log("No active session found");
          clearSession();
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        console.log("Found active Supabase session, fetching profile");
        // We have a Supabase session, fetch user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // If there's an error fetching the profile, clear everything
          await supabase.auth.signOut();
          clearSession();
          setUser(null);
        } else if (profile) {
          console.log("Profile found, setting user state with role:", profile.role);
          // Create user object from profile
          const userData: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role as UserRole,
            avatar: profile.avatar
          };
          
          // Save to localStorage
          saveSession({
            user: userData,
            accessToken: session.access_token,
            expiresAt: new Date(session.expires_at || 0).getTime()
          });
          
          setUser(userData);
        } else {
          console.error("No profile found for user");
          clearSession();
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        // Reset the user state if there's an error
        clearSession();
        setUser(null);
      } finally {
        // Always set loading to false to avoid getting stuck
        console.log("Auth initialization complete");
        setIsLoading(false);
      }
    };

    // Run the initialization
    initializeAuth();

    // Cleanup subscription on unmount
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
      
      // The session will be updated by the onAuthStateChange listener
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
      
      // The session will be updated by the onAuthStateChange listener
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
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear local storage
      clearSession();
      setUser(null);
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
