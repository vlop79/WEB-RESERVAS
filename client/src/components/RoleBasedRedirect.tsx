import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Component that redirects users based on their role
 * - empresa → /company/dashboard
 * - admin/team → /admin
 * - not logged in → stays on current page
 */
export default function RoleBasedRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading || !user) return;

    // Only redirect from home page
    if (location !== "/") return;

    // Redirect based on role
    if (user.role === "empresa") {
      setLocation("/company/dashboard");
    } else if (user.role === "admin" || user.role === "team") {
      setLocation("/admin");
    }
  }, [user, loading, location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#ea6852]" />
      </div>
    );
  }

  return <>{children}</>;
}
