'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  roles: string[];
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(requiredRoles?: string | string[]): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof document === 'undefined') return;

    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    const username = cookies['username'];
    const rolesStr = cookies['roles'];

    // ONLY check username and roles (not token)
    if (!username || !rolesStr) {
      console.log('Missing cookies, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const roles = JSON.parse(rolesStr);

      // Check if user has any of the required roles
      if (requiredRoles) {
        const allowedRoles = Array.isArray(requiredRoles)
          ? requiredRoles
          : [requiredRoles];

        const hasRequiredRole = allowedRoles.some((role) =>
          roles.includes(role)
        );

        if (!hasRequiredRole) {
          console.log('User does not have required role');
          router.push('/unauthorized');
          return;
        }
      }

      setUser({ username, roles });
    } catch (error) {
      console.error('Token validation error:', error);
      clearAuthCookies();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const clearAuthCookies = () => {
    document.cookie =
      'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'roles=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const logout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        router.push('/login');
        router.refresh();
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if API fails, clear cookies and redirect
        clearAuthCookies();
        router.push('/login');
      }
    }
  };

  return { user, loading, logout };
}
