import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('jwtToken')?.value;
  const rolesStr = request.cookies.get('roles')?.value;
  const { pathname } = request.nextUrl;

  // Redirect root to appropriate page
  if (pathname === '/') {
    if (token && rolesStr) {
      try {
        const roles = JSON.parse(rolesStr);

        // Redirect to appropriate dashboard based on role
        if (roles.includes('DOCTOR')) {
          return NextResponse.redirect(new URL('/doctor', request.url));
        } else if (roles.includes('ADMIN')) {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else if (roles.includes('HOSPICE')) {
          return NextResponse.redirect(new URL('/hospice', request.url));
        } else if (roles.includes('PHARMACIST')) {
          return NextResponse.redirect(new URL('/pharmacist', request.url));
        }
      } catch {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Not logged in, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect dashboard routes
  const protectedPaths = [
    '/doctor',
    '/admin',
    '/hospice',
    '/pharmacist',
    '/dashboard',
  ];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/doctor/:path*',
    '/admin/:path*',
    '/hospice/:path*',
    '/pharmacist/:path*',
    '/dashboard/:path*',
  ],
};
