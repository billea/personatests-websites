import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a protected test route
  const isProtectedTest = pathname.includes('/tests/couple-compatibility') || 
                         pathname.includes('/tests/feedback-360');
  
  if (isProtectedTest) {
    // Check for authentication token in cookies or headers
    const authToken = request.cookies.get('firebase-auth-token')?.value;
    const sessionCookie = request.cookies.get('__session')?.value;
    
    // If no authentication found, redirect to auth page
    if (!authToken && !sessionCookie) {
      const url = request.nextUrl.clone();
      const locale = pathname.split('/')[1] || 'en';
      
      // Redirect to auth page with return URL
      url.pathname = `/${locale}/auth`;
      url.searchParams.set('returnUrl', pathname);
      
      console.log(`🔐 Middleware: Redirecting ${pathname} to auth page`);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};