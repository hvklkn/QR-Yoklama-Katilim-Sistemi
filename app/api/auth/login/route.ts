import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  createAdminSession,
} from "@/lib/auth/admin";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Geçersiz e-posta formatı"),
  password: z.string().min(1, "Şifre gerekli"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[AdminLogin] Login request received");
    console.log("[AdminLogin] Env variables check", {
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasAdminPassword: !!process.env.ADMIN_PASSWORD,
      adminEmail: process.env.ADMIN_EMAIL,
    });
    
    const body = await request.json();
    console.log("[AdminLogin] Form data received", { email: body.email });

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      console.error("[AdminLogin] Validation failed", validation.error.errors);
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Geçersiz giriş verileri",
          validation.error.errors
        ),
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    console.log("[AdminLogin] Validated credentials", { email });

    // Verify credentials
    if (!validateAdminCredentials(email, password)) {
      console.error("[AdminLogin] Credential validation failed", { 
        email, 
        expectedEmail: process.env.ADMIN_EMAIL 
      });
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.UNAUTHORIZED,
          "E-posta veya şifre yanlış"
        ),
        { status: 401 }
      );
    }

    console.log("[AdminLogin] Credentials valid, creating session");

    // Create session
    const token = createAdminSession(email);
    console.log("[AdminLogin] Session token created", { tokenLength: token.length });

    // Set cookie
    const response = NextResponse.json(
      createSuccessResponse({
        email,
        message: "Başarıyla giriş yapıldı",
      })
    );

    // Set secure session cookie
    response.cookies.set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    console.log("[AdminLogin] Login successful", { email });
    return response;
  } catch (err) {
    console.error("[AdminLogin] Login error:", err);
    return NextResponse.json(
      createErrorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        "Giriş işlemi sırasında bir hata oluştu"
      ),
      { status: 500 }
    );
  }
}
