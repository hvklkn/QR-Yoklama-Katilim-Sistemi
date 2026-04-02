"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin");
  const isLoginPage = pathname?.includes("login");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log("[Header] Logout initiated");
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      console.log("[Header] Logout response", { status: response.status });
      router.push("/admin/login");
    } catch (error) {
      console.error("[Header] Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-50 w-full">
      <div className="container-max">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 border-2 border-white/30 rounded-lg hover:border-primary-400 hover:bg-primary-500/10 hover:scale-110 transition-all duration-200 text-sm md:text-base">
            <div className="w-6 md:w-8 h-6 md:h-8 bg-white rounded-lg flex items-center justify-center text-primary-600 font-bold hover:scale-125 hover:shadow-lg transition-all duration-200 text-xs md:text-sm">
              QR
            </div>
            <span className="font-bold text-white hidden sm:block">Yoklama</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 md:gap-6">
            {!isAdminRoute ? (
              <>
                <Link href="/admin/login" className="px-3 md:px-4 py-2 border-2 border-white/30 text-white text-sm md:text-base rounded-lg hover:border-primary-400 hover:text-primary-400 hover:bg-primary-500/10 hover:scale-110 transition-all duration-200 font-medium">
                  Admin
                </Link>
                <Link href="/scan" className="px-3 md:px-4 py-2 bg-primary-600 text-white text-sm md:text-base rounded-lg hover:bg-primary-500 hover:scale-110 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                  Scan
                </Link>
              </>
            ) : !isLoginPage ? (
              <>
                <span className="text-white text-sm md:text-base">Admin Paneli</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-white text-sm md:text-base hover:text-red-400 transition-colors disabled:opacity-50 font-medium"
                >
                  {isLoggingOut ? "Çıkılıyor..." : "Çıkış"}
                </button>
              </>
            ) : null}
          </nav>

          <div className="md:hidden">
            <button className="text-gray-600">
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
