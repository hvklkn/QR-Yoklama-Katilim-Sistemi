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
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              QR
            </div>
            <span className="font-bold text-gray-900">Yoklama</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {!isAdminRoute ? (
              <>
                <Link href="/admin/login" className="text-gray-600 hover:text-gray-900">
                  Admin
                </Link>
                <Link href="/scan" className="text-gray-600 hover:text-gray-900">
                  Scan
                </Link>
              </>
            ) : !isLoginPage ? (
              <>
                <span className="text-gray-600">Admin Paneli</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-600 hover:text-danger transition-colors disabled:opacity-50"
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
