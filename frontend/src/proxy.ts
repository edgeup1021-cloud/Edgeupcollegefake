import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/student", "/teacher", "/management"];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ["/login", "/register"];

// Role to route mapping
const roleRoutes: Record<string, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/management",
};

// Get role from route path
function getRoleFromPath(path: string): string | null {
  if (path.startsWith("/student")) return "student";
  if (path.startsWith("/teacher")) return "teacher";
  if (path.startsWith("/management")) return "admin";
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for access token in cookies (for SSR) or we'll rely on client-side check
  // Since localStorage isn't accessible in middleware, we use cookies
  const accessToken = request.cookies.get("accessToken")?.value;

  // For now, since we use localStorage, we'll do a soft check
  // The actual auth check will happen client-side via AuthProvider
  // This middleware mainly handles the redirect logic for auth routes

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if this is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is on auth page and has a token cookie, redirect to dashboard
  // Note: Full token validation happens client-side
  if (isAuthRoute && accessToken) {
    // Try to decode the token to get role (basic check, not full validation)
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const role = payload.role || "student";
      const redirectPath = roleRoutes[role] + "/overview";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } catch {
      // Invalid token, let them continue to auth page
    }
  }

  // For protected routes, if no token, redirect to login
  // But since we use localStorage, this won't catch all cases
  // The AuthProvider will handle the full protection
  if (isProtectedRoute && !accessToken) {
    // We can't definitively know if user is logged in from middleware
    // since tokens are in localStorage. Let the client-side handle it.
    // This is a limitation of using localStorage vs cookies for tokens.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next (all Next.js internal routes including HMR)
     * - api routes
     * - static files
     * - favicon.ico
     */
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};
