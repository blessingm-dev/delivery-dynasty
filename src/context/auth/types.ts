
import { User, UserRole } from "@/types/auth";

// Define a session type to store in localStorage
export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  expiresAt: number | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

export const SESSION_KEY = 'foodconnect_session';
