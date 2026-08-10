'use client';

import { createContext, useContext, useSyncExternalStore, ReactNode } from 'react';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  userType: 'agent' | 'client';
  role?: string;
};

type StoredAuth = {
  user: AuthUser | null;
  token: string | null;
};

// A small pub/sub system so React knows when localStorage changes
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((callback) => callback());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Reads the CURRENT value from localStorage 
function getSnapshot(): StoredAuth {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return { token, user: user ? JSON.parse(user) : null };
}

// The server has no localStorage — always render "logged out" on the server
function getServerSnapshot(): StoredAuth {
  return { token: null, user: null };
}

function setStoredAuth(user: AuthUser, token: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  notifyListeners();
}

function clearStoredAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  notifyListeners();
}

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}