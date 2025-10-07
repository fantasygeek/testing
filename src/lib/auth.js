'use-client';

import { cookies } from 'next/headers';

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('jwtToken')?.value;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value;
  const rolesStr = cookieStore.get('roles')?.value;
  
  if (!username || !rolesStr) return null;
  
  try {
    const roles = JSON.parse(rolesStr);
    return { username, roles };
  } catch {
    return null;
  }
}

// Client-side helper to get user info from cookies
export function getUserFromCookies() {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
  
  const username = cookies['username'];
  const rolesStr = cookies['roles'];
  
  if (!username || !rolesStr) return null;
  
  try {
    const roles = JSON.parse(rolesStr);
    return { username, roles };
  } catch {
    return null;
  }
}