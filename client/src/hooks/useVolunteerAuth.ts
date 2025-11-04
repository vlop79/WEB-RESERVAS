import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export function useVolunteerAuth() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from localStorage on mount
    if (typeof window !== "undefined") {
      return localStorage.getItem("volunteerToken");
    }
    return null;
  });

  const { data: volunteer, isLoading, error } = trpc.volunteer.getProfile.useQuery(
    { token: token || "" },
    { enabled: !!token, retry: false }
  );

  const logout = () => {
    localStorage.removeItem("volunteerToken");
    setToken(null);
    setLocation("/portal-voluntario/login");
  };

  return {
    volunteer,
    isLoading,
    isAuthenticated: !!volunteer && !error,
    logout,
    token,
  };
}
