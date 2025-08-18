import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Next.js middleware for route protection
 */

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/builder',
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  '/api/protected',
];

// Define public routes that should redirect authenticated users
const PUBLIC_ROUTES = [
  '/login',
  '/register',
];

// Define API routes that don't need protection
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/health',
];

/**
 * Check if route is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
}

/**
 * Check if route is public (should redirect authenticated users)
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );
}

/**
 * Check if API route is public
 */
function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some(route => 
    pathname.startsWith(route)
  );
}

/**
 * Extract token from request
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check auth-token cookie
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

/**
 * Verify if user is authenticated
 */
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return false;
    }
    
    // Verify token
    const payload = verifyToken(token);
    return !!payload && payload.type === 'access';
  } catch (error) {
    return false;
  }
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }
  
  const authenticated = await isAuthenticated(request);
  
  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Allow public API routes
    if (isPublicApiRoute(pathname)) {
      return NextResponse.next();
    }
    
    // Protect other API routes
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.next();
  }
  
  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!authenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
  
  // Handle public routes (redirect authenticated users)
  if (isPublicRoute(pathname) && authenticated) {
    // Check if there's a return URL
    const returnTo = request.nextUrl.searchParams.get('returnTo');
    if (returnTo && isProtectedRoute(returnTo)) {
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
    
    // Default redirect for authenticated users
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
