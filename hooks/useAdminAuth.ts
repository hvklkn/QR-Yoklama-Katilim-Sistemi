import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminSession {
  email: string;
  isAuthenticated: boolean;
}

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, _setSession] = useState<AdminSession>({
    email: "",
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're on login page
    if (pathname?.includes("login")) {
      setIsLoading(false);
      return;
    }

    // For now, assume authenticated if on protected route
    // In production, you'd verify with middleware
    setIsLoading(false);
  }, [pathname]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    session,
    isLoading,
    logout,
  };
}
