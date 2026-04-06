import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Pass pathname as custom header for layout use
  response.headers.set("x-pathname", request.nextUrl.pathname);

  // Check if accessing protected routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("[Middleware] Admin route accessed:", request.nextUrl.pathname);
    
    // Allow /admin/login
    if (request.nextUrl.pathname === "/admin/login") {
      console.log("[Middleware] Login page accessed, allowing access");
      return response;
    }

    // Get session token
    const sessionToken = request.cookies.get("admin_session")?.value;
    console.log("[Middleware] Session token check", { 
      hasToken: !!sessionToken,
      tokenLength: sessionToken?.length || 0 
    });

    // Check if session exists
    if (!sessionToken) {
      console.log("[Middleware] No session token, redirecting to login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Session token exists, allow access
    console.log("[Middleware] Session valid, allowing access");
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
