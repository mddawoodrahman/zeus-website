"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component - Wraps routes that require authentication
 *
 * Usage:
 * <Route path="/protected" element={
 *   <ProtectedRoute>
 *     <YourProtectedComponent />
 *   </ProtectedRoute>
 * } />
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !userId) {
      const callbackUrl = encodeURIComponent(pathname || "/");
      router.replace(`/signin?callbackUrl=${callbackUrl}`);
    }
  }, [isLoaded, pathname, router, userId]);

  // Show loading spinner while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};
