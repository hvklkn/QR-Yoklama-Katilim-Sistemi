import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Pass pathname as custom header for layout use
  response.headers.set("x-pathname", request.nextUrl.pathname);

  // Check if accessing protected routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow /admin/login
    if (request.nextUrl.pathname === "/admin/login") {
      return response;
    }

    // Get session token
    const sessionToken = request.cookies.get("admin_session")?.value;

    // Check if session exists
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Session token exists, allow access
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
  runtime: "nodejs",
};
