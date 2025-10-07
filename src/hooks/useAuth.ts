'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  roles: string[];
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  validateToken: () => Promise<boolean>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export function useAuth(requiredRoles?: string | string[]): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const requiredRolesRef = useRef(requiredRoles);

  // Update ref when requiredRoles changes
  useEffect(() => {
    requiredRolesRef.current = requiredRoles;
  }, [requiredRoles]);

  const getCookie = useCallback((name: string): string | null => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    return cookies[name] || null;
  }, []);

  const clearAuthCookies = useCallback(() => {
    document.cookie =
      'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'roles=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // refreshToken is also httpOnly, so we just call the endpoint
      // The server will read it from cookies
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Sends httpOnly cookies
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      // DON'T check token here - it's httpOnly and can't be read client-side
      // Just call the API and let the server read the httpOnly cookie

      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This sends httpOnly cookies to server
      });

      console.log('🔍 Token validation response:', response.status);

      if (response.status === 401) {
        // Token expired or invalid, try to refresh
        console.log('Token invalid/expired, attempting refresh...');
        const refreshed = await refreshToken();
        return refreshed;
      }

      if (!response.ok) {
        console.log('Token validation failed');
        return false;
      }

      const data = await response.json();
      console.log('✅ Token valid, user:', data.user);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, [refreshToken]);

  const checkAuth = useCallback(async () => {
    if (typeof document === 'undefined') return;

    const username = getCookie('username');
    const rolesStr = getCookie('roles');

    console.log('🔍 Checking auth - username:', username, 'roles:', rolesStr);

    if (!username || !rolesStr) {
      console.log('❌ Missing username/roles cookies, redirecting to login');
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const roles = JSON.parse(rolesStr);
      const isValid = await validateToken();

      if (!isValid) {
        console.log('❌ Token validation failed, redirecting to login');
        clearAuthCookies();
        router.push('/login');
        return;
      }

      if (requiredRolesRef.current) {
        const allowedRoles = Array.isArray(requiredRolesRef.current)
          ? requiredRolesRef.current
          : [requiredRolesRef.current];

        const hasRequiredRole = allowedRoles.some((role) =>
          roles.includes(role)
        );

        if (!hasRequiredRole) {
          console.log('❌ User does not have required role');
          router.push('/unauthorized');
          return;
        }
      }

      console.log('✅ Auth check passed');
      setUser({ username, roles });
    } catch (error) {
      console.error('❌ Auth check error:', error);
      clearAuthCookies();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [getCookie, validateToken, clearAuthCookies, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch wrapper that automatically handles token refresh
  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      // First attempt
      let response = await fetch(url, {
        ...options,
        credentials: 'include', // Always send cookies
      });

      // If token expired (401), try to refresh and retry
      if (response.status === 401) {
        const refreshed = await refreshToken();

        if (refreshed) {
          // Retry original request with new token
          response = await fetch(url, {
            ...options,
            credentials: 'include',
          });
        } else {
          // Refresh failed, redirect to login
          clearAuthCookies();
          router.push('/login');
          throw new Error('Session expired');
        }
      }

      return response;
    },
    [refreshToken, clearAuthCookies, router]
  );

  const logout = useCallback(async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        clearAuthCookies();
        router.push('/login');
        router.refresh();
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if API fails, clear cookies and redirect
        clearAuthCookies();
        router.push('/login');
      }
    }
  }, [clearAuthCookies, router]);

  return { user, loading, logout, validateToken, authenticatedFetch };
}
