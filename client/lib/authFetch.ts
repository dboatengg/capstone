import { updateStoredToken, clearStoredAuthPublic } from '@/context/AuthContext';

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // If a refresh is already in flight, reuse it instead of firing
  // multiple simultaneous refresh requests (e.g. several tabs/components
  // all hitting a 401 at the same moment).
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        clearStoredAuthPublic();
        return null;
      }

      const data = await res.json();
      updateStoredToken(data.token);
      return data.token;
    } catch {
      clearStoredAuthPublic();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Drop-in replacement for fetch() that adds the Authorization header
// automatically and retries once with a fresh token on a 401.
export async function authFetch(url: string, options: RequestInit = {}, token: string | null) {
  const withAuth = (t: string | null): RequestInit => ({
    ...options,
    headers: {
      ...options.headers,
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
  });

  let res = await fetch(url, withAuth(token));

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(url, withAuth(newToken));
    }
  }

  return res;
}