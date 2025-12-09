"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/services/auth.service";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const user = await authService.getProfile();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch {
        // Token might be expired, try to refresh
        try {
          await authService.refreshToken();
          const user = await authService.getProfile();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          // Refresh failed, clear tokens
          authService.logout();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await authService.login(credentials);
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Redirect based on portal type
        const portalRoutes: Record<string, string> = {
          student: "/student/overview",
          teacher: "/teacher/overview",
          management: "/management/institutional-health",
          superadmin: "/superadmin/overview",
        };
        const redirectPath = portalRoutes[credentials.portalType] || "/";
        router.push(redirectPath);

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw err;
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await authService.register(data);
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Redirect based on portal type
        const portalRoutes: Record<string, string> = {
          student: "/student/overview",
          teacher: "/teacher/overview",
          management: "/management/institutional-health",
          superadmin: "/superadmin/overview",
        };
        const redirectPath = portalRoutes[response.user.portalType] || "/";
        router.push(redirectPath);

        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw err;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    const currentPortal = authService.getCurrentPortal();
    authService.logout(currentPortal || undefined);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // Redirect to portal-specific login
    const loginPath = currentPortal ? `/${currentPortal}/login` : "/student/login";
    router.push(loginPath);
  }, [router]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
