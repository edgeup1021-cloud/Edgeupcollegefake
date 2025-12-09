"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { CircleNotch } from "@phosphor-icons/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login with return URL
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check role-based access
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const roleRoutes: Record<string, string> = {
          student: "/student/overview",
          teacher: "/teacher/overview",
          admin: "/management/institutional-health",
          superadmin: "/superadmin/overview",
        };
        router.push(roleRoutes[user.role] || "/");
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname, allowedRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <CircleNotch
            className="w-10 h-10 text-brand-primary animate-spin"
            weight="bold"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check role access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
