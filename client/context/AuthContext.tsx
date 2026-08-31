'use client';

// Auth context using useSyncExternalStore for client-side authentication state
import { createContext, useContext, useSyncExternalStore, ReactNode } from 'react';

// User auth data structure
type AuthUser = {
  id: string;
  name: string;
  email: string;
  userType: 'agent' | 'client';
  role?: string;
  profileImage?: string | null;

};

type StoredAuth = {
  user: AuthUser | null;
  token: string | null;
};

// Set of listener functions to notify on auth changes
const listeners = new Set<() => void>();

// Notify all listeners of auth state change
function notifyListeners() {
  listeners.forEach((callback) => callback());
}

// Register listener for auth changes
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Server always returns logged-out (prevents hydration mismatch)
const SERVER_SNAPSHOT: StoredAuth = { user: null, token: null };

function getServerSnapshot(): StoredAuth {
  return SERVER_SNAPSHOT;
}

// Cache auth snapshot to avoid recreating on every read
let cachedToken: string | null = null;
let cachedUserRaw: string | null = null;
let cachedSnapshot: StoredAuth = SERVER_SNAPSHOT;

// Get current auth from localStorage with caching
function getSnapshot(): StoredAuth {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  // Return cached snapshot if no changes in localStorage
  if (token === cachedToken && userRaw === cachedUserRaw) {
    return cachedSnapshot;
  }

  cachedToken = token;
  cachedUserRaw = userRaw;
  cachedSnapshot = { token, user: userRaw ? JSON.parse(userRaw) : null };
  return cachedSnapshot;
}

// Save auth to localStorage and notify listeners
function setStoredAuth(user: AuthUser, token: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  notifyListeners();
}

// Clear auth from localStorage
function clearStoredAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  notifyListeners();
}

// Type for auth context value
type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component - manages authentication state
export function AuthProvider({ children }: { children: ReactNode }) {
  // Subscribe to localStorage changes via external store
  const { user, token } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function login(user: AuthUser, token: string) {
    setStoredAuth(user, token);
  }

  function logout() {
    clearStoredAuth();
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

  // Hook to access auth context (validates provider presence)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}