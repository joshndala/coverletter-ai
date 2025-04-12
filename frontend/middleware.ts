import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if we're in a protected route
  const isProtectedRoute = path.startsWith('/dashboard') || 
                           path.startsWith('/skills-and-experiences') || 
                           path.startsWith('/my-cover-letters') || 
                           path.startsWith('/generate-cover-letter');
                           
  // Check if the user is authenticated by looking at the localStorage
  // Note: middleware runs on the edge, so we need to check cookies, not localStorage
  const authCookie = request.cookies.get('auth');
  const isAuthenticated = !!authCookie;
  
  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect authenticated users away from auth pages
  if ((path === '/login' || path === '/signup') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/skills-and-experiences/:path*',
    '/my-cover-letters/:path*',
    '/generate-cover-letter/:path*',
    '/login',
    '/signup',
  ],
}; 