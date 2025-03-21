
import { AuthSession, SESSION_KEY } from './types';

/**
 * Helper functions for session management in localStorage
 */
export const saveSession = (session: AuthSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): AuthSession | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  
  try {
    return JSON.parse(sessionStr) as AuthSession;
  } catch (e) {
    console.error("Error parsing session from localStorage:", e);
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
