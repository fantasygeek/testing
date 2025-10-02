'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string[]} roles
 */

export function useAuth(requiredRole) {
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
    }, {});

    const username = cookies['username'];
    const rolesStr = cookies['roles'];

    if (!username || !rolesStr) {
      router.push('/login');
      return;
    }

    try {
      const roles = JSON.parse(rolesStr);
      
      if (requiredRole && !roles.includes(requiredRole)) {
        router.push('/unauthorized');
        return;
      }

      setUser({ username, roles });
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, redirect to login
      router.push('/login');
    }
  };

  return { user, loading, logout };
}
