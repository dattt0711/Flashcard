"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register"];

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/register"];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isHydrated, hydrate } = useAuthStore();

  // Hydrate auth state on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Handle route protection
  useEffect(() => {
    if (!isHydrated) return;

    const isPublicRoute = publicRoutes.some((route) => pathname === route);
    const isAuthRoute = authRoutes.some((route) => pathname === route);

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthRoute) {
      router.replace("/");
      return;
    }

    // Redirect unauthenticated users to login for protected routes
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, isHydrated, pathname, router]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
