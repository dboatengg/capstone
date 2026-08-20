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

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((callback) => callback());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// A fixed, unchanging object — the server always renders "logged out"
const SERVER_SNAPSHOT: StoredAuth = { user: null, token: null };

function getServerSnapshot(): StoredAuth {
  return SERVER_SNAPSHOT;
}

// Cache the last computed snapshot so we only build a NEW object
// when the underlying localStorage values actually changed.
let cachedToken: string | null = null;
let cachedUserRaw: string | null = null;
let cachedSnapshot: StoredAuth = SERVER_SNAPSHOT;

function getSnapshot(): StoredAuth {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  // Nothing changed since last read — return the SAME object reference
  if (token === cachedToken && userRaw === cachedUserRaw) {
    return cachedSnapshot;
  }

  cachedToken = token;
  cachedUserRaw = userRaw;
  cachedSnapshot = { token, user: userRaw ? JSON.parse(userRaw) : null };
  return cachedSnapshot;
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

export function updateStoredToken(newToken: string) {
  const userRaw = localStorage.getItem('user');
  if (userRaw) {
    localStorage.setItem('token', newToken);
    notifyListeners();
  }
}

export function clearStoredAuthPublic() {
  clearStoredAuth();
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