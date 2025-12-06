import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type PortalType = "student" | "teacher" | "management";

// Portal-specific routes
const portalRoutes: Record<PortalType, string> = {
  student: "/student",
  teacher: "/teacher",
  management: "/management",
};

// Get portal type from route path
function getPortalFromPath(path: string): PortalType | null {
  if (path.startsWith("/student")) return "student";
  if (path.startsWith("/teacher")) return "teacher";
  if (path.startsWith("/management")) return "management";
  return null;
}

// Check if path is a portal-specific auth route
function isPortalAuthRoute(path: string): { isAuth: boolean; portal: PortalType | null } {
  const portal = getPortalFromPath(path);
  if (portal && (path.includes("/login") || path.includes("/register"))) {
    return { isAuth: true, portal };
  }
  return { isAuth: false, portal: null };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get portal from path
  const portal = getPortalFromPath(pathname);
  
  // Check for portal-specific tokens in cookies
  const studentToken = request.cookies.get("student_accessToken")?.value;
  const teacherToken = request.cookies.get("teacher_accessToken")?.value;
  const managementToken = request.cookies.get("management_accessToken")?.value;

  // Determine which portal has an active token
  const hasStudentAuth = !!studentToken;
  const hasTeacherAuth = !!teacherToken;
  const hasManagementAuth = !!managementToken;

  // Check if this is a portal-specific auth route
  const { isAuth: isAuthRoute, portal: authPortal } = isPortalAuthRoute(pathname);

  // If user is on portal auth page and already authenticated for that portal, redirect to dashboard
  if (isAuthRoute && authPortal) {
    const portalToken = request.cookies.get(`${authPortal}_accessToken`)?.value;
    if (portalToken) {
      const redirectPath = `${portalRoutes[authPortal]}/overview`;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // For protected portal routes, check portal-specific authentication
  if (portal && !isAuthRoute) {
    const portalToken = request.cookies.get(`${portal}_accessToken`)?.value;
    
    // If no token for this portal, redirect to portal-specific login
    if (!portalToken) {
      // Allow client-side to handle the redirect since tokens are in localStorage
      // Middleware can't access localStorage, so we rely on client-side checks
    }
  }

  // Handle old /login and /register routes - redirect to student portal by default
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/student/login", request.url));
  }
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/student/register", request.url));
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
