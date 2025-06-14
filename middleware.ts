// middleware.ts (or src/middleware.ts)
import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define role type again for clarity
type UserRole = 'admin' | 'attendee' | 'operator';

// Middleware logic executed by withAuth
function middleware(req: NextRequestWithAuth) {
  const token = req.nextauth.token; // Access token decrypted by withAuth
  const { pathname } = req.nextUrl; // Get the requested path

  // Helper to check path segments
  const pathStartsWith = (segment: string) => pathname.startsWith(`/${segment}`);

  // --- Handle Unauthenticated Users ---
  // If there's no token (user not logged in) and they are trying to access
  // a protected role-specific area, redirect them to the correct login page.
  if (!token) {
    // You could redirect all non-logged-in access to a generic page,
    // but redirecting to role-specific logins is often better UX here.
    if (pathStartsWith('admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    else if (pathStartsWith('attendee')) {
      return NextResponse.redirect(new URL('/attendee/login', req.url));
    }
    else if (pathStartsWith('operator')) {
      return NextResponse.redirect(new URL('/operator/login', req.url));
    }
    else{
      // return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Allow access to public pages or potentially redirect other protected pages
    // to a default login or home page if needed.
    // If the path is not role-specific and not public, decide where to send them.
  }
  // --- Handle Authenticated Users (Role Check) ---
  else {
    const userRole = token.role as UserRole; // Get role from the token

    // If trying to access Admin area but role is not 'admin'
    if ((pathStartsWith('admin') || pathname.startsWith('/api/admin')) && userRole !== 'admin') {
       console.log(`AUTH: Role mismatch (<span class="math-inline">\{userRole\}\) for Admin path \(</span>{pathname}). Redirecting.`);
      return NextResponse.redirect(new URL('/unauthorized', req.url)); // Redirect to an 'access denied' page
    }

    // If trying to access Attendee area but role is not 'attendee'
    if ((pathStartsWith('attendee') || pathname.startsWith('/api/attendee')) && userRole !== 'attendee') {
       console.log(`AUTH: Role mismatch (<span class="math-inline">\{userRole\}\) for Attendee path \(</span>{pathname}). Redirecting.`);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // If trying to access Operator area but role is not 'operator'
    if ((pathStartsWith('operator') || pathname.startsWith('/api/operator')) && userRole !== 'operator') {
       console.log(`AUTH: Role mismatch (<span class="math-inline">\{userRole\}\) for Operator path \(</span>{pathname}). Redirecting.`);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // If none of the above conditions caused a redirect, the user is authorized.
  // Allow the request to proceed.
  return NextResponse.next();
}

// --- Configure withAuth ---
// Options for the withAuth middleware wrapper
const middlewareOptions: NextAuthMiddlewareOptions = {
  callbacks: {
    // The 'authorized' callback determines if the main 'middleware' function
    // above should even run. We return true to always run our custom logic.
    authorized: ({ token }) => true,
  },
  pages: {
    // Specify the sign-in page. `withAuth` might redirect here automatically
    // if the `authorized` callback returned false (which ours doesn't).
    // It's still good practice to define it. Use a generic one or the most common one.
    signIn: '/login', // Maybe create a simple /login page that directs users? Or rely on middleware redirects.
    error: '/auth/error', // Page to redirect to on authentication errors
  }
};

// Export the wrapped middleware function
export default withAuth(middleware, middlewareOptions);

// --- Configure Middleware Path Matching ---
// Specifies which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth's own API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /public folder assets (adjust regex if needed)
     * - The login pages themselves
     * - The unauthorized page
     * - Any public API routes
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|admin/login|attendee/login|operator/login|unauthorized|api/public).*)',

    // Explicitly include protected root-level pages if any (e.g., /dashboard)
    // '/dashboard',
    

    // Include specific API routes that need protection (if not covered by above regex)
     '/api/admin/:path*',
     '/',
     '/api/attendee/:path*', // Add if you have protected attendee API routes
     '/api/operator/:path*', // Add if you have protected operator API routes
  ],
};