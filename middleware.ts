import { NextRequest, NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/auth/admin";

export function middleware(request: NextRequest) {
  // Check if accessing protected routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow /admin/login
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Get session token
    const sessionToken = request.cookies.get("admin_session")?.value;

    // Validate session
    if (!sessionToken || !validateAdminSession(sessionToken)) {
      // Redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
